import { Component } from './component';

interface Attrs {
  [attr: string]: any;
}
export type Attributes = null | Attrs;
export type DioElement = string | number | undefined | null | VNode;

export class VNode {
  name: string;
  attrs: Attributes;
  children: DioElement[] | null;
  component?: Component;
  constructor(node: string, attrs: Attributes, children: DioElement[] | null) {
    this.name = node as string;
    this.attrs = attrs;
    this.children = children;
  }
}

export function isVNode(val: any): val is VNode {
  return val instanceof VNode;
}
