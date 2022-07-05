import { VNode } from '../vNode';

export const FragmentType = Symbol('Fragment');

export const Fragment = () => {
  return new VNode('fragment');
};

(Fragment as any)[FragmentType] = true;

export function isFragment(val: any): val is typeof Fragment {
  return !!val?.[FragmentType];
}
