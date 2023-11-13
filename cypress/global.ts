import * as ShadowDomSelector from '../src';

declare global {
  interface Window {
    ShadowDomSelector: typeof ShadowDomSelector;
  }
}