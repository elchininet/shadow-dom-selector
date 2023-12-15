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

export function deepQuerySelector<E extends Element = Element>(
    root: Document | Element,
    selectors: string
): E | null;
export function deepQuerySelector<E extends Element = Element>(
    selectors: string
): E | null;
export function deepQuerySelector<E extends Element = Element>(
    ...params: [Document | Element, string] | [string]
): E | null {
    const [rootOrSelector, selectors] = params;
    if (typeof rootOrSelector === 'string') {
        return (
            lib.deepQuerySelector<E>(
                document,
                rootOrSelector
            )[0] ||
            null
        );
    }
    return (
        lib.deepQuerySelector<E>(
            rootOrSelector,
            selectors
        )[0] ||
        null
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

export function deepQuerySelectorAll<E extends Element = Element>(
    root: Document | Element,
    selectors: string
): NodeListOf<E>;
export function deepQuerySelectorAll<E extends Element = Element>(
    selectors: string
): NodeListOf<E>;
export function deepQuerySelectorAll<E extends Element = Element>(
    ...params: [Document | Element, string] | [string]
): NodeListOf<E> {
    const [rootOrSelector, selectors] = params;
    if (typeof rootOrSelector === 'string') {
        return lib.deepQuerySelector<E>(
            document,
            rootOrSelector
        );
    }
    return lib.deepQuerySelector<E>(
        rootOrSelector,
        selectors
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

export async function asyncDeepQuerySelector<E extends Element = Element>(
    root: Document | Element,
    selectors: string,
    asyncParams?: AsyncParams,
): Promise<E | null >;
export async function asyncDeepQuerySelector<E extends Element = Element>(
    selectors: string,
    asyncParams?: AsyncParams,
): Promise<E | null >;
export async function asyncDeepQuerySelector<E extends Element = Element>(
    ...params: [Document | Element, string, AsyncParams?] | [string, AsyncParams?]
): Promise<E | null > {

    if (isParamsWithRoot(params)) {
        const [root, selectors, asyncParams] = params;
        return (
            (
                await lib.asyncDeepQuerySelector<E>(
                    root,
                    selectors,
                    asyncParams?.retries || DEFAULT_RETRIES,
                    asyncParams?.delay || DEFAULT_DELAY
                )
            )[0] ||
            null
        );
    }

    const [selectors, asyncParams] = params;

    return (
        (
            await lib.asyncDeepQuerySelector<E>(
                document,
                selectors,
                asyncParams?.retries || DEFAULT_RETRIES,
                asyncParams?.delay || DEFAULT_DELAY
            )
        )[0] ||
        null
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

export function asyncDeepQuerySelectorAll<E extends Element = Element>(
    root: Document | Element,
    selectors: string,
    asyncParams?: AsyncParams
): Promise<NodeListOf<E>>;
export function asyncDeepQuerySelectorAll<E extends Element = Element>(
    selectors: string,
    asyncParams?: AsyncParams
): Promise<NodeListOf<E>>;
export function asyncDeepQuerySelectorAll<E extends Element = Element>(
    ...params: [Document | Element, string, AsyncParams?] | [string, AsyncParams?]
): Promise<NodeListOf<E>> {

    if (isParamsWithRoot(params)) {
        const [root, selectors, asyncParams] = params;
        return lib.asyncDeepQuerySelector<E>(
            root,
            selectors,
            asyncParams?.retries || DEFAULT_RETRIES,
            asyncParams?.delay || DEFAULT_DELAY
        );
    }

    const [selectors, asyncParams] = params;

    return lib.asyncDeepQuerySelector<E>(
        document,
        selectors,
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
            this._element = firstParameter;
            this._asyncParams = {
                retries: DEFAULT_RETRIES,
                delay: DEFAULT_DELAY,
                ...(secondParameter || {})
            };
        } else {
            this._element = document as T;
            this._asyncParams = {
                retries: DEFAULT_RETRIES,
                delay: DEFAULT_DELAY,
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

    get [SHADOW_ROOT_SELECTOR](): AsyncSelector<ShadowRoot> {
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
                    return null;
                }
                if (element instanceof NodeList) {
                    return getPromisableShadowRoot(
                        element[0],
                        this._asyncParams.retries,
                        this._asyncParams.delay
                    );
                }
                return getPromisableShadowRoot(
                    element,
                    this._asyncParams.retries,
                    this._asyncParams.delay
                );
            });
        return new AsyncSelector(
            promisableShadowRoot,
            this._asyncParams
        );
    }

    get all(): Promise<NodeListOf<Element>> {
        const promise = getElementPromise<T>(this._element);
        return promise
            .then((element: T | NodeListOf<Element> | null) => {
                if (element instanceof NodeList) {
                    return element;
                }
                return document.querySelectorAll(INVALID_SELECTOR);
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
                    return element[index] || null;
                }
                return null;
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
                    return getPromisableElement(
                        element[0],
                        selector,
                        this._asyncParams.retries,
                        this._asyncParams.delay,
                        true
                    );
                }
                return getPromisableElement(
                    element,
                    selector,
                    this._asyncParams.retries,
                    this._asyncParams.delay,
                    true
                );
            });
        return new AsyncSelector<Element>(
            promisableElement,
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
                                this._asyncParams.retries,
                                this._asyncParams.delay
                            );
                        })
                    );
                }
                return lib.asyncDeepQuerySelector(
                    element,
                    selector,
                    this._asyncParams.retries,
                    this._asyncParams.delay
                );
            });
        return new AsyncSelector<Element>(
            promisableElement,
            this._asyncParams
        );
    }
}

export type { AsyncParams };