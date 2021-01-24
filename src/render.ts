import { VNode, isVNode} from './vNode';

export function render(vNode: VNode, element?: HTMLElement | null) {
  element?.appendChild(build(vNode));
}

function build(vNode: VNode): HTMLElement {
  const ele = document.createElement(vNode.name);
  const attrs = vNode.attrs || {};
  Object.keys(attrs).forEach(key => {
    ele.setAttribute(key, attrs[key]);
  });
  const children = vNode.children || [];
  children.forEach(v => {
    if (typeof v === 'string' || typeof v === 'number') {
      ele.appendChild(document.createTextNode(String(v)));
    } else if (isVNode(v)) {
      ele.appendChild(build(v));
    }
  });
  return ele;
}
