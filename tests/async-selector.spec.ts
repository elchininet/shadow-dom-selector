import { test, expect } from 'playwright-test-coverage';
import { BASE_URL } from './constants';
import './global';

test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
});

test('If no shadowRoot traverse, queries should behave as the native ones', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const AsyncSelector = window.ShadowDomSelector.AsyncSelector;
        const compare = window.__compare;
        
        const selector = new AsyncSelector({
            retries: 1,
            delay: 5
        });
        const section = document.querySelector('section');
        const allSections = document.querySelectorAll('section');

        const query1 = await selector.query('section').element;
        const query2 = await selector.query('section').all;
        const query3 = await selector.query('li').element;
        const query4 = await selector.query('article').$.element;
        const query5 = await selector.query('li').all;
        const query6 = await selector.query('article').$.query('div').$.query('span').all;
        const query7 = await selector.query('li').all;

        return [
            query1 !== null,
            query1 === section,
            compare(query2, allSections),
            query3 === null,
            query4 === null,
            query5.length === 0,
            query6.length === 0,
            query7 instanceof NodeList
        ];
    });

    expect(result).toMatchObject([
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true
    ]);

});

test('Query for existent elements', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const AsyncSelector = window.ShadowDomSelector.AsyncSelector;
        const compare = window.__compare;

        const selector = new AsyncSelector();

        const article = document
            .querySelector('section')!
            .shadowRoot!
            .querySelector('article');

        const ul = article!
            .shadowRoot!
            .querySelector('ul');

        const allLis = ul!.querySelectorAll('li');

        const query1 = await selector.query('section').$.query('article').element;
        const query2 = await selector.query('#section').$.query('.article').element;
        const query3 = await selector.query('section').$.query('article').$.query('ul li').all;

        return [
            query1 !== null,
            query2 !== null,
            query3.length > 0,
            query1 === article,
            query2 === article,
            compare(query3, allLis)
        ];

    });

    expect(result).toMatchObject([
        true,
        true,
        true,
        true,
        true,
        true
    ]);

});

test('Query from an element', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const AsyncSelector = window.ShadowDomSelector.AsyncSelector;

        const article = document
            .querySelector('section')!
            .shadowRoot!
            .querySelector('article');

        const ul = article!.shadowRoot!.querySelector('ul');

        const selector = new AsyncSelector(article);

        const query1 = await selector.element;
        const query2 = await selector.$.query('ul').element;

        return [
            query1 !== null,
            query2 !== null,
            query1 === article,
            query2 === ul
        ];

    });

    expect(result).toMatchObject([
        true,
        true,
        true,
        true
    ]);

});

test('Query for delayed elements', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const AsyncSelector = window.ShadowDomSelector.AsyncSelector;

        const selector = new AsyncSelector({
            retries: 100
        });

        const selectorFromDelayedSection = new AsyncSelector(
            new Promise<Element>((resolve) => {
                setTimeout(() => {
                    resolve(
                        document.querySelector('section')!
                    );
                }, 500);
            }),
            {
                retries: 20,
                delay: 50
            }
        );

        const query1 = await (
            selector
                .query('#section')
                .$
                .query('.article')
                .$
                .query('delayed-list-container')
                .$
                .query('ul li:nth-of-type(2)')
                .element
        );

        const query2 = await (
            selector
                .query('#section')
                .$
                .query('.article')
                .$
                .query('delayed-list-container')
                .$
                .query('ul li')
                .eq(1)
        );

        const query3 = await (
            selector
                .query('section')
                .$
                .query('article')
                .$
                .query('delayed-list-container')
                .$
                .query('ul > li')
                .all
        );

        const query4 = await selectorFromDelayedSection.element;

        return [
            query1?.textContent === 'Delayed List item 2',
            query2?.textContent === 'Delayed List item 2',
            query3.length === 3,
            query4 !== null,
            query4 === document.querySelector('section')
        ];

    });

    expect(result).toMatchObject([
        true,
        true,
        true,
        true,
        true
    ]);

});

