import type { AsyncParams } from '@types';
import {
    DEFAULT_RETRIES,
    DEFAULT_DELAY,
    DEFAULT_SHOULD_REJECT,
    INVALID_SELECTOR,
    SHADOW_ROOT_SELECTOR
} from '@constants';
import * as lib from '@lib';
import {
    getElementPromise,
    getAsyncQueryParams,
    getQueryParams
} from '@utilities';

export function querySelector<E extends Element = Element>(
    root: Document | Element | ShadowRoot,
    selectors: string
): E | null;
export function querySelector<E extends Element = Element>(
    selectors: string
): E | null;
export function querySelector<E extends Element = Element>(
    rootOrSelector: Document | Element | ShadowRoot | string,
    selectors?: string
): E | null {
    return lib.querySelector(
        ...getQueryParams(rootOrSelector, selectors)
    );
}

export function deepQuerySelector<E extends Element = Element>(
    root: Document | Element | ShadowRoot,
    selectors: string
): E | null;
export function deepQuerySelector<E extends Element = Element>(
    selectors: string
): E | null;
export function deepQuerySelector<E extends Element = Element>(
    rootOrSelector: Document | Element | ShadowRoot | string,
    selectors?: string
): E | null {
    return (
        lib.deepQuerySelector<E>(
            ...getQueryParams(rootOrSelector, selectors)
        )[0] ||
        null
    );
}

export function querySelectorAll<E extends Element = Element>(
    root: Document | Element | ShadowRoot,
    selectors: string
): NodeListOf<E>;
export function querySelectorAll<E extends Element = Element>(
    selectors: string
): NodeListOf<E>;
export function querySelectorAll<E extends Element = Element>(
    rootOrSelector: Document | Element | ShadowRoot | string,
    selectors?: string
): NodeListOf<E> {
    return lib.querySelectorAll(
        ...getQueryParams(rootOrSelector, selectors)
    );
}

export function deepQuerySelectorAll<E extends Element = Element>(
    root: Document | Element | ShadowRoot,
    selectors: string
): NodeListOf<E>;
export function deepQuerySelectorAll<E extends Element = Element>(
    selectors: string
): NodeListOf<E>;
export function deepQuerySelectorAll<E extends Element = Element>(
    rootOrSelector: Document | Element | ShadowRoot | string,
    selectors?: string
): NodeListOf<E> {
    return lib.deepQuerySelector<E>(
        ...getQueryParams(rootOrSelector, selectors)
    );
}

export function shadowRootQuerySelector(
    root: Document | Element | ShadowRoot,
    selectors: string
): ShadowRoot | null;
export function shadowRootQuerySelector(
    selectors: string
): ShadowRoot | null;
export function shadowRootQuerySelector(
    rootOrSelector: Document | Element | ShadowRoot | string,
    selectors?: string
): ShadowRoot | null {
    return lib.shadowRootQuerySelector(
        ...getQueryParams(rootOrSelector, selectors)
    );
}

export async function asyncQuerySelector<E extends Element = Element>(
    root: Document | Element | ShadowRoot,
    selectors: string,
    asyncParams?: AsyncParams,
): Promise<E | null >;
export async function asyncQuerySelector<E extends Element = Element>(
    selectors: string,
    asyncParams?: AsyncParams,
): Promise<E | null >;
export async function asyncQuerySelector<E extends Element = Element>(
    rootOrSelector: Document | Element | ShadowRoot | string,
    selectorOrAsyncParams?: string | AsyncParams,
    asyncParams?: AsyncParams
): Promise<E | null > {
    return await lib.asyncQuerySelector(
        ...getAsyncQueryParams(rootOrSelector, selectorOrAsyncParams, asyncParams)
    );
}

export async function asyncDeepQuerySelector<E extends Element = Element>(
    root: Document | Element | ShadowRoot,
    selectors: string,
    asyncParams?: AsyncParams,
): Promise<E | null >;
export async function asyncDeepQuerySelector<E extends Element = Element>(
    selectors: string,
    asyncParams?: AsyncParams,
): Promise<E | null >;
export async function asyncDeepQuerySelector<E extends Element = Element>(
    rootOrSelector: Document | Element | ShadowRoot | string,
    selectorOrAsyncParams?: string | AsyncParams,
    asyncParams?: AsyncParams
): Promise<E | null > {
    return (
        (
            await lib.asyncDeepQuerySelector<E>(
                ...getAsyncQueryParams(rootOrSelector, selectorOrAsyncParams, asyncParams)
            )
        )[0] ||
        null
    );
}

export async function asyncQuerySelectorAll<E extends Element = Element>(
    root: Document | Element | ShadowRoot,
    selectors: string,
    asyncParams?: AsyncParams
): Promise<NodeListOf<E>>;
export async function asyncQuerySelectorAll<E extends Element = Element>(
    selectors: string,
    asyncParams?: AsyncParams
): Promise<NodeListOf<E>>;
export async function asyncQuerySelectorAll<E extends Element = Element>(
    rootOrSelector: Document | Element | ShadowRoot | string,
    selectorOrAsyncParams?: string | AsyncParams,
    asyncParams?: AsyncParams
): Promise<NodeListOf<E>> {
    return lib.asyncQuerySelectorAll(
        ...getAsyncQueryParams(rootOrSelector, selectorOrAsyncParams, asyncParams)
    );
}

