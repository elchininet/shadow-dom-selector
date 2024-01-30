import { test, expect } from 'playwright-test-coverage';
import { BASE_URL } from './constants';
import './global';

test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
});

test('If no shadowRoot traverse, methods should behave as the native ones', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const ShadowDomSelector = window.ShadowDomSelector;
        const compare = window.__compare;
        const {
            querySelector,
            querySelectorAll,
            asyncQuerySelector,
            asyncQuerySelectorAll,
            deepQuerySelector,
            deepQuerySelectorAll,
            asyncDeepQuerySelector,
            asyncDeepQuerySelectorAll
        } = ShadowDomSelector;

        const section = document.querySelector('section');
        const allSections = document.querySelectorAll('section');
        const asyncParams = { retries: 1, delay: 0 };

        const sectionPromised = await asyncQuerySelector('section', asyncParams);
        const sectionAllPromised = await asyncQuerySelectorAll('section', asyncParams);
        const deepSectionPromised = await asyncDeepQuerySelector('section', asyncParams);
        const deepSectionAllPromised = await asyncDeepQuerySelectorAll('section', asyncParams);

        const listPromised = await asyncQuerySelector('li');
        const allListsPromised = await asyncQuerySelectorAll('li', asyncParams);
        
        return [
            querySelector('section') === section,
            compare(querySelectorAll('section'), allSections),
            querySelector('li') === null,
            querySelectorAll('li').length === 0,
            querySelectorAll('li') instanceof NodeList,
            deepQuerySelector('section') === section,
            compare(deepQuerySelectorAll('section'), allSections),
            sectionPromised === section,
            compare(sectionAllPromised, allSections),
            deepSectionPromised === section,
            compare(deepSectionAllPromised, allSections),
            listPromised === null,
            allListsPromised.length === 0,
            allListsPromised instanceof NodeList,
            querySelector('p, a, section') === document.querySelector('p, a, section')
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
        true,
        true,
        true,
        true,
        true,
        true,
        true
    ]);

});

test('querySelector tests', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const ShadowDomSelector = window.ShadowDomSelector;

        const { querySelector } = ShadowDomSelector;

        const query1 = querySelector('#section$ article$ ul');
        const query2 = querySelector('#section$ .article$ > ul > li:nth-of-type(2)');
        const query3 = querySelector('section$ article$ li:last-of-type');
        const query4 = querySelector(
            document.querySelector('section')!,
            '$ article$ li'
        );
        const query5 = querySelector('section$ li, section$ article$ li');
        const query6 = querySelector(document.body, '$ article$ li');
        const query7 = querySelector('section$ article$ li:nth-of-type(4)');
        const query8 = querySelector('section$ article$ ul$ li');

        return [
            query1 instanceof HTMLUListElement,
            query2!.textContent === 'List item 2',
            query3!.textContent === 'List item 3',
            query4 === document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelector('li'),
            query5 === document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelector('li'),
            query6 === null,
            query7 === null,
            query8 === null
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

test('deepQuerySelector tests', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const ShadowDomSelector = window.ShadowDomSelector;
        const { deepQuerySelector } = ShadowDomSelector;

        const query1 = deepQuerySelector('ul');
        const query2 = deepQuerySelector('li:nth-of-type(2)');
        const query3 = deepQuerySelector('li:last-of-type');
        const query4 = deepQuerySelector(
            document.querySelector('section')!
            ,
            'li'
        );
        const query5 = deepQuerySelector('article > li');
        const query6 = deepQuerySelector(
            document.querySelector('section')!,
            'article > li'
        );

        return [
            query1 instanceof HTMLUListElement,
            query2?.textContent === 'List item 2',
            query3?.textContent === 'List item 3',
            query4 === document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelector('li'),
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

test('querySelectorAll tests', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const ShadowDomSelector = window.ShadowDomSelector;
        const compare = window.__compare;

        const { querySelectorAll } = ShadowDomSelector;

        const query1 = querySelectorAll('section$ .article$ ul li');
        const query2 = querySelectorAll(
            document.querySelector('section')!,
            '$ article$ li'
        );
        const query3 = querySelectorAll('section$ li, section$ article$ li');
        const query4 = querySelectorAll('section$ .article$ ul$ li');

        return [
            compare(query1, document.querySelector('section')!.shadowRoot!.querySelector('.article')!.shadowRoot!.querySelectorAll('ul li')),
            compare(query2, document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelectorAll('li')),
            compare(query3, document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelectorAll('li')),
            query4.length === 0
        ];

    });

    expect(result).toMatchObject([
        true,
        true,
        true,
        true
    ]);

});

test('deepQuerySelectorAll tests', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const ShadowDomSelector = window.ShadowDomSelector;
        const compare = window.__compare;

        const { deepQuerySelectorAll } = ShadowDomSelector;

        const query1 = deepQuerySelectorAll('ul li');
        const query2 = deepQuerySelectorAll(
            document.querySelector('section')!,
            'li'
        );
        const query3 = deepQuerySelectorAll('article > li');

        return [
            compare(query1, document.querySelector('section')!.shadowRoot!.querySelector('.article')!.shadowRoot!.querySelectorAll('ul li')),
            compare(query2, document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelectorAll('li')),
            query3.length === 0
        ];

    });

    expect(result).toMatchObject([
        true,
        true,
        true
    ]);

});

