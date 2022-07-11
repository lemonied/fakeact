import { buildVNode, VNodeType } from '../vNode';
import { buildDomNode, rebuildDomNode } from './';
import { Diff } from '../diff';
import { DomNodeType } from './models';

export class Root {
  private readonly ele: HTMLElement;
  private domNode: DomNodeType | null = null;
  constructor(ele: HTMLElement) {
    this.ele = ele;
  }
  render(vNode: VNodeType) {
    const tree = buildVNode(vNode);
    if (!this.domNode) {
      this.domNode = buildDomNode(tree, this.ele);
    } else {
      const diff = new Diff(this.domNode, tree);
      diff.setPatchVNode(rebuildDomNode);
      this.domNode = diff.dispatch();
    }
  }
}

export function createRoot(ele: HTMLElement) {
  return new Root(ele);
}

