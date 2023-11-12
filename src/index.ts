import { Options } from '@types';
import { DEFAULT_OPTIONS } from '@constants';
import * as utilities from '@utilities';

export default class DomSubtreeSelector {

    constructor(options: Options = {}) {
        this.options = {
            ...DEFAULT_OPTIONS,
            ...options
        };
    }

    private options: Required<Options>;

    public querySelector<E extends Element = Element>(
        selector: string,
        rootElement: Document | Element = document
    ): E | null {
        return utilities.querySelector(selector, rootElement);
    }

    public querySelectorAll<E extends Element = Element>(
        selector: string,
        rootElement: Document | Element = document
    ): NodeListOf<E> {
        return utilities.querySelectorAll(
            selector,
            rootElement
        );
    }

    public queryShadowRootSelector(
        selector: string,
        rootElement: Document | Element = document
    ): ShadowRoot | null {
        return utilities.queryShadowRootSelector(selector, rootElement);
    }

    public promisableQuerySelector<E extends Element = Element>(
        selector: string,
        rootElement: Document | Element = document
    ): Promise<E | null > {
        return utilities.promisableQuerySelector(
            selector,
            rootElement,
            this.options.retries,
            this.options.retriesDelay
        );
    }

    public promisableQuerySelectorAll<E extends Element = Element>(
        selector: string,
        rootElement: Document | Element = document
    ): Promise<NodeListOf<E>> {
        return utilities.promisableQuerySelectorAll(
            selector,
            rootElement,
            this.options.retries,
            this.options.retriesDelay
        );
    }

    public promisableQueryShadowRootSelector(
        selector: string,
        rootElement: Document | Element = document
    ) {
        return utilities.promisableQueryShadowRootSelector(
            selector,
            rootElement,
            this.options.retries,
            this.options.retriesDelay
        );
    }

}