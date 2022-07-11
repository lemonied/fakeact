import { VNodeType } from '../vNode';
import { setAttributes } from '../attribute';
import { DomNodeType, ElementDomNode, TextDomNode } from './models';

export function createDomNode(vNode: VNodeType) {
  const domNode = vNode as (ElementDomNode | TextDomNode);
  if (domNode.type === 'text') {
    domNode.node = document.createTextNode(domNode.text);
  } else if (domNode.type === 'element') {
    domNode.node = document.createElement(domNode.tagName);
    setAttributes(domNode.node, domNode.attributes);
  }
  return domNode;
}

export function buildDomNode(vNode: VNodeType, parentNode: Node): DomNodeType {
  const domNode = createDomNode(vNode);
  let node = parentNode;
  if (domNode.type === 'element') {
    parentNode.appendChild(domNode.node);
    node = domNode.node;
  } else if (domNode.type === 'text') {
    parentNode.appendChild(domNode.node);
    node = domNode.node;
  }
  if ('children' in domNode && domNode.children) {
    const children: DomNodeType[] = [];
    for (const child of domNode.children) {
      children.push(
        buildDomNode(child, node),
      );
    }
    domNode.children = children;
  }
  return domNode;
}

export function rebuildDomNode(vDom: DomNodeType | null, vNode: VNodeType | null) {
  if (vDom && vNode) {
    //
  } else if (vDom) {
    removeAllNode(vDom);
  } else if (vNode) {
    //
  }
}

export function removeAllNode(vNode: DomNodeType) {
  if ('node' in vNode) {
    vNode.node.parentNode?.removeChild(vNode.node);
  } else if ('children' in vNode) {
    vNode.children?.forEach(v => removeAllNode(v));
  }
}

export function insertAfter(oldNode: Node, newNode: Node) {
  const parent = oldNode.parentNode;
  if (parent) {
    if (oldNode === parent.lastChild) {
      return parent.appendChild(newNode);
    } else {
      return parent.insertBefore(newNode, oldNode.nextSibling);
    }
  }
}
