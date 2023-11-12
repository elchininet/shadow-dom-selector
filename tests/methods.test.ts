import DomSubtreeSelector from '../src';

const SELECTORS = {
    section: 'section',
    article: 'article',
    title: 'title',
    subtitle: 'subtitle'
};

const ELEMENTS_STRINGS = {
    title: 'Section title',
    article: 'Article title',
    list: [
        'List item 1',
        'List item 2',
        'List item 3'
    ]
};

// describe('Methods tests', () => {

//     beforeEach(() => {
        const section = document.createElement('section');
        section.id = SELECTORS.section;

        const article = document.createElement('article');
        article.classList.add(SELECTORS.article);

        const sectionTitle = document.createElement('h1');
        sectionTitle.classList.add(SELECTORS.title);
        sectionTitle.textContent = ELEMENTS_STRINGS.title;

        const articleTitle = document.createElement('h2');
        articleTitle.classList.add(SELECTORS.subtitle);
        articleTitle.textContent = ELEMENTS_STRINGS.article;

        const list = document.createElement('ul');
        list.innerHTML = ELEMENTS_STRINGS.list.map(text => `<li>${text}</li>`).join('');

        const shadowSection = section.attachShadow({ mode: 'open' });
        const shadowArticle = article.attachShadow({ mode: 'open' });

        shadowSection.appendChild(sectionTitle);
        shadowSection.appendChild(article);
        shadowArticle.appendChild(articleTitle);
        shadowArticle.appendChild(list);
        document.body.appendChild(section);
//     });

//     /*it('If no shadowRoot traverse, methods should behave as the native ones', async () => {
        
//         const selector = new DomSubtreeSelector({ retries: 1, retriesDelay: 0 });
//         const section = document.querySelector('section');
//         const allSections = document.querySelectorAll('section');
//         const allList = document.querySelectorAll('li');

//         expect(selector.querySelector('section')).toBe(section);
//         expect(selector.querySelectorAll('section')).toEqual(allSections);
//         expect(selector.querySelector('li')).toBe(null);
//         expect(selector.querySelectorAll('li')).toEqual(allList);

//         const sectionPromised = await selector.promisableQuerySelector('section');
//         const sectionAllPromised = await selector.promisableQuerySelectorAll('section');
//         expect(sectionPromised).toBe(section);
//         expect(sectionAllPromised).toEqual(allSections);

//         const listPromised = await selector.promisableQuerySelector('li');
//         const allListsPromised = await selector.promisableQuerySelectorAll('li');
//         expect(listPromised).toBe(null);
//         expect(allListsPromised).toEqual(allList);

//     });*/

//     it('querySelector tests', () => {

//         const selector = new DomSubtreeSelector({ retries: 1, retriesDelay: 0 });

//         const secondList = selector.querySelector('#section$ .article$ li');
//         //expect(secondList).not.toBeNull();
//         //expect(secondList?.textContent).toBe(ELEMENTS_STRINGS.list[1]);

//     });

// });