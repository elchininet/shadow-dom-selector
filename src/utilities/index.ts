import { AsyncParams } from '@types';
import { SHADOW_ROOT_SELECTOR } from '@constants';

const isElement = (param: unknown): param is (Document | Element | ShadowRoot) => {
    return (
        param &&
        (
            param instanceof Document ||
            param instanceof Element ||
            param instanceof ShadowRoot
        )
    );
};

export const isParamsWithRoot = (
    params: unknown[]
): params is [Document | Element | ShadowRoot, string, AsyncParams?] => {
    const [param1, param2] = params;
    return (
        isElement(param1) &&
        typeof param2 === 'string'
    );
};

function getSelectorsArray(selectors: string): string[] {
    return selectors
        .split(',')
        .map((subSelector) => subSelector.trim());
}

function getSelectorsPath(selector: string): string[] {
    return selector
        .split(SHADOW_ROOT_SELECTOR)
        .map((subSelector) => subSelector.trim());
}

export function getSubtreePaths(
    selectors: string,
    modifier: (path: string[]) => string[]
): string[][] {
    return (
        getSelectorsArray(selectors)
            .map((selector: string) => {
                const path = getSelectorsPath(selector);
                return modifier(path);
            })
    );
}

export function getCannotErrorText(
    method: string,
    insteadMethod?: string
): string {
    const instead = insteadMethod
        ? ` If you want to select a shadowRoot, use ${insteadMethod} instead.`
        : '';
    return `${method} cannot be used with a selector ending in a shadowRoot (${SHADOW_ROOT_SELECTOR}).${instead}`;
}

export function getMustErrorText(
    method: string,
    insteadMethod: string
): string {
    return `${method} must be used with a selector ending in a shadowRoot (${SHADOW_ROOT_SELECTOR}). If you don't want to select a shadowRoot, use ${insteadMethod} instead.`;
}

export function getElementPromise<T extends Document | Element | ShadowRoot>(
    element: T | Promise<NodeListOf<Element> | T | null>
): Promise<T | NodeListOf<Element> | null> {
    return element instanceof Promise
        ? element
        : Promise.resolve(element);
}

export function getDocumentShadowRootError(): string {
    return `You can not select a shadowRoot (${SHADOW_ROOT_SELECTOR}) of the document.`;
}

export function getShadowRootShadowRootError(): string {
    return `You can not select a shadowRoot (${SHADOW_ROOT_SELECTOR}) of a shadowRoot.`;
}