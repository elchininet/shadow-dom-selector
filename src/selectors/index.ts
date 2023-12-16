import { HOST_SELECTOR } from '@constants';
import { getDocumentShadowRootError, getShadowRootShadowRootError } from '@utilities';

export function querySelectorInternal<E extends Element>(
    path: string[],
    root: Document | Element | ShadowRoot,
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
                if (root instanceof ShadowRoot) {
                    throw new SyntaxError(
                        getShadowRootShadowRootError()
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
    root: Document | Element | ShadowRoot
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
        lastElement?.shadowRoot?.querySelectorAll<E>(`${HOST_SELECTOR} ${lastSelector}`) ||
        null
    );

}

export function shadowRootQuerySelectorInternal(
    path: string[],
    root: Document | Element | ShadowRoot
): ShadowRoot | null {

    if (
        path.length === 1 &&
        !path[0].length
    ) {
        if (root instanceof Document) {
            throw new SyntaxError(
                getDocumentShadowRootError()
            );
        }
        if (root instanceof ShadowRoot) {
            throw new SyntaxError(
                getShadowRootShadowRootError()
            );
        }
        return root.shadowRoot;
    }

    const lastElement = querySelectorInternal(
        path,
        root
    );

    return lastElement?.shadowRoot || null;

}