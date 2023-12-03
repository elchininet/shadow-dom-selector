export interface AsyncParams {
    retries?: number;
    delay?: number;
}

export type SelectorBase = {
    _element: Document | Element | ShadowRoot | Promise<NodeListOf<Element> | ShadowRoot | null>;
    asyncParams: AsyncParams;
};

export type SelectorInstance = SelectorBase & {
    element: Promise<Document | Element | ShadowRoot | null>;
    all: Promise<NodeListOf<Element>>;
};

export type SelectorProxy = SelectorInstance & {
    [prop: string]: SelectorProxy;
};