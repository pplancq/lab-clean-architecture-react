export interface HandlerInterface<E extends Event = Event> {
  handle(event: E): void;
}
