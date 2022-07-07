import { VNode, FragmentVNode } from '../vNode';

export const FragmentType = Symbol('Fragment');

export interface FragmentFunction {
  (): FragmentVNode;
  [FragmentType]?: true;
}

export const Fragment: FragmentFunction = () => {
  const fragment = new VNode() as FragmentVNode;
  fragment.type = 'fragment';
  return fragment;
};

Fragment[FragmentType] = true;

export function isFragment(val: any): val is FragmentFunction {
  return !!val?.[FragmentType];
}
