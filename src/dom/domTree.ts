import { VNode } from '../vNode';
import { setAttributes } from '../attribute';

export class DomTree extends VNode {
  node?: Node;
}

export function createDomTreeByVNode(vNode: VNode) {
  const domTree = new DomTree(vNode.type);
  Object.assign(domTree, vNode);
  return domTree;
}

export function buildDomTree(vNode: VNode, parentNode: Node): DomTree {
  const domTree = createDomTreeByVNode(vNode);
  let node = parentNode;
  if (domTree.type === 'element') {
    const ele = document.createElement(vNode.tagName!);
    domTree.node = ele;
    parentNode.appendChild(domTree.node);
    node = domTree.node;
    setAttributes(ele, vNode.attributes);
  } else if (domTree.type === 'text') {
    domTree.node = document.createTextNode(vNode.text!);
    parentNode.appendChild(domTree.node);
    node = domTree.node;
  }
  if (vNode.children) {
    for (const child of vNode.children) {
      buildDomTree(child, node);
    }
  }
  return domTree;
}
