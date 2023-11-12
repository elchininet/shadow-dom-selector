import ShadowQuerySelector from '../src';

declare global {
  interface Window {
    ShadowQuerySelector: typeof ShadowQuerySelector;
  }
}