import { BasicType } from './models';

export function replaceItem<T>(list: T[], target: T, replace?: T) {
  const index = list.indexOf(target);
  if (index > -1) {
    list.splice(index, 1, ...([replace].filter(Boolean) as T[]));
  }
  return list;
}

export function isBasic(val: any): val is BasicType {
  return typeof val === 'undefined' ||
    typeof val === 'number' ||
    typeof val === 'string' ||
    typeof val === 'boolean' ||
    val === null;
}

export function lightClone<T>(target: T, source: any) {
  if (target && source) {
    Object.assign(target, source);
  }
  return target;
}
