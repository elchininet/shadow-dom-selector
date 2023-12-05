describe('ShadowDomSelector AsyncSelector class spec', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000');
    });

    it('If no shadowRoot traverse, queries should behave as the native ones', () => {
        cy.window()
            .then(async (win) => {

                const doc = win.document;
                const AsyncSelector = win.ShadowDomSelector.AsyncSelector;

                const selector = new AsyncSelector({
                    retries: 1,
                    delay: 5
                });

                const section = doc.querySelector('section');
                const allSections = doc.querySelectorAll('section');

                expect(await selector.query('section').element).to.equal(section);
                expect(await selector.query('section').all).to.deep.equal(allSections);
                expect(await selector.query('li').element).to.null;
                expect(await selector.query('article').$.element).to.null;
                expect((await selector.query('li').all).length).to.equal(0);
                expect((await selector.query('article').$.query('div').$.query('span').all).length).to.equal(0);
                expect(await selector.query('li').all).to.be.instanceOf(win.NodeList);

            });
    });

    it('Query for existent elements', () => {

        cy.window()
            .then(async (win) => {

                const doc = win.document;
                const AsyncSelector = win.ShadowDomSelector.AsyncSelector;

                const selector = new AsyncSelector();

                const article = doc
                    .querySelector('section')
                    .shadowRoot
                    .querySelector('article');

                const ul = article
                    .shadowRoot
                    .querySelector('ul');

                const allLis = ul.querySelectorAll('li');

                expect(
                    await selector.query('section').$.query('article').element
                ).to.equal(
                    article
                );

                expect(
                    await selector.query('#section').$.query('.article').element
                ).to.equal(
                    article
                );

                expect(
                    await selector.query('section').$.query('article').$.query('ul li').all
                ).to.deep.equal(
                    allLis
                );

            });

    });

    it('Query from an element', () => {

        cy.window()
            .then(async (win) => {

                const doc = win.document;
                const AsyncSelector = win.ShadowDomSelector.AsyncSelector;

                const article = doc
                    .querySelector('section')
                    .shadowRoot
                    .querySelector('article');

                const selector = new AsyncSelector(article);

                expect(await selector.element).to.equal(article);
        
                expect(
                    await selector.$.query('ul').element
                ).to.equal(
                    article.shadowRoot.querySelector('ul')
                );

            });

    });

    it('Query for delayed elements', () => {

        cy.window()
            .then(async (win) => {

                const doc = win.document;
                const AsyncSelector = win.ShadowDomSelector.AsyncSelector;

                const selector = new AsyncSelector({
                    retries: 100
                });

                const selectorFromDelayedSection = new AsyncSelector(
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
                    await selector.query('#section').$.query('.article').$.query('.delayed-list-container').$.query('ul li:nth-of-type(2)').element
                ).to.text('Delayed List item 2');

                expect(
                    await selector.query('#section').$.query('.article').$.query('.delayed-list-container').$.query('ul li').eq(1)
                ).to.text('Delayed List item 2');

                expect(
                    (await selector.query('section').$.query('article').$.query('.delayed-list-container').$.query('ul > li').all).length
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

                const AsyncSelector = win.ShadowDomSelector.AsyncSelector;

                const selector = new AsyncSelector({
                    retries: 7,
                    delay: 13
                });

                expect(
                    selector.query('section').$.asyncParams
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
                const AsyncSelector = win.ShadowDomSelector.AsyncSelector;

                const selector = new AsyncSelector({
                    delay: 5
                });

                const selectorFromSection = new AsyncSelector(
                    doc.querySelector('section').shadowRoot,
                    {
                        delay: 5
                    }
                );

                const selectorFromDelayedSection = new AsyncSelector(
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
                    await selector.query('article').element
                ).to.null;

                expect(
                    await selector.query('section').query('div').element
                ).to.null;

                expect(
                    await selector.$.element
                ).to.null;

                expect(
                    await selector.query('section').$.$.element
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

                expect(
                    await selector.eq(0)
                ).to.null;

                expect(
                    await selector.query('section').eq(10)
                ).to.null;

            });

    });

});