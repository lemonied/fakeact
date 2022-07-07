import { VNodeType } from '../vNode';

export const componentType = Symbol('component');

export class Component<P=any> {
  public props: P = {} as P;
  render(): VNodeType | null {
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

export function buildComponent(component: Component): VNodeType | null {
  return component.render();
}