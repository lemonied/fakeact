import { buildVNode, VNodeType } from '../vNode';
import { buildDomNode, createDomNode } from './';
import { Diff, Difference } from '../diff';
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
      this.domNode = diff.process();
    }
  }
}

export function createRoot(ele: HTMLElement) {
  return new Root(ele);
}

export function rerender(difference: Difference<DomNodeType>): DomNodeType {
  let ret!: DomNodeType;
  if ('vDom' in difference) {
    ret = difference.vDom;
  }
  if (difference.type === 'remove' || difference.type === 'replace') {
    const vDom = difference.vDom;
    if (vDom.type === 'element' && 'node' in vDom) {
      vDom.node.parentNode?.removeChild(vDom.node);
    }
  }
  if (difference.type === 'update') {
    const vDom = difference.vDom;
    const vNode = difference.vNode;
    if (vDom.type === 'text' && vNode.type === 'text' && 'node' in vDom) {
      const nodeType = vDom.node.nodeType;
      if (nodeType === 3) {
        vDom.text = vNode.text;
        vDom.node.textContent = vNode.text!;
      }
    }
    ret = vDom;
  }
  if (difference.type === 'add') {
    const vNode = difference.vNode;
    ret = createDomNode(vNode);
  }
  return ret;
}
