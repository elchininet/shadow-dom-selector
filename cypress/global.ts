import DomSubtreeSelector from '../src';

declare global {
  interface Window {
    DomSubtreeSelector: typeof DomSubtreeSelector;
  }
}