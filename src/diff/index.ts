import {
  VNodeType,
} from '../vNode';

export class Diff<T extends VNodeType> {
  private readonly vDom: T;
  private readonly vNode: VNodeType;
  constructor(vDom: T, vNode: VNodeType) {
    this.vDom = vDom;
    this.vNode = vNode;
  }
  private patchVNode: (vDom: T | null, vNode: VNodeType | null) => void = () => {
    throw new Error('Please set function patchVNode');
  };
  private static sameVNode(oldVNode: VNodeType, newVNode: VNodeType) {
    if (oldVNode.type !== newVNode.type) {
      return false;
    }
    if (oldVNode.type === 'element' && newVNode.type === 'element') {
      return oldVNode.tagName === newVNode.tagName && oldVNode.key === newVNode.key;
    }
    if (oldVNode.type === 'text' && newVNode.type === 'text') {
      return oldVNode.text === newVNode.text;
    }
    return true;
  }
  private execChildren(vDom: T | null, vNode: VNodeType | null) {
    let oldChildren: T[] | null = null;
    let newChildren: VNodeType[] | null = null;
    if (vDom && 'children' in vDom) {
      oldChildren = vDom.children as T[];
    }
    if (vNode && 'children' in vNode) {
      newChildren = vNode.children as VNodeType[];
    }
    if (oldChildren && newChildren) {
      const p = [...oldChildren];
      const n = [...newChildren];
      let oldStartIdx = 0;
      let oldEndIdx = p.length - 1;
      let newStartIdx = 0;
      let newEndIdx = n.length - 1;
      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        const oldStartNode = p[oldStartIdx];
        const oldEndNode = p[oldEndIdx];
        const newStartNode = n[newStartIdx];
        const newEndNode = n[newEndIdx];
        if (Diff.sameVNode(oldStartNode, newStartNode)) {
          this.patchVNode(oldStartNode, newStartNode);
          this.execChildren(oldStartNode, newStartNode);
          oldStartIdx++;
          newStartIdx++;
          continue;
        }
        if (Diff.sameVNode(oldEndNode, newEndNode)) {
          this.patchVNode(oldEndNode, newEndNode);
          this.execChildren(oldEndNode, newEndNode);
          oldEndIdx--;
          newEndIdx--;
          continue;
        }
        if (Diff.sameVNode(oldStartNode, newEndNode)) {
          this.patchVNode(oldStartNode, newEndNode);
          this.execChildren(oldStartNode, newEndNode);
          oldStartIdx++;
          newEndIdx--;
          continue;
        }
        if (Diff.sameVNode(oldEndNode, newStartNode)) {
          this.patchVNode(oldEndNode, newStartNode);
          this.patchVNode(oldEndNode, newStartNode);
          oldEndIdx++;
          newStartIdx--;
          continue;
        }
        const index = p.findIndex(v => Diff.sameVNode(v, newStartNode));
        if (index > -1) {
          const spliced = p.splice(index, 1);
          p.splice(oldStartIdx, 0, spliced[0]);
        } else {
          this.patchVNode(null, n[newStartIdx]);
          newStartIdx++;
        }
      }
      if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
        if (oldStartIdx <= oldEndIdx) {
          p.slice(oldStartIdx, oldEndIdx + 1).forEach(v => this.patchVNode(v, null));
        } else if (newStartIdx <= newEndIdx) {
          n.slice(newStartIdx, newEndIdx + 1).forEach(v => this.patchVNode(null, v));
        }
      }
    } else if (oldChildren) {
      oldChildren.forEach(v => this.patchVNode(v, null));
    } else if (newChildren) {
      newChildren.forEach(v => this.patchVNode(null, v));
    }
  }
  private process(vDom: T | null, vNode: VNodeType | null) {
    if (vDom && vNode) {
      if (Diff.sameVNode(vDom, vNode)) {
        this.patchVNode(vDom, vNode);
        this.execChildren(vDom, vNode);
      } else {
        this.patchVNode(vDom, null);
        this.patchVNode(null, vNode);
        this.execChildren(null, vNode);
      }
    } else if (vDom) {
      this.patchVNode(vDom, null);
    } else if (vNode) {
      this.patchVNode(null, vNode);
    }
  }
  public setPatchVNode(callback: Diff<T>['patchVNode']) {
    this.patchVNode = callback;
  }
  public dispatch() {
    this.process(this.vDom, this.vNode);
    return this.vNode as T;
  }
}
