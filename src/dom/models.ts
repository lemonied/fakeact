import {
  VNode,
} from '../vNode';

export interface DomNodeElement extends HTMLElement {
  [prop: symbol]: any;
}

export interface DomNodeText extends Node {
  [prop: symbol]: any;
}

export interface DomNode extends VNode {
  node?: DomNodeElement | DomNodeText;
}
