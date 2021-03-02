import { build } from './component';
import { VNode } from './vNode';

export function render(vNode: VNode, parent: HTMLElement) {
  const builtDOM = build(vNode);
  parent.appendChild(builtDOM);
  return builtDOM;
}
