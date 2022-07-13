import {
  VNode,
} from '../vNode';

export interface PatchVNode<T> {
  (vDom: T | null, vNode: T | null): void;
  sign?: symbol;
}

export class Diff<T extends VNode> {
  private readonly vDom: T;
  private readonly vNode: VNode;
  constructor(vDom: T, vNode: VNode) {
    this.vDom = vDom;
    this.vNode = vNode;
  }
  private patchVNode: PatchVNode<T> = () => {
    throw new Error('Please set function patchVNode');
  };
  private static sameVNode(oldVNode: VNode, newVNode: VNode) {
    if (oldVNode.type !== newVNode.type) {
      return false;
    }
    if (oldVNode.type === 'element' && newVNode.type === 'element') {
      return oldVNode.tagName === newVNode.tagName && oldVNode.key === newVNode.key;
    }
    if (oldVNode.type === 'component' && newVNode.type === 'component') {
      return oldVNode.Component === newVNode.Component && oldVNode.key === newVNode.key;
    }
    return true;
  }
  private execChildren(vDom: T | null, vNode: VNode | null) {
    const oldChildren = vDom?.children;
    const newChildren = vNode?.children;
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
          this.patchVNode(oldStartNode, newStartNode as T);
          this.execChildren(oldStartNode, newStartNode);
          oldStartIdx++;
          newStartIdx++;
          continue;
        }
        if (Diff.sameVNode(oldEndNode, newEndNode)) {
          this.patchVNode(oldEndNode, newEndNode as T);
          this.execChildren(oldEndNode, newEndNode);
          oldEndIdx--;
          newEndIdx--;
          continue;
        }
        if (Diff.sameVNode(oldStartNode, newEndNode)) {
          this.patchVNode(oldStartNode, newEndNode as T);
          this.execChildren(oldStartNode, newEndNode);
          oldStartIdx++;
          newEndIdx--;
          continue;
        }
        if (Diff.sameVNode(oldEndNode, newStartNode)) {
          this.patchVNode(oldEndNode, newStartNode as T);
          this.patchVNode(oldEndNode, newStartNode as T);
          oldEndIdx++;
          newStartIdx--;
          continue;
        }
        const index = p.findIndex(v => Diff.sameVNode(v, newStartNode));
        if (index > -1) {
          const spliced = p.splice(index, 1);
          p.splice(oldStartIdx, 0, spliced[0]);
        } else {
          this.patchVNode(null, n[newStartIdx] as T);
          newStartIdx++;
        }
      }
      if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
        if (oldStartIdx <= oldEndIdx) {
          p.slice(oldStartIdx, oldEndIdx + 1).forEach(v => this.patchVNode(v, null));
        } else if (newStartIdx <= newEndIdx) {
          n.slice(newStartIdx, newEndIdx + 1).forEach(v => this.patchVNode(null, v as T));
        }
      }
    } else if (oldChildren) {
      oldChildren.forEach(v => this.patchVNode(v, null));
    } else if (newChildren) {
      newChildren.forEach(v => this.patchVNode(null, v as T));
    }
  }
  private process(vDom: T | null, vNode: VNode | null) {
    if (vDom && vNode) {
      if (Diff.sameVNode(vDom, vNode)) {
        this.patchVNode(vDom, vNode as T);
        this.execChildren(vDom, vNode);
      } else {
        this.patchVNode(vDom, null);
        this.patchVNode(null, vNode as T);
      }
    } else if (vDom) {
      this.patchVNode(vDom, null);
    } else if (vNode) {
      this.patchVNode(null, vNode as T);
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
