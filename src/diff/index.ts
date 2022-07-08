import {
  VNodeType,
} from '../vNode';
import { Attributes } from '../attribute';

export interface Difference<T extends VNodeType> {
  type: 'remove' | 'update' | 'add';
  vDom: T;
}

export class Diff<T extends VNodeType> {
  private readonly vDom: T;
  private readonly vNode: VNodeType;
  private results: Difference<T>[] = [];
  constructor(vDom: T, vNode: VNodeType) {
    this.vDom = vDom;
    this.vNode = vNode;
  }
  private execChildren(oldChildren: T[] | null, newChildren: VNodeType[] | null) {
    if (oldChildren && newChildren) {
      let newEndIdx = newChildren.length - 1;
    }
  }
  private patchVNode() {}
  private process(vDom: T | null, vNode: VNodeType | null) {
    if (vDom && vNode) {
      if (vDom.type === 'component' && vNode.type === 'component') {
        //
      } else if (vDom.type === 'text' && vNode.type === 'text') {
        this.results.push({
          type: 'update',
          vDom: vNode as T,
        });
      } else if (vDom.type === 'element' && vNode.type === 'element') {
        if (vDom.tagName !== vNode.tagName) {
          this.results.push({
            type: 'remove',
            vDom,
          }, {
            type: 'add',
            vDom: vNode as T,
          });
        }
      }
      let length = 0;
      if ('children' in vNode) {
        length = Math.max(vNode.children?.length ?? 0, length);
      }
      if ('children' in vDom) {
        length = Math.max(vDom.children?.length ?? 0, length);
      }
      for (let i = 0; i < length; i += 1){
        this.process((vDom as any).children?.[i], (vNode as any).children?.[i]);
      }
    } else if (vDom) {
      this.results.push({
        type: 'remove',
        vDom,
      });
    } else if (vNode) {
      this.results.push({
        type: 'add',
        vDom: vNode as T,
      });
    }
  }
  public compare() {
    this.process(this.vDom, this.vNode);
    return this.results;
  }
}

export function attributeDiff(prev: Attributes, current: Attributes) {

}
