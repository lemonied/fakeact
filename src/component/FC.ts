import { VNode } from '../vNode';

export interface FunctionComponent<P=any> {
  // eslint-disable-next-line no-unused-vars
  (props: P): VNode;
  defaultProps?: P;
}

export type FC<P=any> = FunctionComponent<P>;
