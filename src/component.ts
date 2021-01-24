import { DioElement, VNode } from './vNode';

export interface PropsWithChildren {
  children?: DioElement[];
}
export class Component<P=PropsWithChildren & any> {
  $props: P & PropsWithChildren;
  $vNode!: VNode;
  __observe__!: Array<symbol | string>;
  constructor() {
    this.$props = {} as any;
    this.__observe__.forEach(key => {
      observer(this, key, (this as any)[key]);
    });
  }
  render(): VNode {
    throw new Error(`The render function must be defined in ${this.constructor.name}`);
  };
}
Component.prototype.__observe__ = [];
export interface ComponentConstructor {
  new (): Component;
}

function observer<T>(target: T, key: string | symbol, initialValue: any) {
  let value = initialValue;
  Object.defineProperty(target, key, {
    get() {
      return value;
    },
    set(val) {
      value = val;
    }
  });
}

export function Observe(target: Component, key: string | symbol) {
  if (!target.__observe__) {
    target.__observe__ = [];
  }
  target.__observe__.push(key);
}
