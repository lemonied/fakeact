import { buildVNode, VNode } from '../vNode';
import { buildDomNode, rebuildDomNode } from './';
import { Diff } from '../diff';
import { DomNode } from './models';

export class Root {
  private readonly ele: HTMLElement;
  private domNode: DomNode | null = null;
  constructor(ele: HTMLElement) {
    this.ele = ele;
  }
  render(vNode: VNode) {
    const tree = buildVNode(vNode);
    if (!this.domNode) {
      this.domNode = buildDomNode(tree, this.ele);
    } else {
      const diff = new Diff(this.domNode, tree);
      rebuildDomNode.sign = Symbol('diff');
      diff.setPatchVNode(rebuildDomNode);
      this.domNode = diff.dispatch();
    }
  }
}

export function createRoot(ele: HTMLElement) {
  return new Root(ele);
}

