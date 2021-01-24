import { VNode, isVNode} from './vNode';
import { Component } from './component';

export function render(vNode: VNode, element?: HTMLElement | null) {
  element?.appendChild(build(vNode));
}

const domEvents = {
  onclick: 'click',
};

function build(vNode: VNode, component?: Component): HTMLElement {
  const ele = document.createElement(vNode.name);
  const attrs = vNode.attrs || {};
  if (!vNode.component) {
    vNode.component = component;
  }
  Object.keys(attrs).forEach(key => {
    const loweredAttr = key.toLowerCase();
    if (Object.keys(domEvents).includes(loweredAttr)) {
      attrs[key] = attrs[key].bind(vNode.component);
      ele.addEventListener((domEvents as any)[loweredAttr], attrs[key], false);
    } else {
      ele.setAttribute(key, attrs[key]);
    }
  });
  const children = vNode.children || [];
  children.forEach(v => {
    if (typeof v === 'string' || typeof v === 'number') {
      ele.appendChild(document.createTextNode(String(v)));
    } else if (isVNode(v)) {
      ele.appendChild(build(v, vNode.component));
    }
  });
  return ele;
}
