import {
  buildComponent,
  isComponentConstructor,
} from '../component';
import { Attributes } from '../attribute';
import {
  JSXNode,
  NodeName,
  VNodeType,
  ElementVNode,
  ComponentVNode,
  TextVNode,
} from './models';
import { isFragment } from '../fragment';
import { isBasic } from '../helpers';

export class VNode {}

export function createVNode(nodeName: NodeName, attributes: Attributes, children: JSXNode[] | null): VNodeType {
  let vNode: VNodeType;
  if (typeof nodeName === 'string') {
    vNode = new VNode() as ElementVNode;
    vNode.tagName = nodeName;
    vNode.type = 'element';
  } else if (isComponentConstructor(nodeName)) {
    vNode = new VNode() as ComponentVNode;
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
        return v;
      }
      if (typeof v === 'undefined' || v === null) {
        return false;
      }
      const textNode = new VNode() as TextVNode;
      textNode.type = 'text';
      textNode.text = `${v}`;
      return textNode;
    }).filter(Boolean) as VNodeType[];
  }
  return vNode;
}

export function buildVNode(vNode: VNodeType): VNodeType {
  if (vNode.type === 'component') {
    const component = new vNode.Component!();
    component.props = Object.assign({ children: vNode.children }, vNode.attributes);
    vNode.instance = component;
    const child = buildComponent(component);
    if (child) {
      vNode.children = [child];
    }
  }
  if ('children' in vNode && vNode.children) {
    vNode.children = vNode.children.map(v => buildVNode(v));
  }
  return vNode;
}

export function rebuildVNode(pre: VNodeType, current: VNodeType) {
  if (
    pre.type === 'component' &&
    current.type === 'component' &&
    pre.Component === current.Component
  ) {
    const instance = pre.instance!;
    current.instance = instance;
    instance.props = current.attributes;
    const child = buildComponent(instance);
    if (child) {
      current.children = [child];
    }
  }
}
