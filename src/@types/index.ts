export interface AsyncParams {
    retries?: number;
    delay?: number;
}

export type AsyncSelectorBase = {
    _element: Document | Element | ShadowRoot | Promise<NodeListOf<Element> | Element | ShadowRoot | null>;
    asyncParams: AsyncParams;
};

export type AsyncSelectorInstance = Exclude<AsyncSelectorBase, '_element'> & {
    element: Promise<Document | Element | ShadowRoot | null>;
    all: Promise<NodeListOf<Element>>;
};

export type AsyncSelectorProxy = AsyncSelectorInstance & {
    [prop: string]: AsyncSelectorProxy;
};