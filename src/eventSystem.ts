type EventHandler<T> = (payload: T) => void;

export class EventSystem {
  private handlers: Map<string, Set<EventHandler<any>>> = new Map();

  on<T>(eventType: string, handler: EventHandler<T>) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }

    this.handlers.get(eventType)!.add(handler);
  }

  off<T>(eventType: string, handler: EventHandler<T>) {
    this.handlers.get(eventType)?.delete(handler);
  }

  emit<T>(eventType: string, payload: T) {
    this.handlers.get(eventType)?.forEach((handler) => handler(payload));
  }
}

export const Events = new EventSystem();
