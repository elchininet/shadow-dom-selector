import type { AsyncParams } from '@types';
import {
    DEFAULT_RETRIES,
    DEFAULT_DELAY,
    INVALID_SELECTOR,
    SHADOW_ROOT_SELECTOR,
} from '@constants';
import * as lib from '@lib';
import {
    isParamsWithRoot,
    getPromisableShadowRoot,
    getPromisableElement,
    getElementPromise
} from '@utilities';

export function querySelector<E extends Element = Element>(
    root: Document | Element,
    selectors: string
): E | null;
export function querySelector<E extends Element = Element>(
    selectors: string
): E | null;
export function querySelector<E extends Element = Element>(
    ...params: [Document | Element, string] | [string]
): E | null {
    const [rootOrSelector, selectors] = params;
    if (typeof rootOrSelector === 'string') {
        return lib.querySelector(
            rootOrSelector,
            document
        );
    }
    return lib.querySelector(
        selectors,
        rootOrSelector
    );
}

export function querySelectorAll<E extends Element = Element>(
    root: Document | Element,
    selectors: string
): NodeListOf<E>;
export function querySelectorAll<E extends Element = Element>(
    selectors: string
): NodeListOf<E>;
export function querySelectorAll<E extends Element = Element>(
    ...params: [Document | Element, string] | [string]
): NodeListOf<E> {
    const [rootOrSelector, selectors] = params;
    if (typeof rootOrSelector === 'string') {
        return lib.querySelectorAll(
            rootOrSelector,
            document
        );
    }
    return lib.querySelectorAll(
        selectors,
        rootOrSelector
    );
}

export function shadowRootQuerySelector(
    root: Document | Element,
    selectors: string
): ShadowRoot | null;
export function shadowRootQuerySelector(
    selectors: string
): ShadowRoot | null;
export function shadowRootQuerySelector(
    ...params: [Document | Element, string] | [string]
): ShadowRoot | null {
    const [rootOrSelector, selectors] = params;
    if (typeof rootOrSelector === 'string') {
        return lib.shadowRootQuerySelector(
            rootOrSelector,
            document
        );
    }
    return lib.shadowRootQuerySelector(
        selectors,
        rootOrSelector
    );
}

export async function asyncQuerySelector<E extends Element = Element>(
    root: Document | Element,
    selectors: string,
    asyncParams?: AsyncParams,
): Promise<E | null >;
export async function asyncQuerySelector<E extends Element = Element>(
    selectors: string,
    asyncParams?: AsyncParams,
): Promise<E | null >;
export async function asyncQuerySelector<E extends Element = Element>(
    ...params: [Document | Element, string, AsyncParams?] | [string, AsyncParams?]
): Promise<E | null > {

    if (isParamsWithRoot(params)) {
        const [root, selectors, asyncParams] = params;
        return await lib.asyncQuerySelector(
            selectors,
            root,
            asyncParams?.retries || DEFAULT_RETRIES,
            asyncParams?.delay || DEFAULT_DELAY
        );
    }

    const [selectors, asyncParams] = params;

    return await lib.asyncQuerySelector(
        selectors,
        document,
        asyncParams?.retries || DEFAULT_RETRIES,
        asyncParams?.delay || DEFAULT_DELAY
    );
}

export async function asyncQuerySelectorAll<E extends Element = Element>(
    root: Document | Element,
    selectors: string,
    asyncParams?: AsyncParams
): Promise<NodeListOf<E>>;
export async function asyncQuerySelectorAll<E extends Element = Element>(
    selectors: string,
    asyncParams?: AsyncParams
): Promise<NodeListOf<E>>;
export async function asyncQuerySelectorAll<E extends Element = Element>(
    ...params: [Document | Element, string, AsyncParams?] | [string, AsyncParams?]
): Promise<NodeListOf<E>> {
    
    if (isParamsWithRoot(params)) {
        const [root, selectors, asyncParams] = params;
        return await lib.asyncQuerySelectorAll(
            selectors,
            root,
            asyncParams?.retries || DEFAULT_RETRIES,
            asyncParams?.delay || DEFAULT_DELAY
        );
    }

    const [selectors, asyncParams] = params;
    
    return lib.asyncQuerySelectorAll(
        selectors,
        document,
        asyncParams?.retries || DEFAULT_RETRIES,
        asyncParams?.delay || DEFAULT_DELAY
    );
}

