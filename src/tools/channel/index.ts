class Channel<T = unknown> {
  _subscribers: Map<string, (data: T) => void> = new Map();

  constructor() {}

  listen(key: string, cb: (data: T) => void) {
    this._subscribers.set(key, cb);
  }

  unlisten(key: string) {
    this._subscribers.delete(key);
  }

  emit(key: string, data: T) {
    this._subscribers.get(key)?.(data);
  }
}

export default Channel;
