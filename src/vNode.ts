import { ComponentConstructor } from './component';

export type NodeName = string | ComponentConstructor;
export type Attributes = { [prop: string]: any } | null;
export type Children = Array<VNode | string | number> | null;

export class VNode {
  nodeName: NodeName;
  attributes: Attributes;
  children: Children;
  constructor(nodeName: NodeName, attributes: Attributes, children: Children) {
    this.nodeName = nodeName;
    this.attributes = attributes;
    this.children = children;
  }
}
