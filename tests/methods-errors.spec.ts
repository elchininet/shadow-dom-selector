import { test, expect } from 'playwright-test-coverage';
import { BASE_URL } from './constants';
import './global';

test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
});

test('querySelector errors tests', async ({ page }) => {

    page.on('pageerror', error => {
        expect(error.message).toBe('querySelector cannot be used with a selector ending in a shadowRoot');
    });

    const result = await page.evaluate(async () => {

        const errors: string[] = [];

        const ShadowDomSelector = window.ShadowDomSelector;

        const { querySelector } = ShadowDomSelector;

        try {
            querySelector('section$ article$');
        } catch (error) {
            errors.push(error.toString());
        }

        try {
            querySelector('$ section$ article');
        } catch (error) {
            errors.push(error.toString());
        }

        try {
            querySelector(
                document.querySelector('section')!.shadowRoot!,
                '$ article'
            );
        } catch (error) {
            errors.push(error.toString());
        }

        return errors;

    });

    expect(result).toMatchObject([
        'SyntaxError: querySelector cannot be used with a selector ending in a shadowRoot ($). If you want to select a shadowRoot, use shadowRootQuerySelector instead.',
        'SyntaxError: You can not select a shadowRoot ($) of the document.',
        'SyntaxError: You can not select a shadowRoot ($) of a shadowRoot.'
    ]);

});

test('querySelectorAll errors tests', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const errors: string[] = [];

        const ShadowDomSelector = window.ShadowDomSelector;

        const { querySelectorAll } = ShadowDomSelector;

        try {
            querySelectorAll('section$ article$ ul$');
        } catch (error) {
            errors.push(error.toString());
        }

        try {
            querySelectorAll('$ section$ article$ ul');
        } catch (error) {
            errors.push(error.toString());
        }

        try {
            querySelectorAll(
                document.querySelector('section')!.shadowRoot!,
                '$ article'
            );
        } catch (error) {
            errors.push(error.toString());
        }

        return errors;

    });

    expect(result).toMatchObject([
        'SyntaxError: querySelectorAll cannot be used with a selector ending in a shadowRoot ($).',
        'SyntaxError: You can not select a shadowRoot ($) of the document.',
        'SyntaxError: You can not select a shadowRoot ($) of a shadowRoot.'
    ]);

});

test('shadowRootQuerySelector errors tests', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const errors: string[] = [];

        const ShadowDomSelector = window.ShadowDomSelector;

        const { shadowRootQuerySelector } = ShadowDomSelector;

        try {
            shadowRootQuerySelector('section$ article$ ul li');
        } catch (error) {
            errors.push(error.toString());
        }

        try {
            shadowRootQuerySelector('$ section$ article$');
        } catch (error) {
            errors.push(error.toString());
        }

        try {
            shadowRootQuerySelector('$');
        } catch (error) {
            errors.push(error.toString());
        }

        try {
            shadowRootQuerySelector(
                document.querySelector('section')!.shadowRoot!,
                '$'
            );
        } catch (error) {
            errors.push(error.toString());
        }

        return errors;

    });
    
    expect(result).toMatchObject([
        'SyntaxError: shadowRootQuerySelector must be used with a selector ending in a shadowRoot ($). If you don\'t want to select a shadowRoot, use querySelector instead.',
        'SyntaxError: You can not select a shadowRoot ($) of the document.',
        'SyntaxError: You can not select a shadowRoot ($) of the document.',
        'SyntaxError: You can not select a shadowRoot ($) of a shadowRoot.'
    ]);

});

test('asyncQuerySelector errors tests', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const errors: string[] = [];

        const ShadowDomSelector = window.ShadowDomSelector;

        const { asyncQuerySelector } = ShadowDomSelector;

        try {
            await asyncQuerySelector('section$ article$');
        } catch (error) {
            errors.push(error.toString());
        }

        try {
            await asyncQuerySelector('$ section$ article');
        } catch (error) {
            errors.push(error.toString());
        }

        try {
            await asyncQuerySelector(
                document.querySelector('section')!.shadowRoot!,
                '$ article'
            );
        } catch (error) {
            errors.push(error.toString());
        }

        return errors;

    });

    expect(result).toMatchObject([
        'SyntaxError: asyncQuerySelector cannot be used with a selector ending in a shadowRoot ($). If you want to select a shadowRoot, use asyncShadowRootQuerySelector instead.',
        'SyntaxError: You can not select a shadowRoot ($) of the document.',
        'SyntaxError: You can not select a shadowRoot ($) of a shadowRoot.'
    ]);

});

test('asyncQuerySelectorAll errors tests', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const errors: string[] = [];

        const ShadowDomSelector = window.ShadowDomSelector;

        const { asyncQuerySelectorAll } = ShadowDomSelector;

        try {
            await asyncQuerySelectorAll('section$ article$');
        } catch (error) {
            errors.push(error.toString());
        }

        try {
            await asyncQuerySelectorAll('$ section$ article li');
        } catch (error) {
            errors.push(error.toString());
        }

        try {
            await asyncQuerySelectorAll(
                document.querySelector('section')!.shadowRoot!,
                '$ article'
            );
        } catch (error) {
            errors.push(error.toString());
        }

        return errors;

    });

    expect(result).toMatchObject([
        'SyntaxError: asyncQuerySelectorAll cannot be used with a selector ending in a shadowRoot ($).',
        'SyntaxError: You can not select a shadowRoot ($) of the document.',
        'SyntaxError: You can not select a shadowRoot ($) of a shadowRoot.'
    ]);

});

test('asyncShadowRootQuerySelector errors tests', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const errors: string[] = [];

        const ShadowDomSelector = window.ShadowDomSelector;

        const { asyncShadowRootQuerySelector } = ShadowDomSelector;

        try {
            await asyncShadowRootQuerySelector('section$ article$ > delayed-list-container$ ul > li');
        } catch (error) {
            errors.push(error.toString());
        }

        try {
            await asyncShadowRootQuerySelector('$ section$ article$');
        } catch (error) {
            errors.push(error.toString());
        }

        try {
            await asyncShadowRootQuerySelector('$');
        } catch (error) {
            errors.push(error.toString());
        }

        try {
            await asyncShadowRootQuerySelector(
                document.querySelector('section')!.shadowRoot!,
                '$'
            );
        } catch (error) {
            errors.push(error.toString());
        }

        return errors;

    });

    expect(result).toMatchObject([
        'SyntaxError: asyncShadowRootQuerySelector must be used with a selector ending in a shadowRoot ($). If you don\'t want to select a shadowRoot, use asyncQuerySelector instead.',
        'SyntaxError: You can not select a shadowRoot ($) of the document.',
        'SyntaxError: You can not select a shadowRoot ($) of the document.',
        'SyntaxError: You can not select a shadowRoot ($) of a shadowRoot.'
    ]);

});