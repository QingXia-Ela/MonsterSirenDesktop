type EventName = "change" | "created";
import type { WritableAtom } from "nanostores";

export default function createEffectManager(data: any) {
  const atomList: Array<{
    key: string;
    atom: WritableAtom<any>;
  }> = [];
  const eventMap = {};

  /**
   * @param atom atom instance
   * @param key the key that use from data, will be used as the init value
   */
  function addAtom<T = any>(atom: WritableAtom<T>, key: string) {
    if (data[key]) {
      atom.set(data[key]);
    }

    atomList.push({ atom, key });

    atom.listen((v) => {
      eventMap["change"]?.forEach((f) => {
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
  function on(eventName: EventName, callback) {
    if (!eventMap[eventName]) {
      eventMap[eventName] = [];
    }
    eventMap[eventName] = callback;
  }

  /**
   * Retrieves the combined state of all atoms.
   *
   * @return {Object} The combined state object.
   */
  function getCombinedState() {
    const state = {};
    atomList.forEach(({ atom, key }) => {
      state[key] = atom.get();
    });
    return state;
  }

  requestAnimationFrame(() => {
    eventMap["created"]?.forEach((f) => {
      f();
    });
  });

  return {
    addAtom,
    on,
    getCombinedState,
  };
}
