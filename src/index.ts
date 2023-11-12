import { Options } from '@types';
import { DEFAULT_OPTIONS } from '@constants';
import * as utilities from '@utilities';

export default class ShadowDomSelector {

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

    public asyncQuerySelector<E extends Element = Element>(
        selector: string,
        rootElement: Document | Element = document
    ): Promise<E | null > {
        return utilities.asyncQuerySelector(
            selector,
            rootElement,
            this.options.retries,
            this.options.retriesDelay
        );
    }

    public asyncQuerySelectorAll<E extends Element = Element>(
        selector: string,
        rootElement: Document | Element = document
    ): Promise<NodeListOf<E>> {
        return utilities.asyncQuerySelectorAll(
            selector,
            rootElement,
            this.options.retries,
            this.options.retriesDelay
        );
    }

    public asyncQueryShadowRootSelector(
        selector: string,
        rootElement: Document | Element = document
    ) {
        return utilities.asyncQueryShadowRootSelector(
            selector,
            rootElement,
            this.options.retries,
            this.options.retriesDelay
        );
    }

}