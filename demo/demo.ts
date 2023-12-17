import * as ShadowDomSelector from '../src';

// @ts-ignore
window.ShadowDomSelector = ShadowDomSelector;

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