import { Request, Response, NextFunction } from 'express';
import { register, Counter, Histogram, Gauge } from 'prom-client';

// Create metrics
export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

export const httpRequestDurationSeconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
});

export const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
});

export const memoryUsageBytes = new Gauge({
  name: 'memory_usage_bytes',
  help: 'Memory usage in bytes',
  labelNames: ['type'],
});

// Collect default metrics
register.setDefaultLabels({
  app: 'clawchan-api',
  environment: process.env.NODE_ENV || 'development',
});

// Metrics middleware
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  // Record memory usage
  const memUsage = process.memoryUsage();
  memoryUsageBytes.set({ type: 'heapTotal' }, memUsage.heapTotal);
  memoryUsageBytes.set({ type: 'heapUsed' }, memUsage.heapUsed);
  memoryUsageBytes.set({ type: 'rss' }, memUsage.rss);
  memoryUsageBytes.set({ type: 'external' }, memUsage.external);

  // Override res.end to capture response metrics
  const originalEnd = res.end.bind(res);
  res.end = function(chunk?: any, encoding?: any, cb?: any): Response {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;
    
    httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode,
    });
    
    httpRequestDurationSeconds.observe(
      {
        method: req.method,
        route,
        status_code: res.statusCode,
      },
      duration
    );

    return originalEnd(chunk, encoding, cb);
  };

  next();
};

export { register };
export default metricsMiddleware;
