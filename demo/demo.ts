import * as ShadowDomSelector from '../src';

// @ts-ignore
window.ShadowDomSelector = ShadowDomSelector;

document.addEventListener('DOMContentLoaded', () => {

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

    setTimeout(() => {
        const delayedListContainer = document.createElement('div');
        delayedListContainer.classList.add('delayed-list-container');
        const delayedList = document.createElement('ul');
        delayedList.innerHTML = ELEMENTS_STRINGS.list.map(text => `<li>Delayed ${text}</li>`).join('');

        const shadowDelayedList = delayedListContainer.attachShadow({ mode: 'open' });
        shadowDelayedList.appendChild(delayedList);
        shadowArticle.appendChild(delayedListContainer);
        
    }, 500);

});