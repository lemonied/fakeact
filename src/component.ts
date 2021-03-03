import { Children, VNode } from './vNode';

const data = Symbol('data');
const init = Symbol('init');
const DOM_COMPONENT = '_component';
const DOM_ORIGIN_LISTENERS = '_origin_listeners';
const DOM_LISTENERS = '_listeners';
export const nextProps = Symbol('nextProps');
export const componentBase = Symbol('base');

export type PropsWithChildren<P> = P & { children?: Children };

export interface ComponentConstructor {
  new (): Component;
}

export class Component<P=any> {
  [nextProps]: PropsWithChildren<P> = { children: null } as PropsWithChildren<P>;
  [componentBase]: Node | null = null;
  [data]?: Array<string | symbol>;
  props: PropsWithChildren<P> = { children: null } as PropsWithChildren<P>;
  [init]() {
    (this[data] || []).forEach(key => observer(this, key, (this as any)[key]));
  }
  render(): VNode | string | number | null | undefined {
    throw new Error(`The render function must be defined in ${this.constructor.name}`);
  }
  // eslint-disable-next-line no-unused-vars
  onDataChange(key: string | symbol, newData: any, oldData: any) {
    // Called when data changed
  }
  // eslint-disable-next-line no-unused-vars
  onPropsChange(nextProps: PropsWithChildren<P>, preProps: PropsWithChildren<P>) {
    // Called when Props changes
  }
  updated() {
    // Called after update
  }
  mounted() {
    // Called when document is ready
  }
  created() {
    // Called when Component is created
  }
  beforeDestroy() {
    // Called before destroy
  }
}

export function build(vNode: VNode | string | number | undefined | null, dom?: Node | HTMLElement | null): Node {
  if (vNode === null || typeof vNode === 'undefined') {
    vNode = '';
  }
  if (typeof vNode === 'string' || typeof vNode === 'number') {
    if (dom) {
      if (dom.nodeType === 3) {
        if (vNode !== dom.textContent) {
          dom.textContent = String(vNode);
        }
        return dom;
      }
    }
    return document.createTextNode(String(vNode));
  }
  const { nodeName, attributes, children: vChildren } = vNode;
  if (typeof nodeName === 'function') {
    return buildComponentFromVNode(vNode as VNode, dom);
  }

  let out = dom;
  if (typeof nodeName === 'string') {
    if (!out || out.nodeType !== 1 || out.nodeName !== nodeName.toUpperCase()) {
      out = document.createElement(nodeName);
    }
    if (attributes) {
      for (const key in attributes) {
        if (Object.prototype.hasOwnProperty.call(attributes, key)) {
          // @ts-ignore
          setAttribute(out as HTMLElement, key, attributes[key], this);
        }
      }
    }
    let children: Node[] = [];
    const newChildren: Node[] = [];
    if (out && out.childNodes) {
      children = Array.from(out.childNodes);
    }
    if (vChildren && vChildren.length) {
      vChildren.forEach((vChild, i) => {
        // @ts-ignore
        newChildren.push(build.call(this, vChild, children[i]));
      });
    }
    newChildren.forEach((newChild, i) => {
      if (children[i] !== newChild) {
        insertTo(out as HTMLElement, newChild, i);
      }
    });
    children.forEach(v => {
      if (!newChildren.includes(v)) {
        const domComponents = (v as any)[DOM_COMPONENT];
        if (domComponents) {
          domComponents.forEach((c: Component) => {
            c.beforeDestroy();
          });
        }
        out?.removeChild(v);
      }
    });
  }
  return out as Node;
}

export function Observe(target: Component, key: string | symbol) {
  if (!target[data]) {
    target[data] = [];
  }
  target[data]!.push(key);
}

function observer(target: Component, key: string | symbol, initialValue: any) {
  let value = initialValue;
  Object.defineProperty(target, key, {
    get() {
      return value;
    },
    set(val) {
      const oldVal = value;
      value = val;
      if (oldVal !== val) {
        hook(target, 'onDataChange', key, value, oldVal);
        renderComponent(target);
      }
    },
  });
}

