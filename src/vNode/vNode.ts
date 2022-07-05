import {
  buildComponent,
  ComponentConstructor,
  Component,
  isComponentConstructor,
} from '../component';
import { Attributes } from '../attribute';
import { JSXNode, NodeName, NodeType } from './models';
import { isFragment } from '../fragment';

export class VNode {
  public type: NodeType;
  public tagName?: string;
  public text?: string;
  public Component?: ComponentConstructor;
  public componentInstance?: Component;
  public attributes?: Attributes;
  public children?: VNode[];
  constructor(type: NodeType) {
    this.type = type;
  }
}

export function createVNode(nodeName: NodeName, attributes: Attributes, children: JSXNode[] | null) {
  let vNode: VNode;
  if (typeof nodeName === 'string') {
    vNode = new VNode('element');
    vNode.tagName = nodeName;
  } else if (isComponentConstructor(nodeName)) {
    vNode = new VNode('component');
    vNode.Component = nodeName;
  } else if (isFragment(nodeName)) {
    vNode = nodeName();
  } else {
    throw new Error('Invalid NodeName');
  }
  vNode.attributes = attributes;
  if (children?.length) {
    vNode.children = children.map(v => {
      if (v instanceof VNode) {
        return v;
      }
      if (typeof v === 'undefined' || v === null) {
        return false;
      }
      const textNode = new VNode('text');
      textNode.text = `${v}`;
      return textNode;
    }).filter(Boolean) as VNode[];
  }
  return vNode;
}

export function buildVNode(vNode: VNode) {
  if (vNode.type === 'component') {
    const component = new vNode.Component!();
    component.props = Object.assign({ children: vNode.children }, vNode.attributes);
    vNode.componentInstance = component;
    const child = buildComponent(component);
    if (child) {
      vNode.children = [child];
    }
  }
  if (vNode.children) {
    for (const v of vNode.children) {
      buildVNode(v);
    }
  }
  return vNode;
}
