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