test('shadowRootQuerySelector tests', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const ShadowDomSelector = window.ShadowDomSelector;

        const { shadowRootQuerySelector } = ShadowDomSelector;

        const query1 = shadowRootQuerySelector('section$');
        const query2 = shadowRootQuerySelector('section$ .article$');
        const query3 = shadowRootQuerySelector(
            document.querySelector('section')!,
            '$ article$'
        );
        const query4 = shadowRootQuerySelector('section$ div$, section$ article$');
        const query5 = shadowRootQuerySelector(
            document.querySelector('section')!,
            '$'
        );
        const query6 = shadowRootQuerySelector('section$ .article$ ul$');
        const query7 = shadowRootQuerySelector('section$ .article$ h3$');

        return [
            query1 === document.querySelector('section')!.shadowRoot,
            query2 === document.querySelector('section')!.shadowRoot!.querySelector('.article')!.shadowRoot,
            query3 === document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot,
            query4 === document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot,
            query5 === document.querySelector('section')!.shadowRoot,
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

test('asyncQuerySelector tests', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const ShadowDomSelector = window.ShadowDomSelector;

        const { asyncQuerySelector } = ShadowDomSelector;

        const query1 = await asyncQuerySelector('section');
        const query2 = await asyncQuerySelector('#section$ .article');
        const query3 = await asyncQuerySelector('#section$ .article$ > ul > li:nth-of-type(3)');
        const query4 = await asyncQuerySelector(
            '#section$ .article$ > delayed-list-container$ ul > li:nth-of-type(2)',
            {
                retries: 50,
                delay: 50
            }
        );
        const query5 = await asyncQuerySelector('section$ div, section$ article$ li:nth-of-type(2)');
        const query6 = await asyncQuerySelector(
            document.querySelector('section')!,
            '$ article$ li:nth-of-type(2)'
        );
        const query7 = await asyncQuerySelector(
            document.querySelector('section')!,
            '$ article$ li:nth-of-type(3)',
            { retries: 5 }
        );
        const query8 = await asyncQuerySelector(
            document.querySelector('section')!,
            '$ article$ li',
            { delay: 10 }
        );
        const query9 = await asyncQuerySelector(
            'section$ article$ ul > li',
            { retries: 10 }
        );
        const query10 = await asyncQuerySelector(
            'section$ article$ li:nth-of-type(2)',
            { delay: 1 }
        );
        const query11 = await asyncQuerySelector(
            document.body,
            '$ article$ li'
        );
        const query12 = await asyncQuerySelector('#section$ .article$ > ul$ li');

        return [
            query1 !== null,
            query1 === document.querySelector('section'),
            query2 === document.querySelector('#section')!.shadowRoot!.querySelector('.article'),
            query3?.textContent === 'List item 3',
            query4?.textContent === 'Delayed List item 2',
            query5 === document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelector('li:nth-of-type(2)'),
            query6 === document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelector('li:nth-of-type(2)'),
            query7 === document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelector('li:nth-of-type(3)'),
            query8 === document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelector('li'),
            query9 === document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelector('ul > li'),
            query10 === document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelector('li:nth-of-type(2)'),
            query11 === null,
            query12 === null
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
        true,
        true,
        true,
        true,
        true
    ]);

});

