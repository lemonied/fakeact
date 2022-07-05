import { buildVNode, VNode } from '../vNode';
import { buildDomTree } from './index';

export class Root {
  ele: HTMLElement;
  constructor(ele: HTMLElement) {
    this.ele = ele;
  }
  render(vNode: VNode) {
    const tree = buildVNode(vNode);
    buildDomTree(tree, this.ele);
  }
}

export function createRoot(ele: HTMLElement) {
  return new Root(ele);
}
