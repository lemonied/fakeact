import { setAttributes } from '../attribute';
import { VNode } from '../vNode';
import { DomNode, DomNodeElement, DomNodeText } from './models';
import { PatchVNode } from '../diff';

export function createDomNode(vNode: VNode) {
  const domNode = vNode as DomNode;
  if (domNode.type === 'text') {
    domNode.node = document.createTextNode(domNode.text!) as unknown as DomNodeText;
  } else if (domNode.type === 'element') {
    domNode.node = document.createElement(domNode.tagName!) as unknown as DomNodeElement;
    setAttributes(domNode.node as HTMLElement, domNode.attributes);
  }
  return domNode;
}

export function buildDomNode(vNode: VNode, parentNode: Node): DomNode {
  const domNode = createDomNode(vNode);
  let node = parentNode;
  if (domNode.type === 'element' || domNode.type === 'text') {
    parentNode.appendChild(domNode.node!);
    node = domNode.node!;
  }
  domNode.children?.forEach(v => buildDomNode(v, node));
  return domNode;
}

const upgraded = Symbol('upgraded');
export const rebuildDomNode: PatchVNode<DomNode> = (vDom, vNode) => {
  if (vDom && vNode) {
    vNode.node = vDom.node;
    if (vDom.type === 'text' && vNode.type === 'text' && vDom.text !== vNode.text) {
      vNode.node!.textContent = vNode.text!;
    }
  } else if (vDom) {
    removeAllNode(vDom);
  } else if (vNode) {
    insertNode(vNode);
  }
  if (vNode?.node) {
    vNode.node[upgraded] = rebuildDomNode.sign;
  }
};
function insertNode(vDom: DomNode, parent?: Node) {
  if (vDom.type === 'text' || vDom.type === 'element') {
    if (!parent) {
      parent = upChainNode(vDom);
    }
    if (parent) {
      const newNode = createDomNode(vDom);
      for (const child of Array.from(parent.childNodes)) {
        if ((child as any)[upgraded] !== rebuildDomNode.sign) {
          insertBefore(parent, newNode.node!, child);
          newNode.node![upgraded] = rebuildDomNode.sign;
          newNode.children?.forEach(v => insertNode(v, newNode.node));
          return;
        }
      }
      insertBefore(parent, newNode.node!);
      newNode.node![upgraded] = rebuildDomNode.sign;
      newNode.children?.forEach(v => insertNode(v, newNode.node));
    }
  }
}

export function upChainNode(vDom?: DomNode): Node | undefined {
  if (vDom?.node) {
    return vDom.node;
  }
  return upChainNode(vDom?.parentNode);
}

export function removeAllNode(vNode: DomNode) {
  if ('node' in vNode) {
    vNode.node!.parentNode?.removeChild(vNode.node!);
  } else if ('children' in vNode) {
    vNode.children!.forEach(v => removeAllNode(v));
  }
}

export function insertBefore(parent: Node, newNode: Node, oldNode?: Node) {
  if (parent) {
    if (oldNode) {
      parent.insertBefore(newNode, oldNode);
    } else {
      parent.appendChild(newNode);
    }
  }
}
