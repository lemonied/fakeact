import { NodeName, VNode, createVNode } from './vNode';
import { Attributes } from './attribute';
import { Fragment } from './fragment';

export function h(nodeName: NodeName, attributes: Attributes, ...args: any[]): VNode {
  const children = args.length ? [...args] : null;
  return createVNode(nodeName, attributes, children);
}

h.Fragment = Fragment;
