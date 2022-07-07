import { ComponentConstructor, Component } from '../component';
import { FragmentFunction } from '../fragment';
import { Attributes } from '../attribute';

export type NodeName = string | ComponentConstructor | Function | FragmentFunction;

export type JSXNode = VNodeType | number | boolean | null | undefined | string;

export interface ElementVNodeBase {
  type: 'element';
  tagName: string;
  attributes: Attributes;
}
export interface ElementVNode extends ElementVNodeBase {
  children?: VNodeType[];
}

export interface FragmentVNodeBase {
  type: 'fragment';
}
export interface FragmentVNode extends FragmentVNodeBase {
  children?: VNodeType[];
}

export interface ComponentVNodeBase {
  type: 'component';
  attributes: Attributes;
  Component: ComponentConstructor;
  instance?: Component;
}
export interface ComponentVNode extends ComponentVNodeBase {
  children?: VNodeType[];
}

export interface TextVNode {
  type: 'text';
  text: string;
}

export type VNodeType = ElementVNode | ComponentVNode | FragmentVNode | TextVNode;
