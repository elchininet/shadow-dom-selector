import { HOST_SELECTOR } from '@constants';
import {
    getPromisableElement,
    getPromisableShadowRoot,
    getDocumentShadowRootError
} from '@utilities';

export function querySelectorInternal<E extends Element>(
    path: string[],
    root: Document | Element,
): E | null {

    let foundElement: E | null = null;

    const total = path.length;

    for (let index = 0; index < total; index++) {
        if (index === 0) {
            if (!path[index].length) {
                if (root instanceof Document) {
                    throw new SyntaxError(
                        getDocumentShadowRootError()
                    );
                }
                foundElement = root.shadowRoot?.querySelector(path[++index]) || null;
            } else {
                foundElement = root.querySelector(path[index]);
            }
        } else {
            foundElement = foundElement.shadowRoot?.querySelector<E>(`${HOST_SELECTOR} ${path[index]}`) || null;
        }
        if (foundElement === null) {
            return null;
        }
    }

    return foundElement;

}

export function querySelectorAllInternal<E extends Element>(
    path: string[],
    root: Document | Element
): NodeListOf<E> | null {

    const pathLocal = [...path];

    const lastSelector = pathLocal.pop();
    
    if (!pathLocal.length) {
        return root.querySelectorAll<E>(lastSelector);
    }

    const lastElement = querySelectorInternal(
        pathLocal,
        root
    );
 
    return (
        lastElement.shadowRoot?.querySelectorAll<E>(`${HOST_SELECTOR} ${lastSelector}`) ||
        null
    );

}

export function shadowRootQuerySelectorInternal(
    path: string[],
    root: Document | Element
): ShadowRoot | null {

    const lastElement = querySelectorInternal(
        path,
        root
    );

    return lastElement?.shadowRoot || null;

}

export async function asyncQuerySelectorInternal<E extends Element>(
    path: string[],
    root: Document | Element,
    retries: number,
    delay: number
): Promise<E | null> {

    let foundElement: E | null = null;

    const total = path.length;

    for (let index = 0; index < total; index++) {

        if (index === 0) {

            if (!path[index].length) {

                if (root instanceof Document) {
                    throw new SyntaxError(
                        getDocumentShadowRootError()
                    );
                }

                foundElement = root.shadowRoot
                    ? await getPromisableElement<E>(
                        root.shadowRoot,
                        path[++index],
                        retries,
                        delay
                    )
                    : null;

            } else {

                foundElement = await getPromisableElement<E>(
                    root,
                    path[index],
                    retries,
                    delay
                );

            }

        } else {

            const shadowRoot = await getPromisableShadowRoot(
                foundElement,
                retries,
                delay
            );

            foundElement = shadowRoot
                ? await getPromisableElement<E>(
                    shadowRoot,
                    `${HOST_SELECTOR} ${path[index]}`,
                    retries,
                    delay
                )
                : null;
        }

        if (foundElement === null) {
            return null;
        }

    }

    return foundElement;

}

export async function asyncQuerySelectorAllInternal<E extends Element>(
    path: string[],
    root: Document | Element,
    retries: number,
    delay: number
): Promise<NodeListOf<E> | null> {

    const pathLocal = [...path];

    const lastSelector = pathLocal.pop();

    if (!pathLocal.length) {
        return await getPromisableElement<E>(
            root,
            lastSelector,
            retries,
            delay,
            true
        );
    }

    const lastElement = await asyncQuerySelectorInternal(
        pathLocal,
        root,
        retries,
        delay
    );

    const shadowRoot = lastElement
        ? await getPromisableShadowRoot(
            lastElement,
            retries,
            delay
        )
        : null;

    return shadowRoot
        ? await getPromisableElement<E>(
            shadowRoot,
            `${HOST_SELECTOR} ${lastSelector}`,
            retries,
            delay,
            true
        )
        : null;

}

export async function asyncShadowRootQuerySelectorInternal(
    path: string[],
    root: Document | Element,
    retries: number,
    delay: number
): Promise<ShadowRoot | null> {

    const lastElement = await asyncQuerySelectorInternal(
        path,
        root,
        retries,
        delay
    );

    return lastElement
        ? await getPromisableShadowRoot(
            lastElement,
            retries,
            delay
        )
        : null;

}