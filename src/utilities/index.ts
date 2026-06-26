import {
    AsyncParams,
    Return,
    Root
} from '@types';
import {
    DEFAULT_RETRIES,
    DEFAULT_DELAY,
    DEFAULT_SHOULD_REJECT,
    SHADOW_ROOT_SELECTOR,
    WRONG_PARAMETERS_ERROR
} from '@constants';

export const getDocumentShadowRootError = (): string => `You can not select a shadowRoot (${SHADOW_ROOT_SELECTOR}) of the document.`;

export const getShadowRootShadowRootError = (): string => `You can not select a shadowRoot (${SHADOW_ROOT_SELECTOR}) of a shadowRoot.`;

export const isString = (value: unknown): value is string => typeof value === 'string';

export const isObject = <T = Record<string, unknown>>(variable: unknown): variable is T => Object.prototype.toString.call(variable) === '[object Object]';

const isElement = (param: unknown): param is Root => {
    return (
        !!param &&
        (
            param instanceof Document ||
            param instanceof Element ||
            param instanceof ShadowRoot
        )
    );
};

export const isAsyncPrams = (value: unknown): value is AsyncParams => {
    const defaultAsyncParams = ['retries', 'delay', 'shouldReject'];
    return (
        isObject(value) &&
        (
            Object.keys(value).length === 0 ||
            defaultAsyncParams.some((key: string) => key in value)
        )
    );
};

export const getQueryParams = (
    firstParam: Root | string,
    secondParam?: string
): [Root, string] => {
    if (isString(firstParam)) {
        return [ document, firstParam ];
    }
    if (isElement(firstParam) && isString(secondParam)) {
        return [firstParam, secondParam];
    }
    throw new TypeError(WRONG_PARAMETERS_ERROR);
};

export const getAsyncQueryParams = (
    firstParam: Root | string,
    secondParam?: AsyncParams | string,
    thirdParameter?: AsyncParams
): [Root, string, number, number, boolean] => {
    if (isString(firstParam)) {
        if (isAsyncPrams(secondParam)) {
            return [
                document,
                firstParam,
                secondParam.retries ?? DEFAULT_RETRIES,
                secondParam.delay ?? DEFAULT_DELAY,
                secondParam.shouldReject ?? DEFAULT_SHOULD_REJECT
            ];
        }
        return [
            document,
            firstParam,
            DEFAULT_RETRIES,
            DEFAULT_DELAY,
            DEFAULT_SHOULD_REJECT
        ];
    }
    if (isElement(firstParam) && isString(secondParam)) {
        if (isAsyncPrams(thirdParameter)) {
            return [
                firstParam,
                secondParam,
                thirdParameter.retries ?? DEFAULT_RETRIES,
                thirdParameter.delay ?? DEFAULT_DELAY,
                thirdParameter.shouldReject ?? DEFAULT_SHOULD_REJECT
            ];
        }
        return [
            firstParam,
            secondParam,
            DEFAULT_RETRIES,
            DEFAULT_DELAY,
            DEFAULT_SHOULD_REJECT
        ];
    }
    throw new TypeError(WRONG_PARAMETERS_ERROR);
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

export function getElementPromise<T extends Root>(
    element: T | Promise<NodeListOf<Element> | Return<T>>
): Promise<NodeListOf<Element> | Return<T>> {
    return element instanceof Promise
        ? element
        : Promise.resolve(element);
}