export function asyncDeepQuerySelectorAll<E extends Element = Element>(
    root: Document | Element | ShadowRoot,
    selectors: string,
    asyncParams?: AsyncParams
): Promise<NodeListOf<E>>;
export function asyncDeepQuerySelectorAll<E extends Element = Element>(
    selectors: string,
    asyncParams?: AsyncParams
): Promise<NodeListOf<E>>;
export function asyncDeepQuerySelectorAll<E extends Element = Element>(
    rootOrSelector: Document | Element | ShadowRoot | string,
    selectorOrAsyncParams?: string | AsyncParams,
    asyncParams?: AsyncParams
): Promise<NodeListOf<E>> {
    return lib.asyncDeepQuerySelector<E>(
        ...getAsyncQueryParams(rootOrSelector, selectorOrAsyncParams, asyncParams)
    );
}

export async function asyncShadowRootQuerySelector(
    root: Document | Element | ShadowRoot,
    selectors: string,
    asyncParams?: AsyncParams
): Promise<ShadowRoot | null>;
export async function asyncShadowRootQuerySelector(
    selectors: string,
    asyncParams?: AsyncParams
): Promise<ShadowRoot | null>;
export async function asyncShadowRootQuerySelector(
    rootOrSelector: Document | Element | ShadowRoot | string,
    selectorOrAsyncParams?: string | AsyncParams,
    asyncParams?: AsyncParams
): Promise<ShadowRoot | null> {
    return lib.asyncShadowRootQuerySelector(
        ...getAsyncQueryParams(rootOrSelector, selectorOrAsyncParams, asyncParams)
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
            this._element = firstParameter;
            this._asyncParams = {
                retries: DEFAULT_RETRIES,
                delay: DEFAULT_DELAY,
                shouldReject: DEFAULT_SHOULD_REJECT,
                ...(secondParameter || {})
            };
        } else {
            this._element = document as T;
            this._asyncParams = {
                retries: DEFAULT_RETRIES,
                delay: DEFAULT_DELAY,
                shouldReject: DEFAULT_SHOULD_REJECT,
                ...(firstParameter || {})
            };
        }
    }
    private _element: T | Promise<NodeListOf<Element> | T | null>;
    private _asyncParams: AsyncParams;

    get element(): Promise<T | null> {
        const promise = getElementPromise<T>(this._element);
        return promise
            .then((element: T | NodeListOf<Element> | null) => {
                if (element instanceof NodeList) {
                    return element[0] as T || null;
                }
                return element;
            });
    }

    get $(): AsyncSelector<ShadowRoot> {
        const promise = getElementPromise<T>(this._element);
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
                    if (!this._asyncParams.shouldReject) {
                        return null;
                    }
                    throw new SyntaxError('The "$" method can only be called in an element with a ShadowRoot.');
                }
                if (element instanceof NodeList) {
                    return asyncShadowRootQuerySelector(
                        element[0],
                        SHADOW_ROOT_SELECTOR,
                        this._asyncParams
                    );
                }
                return asyncShadowRootQuerySelector(
                    element,
                    SHADOW_ROOT_SELECTOR,
                    this._asyncParams
                );
            });
        return new AsyncSelector<ShadowRoot>(
            promisableShadowRoot as Promise<ShadowRoot>,
            this._asyncParams
        );
    }

    get all(): Promise<NodeListOf<Element>> {
        const promise = getElementPromise<T>(this._element);
        return promise
            .then((element: T | NodeListOf<Element> | null) => {
                if (element instanceof NodeList) {
                    return element;
                } else if (!this._asyncParams.shouldReject) {
                    return document.querySelectorAll(INVALID_SELECTOR);
                }
                throw new SyntaxError('The "all" method can only be called in a NodeList element.');
            });
    }

    get asyncParams(): AsyncParams {
        return this._asyncParams;
    }

    public async eq(index: number): Promise<Element | null> {
        const promise = getElementPromise<T>(this._element);
        return promise
            .then((element: T | NodeListOf<Element> | null) => {
                if (element instanceof NodeList) {
                    if (element[index]) {
                        return element[index];
                    } else if (!this._asyncParams.shouldReject) {
                        return null;
                    }
                    throw new SyntaxError(`Could not get any element at index ${index}.`);
                } else if (!this._asyncParams.shouldReject) {
                    return null;
                }
                throw new SyntaxError('The "eq" method only be called in a NodeList element.');
            });
    }

    public query(selector: string): AsyncSelector<Element> {
        const promise = getElementPromise<T>(this._element);
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
                    return asyncQuerySelectorAll(
                        element[0],
                        selector,
                        this._asyncParams
                    );
                }
                return asyncQuerySelectorAll(
                    element,
                    selector,
                    this._asyncParams
                );
            });
        return new AsyncSelector<Element>(
            promisableElement as Promise<NodeListOf<Element>>,
            this._asyncParams
        );
    }

    public deepQuery(selector: string): AsyncSelector<Element> {
        const promise = getElementPromise<T>(this._element);
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
                    return Promise.race(
                        Array.from(element).map((child: Element): Promise<NodeListOf<Element>> => {
                            return lib.asyncDeepQuerySelector(
                                child,
                                selector,
                                this._asyncParams.retries!,
                                this._asyncParams.delay!,
                                this._asyncParams.shouldReject!
                            );
                        })
                    );
                }
                return lib.asyncDeepQuerySelector(
                    element,
                    selector,
                    this._asyncParams.retries!,
                    this._asyncParams.delay!,
                    this._asyncParams.shouldReject!
                );
            });
        return new AsyncSelector<Element>(
            promisableElement as Promise<NodeListOf<Element>>,
            this._asyncParams
        );
    }
}

export type { AsyncParams };