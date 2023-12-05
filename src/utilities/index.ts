import { AsyncParams } from '@types';
import { SHADOW_ROOT_SELECTOR, INVALID_SELECTOR } from '@constants';

const isElement = (param: unknown): param is (Document | Element) => {
    return (
        param &&
        (
            param instanceof Document ||
            param instanceof Element
        )
    );
};

export const isParamsWithRoot = (
    params: unknown[]
): params is [Document | Element, string, AsyncParams?] => {
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

export function getPromisableElement<E extends Element>(
    root: Document | Element | ShadowRoot,
    selector: string,
    retries: number,
    delay: number,
    selectAll?: false
): Promise<E | null>;
export function getPromisableElement<E extends Element>(
    root: Document | Element | ShadowRoot,
    selector: string,
    retries: number,
    delay: number,
    selectAll?: true
): Promise<NodeListOf<E>>;
export function getPromisableElement<E extends Element>(
    root: Document | Element | ShadowRoot,
    selector: string,
    retries: number,
    delay: number,
    selectAll = false
): Promise<E | NodeListOf<E> | null> {
    return new Promise<E | NodeListOf<E> | null>((resolve) => {
        let attempts = 0;
        const select = () => {
            const element = selectAll
                ? root.querySelectorAll<E>(selector)
                : root.querySelector<E>(selector);
            if (
                (
                    selectAll &&
                    (element as NodeListOf<E>).length
                ) ||
                (
                    !selectAll &&
                    element !== null
                )
            ) {
                resolve(element);
            } else {
                attempts++;
                if (attempts < retries) {
                    setTimeout(select, delay);
                } else {
                    resolve(
                        selectAll
                            ? document.querySelectorAll(INVALID_SELECTOR)
                            : null
                    );
                }
            }
        };
        select();
    });
}

export function getPromisableShadowRoot(
    element: Element,
    retries: number,
    retriesDelay: number,
): Promise<ShadowRoot | null> {
    return new Promise<ShadowRoot | null>((resolve) => {
        let attempts = 0;
        const getShadowRoot = () => {
            const shadowRoot = element.shadowRoot;
            if (shadowRoot) {
                resolve(shadowRoot);
            } else {
                attempts++;
                if (attempts < retries) {
                    setTimeout(getShadowRoot, retriesDelay);
                } else {
                    resolve(null);
                }
            }
        };
        getShadowRoot();
    });
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