function renderComponent(component: Component): Node {
  const p = component[nextProps];
  if (component[componentBase]) {
    if (isPropsDifferent(p, component.props)) {
      hook(component, 'onPropsChange', p, component.props);
    }
    component.props = p;
  } else {
    component.props = p;
    hook(component, 'created');
    component[init]();
  }
  const rendered = hook(component, 'render');
  const base = build.call(component, rendered, component[componentBase]);
  if (!component[componentBase]) {
    Promise.resolve().then(() => {
      hook(component, 'mounted');
    });
  } else {
    hook(component, 'updated');
  }
  if (base) {
    component[componentBase] = base;
    if (!(base as any)[DOM_COMPONENT]) {
      (base as any)[DOM_COMPONENT] = [];
    }
    const components: Component[] = (base as any)[DOM_COMPONENT];
    const index = components.findIndex(v => v.constructor === component.constructor);
    if (index > -1) {
      components.splice(index, 1, component);
    } else {
      components.push(component);
    }
  }
  return base;
}

function isPropsDifferent(newProps: PropsWithChildren<any>, oldProps: PropsWithChildren<any>) {
  const newKeys = Object.keys(newProps);
  if (newKeys.length !== Object.keys(oldProps).length) {
    return true;
  }
  return newKeys.some(key => {
    return newProps[key] !== oldProps[key];
  });
}

function hook(component: Component, key: keyof Component, ...args: any[]): any {
  const fn = component[key];
  if (typeof fn === 'function') {
    return (fn as Function).apply(component, args);
  }
}

function buildComponentFromVNode(vNode: VNode, dom?: Node | null) {
  const domComponent: Component[] = dom && (dom as any)[DOM_COMPONENT];
  let component: Component;
  if (domComponent) {
    component = domComponent.find((v) => v.constructor === vNode.nodeName)!;
  }
  // @ts-ignore
  if (!component) {
    component = new (vNode.nodeName as ComponentConstructor)();
  }
  const props = getNodeProps(vNode);
  setComponentProps(component, props);
  return renderComponent(component);
}

function setComponentProps(component: Component, props: PropsWithChildren<any>) {
  component[nextProps] = props;
}

function getNodeProps(vNode: VNode) {
  return { ...vNode.attributes, children: vNode.children };
}

function setAttribute(node: HTMLElement, attr: string, value: any, context?: any) {
  const prefix = attr.substr(0, 2);
  if (prefix === 'on' && typeof value === 'function') {
    const eventType = attr.substr(2).toLowerCase();
    const originListeners = (node as any)[DOM_ORIGIN_LISTENERS] || ((node as any)[DOM_ORIGIN_LISTENERS] = {});
    const listeners = (node as any)[DOM_LISTENERS] || ((node as any)[DOM_LISTENERS] = {});
    if (originListeners[eventType] !== value) {
      if (listeners[eventType]) {
        node.removeEventListener(eventType, listeners[eventType]);
      }
      const newValue = value.bind(context);
      listeners[eventType] = newValue;
      node.addEventListener(eventType, newValue);
    }
    originListeners[eventType] = value;
  } else if (attr === 'style') {
    Object.keys(value as CSSStyleDeclaration).forEach((key) => {
      (node.style as any)[key] = value[key];
    });
  } else if (attr === 'ref') {
    if (typeof value === 'function') {
      value.bind(context)(node);
    } else {
      throw new Error('ref must be function');
    }
  } else {
    node.setAttribute(attr, value);
  }
}

function insertTo(dom: HTMLElement, child: Node, index: number) {
  const childNodes = dom.childNodes;
  if (index >= childNodes.length) {
    dom.appendChild(child);
  } else {
    dom.insertBefore(child, childNodes[index]);
  }
}
