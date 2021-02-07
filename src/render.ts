import { VNode, isVNode } from './vNode';
import { Component, isComponent, rootCheck, observedListener, ComponentConstructor } from './component';

export async function render(node: VNode | ComponentConstructor, element?: HTMLElement | null) {
  const vNodes = await buildVNode(node);
  const ele = await build(vNodes);
  element?.appendChild(ele);
  return vNodes;
}

async function reRender(node: Component, element: HTMLElement) {
  diff(node.render(), node.$vNode, element.parentElement!);
}

const domEvents = {
  onclick: 'click',
  onmouseenter: 'mouseenter',
  onmousemove: 'mousemove',
  onmouseleave: 'mouseleave',
  onkeydown: 'keydown',
  onkeyup: 'keyup',
};

async function buildVNodeChildren(Node: VNode) {
  const children = Node.children;
  if (children) {
    for (let i = 0; i < children.length; i += 1) {
      const v = children[i];
      if (isVNode(v) || typeof v === 'function') {
        children.splice(i, 1, await buildVNode(v));
      }
    }
  }
}
async function buildVNode(Node: VNode | ComponentConstructor): Promise<VNode | Component> {
  if (isVNode(Node)) {
    await buildVNodeChildren(Node);
  } else if (typeof Node === 'function') {
    const component = new Node();
    await component.$readyToken;
    component.$registerRootCheck(() => {
      reRender(component, component.$vNode.htmlElement);
    });
    component.$vNode = component.render();
    component.$vNode.component = component;
    await buildVNodeChildren(component.$vNode);
    return component;
  }
  return Node;
}
async function build(Node: VNode | Component, component?: Component) {
  let vNode: VNode;
  if (isComponent(Node)) {
    vNode = Node.$vNode;
  } else {
    if (!Node.component) {
      Node.component = component!;
    }
    vNode = Node;
  }
  const ele = syncBuild(vNode);
  vNode.htmlElement = ele;
  const children = vNode.children || [];
  for (const v of children) {
    if (typeof v === 'string' || typeof v === 'number') {
      ele.appendChild(document.createTextNode(String(v)));
    } else if (isVNode(v) || isComponent(v)) {
      ele.appendChild(await build(v, vNode.component));
    }
  }
  return ele;
}

function syncBuild(vNode: VNode) {
  const ele = document.createElement(vNode.name);
  const attrs = vNode.attrs || {};
  Object.keys(attrs).forEach(key => {
    const loweredAttr = key.toLowerCase();
    if (Object.keys(domEvents).includes(loweredAttr)) {
      attrs[key] = attrs[key].bind(vNode.component);
      ele.addEventListener((domEvents as any)[loweredAttr], attrs[key], false);
    } else {
      ele.setAttribute(key, attrs[key]);
    }
  });
  return ele;
}

function destroyComponent(component: Component) {
  component[observedListener] = [];
  component[rootCheck] = [];
  if (typeof component.beforeDestroy === 'function') {
    component.beforeDestroy();
  }
}
function destroyAll(vNodes: Array<any>) {
  vNodes.forEach(v => {
    if (isComponent(v)) {
      destroyComponent(v);
      destroyAll(v.$vNode.children || []);
    } else if (isVNode(v)) {
      destroyAll(v.children || []);
    }
  });
}

function diff(newNode: VNode, oldNode: VNode, parentHtml: HTMLElement) {
  const newAttrs = newNode.attrs || {};
  const oldAttrs = oldNode.attrs || {};
  const html = oldNode.htmlElement;
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];
  if (newNode.name === oldNode.name) {
    Object.keys(newAttrs).forEach(key => {
      if (newAttrs[key] === oldAttrs[key]) { return; }
      const loweredAttr = key.toLowerCase();
      if (Object.keys(domEvents).includes(loweredAttr)) {
        newAttrs[key] = newAttrs[key].bind(newNode.component);
        html.removeEventListener((domEvents as any)[loweredAttr], oldAttrs[key]);
        html.addEventListener((domEvents as any)[loweredAttr], newAttrs[key]);
      } else {
        html.setAttribute(key, newAttrs[key]);
      }
    });
    if (oldChildren.length > newChildren.length) {
      newChildren.push(...new Array(oldChildren.length - newChildren.length).fill(null));
    }
    newChildren.forEach((child, index) => {
      const old = oldChildren[index];
      if (isComponent(child) && isComponent(old) && child.constructor === old.constructor) {
        diff(old.render(), old.$vNode, html);
      } else if (isVNode(child) && isVNode(old)) {
        diff(child, old, html);
      } else if (isVNode(child)) {
        destroyAll([oldChildren[index]]);
        html.replaceChild(syncBuild(child), html.childNodes[index]);
      } else if (isComponent(child)) {
        build(child).then(ele => {
          destroyAll([oldChildren[index]]);
          html.replaceChild(ele, html.childNodes[index]);
        });
      } else if (typeof child === 'string' || typeof child === 'number') {
        html.replaceChild(document.createTextNode(String(child)), html.childNodes[index]);
      } else {
        destroyAll([oldChildren[index]]);
        html.removeChild(html.childNodes[index]);
      }
    });
  } else {
    const newEle = syncBuild(newNode);
    destroyAll(oldChildren);
    parentHtml.replaceChild(
      newEle,
      oldNode.htmlElement,
    );
  }
}