test('asyncDeepQuerySelector tests', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const ShadowDomSelector = window.ShadowDomSelector;

        const { asyncDeepQuerySelector } = ShadowDomSelector;

        const query1 = await asyncDeepQuerySelector('section');
        const query2 = await asyncDeepQuerySelector('.article');
        const query3 = await asyncDeepQuerySelector('li:nth-of-type(3)');
        const query4 = await asyncDeepQuerySelector(
            'li.delayed-li:nth-of-type(2)',
            {
                retries: 50,
                delay: 50
            }
        );
        const query5 = await asyncDeepQuerySelector('section > ul');
        const query6 = await asyncDeepQuerySelector(
            document.body,
            'article > li'
        );
        const query7 = await asyncDeepQuerySelector(
            document.body,
            'section > article',
            {
                retries: 2,
                delay: 5
            }
        );

        return [
            query1 !== null,
            query1 === document.querySelector('section'),
            query2 === document.querySelector('#section')!.shadowRoot!.querySelector('.article'),
            query3?.textContent === 'List item 3',
            query4?.textContent === 'Delayed List item 2',
            query5 === null,
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
        true,
        true
    ]);

});

test('asyncQuerySelectorAll tests', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const ShadowDomSelector = window.ShadowDomSelector;
        const compare = window.__compare;

        const { asyncQuerySelectorAll } = ShadowDomSelector;

        const query1 = await asyncQuerySelectorAll('section');
        const query2 = await asyncQuerySelectorAll('#section$ .article');
        const query3 = await asyncQuerySelectorAll('#section$ div li, #section$ .article$ li');
        const query4 = await asyncQuerySelectorAll('#section$ .article$ > ul > li');
        const query5 = await asyncQuerySelectorAll(
            '#section$ .article$ > delayed-list-container$ ul > li',
            {
                retries: 50,
                delay: 50
            }
        );
        const query6 = await asyncQuerySelectorAll(
            document.querySelector('section')!,
            '$ article$ li'
        );
        const query7 = await asyncQuerySelectorAll(
            document.querySelector('section')!,
            '$ article$ li',
            { retries: 5 }
        );
        const query8 = await asyncQuerySelectorAll(
            document.querySelector('section')!,
            '$ article$ li',
            { delay: 10 }
        );
        const query9 = await asyncQuerySelectorAll(
            'section$ article$ ul > li',
            { retries: 10 }
        );
        const query10 = await asyncQuerySelectorAll(
            'section$ article$ li',
            { delay: 1 }
        );
        const query11 = await asyncQuerySelectorAll('section$ div$ span');
        const query12 = await asyncQuerySelectorAll('#section$ .article$ > delayed-list-container$ ul$ li');
        const query13 = await asyncQuerySelectorAll('div.container ul');

        return [
            compare(query1, document.querySelectorAll('section')),
            compare(query2, document.querySelector('#section')!.shadowRoot!.querySelectorAll('.article')),
            compare(query3, document.querySelector('#section')!.shadowRoot!.querySelector('.article')!.shadowRoot!.querySelectorAll('li')),
            query4.length === 3,
            query4.item(1).textContent === 'List item 2',
            query5.length === 3,
            query5.item(1).textContent === 'Delayed List item 2',
            compare(query6, document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelectorAll('li')),
            compare(query7, document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelectorAll('li')),
            compare(query8, document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelectorAll('li')),
            compare(query9, document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelectorAll('ul > li')),
            compare(query10, document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelectorAll('li')),
            query11.length === 0,
            query12.length === 0,
            query13.length === 0
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
        true,
        true,
        true,
        true,
        true,
        true,
        true
    ]);

});

