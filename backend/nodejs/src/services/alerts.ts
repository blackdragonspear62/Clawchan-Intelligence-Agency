import { logger } from '../utils/logger';

interface Alert {
  id: string;
  title: string;
  message: string;
  type: string;
  severity: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  metadata?: unknown;
  createdAt: string;
  updatedAt: string;
  acknowledgedBy?: string;
  resolvedBy?: string;
}

class AlertService {
  private alerts: Map<string, Alert> = new Map();

  constructor() {
    // Initialize with some demo alerts
    this.createAlert({
      title: 'High CPU Usage',
      message: 'Server CPU usage exceeded 90% for more than 5 minutes',
      type: 'SYSTEM',
      severity: 'WARNING',
    });

    this.createAlert({
      title: 'ADS-B Feed Latency',
      message: 'Aircraft data feed experiencing higher than normal latency',
      type: 'AIRCRAFT',
      severity: 'INFO',
    });
  }

  createAlert(input: {
    title: string;
    message: string;
    type: string;
    severity: string;
    metadata?: unknown;
  }): Alert {
    const id = `ALERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const alert: Alert = {
      id,
      title: input.title,
      message: input.message,
      type: input.type,
      severity: input.severity,
      status: 'ACTIVE',
      metadata: input.metadata,
      createdAt: now,
      updatedAt: now,
    };

    this.alerts.set(id, alert);
    logger.info(`Alert created: ${id}`, { alert });

    return alert;
  }

  getAlert(id: string): Alert | null {
    return this.alerts.get(id) || null;
  }

  getAllAlerts(): Alert[] {
    return Array.from(this.alerts.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getActiveAlerts(): Alert[] {
    return this.getAllAlerts().filter((alert) => alert.status === 'ACTIVE');
  }

  acknowledgeAlert(id: string, userId?: string): Alert {
    const alert = this.alerts.get(id);
    if (!alert) {
      throw new Error(`Alert not found: ${id}`);
    }

    alert.status = 'ACKNOWLEDGED';
    alert.acknowledgedBy = userId;
    alert.updatedAt = new Date().toISOString();

    this.alerts.set(id, alert);
    logger.info(`Alert acknowledged: ${id}`, { userId });

    return alert;
  }

  resolveAlert(id: string, userId?: string): Alert {
    const alert = this.alerts.get(id);
    if (!alert) {
      throw new Error(`Alert not found: ${id}`);
    }

    alert.status = 'RESOLVED';
    alert.resolvedBy = userId;
    alert.updatedAt = new Date().toISOString();

    this.alerts.set(id, alert);
    logger.info(`Alert resolved: ${id}`, { userId });

    return alert;
  }

  deleteAlert(id: string): boolean {
    const deleted = this.alerts.delete(id);
    if (deleted) {
      logger.info(`Alert deleted: ${id}`);
    }
    return deleted;
  }

  // Automated alert generation based on system metrics
  checkSystemMetrics(metrics: {
    cpu: number;
    memory: number;
    disk: number;
    networkLatency: number;
  }): void {
    if (metrics.cpu > 90) {
      this.createAlert({
        title: 'Critical CPU Usage',
        message: `CPU usage at ${metrics.cpu.toFixed(1)}%`,
        type: 'SYSTEM',
        severity: 'CRITICAL',
        metadata: { cpu: metrics.cpu },
      });
    } else if (metrics.cpu > 80) {
      this.createAlert({
        title: 'High CPU Usage',
        message: `CPU usage at ${metrics.cpu.toFixed(1)}%`,
        type: 'SYSTEM',
        severity: 'WARNING',
        metadata: { cpu: metrics.cpu },
      });
    }

    if (metrics.memory > 90) {
      this.createAlert({
        title: 'Critical Memory Usage',
        message: `Memory usage at ${metrics.memory.toFixed(1)}%`,
        type: 'SYSTEM',
        severity: 'CRITICAL',
        metadata: { memory: metrics.memory },
      });
    }

    if (metrics.networkLatency > 1000) {
      this.createAlert({
        title: 'High Network Latency',
        message: `Network latency at ${metrics.networkLatency.toFixed(0)}ms`,
        type: 'NETWORK',
        severity: 'WARNING',
        metadata: { latency: metrics.networkLatency },
      });
    }
  }
}

export const alertService = new AlertService();
export default alertService;
