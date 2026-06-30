export type AlertType = "info" | "warning" | "error" | "success";

export type AlertMessage = {
  id: string;
  type: AlertType;
  message: string;
  durationMs?: number;
};

type AlertInput = Omit<AlertMessage, "id">;
type AlertListener = (alert: AlertMessage) => void;

class AlertService {
  private listeners = new Set<AlertListener>();

  subscribe(listener: AlertListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  push(input: AlertInput) {
    const alert: AlertMessage = {
      ...input,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    };

    this.listeners.forEach((listener) => listener(alert));
  }

  info(message: string, durationMs = 4000) {
    this.push({ type: "info", message, durationMs });
  }

  warning(message: string, durationMs = 4500) {
    this.push({ type: "warning", message, durationMs });
  }

  error(message: string, durationMs = 5000) {
    this.push({ type: "error", message, durationMs });
  }

  success(message: string, durationMs = 5000) {
    this.push({ type: "success", message, durationMs });
  }
}

export const alertService = new AlertService();
