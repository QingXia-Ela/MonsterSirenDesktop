type EventName = 'change' | 'created' | 'atomAdd';
import type { WritableAtom } from 'nanostores';

export default function createEffectManager(data: any) {
  const atomMap = new Map<string, WritableAtom<any>>();
  const eventMap: Record<EventName | string, Array<(...args: any[]) => any>> = {
    atomAdd: [],
  };

  /**
   * @param key the key that use from data, will be used as the init value
   * @param atom atom instance
   */
  function addAtom<T = any>(key: string, atom: WritableAtom<T>) {
    if (data[key]) {
      atom.set(data[key]);
    }

    atomMap.set(key, atom);

    eventMap['atomAdd']?.forEach((f) => {
      f(key, atom.get());
    });

    atom.listen((v) => {
      eventMap['change']?.forEach((f) => {
        f(key, v);
      });
    });
  }

  /**
   * Adds an event listener for the specified event.
   *
   * @param {EventName} eventName - The name of the event to listen for.
   * @param {Function} callback - The callback function to be executed when the event is triggered.
   */
  function on(eventName: EventName, callback: (...args: any[]) => any) {
    if (!eventMap[eventName]) {
      eventMap[eventName] = [];
    }
    eventMap[eventName].push(callback);
  }

  /**
   * Retrieves the combined state of all atoms.
   *
   * @return {Object} The combined state object.
   */
  function getCombinedState() {
    const state: Record<string, any> = {};
    atomMap.forEach((atom, key) => {
      state[key] = atom.get();
    });
    return state;
  }

  /**
   * Retrieves an atom instance by key.
   *
   * @param {string} key - The key of the atom.
   * @return {WritableAtom} The atom instance.
   */
  function getAtom<T>(key: string): WritableAtom<T> {
    return atomMap.get(key);
  }

  setTimeout(() => {
    eventMap['created']?.forEach((f) => {
      f();
    });
  });

  return {
    addAtom,
    on,
    getCombinedState,
    getAtom,
  };
}
