import type * as ShadowDomSelector from '../src';

declare global {
  interface Window {
    ShadowDomSelector: typeof ShadowDomSelector;
    __compare: <T extends Node = Element>(nodeList1: NodeListOf<T>, nodeList2: NodeListOf<T>) => boolean;
  }
}