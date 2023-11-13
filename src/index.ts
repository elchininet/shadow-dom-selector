import { DEFAULT_RETRIES, DEFAULT_RETRIES_DELAY } from '@constants';
import * as lib from '@lib';

export function querySelector<E extends Element = Element>(
    selector: string,
    rootElement: Document | Element = document
): E | null {
    return lib.querySelector(selector, rootElement); 
}

export function querySelectorAll<E extends Element = Element>(
    selector: string,
    rootElement: Document | Element = document
): NodeListOf<E> {
    return lib.querySelectorAll(
        selector,
        rootElement
    );
}

export function queryShadowRootSelector(
    selector: string,
    rootElement: Document | Element = document
): ShadowRoot | null {
    return lib.queryShadowRootSelector(
        selector,
        rootElement
    );
}

export async function asyncQuerySelector<E extends Element = Element>(
    selector: string,
    rootElement: Document | Element = document,
    retries = DEFAULT_RETRIES,
    retriesDelay = DEFAULT_RETRIES_DELAY
): Promise<E | null > {
    return lib.asyncQuerySelector(
        selector,
        rootElement,
        retries,
        retriesDelay
    );
}

export async function asyncQuerySelectorAll<E extends Element = Element>(
    selector: string,
    rootElement: Document | Element = document,
    retries = DEFAULT_RETRIES,
    retriesDelay = DEFAULT_RETRIES_DELAY
): Promise<NodeListOf<E>> {
    return lib.asyncQuerySelectorAll(
        selector,
        rootElement,
        retries,
        retriesDelay
    );
}

export async function asyncQueryShadowRootSelector(
    selector: string,
    rootElement: Document | Element = document,
    retries = DEFAULT_RETRIES,
    retriesDelay = DEFAULT_RETRIES_DELAY
): Promise<ShadowRoot | null> {
    return lib.asyncQueryShadowRootSelector(
        selector,
        rootElement,
        retries,
        retriesDelay
    );
}