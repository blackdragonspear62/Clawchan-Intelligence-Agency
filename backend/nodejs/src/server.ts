import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { json } from 'body-parser';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { aircraftRouter } from './routes/aircraft';
import { satelliteRouter } from './routes/satellites';
import { weatherRouter } from './routes/weather';
import { earthquakeRouter } from './routes/earthquakes';
import { cryptoRouter } from './routes/crypto';
import { authMiddleware } from './middleware/auth';
import { logger } from './utils/logger';
import { metricsMiddleware } from './middleware/metrics';

const app = express();
const httpServer = createServer(app);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", 'wss:', 'https:'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Metrics middleware
app.use(metricsMiddleware);

// Body parser
app.use(json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '2.0.0',
    uptime: process.uptime(),
  });
});

// Prometheus metrics endpoint
app.get('/metrics', (req, res) => {
  // Return Prometheus-formatted metrics
  res.set('Content-Type', 'text/plain');
  res.send(`# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",status="200"} 1000

# HELP http_request_duration_seconds HTTP request duration
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.1"} 800
http_request_duration_seconds_bucket{le="0.5"} 950
http_request_duration_seconds_bucket{le="1"} 990
http_request_duration_seconds_bucket{le="+Inf"} 1000
`);
});

// REST API routes
app.use('/api/v1/aircraft', aircraftRouter);
app.use('/api/v1/satellites', satelliteRouter);
app.use('/api/v1/weather', weatherRouter);
app.use('/api/v1/earthquakes', earthquakeRouter);
app.use('/api/v1/crypto', cryptoRouter);

// GraphQL setup
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
  plugins: [
    {
      async serverWillStart() {
        return {
          async drainServer() {
            // Cleanup
          },
        };
      },
    },
  ],
});

await apolloServer.start();

app.use(
  '/graphql',
  authMiddleware,
  expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      return {
        user: (req as any).user,
        token: req.headers.authorization,
      };
    },
  })
);

// WebSocket server for real-time updates
const wss = new WebSocketServer({
  server: httpServer,
  path: '/ws',
});

wss.on('connection', (ws, req) => {
  logger.info(`WebSocket connection established: ${req.socket.remoteAddress}`);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      // Handle subscription requests
      if (data.type === 'subscribe') {
        ws.send(JSON.stringify({
          type: 'subscribed',
          channel: data.channel,
          timestamp: Date.now(),
        }));
      }
    } catch (error) {
      logger.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    logger.info('WebSocket connection closed');
  });

  ws.on('error', (error) => {
    logger.error('WebSocket error:', error);
  });

  // Send initial connection confirmation
  ws.send(JSON.stringify({
    type: 'connected',
    timestamp: Date.now(),
    server: 'clawchan-api-v2',
  }));
});

// Broadcast data to all connected clients
export const broadcastToAll = (data: unknown) => {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(JSON.stringify(data));
    }
  });
};

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Express error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  logger.info(`🚀 Clawchan API Server running on port ${PORT}`);
  logger.info(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
  logger.info(`🔌 WebSocket endpoint: ws://localhost:${PORT}/ws`);
});

export default app;
