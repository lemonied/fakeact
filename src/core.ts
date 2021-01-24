import { VNode, Attributes, DioElement, isVNode } from './vNode';
import { ComponentConstructor } from './component';

export function h(Node: string | VNode | ComponentConstructor, attrs: Attributes, ...args: DioElement[]): VNode {
  if (isVNode(Node)) {
    return Node;
  }
  const children = args.length ? [...args] : null;
  if (typeof Node === 'function') {
    const component = new Node();
    component.$props.children = children;
    Object.assign(component.$props, attrs || {});
    component.$vNode = component.render();
    component.$vNode.component = component;
    return component.$vNode;
  }
  return new VNode(Node, attrs, children);
}
h.Fragment = function () {};

export const Fragment = h.Fragment;
