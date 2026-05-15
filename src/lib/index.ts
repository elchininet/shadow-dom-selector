import {
    PromiseReturn,
    Return,
    Root
} from '@types';
import { getPromisableResult } from 'get-promisable-result';
import { INVALID_SELECTOR } from '@constants';
import {
    querySelectorInternal,
    querySelectorAllInternal,
    shadowRootQuerySelectorInternal
} from '@selectors';
import {
    getSubtreePaths,
    getCannotErrorText,
    getMustErrorText
} from '@utilities';

export function querySelector<E extends Element>(
    root: Root,
    selectors: string,
    method = 'querySelector',
    insteadMethod = 'shadowRootQuerySelector'
): Return<E> {

    const selectorsPaths = getSubtreePaths(selectors, (path: string[]): string[] => {
        if (!path[path.length - 1].length) {
            throw new SyntaxError(
                getCannotErrorText(method, insteadMethod)
            );
        }
        return path;
    });

    const total = selectorsPaths.length;

    for (let index = 0; index < total; index++) {

        const foundElement = querySelectorInternal<E>(
            selectorsPaths[index],
            root
        );

        if (foundElement) {
            return foundElement;
        }

    }

    return null;

}

export function querySelectorAll<E extends Element = Element>(
    root: Root,
    selectors: string,
    method = 'querySelectorAll'
): NodeListOf<E> {
    const selectorsPaths = getSubtreePaths(
        selectors,
        (path: string[]): string[] => {
            if (!path[path.length - 1].length) {
                throw new SyntaxError(
                    getCannotErrorText(method)
                );
            }
            return path;
        }
    );

    const total = selectorsPaths.length;

    for (let index = 0; index < total; index++) {

        const foundElements = querySelectorAllInternal<E>(
            selectorsPaths[index],
            root
        );

        if (foundElements?.length) {
            return foundElements;
        }

    }

    return document.querySelectorAll(INVALID_SELECTOR);

}

export function shadowRootQuerySelector(
    root: Root,
    selectors: string,
    method = 'shadowRootQuerySelector',
    insteadMethod = 'querySelector'
): Return<ShadowRoot> {

    const selectorsPaths = getSubtreePaths(selectors, (path: string[]): string[] => {
        const lastSelector = path.pop();
        if (lastSelector!.length) {
            throw new SyntaxError(
                getMustErrorText(method, insteadMethod)
            );
        }
        return path;
    });

    const total = selectorsPaths.length;

    for (let index = 0; index < total; index++) {

        const shadowRoot = shadowRootQuerySelectorInternal(
            selectorsPaths[index],
            root
        );

        if (shadowRoot) {
            return shadowRoot;
        }

    }

    return null;

}

export async function asyncQuerySelector<E extends Element>(
    root: Root,
    selectors: string,
    retries: number,
    delay: number,
    shouldReject: boolean
): PromiseReturn<E> {
    return getPromisableResult<Return<E>>(
        () => querySelector<E>(
            root,
            selectors,
            'asyncQuerySelector',
            'asyncShadowRootQuerySelector'
        ),
        (element: Return<E>): boolean => !!element,
        {
            retries,
            delay,
            shouldReject
        }
    );
}

export async function asyncQuerySelectorAll<E extends Element = Element>(
    root: Root,
    selectors: string,
    retries: number,
    delay: number,
    shouldReject: boolean
): Promise<NodeListOf<E>> {
    return getPromisableResult<NodeListOf<E>>(
        () => querySelectorAll<E>(
            root,
            selectors,
            'asyncQuerySelectorAll'
        ),
        (elements: NodeListOf<E>): boolean => !!elements.length,
        {
            retries,
            delay,
            shouldReject
        }
    );
}

export async function asyncShadowRootQuerySelector(
    root: Root,
    selectors: string,
    retries: number,
    delay: number,
    shouldReject: boolean
): PromiseReturn<ShadowRoot> {
    return getPromisableResult<Return<ShadowRoot>>(
        () => shadowRootQuerySelector(
            root,
            selectors,
            'asyncShadowRootQuerySelector',
            'asyncQuerySelector'
        ),
        (shadowRoot: Return<ShadowRoot>): boolean => !!shadowRoot,
        {
            retries,
            delay,
            shouldReject
        }
    );
}

export const deepQuerySelector = <E extends Element = Element>(
    element: Root,
    selector: string
): NodeListOf<E> => {

    const child = element.querySelectorAll<E>(selector);

    if (child.length) return child;

    if (element instanceof Element && element.shadowRoot) {
        const shadowRootDeepChild = deepQuerySelector<E>(element.shadowRoot, selector);
        if (shadowRootDeepChild.length) return shadowRootDeepChild;
    }

    const allChildren = Array.from(
        element.querySelectorAll<E>('*')
    );

    for (const child of allChildren) {
        const deepChild = deepQuerySelector<E>(child, selector);
        if (deepChild.length) return deepChild;
    }
    
    return document.querySelectorAll(INVALID_SELECTOR);

};

export const asyncDeepQuerySelector = <E extends Element = Element>(
    root: Root,
    selector: string,
    retries: number,
    delay: number,
    shouldReject: boolean
): Promise<NodeListOf<E>> => {
    return getPromisableResult<NodeListOf<E>>(
        () => deepQuerySelector<E>(root, selector),
        (elements: NodeListOf<E>) => !!elements.length,
        {
            retries,
            delay,
            shouldReject
        }
    );
};