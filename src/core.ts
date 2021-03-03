import { VNode, NodeName, Attributes } from './vNode';
import { Component } from './component';

export function h(nodeName: NodeName, attributes: Attributes, ...args: any[]): VNode {
  const children = args.length ? [].concat(...args) : null;
  return new VNode(nodeName, attributes, children);
}

export class Fragment extends Component {
  render() {
    const children = this.props.children || null;
    return new VNode('div', null, children);
  }
}

h.Fragment = Fragment;
