import * as ShadowDomSelector from '../src';

// @ts-ignore
window.ShadowDomSelector = ShadowDomSelector;
// @ts-ignore
window.__compare = <T extends Node = Element>(
    nodeList1: NodeListOf<T>,
    nodeList2: NodeListOf<T>
): boolean => {
    const sameLength = nodeList1.length === nodeList2.length;
    const sameElements = Array.from(nodeList1).every((element: T, index: number) => {
        return element === nodeList2.item(index);
    });
    return sameLength && sameElements;
};

class DelayedListContainer extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        setTimeout(() => {
            const shadow = this.attachShadow({ mode: 'open' });
            shadow.innerHTML = `
                <ul>
                    <li class="delayed-li">Delayed List item 1</li>
                    <li class="delayed-li">Delayed List item 2</li>
                    <li class="delayed-li">Delayed List item 3</li>
                </ul>
            `;
        }, 500);
        
    }
}

customElements.define('delayed-list-container', DelayedListContainer);