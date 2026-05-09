import { test, expect } from 'playwright-test-coverage';
import { BASE_URL } from './constants';
import './global';

test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
});

test('querySelector errors tests', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const errors: string[] = [];

        const ShadowDomSelector = window.ShadowDomSelector;

        const { querySelector } = ShadowDomSelector;

        try {
            querySelector('section$ article$');
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            querySelector('$ section$ article');
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            querySelector(
                document.querySelector('section')!.shadowRoot!,
                '$ article'
            );
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            // @ts-ignore
            querySelector([], 123);
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        return errors;

    });

    expect(result).toMatchObject([
        'SyntaxError: querySelector cannot be used with a selector ending in a shadowRoot ($). If you want to select a shadowRoot, use shadowRootQuerySelector instead.',
        'SyntaxError: You can not select a shadowRoot ($) of the document.',
        'SyntaxError: You can not select a shadowRoot ($) of a shadowRoot.',
        'TypeError: Wrong parameters have been provided.'
    ]);

});

test('querySelectorAll errors tests', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const errors: string[] = [];

        const ShadowDomSelector = window.ShadowDomSelector;

        const { querySelectorAll } = ShadowDomSelector;

        try {
            querySelectorAll('section$ article$ ul$');
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            querySelectorAll('$ section$ article$ ul');
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            querySelectorAll(
                document.querySelector('section')!.shadowRoot!,
                '$ article'
            );
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            // @ts-ignore
            querySelectorAll([], 123);
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        return errors;

    });

    expect(result).toMatchObject([
        'SyntaxError: querySelectorAll cannot be used with a selector ending in a shadowRoot ($).',
        'SyntaxError: You can not select a shadowRoot ($) of the document.',
        'SyntaxError: You can not select a shadowRoot ($) of a shadowRoot.',
        'TypeError: Wrong parameters have been provided.'
    ]);

});

test('shadowRootQuerySelector errors tests', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const errors: string[] = [];

        const ShadowDomSelector = window.ShadowDomSelector;

        const { shadowRootQuerySelector } = ShadowDomSelector;

        try {
            shadowRootQuerySelector('section$ article$ ul li');
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            shadowRootQuerySelector('$ section$ article$');
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            shadowRootQuerySelector('$');
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            shadowRootQuerySelector(
                document.querySelector('section')!.shadowRoot!,
                '$'
            );
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            // @ts-ignore
            shadowRootQuerySelector([], 123);
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        return errors;

    });
    
    expect(result).toMatchObject([
        'SyntaxError: shadowRootQuerySelector must be used with a selector ending in a shadowRoot ($). If you don\'t want to select a shadowRoot, use querySelector instead.',
        'SyntaxError: You can not select a shadowRoot ($) of the document.',
        'SyntaxError: You can not select a shadowRoot ($) of the document.',
        'SyntaxError: You can not select a shadowRoot ($) of a shadowRoot.',
        'TypeError: Wrong parameters have been provided.'
    ]);

});

test('asyncQuerySelector errors tests', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const errors: string[] = [];

        const ShadowDomSelector = window.ShadowDomSelector;

        const { asyncQuerySelector } = ShadowDomSelector;

        try {
            await asyncQuerySelector('section$ article$');
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            await asyncQuerySelector('$ section$ article');
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            await asyncQuerySelector(
                document.querySelector('section')!.shadowRoot!,
                '$ article'
            );
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            // @ts-ignore
            await asyncQuerySelector([], 123);
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            await asyncQuerySelector('section.non-existent', { shouldReject: true });
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            await asyncQuerySelector(
                document.querySelector('section')!,
                '.non-existent',
                { shouldReject: true }
            );
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        return errors;

    });

    expect(result).toMatchObject([
        'SyntaxError: asyncQuerySelector cannot be used with a selector ending in a shadowRoot ($). If you want to select a shadowRoot, use asyncShadowRootQuerySelector instead.',
        'SyntaxError: You can not select a shadowRoot ($) of the document.',
        'SyntaxError: You can not select a shadowRoot ($) of a shadowRoot.',
        'TypeError: Wrong parameters have been provided.',
        'Error: Could not get the result after 10 retries',
        'Error: Could not get the result after 10 retries'
    ]);

});

test('asyncQuerySelectorAll errors tests', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const errors: string[] = [];

        const ShadowDomSelector = window.ShadowDomSelector;

        const { asyncQuerySelectorAll } = ShadowDomSelector;

        try {
            await asyncQuerySelectorAll('section$ article$');
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            await asyncQuerySelectorAll('$ section$ article li');
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            await asyncQuerySelectorAll(
                document.querySelector('section')!.shadowRoot!,
                '$ article'
            );
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            // @ts-ignore
            await asyncQuerySelectorAll([], 123);
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            await asyncQuerySelectorAll('section.non-existent', { shouldReject: true });
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            await asyncQuerySelectorAll(
                document.querySelector('section')!,
                '.non-existent',
                { shouldReject: true }
            );
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        return errors;

    });

    expect(result).toMatchObject([
        'SyntaxError: asyncQuerySelectorAll cannot be used with a selector ending in a shadowRoot ($).',
        'SyntaxError: You can not select a shadowRoot ($) of the document.',
        'SyntaxError: You can not select a shadowRoot ($) of a shadowRoot.',
        'TypeError: Wrong parameters have been provided.',
        'Error: Could not get the result after 10 retries',
        'Error: Could not get the result after 10 retries'
    ]);

});

test('asyncShadowRootQuerySelector errors tests', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const errors: string[] = [];

        const ShadowDomSelector = window.ShadowDomSelector;

        const { asyncShadowRootQuerySelector } = ShadowDomSelector;

        try {
            await asyncShadowRootQuerySelector('section$ article$ > delayed-list-container$ ul > li');
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            await asyncShadowRootQuerySelector('$ section$ article$');
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            await asyncShadowRootQuerySelector('$');
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            await asyncShadowRootQuerySelector(
                document.querySelector('section')!.shadowRoot!,
                '$'
            );
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            // @ts-ignore
            await asyncShadowRootQuerySelector([], 123);
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            await asyncShadowRootQuerySelector('section.non-existent$', { shouldReject: true });
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        try {
            await asyncShadowRootQuerySelector(
                document.querySelector('section')!,
                '.non-existent$',
                { shouldReject: true }
            );
        } catch (error: unknown) {
            errors.push((error as Error).toString());
        }

        return errors;

    });

    expect(result).toMatchObject([
        'SyntaxError: asyncShadowRootQuerySelector must be used with a selector ending in a shadowRoot ($). If you don\'t want to select a shadowRoot, use asyncQuerySelector instead.',
        'SyntaxError: You can not select a shadowRoot ($) of the document.',
        'SyntaxError: You can not select a shadowRoot ($) of the document.',
        'SyntaxError: You can not select a shadowRoot ($) of a shadowRoot.',
        'TypeError: Wrong parameters have been provided.',
        'Error: Could not get the result after 10 retries',
        'Error: Could not get the result after 10 retries'
    ]);

});