export async function asyncShadowRootQuerySelector(
    root: Document | Element,
    selectors: string,
    asyncParams?: AsyncParams
): Promise<ShadowRoot | null>;
export async function asyncShadowRootQuerySelector(
    selectors: string,
    asyncParams?: AsyncParams
): Promise<ShadowRoot | null>;
export async function asyncShadowRootQuerySelector(
    ...params: [Document | Element, string, AsyncParams?] | [string, AsyncParams?]
): Promise<ShadowRoot | null> {

    if (isParamsWithRoot(params)) {
        const [root, selectors, asyncParams] = params;
        return await lib.asyncShadowRootQuerySelector(
            selectors,
            root,
            asyncParams?.retries || DEFAULT_RETRIES,
            asyncParams?.delay || DEFAULT_DELAY
        );
    }

    const [selectors, asyncParams] = params;
    
    return lib.asyncShadowRootQuerySelector(
        selectors,
        document,
        asyncParams?.retries || DEFAULT_RETRIES,
        asyncParams?.delay || DEFAULT_DELAY
    );
}

export class AsyncSelector<T extends Document | Element | ShadowRoot> {
    constructor(
        asyncParams?: AsyncParams
    );
    constructor(
        root?: T | Promise<T | NodeListOf<Element>>,
        asyncParams?: AsyncParams
    );
    constructor(
        firstParameter?: T | Promise<T | NodeListOf<Element>> | AsyncParams,
        secondParameter?: AsyncParams
    ) {
        if (
            firstParameter instanceof Node ||
            firstParameter instanceof Promise
        ) {
            this.#element = firstParameter;
            this.#asyncParams = {
                retries: DEFAULT_RETRIES,
                delay: DEFAULT_DELAY,
                ...(secondParameter || {})
            };
        } else {
            this.#element = document as T;
            this.#asyncParams = {
                retries: DEFAULT_RETRIES,
                delay: DEFAULT_DELAY,
                ...(firstParameter || {})
            };
        }
    }
    #element: T | Promise<NodeListOf<Element> | T | null>;
    #asyncParams: AsyncParams;

    get element(): Promise<T | null> {
        const promise = getElementPromise<T>(this.#element);
        return promise
            .then((element: T | NodeListOf<Element> | null) => {
                if (element instanceof NodeList) {
                    return element[0] as T || null;
                }
                return element;
            });
    }

    get [SHADOW_ROOT_SELECTOR](): AsyncSelector<ShadowRoot> {
        const promise = getElementPromise<T>(this.#element);
        const promisableShadowRoot = promise
            .then((element: T | NodeListOf<Element> | null) => {
                if (
                    element instanceof Document ||
                    element instanceof ShadowRoot ||
                    element === null ||
                    (
                        element instanceof NodeList &&
                        element.length === 0
                    )
                ) {
                    return null;
                }
                if (element instanceof NodeList) {
                    return getPromisableShadowRoot(
                        element[0],
                        this.#asyncParams.retries,
                        this.#asyncParams.delay
                    );
                }
                return getPromisableShadowRoot(
                    element,
                    this.#asyncParams.retries,
                    this.#asyncParams.delay
                );
            });
        return new AsyncSelector(
            promisableShadowRoot,
            this.#asyncParams
        );
    }

    get all(): Promise<NodeListOf<Element>> {
        const promise = getElementPromise<T>(this.#element);
        return promise
            .then((element: T | NodeListOf<Element> | null) => {
                if (element instanceof NodeList) {
                    return element;
                }
                return document.querySelectorAll(INVALID_SELECTOR);
            });
    }

    get asyncParams(): AsyncParams {
        return this.#asyncParams;
    }

    public async eq(index: number): Promise<Element | null> {
        const promise = getElementPromise<T>(this.#element);
        return promise
            .then((element: T | NodeListOf<Element> | null) => {
                if (element instanceof NodeList) {
                    return element[index] || null;
                }
                return null;
            });
    }

    public query(selector: string): AsyncSelector<Element> {
        const promise = getElementPromise<T>(this.#element);
        const promisableElement = promise
            .then((element: T | NodeListOf<Element> | null) => {
                if (
                    element === null ||
                    (
                        element instanceof NodeList &&
                        element.length === 0
                    )
                ) {
                    return null;
                }
                if (element instanceof NodeList) {
                    return getPromisableElement(
                        element[0],
                        selector,
                        this.#asyncParams.retries,
                        this.#asyncParams.delay,
                        true
                    );
                }
                return getPromisableElement(
                    element,
                    selector,
                    this.#asyncParams.retries,
                    this.#asyncParams.delay,
                    true
                );
            });
        return new AsyncSelector<Element>(
            promisableElement,
            this.#asyncParams
        );
    }
}

export type { AsyncParams };