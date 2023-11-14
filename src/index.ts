import { AsyncParams } from '@types';
import { DEFAULT_RETRIES, DEFAULT_DELAY } from '@constants';
import * as lib from '@lib';
import { isParamsWithRoot } from '@utilities';

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