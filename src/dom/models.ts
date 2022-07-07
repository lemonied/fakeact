import {
  ComponentVNodeBase,
  ElementVNodeBase,
  FragmentVNodeBase,
  TextVNode,
} from '../vNode';

export interface ElementDomNode extends ElementVNodeBase {
  children?: DomNodeType[];
  node: HTMLElement;
}

export interface FragmentDomNode extends FragmentVNodeBase {
  children?: DomNodeType[];
}

export interface ComponentDomNode extends ComponentVNodeBase {
  children?: DomNodeType[];
}

export interface TextDomNode extends TextVNode {
  node: Node;
}

export type DomNodeType = ElementDomNode | FragmentDomNode | ComponentDomNode | TextDomNode;
