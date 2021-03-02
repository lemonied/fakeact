import { VNode, NodeName, Attributes } from './vNode';

export function h(nodeName: NodeName, attributes: Attributes, ...args: any[]): VNode {
  const children = args.length ? [].concat(...args) : null;
  return new VNode(nodeName, attributes, children);
}
