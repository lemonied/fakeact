import { isVNode, VNode } from '../vNode';

export const componentType = Symbol('component');

export class Component<P=any> {
  public props: P = {} as P;
  render(): VNode | null {
    throw new Error('You Must Implement Render Function');
  }
  static [componentType] = true;
}

export interface ComponentConstructor<P=any> {
  new (): Component<P>;
  [componentType]: true;
}

export function isComponentConstructor(val: any): val is ComponentConstructor  {
  return !!val?.[componentType];
}

export function buildComponent(component: Component): VNode | null {
  const ret = component.render();
  if (ret !== null && !isVNode(ret)) {
    throw new Error(`${component.constructor.name} rendered invalid VNode`);
  }
  return ret;
}
