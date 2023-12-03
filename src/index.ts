import {
    SelectorBase,
    SelectorProxy,
    AsyncParams
} from '@types';
import {
    DEFAULT_RETRIES,
    DEFAULT_DELAY,
    INVALID_SELECTOR,
    SHADOW_ROOT_SELECTOR,
    ShadowDomSelectorProps,
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


export function Selector(
    asyncParams?: AsyncParams
): SelectorProxy;
export function Selector(
    element: Document | Element | ShadowRoot,
    asyncParams?: AsyncParams
): SelectorProxy;
export function Selector (
    firstParameter: Document | Element | ShadowRoot | AsyncParams,
    secondParameter?: AsyncParams
): SelectorProxy {
    if (firstParameter instanceof Node) {
        const params = {
            retries: DEFAULT_RETRIES,
            delay: DEFAULT_DELAY,
            ...(secondParameter || {})
        };
        return getShadowDomSelectorProxy({
            _element: firstParameter,
            asyncParams: params
        });
    }
    const params = {
        retries: DEFAULT_RETRIES,
        delay: DEFAULT_DELAY,
        ...(firstParameter || {})
    };
    return getShadowDomSelectorProxy({
        _element: document,
        asyncParams: params
    });
}

const getShadowDomSelectorProxy = (
    selector: SelectorBase
): SelectorProxy => {
    function getter(selector: SelectorBase, prop: `${ShadowDomSelectorProps.ELEMENT}`): Promise<Document | Element | ShadowRoot | null>;
    function getter(selector: SelectorBase, prop: `${ShadowDomSelectorProps.ALL}`): Promise<NodeListOf<Element>>;
    function getter(selector: SelectorBase, prop: `${ShadowDomSelectorProps.PARAMS}`): AsyncParams;
    function getter(selector: SelectorBase, prop: string): SelectorProxy;
    function getter(selector: SelectorBase, prop: string): Promise<Document | Element | ShadowRoot | NodeListOf<Element> | null> | AsyncParams | SelectorProxy {
        if (prop === ShadowDomSelectorProps.PARAMS) {
            return selector[prop];
        }
        if (prop === ShadowDomSelectorProps.ELEMENT) {
            const element = getElementPromise(selector._element);
            return element
                .then((element: Document | Element | ShadowRoot | NodeListOf<Element> | null) => {
                    if (element instanceof NodeList) {
                        return element[0] || null;
                    }
                    return element;
                });
        }
        if (prop === ShadowDomSelectorProps.ALL) {
            const element = getElementPromise(selector._element);
            return element
                .then((element: Element | ShadowRoot | NodeListOf<Element> | null) => {
                    if (element === null) {
                        return document.querySelectorAll(INVALID_SELECTOR);
                    }
                    if (element instanceof NodeList) {
                        return element;
                    }
                    throw new SyntaxError(`Cannot call "${ShadowDomSelectorProps.ALL}" method in the starting element`);
                });
        }
        if (prop === SHADOW_ROOT_SELECTOR) {
            const element = getElementPromise(selector._element);
            const promisableShadowRoot = element
                .then((element: Element | ShadowRoot | NodeListOf<Element> | null) => {
                    if (element instanceof ShadowRoot) {
                        throw new SyntaxError('Cannot query a shadowRoot of a shadowRoot');
                    }
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
                        return getPromisableShadowRoot(
                            element[0],
                            selector.asyncParams.retries,
                            selector.asyncParams.delay
                        );
                    }
                    return getPromisableShadowRoot(
                        element,
                        selector.asyncParams.retries,
                        selector.asyncParams.delay
                    );
                });
            return getShadowDomSelectorProxy({
                _element: promisableShadowRoot,
                asyncParams: selector.asyncParams
            });
        }
        const element = getElementPromise(selector._element);
        const promisableElement = element
            .then((element: Element | ShadowRoot | NodeListOf<Element> | null) => {
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
                        prop,
                        selector.asyncParams.retries,
                        selector.asyncParams.delay,
                        true
                    );
                }
                return getPromisableElement(
                    element,
                    prop,
                    selector.asyncParams.retries,
                    selector.asyncParams.delay,
                    true
                );
            });
        return getShadowDomSelectorProxy({
            _element: promisableElement,
            asyncParams: selector.asyncParams
        });
    }
    return new Proxy(
        selector,
        {
            get: getter
        }
    ) as SelectorProxy;
};