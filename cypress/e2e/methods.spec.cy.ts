describe('ShadowDomSelector spec', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    it('If no shadowRoot traverse, methods should behave as the native ones', () => {
        cy.window()
            .then(async (win) => {

                const doc = win.document;
                const ShadowDomSelector = win.ShadowDomSelector;
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

                const section = doc.querySelector('section');
                const allSections = doc.querySelectorAll('section');
                const asyncParams = { retries: 1, delay: 0 };

                expect(querySelector('section')).to.equal(section);
                expect(querySelectorAll('section')).to.deep.equal(allSections);
                expect(querySelector('li')).to.null;
                expect(querySelectorAll('li').length).to.equal(0);
                expect(querySelectorAll('li')).to.be.instanceOf(win.NodeList);
                expect(deepQuerySelector('section')).to.equal(section);
                expect(deepQuerySelectorAll('section')).to.deep.equal(allSections);

                const sectionPromised = await asyncQuerySelector('section', asyncParams);
                const sectionAllPromised = await asyncQuerySelectorAll('section', asyncParams);
                const deepSectionPromised = await asyncDeepQuerySelector('section', asyncParams);
                const deepSectionAllPromised = await asyncDeepQuerySelectorAll('section', asyncParams);

                expect(sectionPromised).to.equal(section);
                expect(sectionAllPromised).to.deep.equal(allSections);
                expect(deepSectionPromised).to.equal(section);
                expect(deepSectionAllPromised).to.deep.equal(allSections);

                const listPromised = await asyncQuerySelector('li');
                const allListsPromised = await asyncQuerySelectorAll('li', asyncParams);

                expect(listPromised).to.null;
                expect(allListsPromised.length).to.equal(0);
                expect(allListsPromised).to.be.instanceOf(win.NodeList);

                expect(
                    querySelector('p, a, section')
                ).to.equal(
                    doc.querySelector('p, a, section')
                );

            });
    });

    it('querySelector tests', () => {
        cy.window()
            .then((win) => {

                const doc = win.document;
                const ShadowDomSelector = win.ShadowDomSelector;
                const { querySelector } = ShadowDomSelector;

                const ul = querySelector('#section$ article$ ul');
                expect(ul).to.not.null;
                expect(ul).to.be.instanceOf(win.HTMLUListElement);
        
                expect(
                    querySelector('#section$ .article$ > ul > li:nth-of-type(2)').textContent
                ).to.equal(
                    'List item 2'
                );

                expect(
                    querySelector('section$ article$ li:last-of-type').textContent
                ).to.equal(
                    'List item 3'
                );

                expect(
                    querySelector(doc.querySelector('section'), '$ article$ li')
                ).to.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelector('li')
                );

                expect(
                    querySelector('section$ li, section$ article$ li')
                ).to.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelector('li')
                );

                expect(
                    querySelector(doc.body, '$ article$ li')
                ).to.null;

                expect(
                    querySelector('section$ article$ li:nth-of-type(4)')
                ).to.null;
        
                expect(
                    querySelector('section$ article$ ul$ li')
                ).to.null;

                expect(
                    () => querySelector('section$ article$')
                ).to.throw(
                    'querySelector cannot be used with a selector ending in a shadowRoot'
                );

                expect(
                    () => querySelector('$ section$ article')
                ).to.throw(
                    'You can not select a shadowRoot ($) of the document'
                );

                expect(
                    () => querySelector(
                        doc.querySelector('section').shadowRoot,
                        '$ article'
                    )
                ).to.throw(
                    'You can not select a shadowRoot ($) of a shadowRoot'
                );

            });
    });

    it('deepQuerySelector tests', () => {
        cy.window()
            .then((win) => {

                const doc = win.document;
                const ShadowDomSelector = win.ShadowDomSelector;
                const { deepQuerySelector } = ShadowDomSelector;

                const ul = deepQuerySelector('ul');
                expect(ul).to.not.null;
                expect(ul).to.be.instanceOf(win.HTMLUListElement);
        
                expect(
                    deepQuerySelector('li:nth-of-type(2)').textContent
                ).to.equal(
                    'List item 2'
                );

                expect(
                    deepQuerySelector('li:last-of-type').textContent
                ).to.equal(
                    'List item 3'
                );

                expect(
                    deepQuerySelector(doc.querySelector('section'), 'li')
                ).to.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelector('li')
                );
        
                expect(
                    deepQuerySelector('article > li')
                ).to.null;

                expect(
                    deepQuerySelector(
                        doc.querySelector('section'),
                        'article > li'
                    )
                ).to.null;

            });
    });

    it('querySelectorAll tests', () => {
        cy.window()
            .then((win) => {

                const doc = win.document;
                const ShadowDomSelector = win.ShadowDomSelector;
                const { querySelectorAll } = ShadowDomSelector;

                expect(
                    querySelectorAll('section$ .article$ ul li')
                ).to.deep.equal(
                    doc.querySelector('section').shadowRoot.querySelector('.article').shadowRoot.querySelectorAll('ul li')
                );

                expect(
                    querySelectorAll(doc.querySelector('section'), '$ article$ li')
                ).to.deep.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelectorAll('li')
                );

                expect(
                    querySelectorAll('section$ li, section$ article$ li')
                ).to.deep.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelectorAll('li')
                );

                expect(
                    querySelectorAll('section$ .article$ ul$ li').length
                ).to.equal(0);

                expect(
                    () => querySelectorAll('section$ article$ ul$')
                ).to.throw(
                    'querySelectorAll cannot be used with a selector ending in a shadowRoot'
                );

                expect(
                    () => querySelectorAll('$ section$ article$ ul')
                ).to.throw(
                    'You can not select a shadowRoot ($) of the document'
                );

                expect(
                    () => querySelectorAll(
                        doc.querySelector('section').shadowRoot,
                        '$ article'
                    )
                ).to.throw(
                    'You can not select a shadowRoot ($) of a shadowRoot'
                );

            });
    });

    it('deepQuerySelectorAll tests', () => {
        cy.window()
            .then((win) => {

                const doc = win.document;
                const ShadowDomSelector = win.ShadowDomSelector;
                const { deepQuerySelectorAll } = ShadowDomSelector;

                expect(
                    deepQuerySelectorAll('ul li')
                ).to.deep.equal(
                    doc.querySelector('section').shadowRoot.querySelector('.article').shadowRoot.querySelectorAll('ul li')
                );

                expect(
                    deepQuerySelectorAll(doc.querySelector('section'), 'li')
                ).to.deep.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelectorAll('li')
                );

                expect(
                    deepQuerySelectorAll('article > li').length
                ).to.equal(0);

            });
    });

    it('shadowRootQuerySelector tests', () => {
        cy.window()
            .then((win) => {

                const doc = win.document;
                const ShadowDomSelector = win.ShadowDomSelector;
                const { shadowRootQuerySelector } = ShadowDomSelector;

                expect(
                    shadowRootQuerySelector('section$')
                ).to.equal(
                    doc.querySelector('section').shadowRoot
                );

                expect(
                    shadowRootQuerySelector('section$ .article$')
                ).to.equal(
                    doc.querySelector('section').shadowRoot.querySelector('.article').shadowRoot
                );

                expect(
                    shadowRootQuerySelector(doc.querySelector('section'), '$ article$')
                ).to.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot
                );

                expect(
                    shadowRootQuerySelector('section$ div$, section$ article$')
                ).to.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot
                );

                expect(
                    shadowRootQuerySelector(
                        doc.querySelector('section'),
                        '$'
                    )
                ).to.equal(
                    doc.querySelector('section').shadowRoot
                );

                expect(
                    shadowRootQuerySelector('section$ .article$ ul$')
                ).to.null;

                expect(
                    shadowRootQuerySelector('section$ .article$ h3$')
                ).to.null;

                expect(
                    () => shadowRootQuerySelector('section$ article$ ul li')
                ).to.throw(
                    'shadowRootQuerySelector must be used with a selector ending in a shadowRoot'
                );

                expect(
                    () => shadowRootQuerySelector('$ section$ article$')
                ).to.throw(
                    'You can not select a shadowRoot ($) of the document'
                );

                expect(
                    () => shadowRootQuerySelector('$')
                ).to.throw(
                    'You can not select a shadowRoot ($) of the document'
                );

                expect(
                    () => shadowRootQuerySelector(
                        doc.querySelector('section').shadowRoot,
                        '$'
                    )
                ).to.throw(
                    'You can not select a shadowRoot ($) of a shadowRoot'
                );

            });
    });

    it('asyncQuerySelector tests', () => {
        cy.window()
            .then(async (win) => {

                const doc = win.document;
                const ShadowDomSelector = win.ShadowDomSelector;
                const { asyncQuerySelector } = ShadowDomSelector;

                expect(
                    await asyncQuerySelector('section')
                ).to.equal(
                    doc.querySelector('section')
                );

                expect(
                    await asyncQuerySelector('#section$ .article')
                ).to.equal(
                    doc.querySelector('#section').shadowRoot.querySelector('.article')
                );

                expect(
                    (await asyncQuerySelector('#section$ .article$ > ul > li:nth-of-type(3)')).textContent
                ).to.equal(
                    'List item 3'
                );

                expect(
                    (await asyncQuerySelector('#section$ .article$ > .delayed-list-container$ ul > li:nth-of-type(2)', { retries: 50, delay: 50 })).textContent
                ).to.equal(
                    'Delayed List item 2'
                );

                expect(
                    await asyncQuerySelector('section$ div, section$ article$ li:nth-of-type(2)')
                ).to.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelector('li:nth-of-type(2)')
                );

                expect(
                    await asyncQuerySelector(
                        doc.querySelector('section'),
                        '$ article$ li:nth-of-type(2)'
                    )
                ).to.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelector('li:nth-of-type(2)')
                );

                expect(
                    await asyncQuerySelector(
                        doc.querySelector('section'),
                        '$ article$ li:nth-of-type(3)',
                        { retries: 5 }
                    )
                ).to.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelector('li:nth-of-type(3)')
                );

                expect(
                    await asyncQuerySelector(
                        doc.querySelector('section'),
                        '$ article$ li',
                        { delay: 10 }
                    )
                ).to.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelector('li')
                );

                expect(
                    await asyncQuerySelector(
                        'section$ article$ ul > li',
                        { retries: 10 }
                    )
                ).to.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelector('ul > li')
                );

                expect(
                    await asyncQuerySelector(
                        'section$ article$ li:nth-of-type(2)',
                        { delay: 1 }
                    )
                ).to.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelector('li:nth-of-type(2)')
                );

                expect(
                    await asyncQuerySelector(doc.body, '$ article$ li')
                ).to.null;

                expect(
                    await asyncQuerySelector('#section$ .article$ > ul$ li')
                ).to.null;

                cy.wrap(null).then(() => {
                    return asyncQuerySelector('section$ article$')
                        .catch((error: Error) => {
                            expect(error.message).to.contain('asyncQuerySelector cannot be used with a selector ending in a shadowRoot');
                        });
                });

                cy.wrap(null).then(() => {
                    return asyncQuerySelector('$ section$ article')
                        .catch((error: Error) => {
                            expect(error.message).to.contain('You can not select a shadowRoot ($) of the document');
                        });
                });

                cy.wrap(null).then(() => {
                    return asyncQuerySelector(
                        doc.querySelector('section').shadowRoot,
                        '$ article'
                    )
                        .catch((error: Error) => {
                            expect(error.message).to.contain('You can not select a shadowRoot ($) of a shadowRoot');
                        });
                });

            });
    });

    it('asyncDeepQuerySelector tests', () => {
        cy.window()
            .then(async (win) => {

                const doc = win.document;
                const ShadowDomSelector = win.ShadowDomSelector;
                const { asyncDeepQuerySelector } = ShadowDomSelector;

                expect(
                    await asyncDeepQuerySelector('section')
                ).to.equal(
                    doc.querySelector('section')
                );

                expect(
                    await asyncDeepQuerySelector('.article')
                ).to.equal(
                    doc.querySelector('#section').shadowRoot.querySelector('.article')
                );

                expect(
                    (await asyncDeepQuerySelector('li:nth-of-type(3)')).textContent
                ).to.equal(
                    'List item 3'
                );

                expect(
                    (await asyncDeepQuerySelector('li.delayed-li:nth-of-type(2)', { retries: 50, delay: 50 })).textContent
                ).to.equal(
                    'Delayed List item 2'
                );

                expect(
                    await asyncDeepQuerySelector('section > ul')
                ).to.null;

                expect(
                    await asyncDeepQuerySelector(doc.body, 'article > li')
                ).to.null;

                expect(
                    await asyncDeepQuerySelector(doc.body, 'section > article', { retries: 2, delay: 5 })
                ).to.null;

            });
    });

    it('asyncQuerySelectorAll tests', () => {
        cy.window()
            .then(async (win) => {

                const doc = win.document;
                const ShadowDomSelector = win.ShadowDomSelector;
                const { asyncQuerySelectorAll } = ShadowDomSelector;

                expect(
                    await asyncQuerySelectorAll('section')
                ).to.deep.equal(
                    doc.querySelectorAll('section')
                );

                expect(
                    await asyncQuerySelectorAll('#section$ .article')
                ).to.deep.equal(
                    doc.querySelector('#section').shadowRoot.querySelectorAll('.article')
                );

                expect(
                    await asyncQuerySelectorAll('#section$ div li, #section$ .article$ li')
                ).to.deep.equal(
                    doc.querySelector('#section').shadowRoot.querySelector('.article').shadowRoot.querySelectorAll('li')
                );

                cy.wrap(null).then(() => {
                    return asyncQuerySelectorAll('#section$ .article$ > ul > li')
                        .then(lists => {
                            expect(lists.length).to.equal(3);
                            expect(lists[1].textContent).to.equal('List item 2');
                        });
                });

                cy.wrap(null).then(() => {
                    return asyncQuerySelectorAll('#section$ .article$ > .delayed-list-container$ ul > li', { retries: 50, delay: 50 })
                        .then(lists => {
                            expect(lists.length).to.equal(3);
                            expect(lists[1].textContent).to.equal('Delayed List item 2');
                        });
                });

                expect(
                    await asyncQuerySelectorAll(
                        doc.querySelector('section'),
                        '$ article$ li'
                    )
                ).to.deep.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelectorAll('li')
                );

                expect(
                    await asyncQuerySelectorAll(
                        doc.querySelector('section'),
                        '$ article$ li',
                        { retries: 5 }
                    )
                ).to.deep.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelectorAll('li')
                );

                expect(
                    await asyncQuerySelectorAll(
                        doc.querySelector('section'),
                        '$ article$ li',
                        { delay: 10 }
                    )
                ).to.deep.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelectorAll('li')
                );

                expect(
                    await asyncQuerySelectorAll(
                        'section$ article$ ul > li',
                        { retries: 10 }
                    )
                ).to.deep.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelectorAll('ul > li')
                );

                expect(
                    await asyncQuerySelectorAll(
                        'section$ article$ li',
                        { delay: 1 }
                    )
                ).to.deep.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelectorAll('li')
                );

                expect(
                    (await asyncQuerySelectorAll('section$ div$ span')).length
                ).to.equal(0);

                cy.wrap(null).then(() => {
                    return asyncQuerySelectorAll('#section$ .article$ > .delayed-list-container$ ul$ li')
                        .then(ul => {
                            expect(ul.length).to.equal(0);
                        });
                });

                cy.wrap(null).then(() => {
                    return asyncQuerySelectorAll('div.container ul')
                        .then(ul => {
                            expect(ul.length).to.equal(0);
                        });
                });

                cy.wrap(null).then(() => {
                    return asyncQuerySelectorAll('section$ article$')
                        .catch((error: Error) => {
                            expect(error.message).to.contain('asyncQuerySelectorAll cannot be used with a selector ending in a shadowRoot');
                        });
                });

                cy.wrap(null).then(() => {
                    return asyncQuerySelectorAll('$ section$ article li')
                        .catch((error: Error) => {
                            expect(error.message).to.contain('You can not select a shadowRoot ($) of the document');
                        });
                });

                cy.wrap(null).then(() => {
                    return asyncQuerySelectorAll(
                        doc.querySelector('section').shadowRoot,
                        '$ article'
                    )
                        .catch((error: Error) => {
                            expect(error.message).to.contain('You can not select a shadowRoot ($) of a shadowRoot');
                        });
                });

            });
    });

    it('asyncDeepQuerySelectorAll tests', () => {
        cy.window()
            .then(async (win) => {

                const doc = win.document;
                const ShadowDomSelector = win.ShadowDomSelector;
                const { asyncDeepQuerySelectorAll } = ShadowDomSelector;

                expect(
                    await asyncDeepQuerySelectorAll('.article')
                ).to.deep.equal(
                    doc.querySelector('#section').shadowRoot.querySelectorAll('.article')
                );

                expect(
                    await asyncDeepQuerySelectorAll('li')
                ).to.deep.equal(
                    doc.querySelector('#section').shadowRoot.querySelector('.article').shadowRoot.querySelectorAll('li')
                );

                cy.wrap(null).then(() => {
                    return asyncDeepQuerySelectorAll('li.delayed-li', { retries: 50, delay: 50 })
                        .then(lists => {
                            expect(lists.length).to.equal(3);
                            expect(lists[1].textContent).to.equal('Delayed List item 2');
                        });
                });

                expect(
                    await asyncDeepQuerySelectorAll(
                        doc.querySelector('section'),
                        'li'
                    )
                ).to.deep.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelectorAll('li')
                );

                expect(
                    await asyncDeepQuerySelectorAll(
                        doc.querySelector('section'),
                        'li',
                        { retries: 5 }
                    )
                ).to.deep.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelectorAll('li')
                );

                expect(
                    await asyncDeepQuerySelectorAll(
                        doc.querySelector('section'),
                        'li',
                        { delay: 10 }
                    )
                ).to.deep.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelectorAll('li')
                );

                expect(
                    await asyncDeepQuerySelectorAll(
                        'li',
                        { retries: 10 }
                    )
                ).to.deep.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelectorAll('ul > li')
                );

                expect(
                    await asyncDeepQuerySelectorAll(
                        'li',
                        { delay: 1 }
                    )
                ).to.deep.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelectorAll('li')
                );

                expect(
                    (await asyncDeepQuerySelectorAll('span')).length
                ).to.equal(0);

                cy.wrap(null).then(() => {
                    return asyncDeepQuerySelectorAll('article li')
                        .then(ul => {
                            expect(ul.length).to.equal(0);
                        });
                });

            });
    });

    it('asyncShadowRootQuerySelector tests', () => {
        cy.window()
            .then(async (win) => {

                const doc = win.document;
                const ShadowDomSelector = win.ShadowDomSelector;
                const { asyncShadowRootQuerySelector } = ShadowDomSelector;

                expect(
                    await asyncShadowRootQuerySelector('section$')
                ).to.equal(
                    doc.querySelector('section').shadowRoot
                );

                expect(
                    await asyncShadowRootQuerySelector('#section$ .article$')
                ).to.deep.equal(
                    doc.querySelector('#section').shadowRoot.querySelector('.article').shadowRoot
                );

                expect(
                    await asyncShadowRootQuerySelector('#section$ div$, #section$ .article$')
                ).to.deep.equal(
                    doc.querySelector('#section').shadowRoot.querySelector('.article').shadowRoot
                );

                cy.wrap(null).then(() => {
                    return asyncShadowRootQuerySelector('#section$ .article$ > .delayed-list-container$', { retries: 50, delay: 50 })
                        .then(shadowRoot => {
                            expect(shadowRoot).not.null;
                        });
                });

                expect(
                    await asyncShadowRootQuerySelector(
                        doc.querySelector('section'),
                        '$ article$'
                    )
                ).to.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot
                );

                expect(
                    await asyncShadowRootQuerySelector(
                        doc.querySelector('section'),
                        '$ article$',
                        { retries: 5 }
                    )
                ).to.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot
                );

                expect(
                    await asyncShadowRootQuerySelector(
                        doc.querySelector('section'),
                        '$ article$',
                        { delay: 10 },
                    )
                ).to.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot
                );

                expect(
                    await asyncShadowRootQuerySelector(
                        'section$ article$',
                        { retries: 10 }
                    )
                ).to.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot
                );

                expect(
                    await asyncShadowRootQuerySelector(
                        'section$ article$',
                        { delay: 1 }
                    )
                ).to.equal(
                    doc.querySelector('section').shadowRoot.querySelector('article').shadowRoot
                );

                expect(
                    await asyncShadowRootQuerySelector(
                        doc.querySelector('section'),
                        '$'
                    )
                ).to.equal(
                    doc.querySelector('section').shadowRoot
                );

                expect(
                    await asyncShadowRootQuerySelector('#section$ div$', { retries: 1, delay: 0 })
                ).to.null;

                cy.wrap(null).then(() => {
                    return asyncShadowRootQuerySelector('#section$ .article$ > .empty-div$', { retries: 10, delay: 5 })
                        .then(shadowRoot => {
                            expect(shadowRoot).null;
                        });
                });

                cy.wrap(null).then(() => {
                    return asyncShadowRootQuerySelector('section$ article$ > .delayed-list-container$ ul > li')
                        .catch((error: Error) => {
                            expect(error.message).to.contain('asyncShadowRootQuerySelector must be used with a selector ending in a shadowRoot');
                        });
                });

                cy.wrap(null).then(() => {
                    return asyncShadowRootQuerySelector('$ section$ article$')
                        .catch((error: Error) => {
                            expect(error.message).to.contain('You can not select a shadowRoot ($) of the document');
                        });
                });

                cy.wrap(null).then(() => {
                    return asyncShadowRootQuerySelector('$')
                        .catch((error: Error) => {
                            expect(error.message).to.contain('You can not select a shadowRoot ($) of the document');
                        });
                });

                cy.wrap(null).then(() => {
                    return asyncShadowRootQuerySelector(
                        doc.querySelector('section').shadowRoot,
                        '$'
                    )
                        .catch((error: Error) => {
                            expect(error.message).to.contain('You can not select a shadowRoot ($) of a shadowRoot');
                        });
                });

            });
    });

});