test('Deep query for delayed elements from document', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const AsyncSelector = window.ShadowDomSelector.AsyncSelector;

        const selector = new AsyncSelector({
            retries: 60,
            delay: 10
        });

        const query1 = await selector.deepQuery('delayed-list-container').element;
        const query2 = await selector.query('section').deepQuery('delayed-list-container').element;
        const query3 = await selector.deepQuery('li.delayed-li').all;
        const query4 = await selector.deepQuery('li.delayed-li').eq(2);
        const query5 = await selector.deepQuery('li.delayed-li:nth-of-type(2)').element;
        const query6 = await selector.deepQuery('.non-existent-element').element;
        const query7 = await selector.query('.non-existent-element').deepQuery('ul').element;

        return [
            query1 !== null,
            query2 !== null,
            query3.length === 3,
            query4?.textContent === 'Delayed List item 3',
            query5?.textContent === 'Delayed List item 2',
            query6 === null,
            query7 === null
        ];

    });

    expect(result).toMatchObject([
        true,
        true,
        true,
        true,
        true,
        true,
        true
    ]);

});

test('Deep query for delayed elements from element', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const AsyncSelector = window.ShadowDomSelector.AsyncSelector;

        const selector = new AsyncSelector(
            document.querySelector('section')!,
            {
                retries: 60,
                delay: 10
            }
        );

        const query1 = await selector.deepQuery('delayed-list-container').element;
        const query2 = await selector.deepQuery('li.delayed-li').all;
        const query3 = await selector.deepQuery('li.delayed-li').eq(2);
        const query4 = await selector.deepQuery('li.delayed-li:nth-of-type(2)').element;
        const query5 = await selector.deepQuery('.non-existent-element').element;
        const query6 = await selector.query('.non-existent-element').deepQuery('ul').element;

        return [
            query1 !== null,
            query2.length === 3,
            query3?.textContent === 'Delayed List item 3',
            query4?.textContent === 'Delayed List item 2',
            query5 === null,
            query6 === null
        ];

    });

    expect(result).toMatchObject([
        true,
        true,
        true,
        true,
        true,
        true
    ]);

});

test('Deep query for delayed elements from shadowRoot', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const AsyncSelector = window.ShadowDomSelector.AsyncSelector;

        const selector = new AsyncSelector(
            document.querySelector('section')!.shadowRoot!,
            {
                retries: 60,
                delay: 10
            }
        );

        const query1 = await selector.deepQuery('delayed-list-container').element;
        const query2 = await selector.deepQuery('li.delayed-li').all;
        const query3 = await selector.deepQuery('li.delayed-li').eq(2);
        const query4 =  await selector.deepQuery('li.delayed-li:nth-of-type(2)').element;
        const query5 = await selector.deepQuery('.non-existent-element').element;

        return [
            query1 !== null,
            query2.length === 3,
            query3?.textContent === 'Delayed List item 3',
            query4?.textContent === 'Delayed List item 2',
            query5 === null
        ];

    });

    expect(result).toMatchObject([
        true,
        true,
        true,
        true,
        true
    ]);

});

test('Inherited params', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const AsyncSelector = window.ShadowDomSelector.AsyncSelector;

        const selector = new AsyncSelector({
            retries: 7,
            delay: 13
        });

        const query = selector.query('section').$.asyncParams;

        return [
            Object.keys(query).length === 2,
            query.retries === 7,
            query.delay === 13
        ];

    });

    expect(result).toMatchObject([
        true,
        true,
        true
    ]);

});

test('Non existent elements', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const AsyncSelector = window.ShadowDomSelector.AsyncSelector;

        const selector = new AsyncSelector({
            delay: 5
        });

        const selectorFromSection = new AsyncSelector(
            document.querySelector('section')!.shadowRoot!,
            {
                delay: 5
            }
        );

        const selectorFromDelayedSection = new AsyncSelector(
            new Promise<ShadowRoot>((resolve) => {
                setTimeout(() => {
                    resolve(document.querySelector('section')!.shadowRoot!);
                }, 500);
            }),
            {
                retries: 20,
                delay: 50
            }
        );

        const query1 = await selector.query('article').element;
        const query2 = await selector.query('section').query('div').element;
        const query3 = await selector.$.element;
        const query4 = await selector.query('section').$.$.element;
        const query5 = await selectorFromSection.$.element;
        const query6 = await selectorFromDelayedSection.$.element;
        const query7 = await selector.all;
        const query8 = await selector.eq(0);
        const query9 = await selector.query('section').eq(10);

        return [
            query1 === null,
            query2 === null,
            query3 === null,
            query4 === null,
            query5 === null,
            query6 === null,
            query7.length === 0,
            query8 === null,
            query9 === null
        ];

    });

    expect(result).toMatchObject([
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true
    ]);

});