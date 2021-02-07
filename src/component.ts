import { DioElement, VNode } from './vNode';

const observedData = Symbol('observedData');
export const rootCheck = Symbol('rootCheck');
export const observedListener = Symbol('observedListener');

export interface PropsWithChildren {
  children?: DioElement[];
}
interface ObservedListener {
  type: string;
  name: symbol | string;
  listeners: Array<(newVal: any, oldVal: any) => any>;
}
export class Component<P=PropsWithChildren & any> {
  $props: P & PropsWithChildren;
  $vNode!: VNode;
  $readyToken!: Promise<void>;
  [rootCheck]: Array<Function> = [];
  [observedData]!: Array<string | symbol>;
  [observedListener]: Array<ObservedListener> = [];
  constructor() {
    this.$props = {} as any;
    let readyResolver: any;
    this.$readyToken = new Promise<void>((resolve, reject) => {
      readyResolver = resolve;
    });
    this[observedListener] = (this[observedData] || []).map(name => {
      return {
        type: 'state',
        name,
        listeners: [],
      };
    });
    Promise.resolve().then(() => {
      this[observedListener].forEach(val => {
        // state is the default type
        const target = (val.type === 'state' ? this : this[val.type as keyof this]) as object;
        observer(target, val.name, (this as any)[val.name], this, val.listeners);
      });
    }).then(() => {
      if (typeof this.created === 'function') {
        this.created();
      }
      readyResolver();
    });
  }
  $registerRootCheck(func: (key: string, newVal: any, oldVal: any) => void) {
    this[rootCheck].push(func);
  }
  $removeRootCheck(func: Function) {
    const index = this[rootCheck].indexOf(func);
    if (index > -1) {
      this[rootCheck].splice(index, 1);
    }
  }
  render(): VNode {
    throw new Error(`The render function must be defined in ${this.constructor.name}`);
  }
  created?(): any;
  beforeDestroy?(): any;
}

export interface ComponentConstructor {
  new (): Component;
}

function observer(target: object, key: string | symbol, initialValue: any, context: Component, listeners?: ObservedListener['listeners']) {
  let value = initialValue;
  Object.defineProperty(target, key, {
    get() {
      return value;
    },
    set(val) {
      const oldVal = value;
      value = val;
      if (oldVal !== val) {
        listeners?.forEach(listener => listener(val, oldVal));
        context[rootCheck].forEach(listener => listener(key, val, oldVal));
      }
    },
  });
}

export function Observe(target: Component, key: string | symbol) {
  if (!target[observedData]) {
    target[observedData] = [];
  }
  target[observedData].push(key);
}

export function isComponent(val: any): val is Component {
  return val instanceof Component;
}
