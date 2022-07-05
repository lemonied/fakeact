import { ComponentConstructor } from '../component';

import { VNode } from './vNode';

export type NodeType = 'element' | 'component' | 'fragment' | 'text';

export type NodeName = string | ComponentConstructor | Function;

export type JSXNode = VNode | number | boolean | null | undefined | string;
