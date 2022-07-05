import { VNode } from '../vNode';

export type PropsWithChildren<P = unknown> = P & { children?: VNode[] | undefined };
