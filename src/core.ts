import { VNode, Attributes, DioElement } from './vNode';
import { ComponentConstructor } from './component';

export function h(Node: string | VNode | ComponentConstructor, attrs: Attributes, ...args: DioElement[]) {
  if (Node instanceof VNode) {
    return Node;
  }
  const children = args.length ? [...args] : null;
  if (typeof Node === 'function') {
    const component = new Node();
    component.$props.children = children;
    component.$vNode = component.render();
    component.$vNode.component = component;
    return component.$vNode;
  }
  return new VNode(Node, attrs, children);
}
h.Fragment = function () {};

export const Fragment = h.Fragment;
