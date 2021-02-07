import { VNode, Attributes, DioElement, isVNode } from './vNode';
import { ComponentConstructor } from './component';

export function h(Node: string | VNode | ComponentConstructor, attrs: Attributes, ...args: DioElement[]): VNode | ComponentConstructor {
  if (isVNode(Node)) {
    return Node;
  }
  const children = args.length ? [...args] : null;
  if (typeof Node === 'function') {
    return Node;
  }
  return new VNode(Node, attrs, children);
}
h.Fragment = function () {};

export const Fragment = h.Fragment;
