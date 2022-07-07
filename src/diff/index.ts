import {
  rebuildVNode,
  VNodeType,
} from '../vNode';
import { Attributes } from '../attribute';

interface ReplaceOrUpdate<T extends VNodeType> {
  type: 'update' | 'replace';
  vDom: T;
  vNode: VNodeType;
}

interface Add {
  type: 'add';
  vNode: VNodeType;
}

interface Remove<T extends VNodeType> {
  type: 'remove';
  vDom: T
}

export type Difference<T extends VNodeType> = ReplaceOrUpdate<T> | Add | Remove<T>;

export class Diff<T extends VNodeType> {
  private vDom: T;
  private vNode: VNodeType;
  public chains: T[] = [];
  constructor(vDom: T, vNode: VNodeType) {
    this.vDom = vDom;
    this.vNode = vNode;
  }
  public getVDom() {
    return this.chains[this.chains.length - 1];
  }
  public process(vDom: T, vNode: VNodeType, callback: (difference: Difference<T>) => T): T {
    this.chains.push(vDom);
    if (vDom.type === 'component' && vNode.type === 'component') {
      if (vDom.Component === vNode.Component) {
        rebuildVNode(vDom, vNode);
      }
    } else if (vDom.type === 'text' && vNode.type === 'text') {
      callback({
        type: 'update',
        vDom,
        vNode,
      });
    } else if (vDom.type === 'element' && vNode.type === 'element') {
      if (vDom.tagName !== vNode.tagName) {
        callback({
          type: 'replace',
          vDom,
          vNode,
        });
      }
    }
    if ('children' in vNode && 'children' in vDom) {
      const length = Math.max(vNode.children?.length ?? 0, vDom.children?.length ?? 0);
      const children: Array<T | null> = [];
      for (let i = 0; i < length; i += 1) {
        const v = vNode.children?.[i];
        const t = vDom.children?.[i];
        if (v && t) {
          children[i] = this.process(t as T, v, callback);
        } else if (v) {
          children[i] = callback({
            type: 'add',
            vNode: v,
          });
        } else if (t) {
          callback({
            type: 'remove',
            vDom,
          });
          children[i] = null;
        }
      }
      vDom.children = children.filter(Boolean) as T[];
    }
    this.chains.splice(0, this.chains.length);
    return vDom;
  }
}

export function attributeDiff(prev: Attributes, current: Attributes) {

}
