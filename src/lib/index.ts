import { INVALID_SELECTOR } from '@constants';
import {
    querySelectorInternal,
    querySelectorAllInternal,
    shadowRootQuerySelectorInternal,
    asyncQuerySelectorInternal,
    asyncQuerySelectorAllInternal,
    asyncShadowRootQuerySelectorInternal
} from '@selectors';
import {
    getSubtreePaths,
    getCannotErrorText,
    getMustErrorText
} from '@utilities';

export function querySelector<E extends Element>(
    selectors: string,
    root: Document | Element
): E | null {

    const selectorsPaths = getSubtreePaths(selectors, (path: string[]): string[] => {
        if (!path[path.length - 1].length) {
            throw new SyntaxError(
                getCannotErrorText('querySelector', 'shadowRootQuerySelector')
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
    selectors: string,
    root: Document | Element
): NodeListOf<E> {

    const selectorsPaths = getSubtreePaths(selectors, (path: string[]): string[] => {
        if (!path[path.length - 1].length) {
            throw new SyntaxError(
                getCannotErrorText('querySelectorAll')
            );
        }
        return path;
    });

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
    selectors: string,
    root: Document | Element
): ShadowRoot | null {

    const selectorsPaths = getSubtreePaths(selectors, (path: string[]): string[] => {
        const lastSelector = path.pop();
        if (lastSelector.length) {
            throw new SyntaxError(
                getMustErrorText('shadowRootQuerySelector', 'querySelector')
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

export async function asyncQuerySelector<E extends Element = Element>(
    selectors: string,
    root: Document | Element,
    retries: number,
    delay: number
): Promise<E | null> {

    const selectorsPaths = getSubtreePaths(selectors, (path: string[]): string[] => {
        if (!path[path.length - 1].length) {
            throw new SyntaxError(
                getCannotErrorText('asyncQuerySelector', 'asyncShadowRootQuerySelector')
            );
        }
        return path;
    });

    const total = selectorsPaths.length;

    for (let index = 0; index < total; index++) {

        const foundElement = await asyncQuerySelectorInternal<E>(
            selectorsPaths[index],
            root,
            retries,
            delay
        );

        if (foundElement) {
            return foundElement;
        }

    }

    return null;

}

export async function asyncQuerySelectorAll<E extends Element = Element>(
    selectors: string,
    root: Document | Element,
    retries: number,
    delay: number
): Promise<NodeListOf<E>> {

    const selectorsPaths = getSubtreePaths(selectors, (path: string[]): string[] => {
        if (!path[path.length - 1].length) {
            throw new SyntaxError(
                getCannotErrorText('asyncQuerySelectorAll')
            );
        }
        return path;
    });

    const total = selectorsPaths.length;

    for (let index = 0; index < total; index++) {

        const foundElements = await asyncQuerySelectorAllInternal<E>(
            selectorsPaths[index],
            root,
            retries,
            delay
        );

        if (foundElements?.length) {
            return foundElements;
        }

    }

    return document.querySelectorAll(INVALID_SELECTOR);

}

export async function asyncShadowRootQuerySelector(
    selectors: string,
    root: Document | Element,
    retries: number,
    delay: number
): Promise<ShadowRoot | null> {

    const selectorsPaths = getSubtreePaths(selectors, (path: string[]): string[] => {
        const lastSelector = path.pop();
        if (lastSelector.length) {
            throw new SyntaxError(
                getMustErrorText('asyncShadowRootQuerySelector', 'asyncQuerySelector')
            );
        }
        return path;
    });

    const total = selectorsPaths.length;

    for (let index = 0; index < total; index++) {

        const shadowRoot = await asyncShadowRootQuerySelectorInternal(
            selectorsPaths[index],
            root,
            retries,
            delay
        );

        if (shadowRoot) {
            return shadowRoot;
        }

    }

    return null;

}