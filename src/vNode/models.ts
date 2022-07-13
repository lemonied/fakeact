import { ComponentConstructor } from '../component';
import { FragmentFunction } from '../fragment';
import { VNode } from './vNode';

export type NodeName = string | ComponentConstructor | Function | FragmentFunction;

export type JSXNode = VNode | number | boolean | null | undefined | string;
