export default function once<T extends (...args: unknown[]) => unknown>(
  fn: T,
): T {
  let called = false;
  return function (...args) {
    if (!called) {
      called = true;
      return fn(...args);
    }
  } as T;
}