test('asyncDeepQuerySelectorAll tests', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const ShadowDomSelector = window.ShadowDomSelector;
        const compare = window.__compare;

        const { asyncDeepQuerySelectorAll } = ShadowDomSelector;

        const query1 = await asyncDeepQuerySelectorAll('.article');
        const query2 = await asyncDeepQuerySelectorAll('li');
        const query3 = await asyncDeepQuerySelectorAll(
            'li.delayed-li',
            {
                retries: 50,
                delay: 50
            }
        );
        const query4 = await asyncDeepQuerySelectorAll(
            document.querySelector('section')!,
            'li'
        );
        const query5 = await asyncDeepQuerySelectorAll(
            document.querySelector('section')!,
            'li',
            { retries: 5 }
        );
        const query6 = await asyncDeepQuerySelectorAll(
            document.querySelector('section')!,
            'li',
            { delay: 10 }
        );
        const query7 = await asyncDeepQuerySelectorAll(
            'li',
            { retries: 10 }
        );
        const query8 = await asyncDeepQuerySelectorAll(
            'li',
            { delay: 1 }
        );
        const query9 = await asyncDeepQuerySelectorAll('span');
        const query10 = await asyncDeepQuerySelectorAll('article li');

        return [
            compare(query1, document.querySelector('#section')!.shadowRoot!.querySelectorAll('.article')),
            compare(query2, document.querySelector('#section')!.shadowRoot!.querySelector('.article')!.shadowRoot!.querySelectorAll('li')),
            query3.length === 3,
            query3.item(1).textContent === 'Delayed List item 2',
            compare(query4, document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelectorAll('li')),
            compare(query5, document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelectorAll('li')),
            compare(query6, document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelectorAll('li')),
            compare(query7, document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelectorAll('ul > li')),
            compare(query8, document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot!.querySelectorAll('li')),
            query9.length === 0,
            query10.length === 0
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
        true,
        true,
        true
    ]);

});

test('asyncShadowRootQuerySelector tests', async ({ page }) => {

    const result = await page.evaluate(async () => {

        const ShadowDomSelector = window.ShadowDomSelector;

        const { asyncShadowRootQuerySelector } = ShadowDomSelector;

        const query1 = await asyncShadowRootQuerySelector('section$');
        const query2 = await asyncShadowRootQuerySelector('#section$ .article$');
        const query3 = await asyncShadowRootQuerySelector('#section$ div$, #section$ .article$');
        const query4 = await asyncShadowRootQuerySelector(
            '#section$ .article$ > delayed-list-container$',
            {
                retries: 50,
                delay: 50
            }
        );
        const query5 = await asyncShadowRootQuerySelector(
            document.querySelector('section')!,
            '$ article$'
        );
        const query6 = await asyncShadowRootQuerySelector(
            document.querySelector('section')!,
            '$ article$',
            { retries: 5 }
        );
        const query7 = await asyncShadowRootQuerySelector(
            document.querySelector('section')!,
            '$ article$',
            { delay: 10 },
        );
        const query8 = await asyncShadowRootQuerySelector(
            'section$ article$',
            { retries: 10 }
        );
        const query9 = await asyncShadowRootQuerySelector(
            'section$ article$',
            { delay: 1 }
        );
        const query10 = await asyncShadowRootQuerySelector(
            document.querySelector('section')!,
            '$'
        );
        const query11 = await asyncShadowRootQuerySelector(
            '#section$ div$',
            {
                retries: 1,
                delay: 0
            }
        );
        const query12 = await asyncShadowRootQuerySelector(
            '#section$ .article$ > .empty-div$',
            {
                retries: 10,
                delay: 5
            }
        );

        return [
            query1 !== null,
            query1 === document.querySelector('section')!.shadowRoot,
            query2 === document.querySelector('#section')!.shadowRoot!.querySelector('.article')!.shadowRoot,
            query3 === document.querySelector('#section')!.shadowRoot!.querySelector('.article')!.shadowRoot,
            query4 !== null,
            query5 === document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot,
            query6 === document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot,
            query7 === document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot,
            query8 === document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot,
            query9 === document.querySelector('section')!.shadowRoot!.querySelector('article')!.shadowRoot,
            query10 === document.querySelector('section')!.shadowRoot,
            query11 === null,
            query12 === null
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
        true,
        true,
        true,
        true,
        true
    ]);

});