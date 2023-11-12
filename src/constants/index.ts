import { Options } from '@types';

export const DEFAULT_OPTIONS: Required<Options> = {
    retries: 100,
    retriesDelay: 50
};

export const SHADOW_ROOT_SELECTOR = '$';
export const HOST_SELECTOR = ':host';
export const INVALID_SELECTOR = 'invalid selector';
