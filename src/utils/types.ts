export const isDef = <T>(val: T): val is NonNullable<T> =>
  val !== undefined && val !== null;

export function isMobile(value: string): boolean {
  value = value.replace(/[^-|\d]/g, '');
  return (
    /^((\+86)|(86))?(1)\d{10}$/.test(value) || /^0[0-9-]{10,13}$/.test(value)
  );
}

export const isNumeric = (val: string | number): val is string =>
  typeof val === 'number' || /^\d+(\.\d+)?$/.test(val);

export const isBrowser = typeof window !== 'undefined';
export const isIOS = (): boolean =>
  isBrowser
    ? /ios|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
    : false;

export {
  isArray,
  isFunction,
  isObject,
  isString,
  isDate,
  isPromise,
  isSymbol,
} from '@vue/shared';
