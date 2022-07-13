import {
  buildComponent,
  Component,
  ComponentConstructor,
  isComponentConstructor,
} from '../component';
import { Attributes } from '../attribute';
import {
  JSXNode,
  NodeName,
} from './models';
import { isFragment } from '../fragment';
import { isBasic } from '../helpers';

const weakMap = new WeakMap();

export class VNode {
  public key?: any;
  public type: 'element' | 'fragment' | 'component' | 'text';
  public attributes?: Attributes;
  public tagName?: string;
  Component?: ComponentConstructor;
  instance?: Component;
  text?: string;
  children?: this[];
  public get parentNode(): this | undefined {
    return weakMap.get(this);
  }
  constructor(type: VNode['type']) {
    this.type = type;
  }
  setParentNode(val: this) {
    weakMap.set(this, val);
  }
}

export function isVNode(val: any): val is VNode {
  return val instanceof VNode;
}

export function createVNode(nodeName: NodeName, attributes: Attributes, children: JSXNode[] | null): VNode {
  let vNode: VNode;
  if (typeof nodeName === 'string') {
    vNode = new VNode('element');
    vNode.tagName = nodeName;
    vNode.type = 'element';
  } else if (isComponentConstructor(nodeName)) {
    vNode = new VNode('component');
    vNode.Component = nodeName;
    vNode.type = 'component';
  } else if (isFragment(nodeName)) {
    vNode = nodeName();
  } else {
    throw new Error('Invalid NodeName');
  }
  if (vNode.type === 'element' || vNode.type === 'component') {
    vNode.attributes = attributes;
  }
  if (children?.length && (vNode.type === 'element' || vNode.type === 'component' || vNode.type === 'fragment')) {
    vNode.children = children.map(v => {
      if (!isBasic(v)) {
        v.setParentNode(vNode);
        return v;
      }
      if (typeof v === 'undefined' || v === null) {
        return false;
      }
      const textNode = new VNode('text');
      textNode.type = 'text';
      textNode.text = `${v}`;
      textNode.setParentNode(vNode);
      return textNode;
    }).filter(Boolean) as VNode[];
  }
  return vNode;
}

export function buildVNode(vNode: VNode): VNode {
  if (vNode.type === 'component') {
    const component = new vNode.Component!();
    component.props = Object.assign({ children: vNode.children }, vNode.attributes);
    vNode.instance = component;
    const child = buildComponent(component);
    if (child) {
      child.setParentNode(vNode);
      vNode.children = [child];
    }
  }
  if (vNode.children?.length) {
    vNode.children = vNode.children.map(v => buildVNode(v));
  }
  return vNode;
}
