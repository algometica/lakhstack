export function register() {
  if (typeof globalThis !== 'undefined' && typeof globalThis.localStorage !== 'undefined') {
    const ls = globalThis.localStorage;
    const isValid =
      ls &&
      typeof ls.getItem === 'function' &&
      typeof ls.setItem === 'function' &&
      typeof ls.removeItem === 'function';

    if (!isValid) {
      try {
        delete globalThis.localStorage;
      } catch {
        globalThis.localStorage = undefined;
      }
    }
  }
}
