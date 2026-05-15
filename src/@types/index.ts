export interface AsyncParams {
    retries?: number;
    delay?: number;
    shouldReject?: boolean;
}

export type Root = Document | Element | ShadowRoot;

export type Return<T> = T | null;

export type PromiseReturn<T> = Promise<Return<T>>