import {
    SHADOW_ROOT_SELECTOR,
    HOST_SELECTOR,
    INVALID_SELECTOR
} from '@constants';

function getSelectorsArray(selector: string, shadowRootSelector: string): string[] {
    return selector
        .split(shadowRootSelector)
        .map((subSelector) => subSelector.trim());
}

function getPromisableElement<E extends Element>(
    root: Document | Element | ShadowRoot,
    selector: string,
    retries: number,
    retriesDelay: number,
    selectAll?: false
): Promise<E | null>;
function getPromisableElement<E extends Element>(
    root: Document | Element | ShadowRoot,
    selector: string,
    retries: number,
    retriesDelay: number,
    selectAll?: true
): Promise<NodeListOf<E>>;
function getPromisableElement<E extends Element>(
    root: Document | Element | ShadowRoot,
    selector: string,
    retries: number,
    retriesDelay: number,
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
                    setTimeout(select, retriesDelay);
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

function getPromisableShadowRoot(
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

function getCannotErrorText(
    method: string,
    insteadMethod?: string
): string {
    const instead = insteadMethod
        ? ` If you want to select a shadowRoot, use ${insteadMethod} instead.`
        : '';
    return `${method} cannot be used with a selector ending in a shadowRoot (${SHADOW_ROOT_SELECTOR}).${instead}`;
}

function getMustErrorText(
    method: string,
    insteadMethod: string
): string {
    return `${method} must be used with a selector ending in a shadowRoot (${SHADOW_ROOT_SELECTOR}). If you don't want to select a shadowRoot, use ${insteadMethod} instead.`;
}

export function querySelector<E extends Element = Element>(
    selector: string | string[],
    element: Document | Element
): E | null {

    let foundElement: E | null = null;
    const selectorArray = Array.isArray(selector)
        ? selector
        : getSelectorsArray(selector, SHADOW_ROOT_SELECTOR); 

    const lastIndex = selectorArray.length - 1;

    if (!selectorArray[lastIndex].length) {
        throw new Error(
            getCannotErrorText('querySelector', 'queryShadowRootSelector')
        );
    }

    for (let index = 0; index <= lastIndex; index++) {
        if (index === 0) {
            foundElement = element.querySelector(selectorArray[index]);
        } else {
            foundElement = foundElement.shadowRoot?.querySelector<E>(`${HOST_SELECTOR} ${selectorArray[index]}`) || null;
        }
        if (foundElement === null) {
            return null;
        }
    }

    return foundElement;

}

export function querySelectorAll<E extends Element = Element>(
    selector: string,
    element: Document | Element
): NodeListOf<E> {

    const selectorArray = getSelectorsArray(
        selector.trim(),
        SHADOW_ROOT_SELECTOR
    );

    const lastSelector = selectorArray.pop();

    if (!lastSelector.length) {
        throw new Error(
            getCannotErrorText('querySelectorAll')
        );
    }
    
    if (!selectorArray.length) {
        return element.querySelectorAll<E>(lastSelector);
    }

    const lastElement = querySelector(
        selectorArray,
        element
    );
 
    return (
        lastElement.shadowRoot?.querySelectorAll<E>(`${HOST_SELECTOR} ${lastSelector}`) ||
        document.querySelectorAll(INVALID_SELECTOR)
    );

}

export function queryShadowRootSelector(
    selector: string,
    element: Document | Element
): ShadowRoot | null {

    const selectorArray = getSelectorsArray(
        selector,
        SHADOW_ROOT_SELECTOR
    );

    const lastSelector = selectorArray.pop();

    if (lastSelector.length) {
        throw new Error(
            getMustErrorText('queryShadowRootSelector', 'querySelector')
        );
    }

    const lastElement = querySelector(
        selectorArray,
        element
    );

    return lastElement?.shadowRoot || null;

}

export async function asyncQuerySelector<E extends Element = Element>(
    selector: string | string[],
    element: Document | Element,
    retries: number,
    retriesDelay: number
): Promise<E | null> {

    let foundElement: Element | null = null;
    const selectorArray = Array.isArray(selector)
        ? selector
        : getSelectorsArray(selector, SHADOW_ROOT_SELECTOR);

    const lastIndex = selectorArray.length - 1;

    if (!selectorArray[lastIndex].length) {
        throw new Error(
            getCannotErrorText('asyncQuerySelector', 'asyncQueryShadowRootSelector')
        );
    }    

    for (let index = 0; index <= lastIndex; index++) {

        if (index === 0) {

            foundElement = await getPromisableElement(
                element,
                selectorArray[index],
                retries,
                retriesDelay
            );

        } else {

            const shadowRoot = await getPromisableShadowRoot(
                foundElement,
                retries,
                retriesDelay
            );

            foundElement = shadowRoot
                ? await getPromisableElement<E>(
                    shadowRoot,
                    `${HOST_SELECTOR} ${selectorArray[index]}`,
                    retries,
                    retriesDelay
                )
                : null;
        }

        if (foundElement === null) {
            return null;
        }

    }

    return foundElement as E;

}

export async function asyncQuerySelectorAll<E extends Element = Element>(
    selector: string,
    element: Document | Element,
    retries: number,
    retriesDelay: number
): Promise<NodeListOf<E>> {

    const selectorArray = getSelectorsArray(
        selector.trim(),
        SHADOW_ROOT_SELECTOR
    );

    const lastSelector = selectorArray.pop();

    if (!lastSelector.length) {
        throw new Error(
            getCannotErrorText('asyncQuerySelectorAll')
        );
    }

    if (!selectorArray.length) {
        return await getPromisableElement(
            element,
            lastSelector,
            retries,
            retriesDelay,
            true
        );
    }

    const lastElement = await asyncQuerySelector(
        selectorArray,
        element,
        retries,
        retriesDelay
    );

    const shadowRoot = await getPromisableShadowRoot(
        lastElement,
        retries,
        retriesDelay
    );

    return shadowRoot
        ? await getPromisableElement(
            shadowRoot,
            `${HOST_SELECTOR} ${lastSelector}`,
            retries,
            retriesDelay,
            true
        )
        : document.querySelectorAll(INVALID_SELECTOR);

}

export async function asyncQueryShadowRootSelector(
    selector: string,
    element: Document | Element,
    retries: number,
    retriesDelay: number
): Promise<ShadowRoot | null> {

    const selectorArray = getSelectorsArray(
        selector,
        SHADOW_ROOT_SELECTOR
    );

    const lastSelector = selectorArray.pop();

    if (lastSelector.length) {
        throw new Error(
            getMustErrorText('asyncQueryShadowRootSelector', 'asyncQuerySelector')
        );
    }

    const lastElement = await asyncQuerySelector(
        selectorArray,
        element,
        retries,
        retriesDelay
    );

    const shadowRoot = await getPromisableShadowRoot(
        lastElement,
        retries,
        retriesDelay
    );

    return shadowRoot || null;

}