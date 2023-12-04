describe('ShadowDomSelector buildAsyncSelector class spec', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    it('If no shadowRoot traverse, queries should behave as the native ones', () => {
        cy.window()
            .then(async (win) => {

                const doc = win.document;
                const buildAsyncSelector = win.ShadowDomSelector.buildAsyncSelector;

                const selector = buildAsyncSelector({
                    retries: 1,
                    delay: 5
                });

                const section = doc.querySelector('section');
                const allSections = doc.querySelectorAll('section');

                expect(await selector.section.element).to.equal(section);
                expect(await selector.section.all).to.deep.equal(allSections);
                expect(await selector.li.element).to.null;
                expect(await selector.article.$.element).to.null;
                expect((await selector.li.all).length).to.equal(0);
                expect((await selector.article.$.div.$.span.all).length).to.equal(0);
                expect(await selector.li.all).to.be.instanceOf(win.NodeList);

            });
    });

    it('Query for existent elements', () => {

        cy.window()
            .then(async (win) => {

                const doc = win.document;
                const buildAsyncSelector = win.ShadowDomSelector.buildAsyncSelector;

                const selector = buildAsyncSelector();

                const article = doc
                    .querySelector('section')
                    .shadowRoot
                    .querySelector('article');

                const ul = article
                    .shadowRoot
                    .querySelector('ul');

                const allLis = ul.querySelectorAll('li');

                expect(
                    await selector.section.$.article.element
                ).to.equal(
                    article
                );

                expect(
                    await selector['#section'].$['.article'].element
                ).to.equal(
                    article
                );

                expect(
                    await selector.section.$.article.$.ul.li.all
                ).to.deep.equal(
                    allLis
                );

            });

    });

    it('Query from an element', () => {

        cy.window()
            .then(async (win) => {

                const doc = win.document;
                const buildAsyncSelector = win.ShadowDomSelector.buildAsyncSelector;

                const article = doc
                    .querySelector('section')
                    .shadowRoot
                    .querySelector('article');

                const selector = buildAsyncSelector(article);

                expect(await selector.element).to.equal(article);
        
                expect(
                    await selector.$.ul.element
                ).to.equal(
                    article.shadowRoot.querySelector('ul')
                );

            });

    });

    it('Query for delayed elements', () => {

        cy.window()
            .then(async (win) => {

                const doc = win.document;
                const buildAsyncSelector = win.ShadowDomSelector.buildAsyncSelector;

                const selector = buildAsyncSelector({
                    retries: 100
                });

                const selectorFromDelayedSection = buildAsyncSelector(
                    new win.Promise<Element>((resolve) => {
                        setTimeout(() => {
                            resolve(
                                doc.querySelector('section')
                            );
                        }, 500);
                    }),
                    {
                        retries: 20,
                        delay: 50
                    }
                );

                expect(
                    await selector['#section'].$['.article'].$['.delayed-list-container'].$.ul['li:nth-of-type(2)'].element
                ).to.text('Delayed List item 2');

                expect(
                    (await selector.section.$.article.$['.delayed-list-container'].$['ul > li'].all).length
                ).to.equal(3);

                expect(
                    await selectorFromDelayedSection.element
                ).to.equal(
                    doc.querySelector('section')
                );

            });

    });

    it('Inherited params', () => {

        cy.window()
            .then(async (win) => {

                const buildAsyncSelector = win.ShadowDomSelector.buildAsyncSelector;

                const selector = buildAsyncSelector({
                    retries: 7,
                    delay: 13
                });

                expect(
                    selector.section.$.asyncParams
                ).to.deep.equal({
                    retries: 7,
                    delay: 13
                });

            });

    });

    it('Non existent elements', () => {

        cy.window()
            .then(async (win) => {

                const doc = win.document;
                const buildAsyncSelector = win.ShadowDomSelector.buildAsyncSelector;

                const selector = buildAsyncSelector({
                    delay: 5
                });

                const selectorFromSection = buildAsyncSelector(
                    doc.querySelector('section').shadowRoot,
                    {
                        delay: 5
                    }
                );

                const selectorFromDelayedSection = buildAsyncSelector(
                    new Promise<ShadowRoot>((resolve) => {
                        setTimeout(() => {
                            resolve(doc.querySelector('section').shadowRoot);
                        }, 500);
                    }),
                    {
                        retries: 20,
                        delay: 50
                    }
                );

                expect(
                    await selector.article.element
                ).to.null;

                expect(
                    await selector.$.element
                ).to.null;

                expect(
                    await selector.section.$.$.element
                ).to.null;

                expect(
                    await selectorFromSection.$.element
                ).to.null;

                expect(
                    await selectorFromDelayedSection.$.element
                ).to.null;

                expect(
                    (await selector.all).length
                ).to.equal(0);

            });

    });

});