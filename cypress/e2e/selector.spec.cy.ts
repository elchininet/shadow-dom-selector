describe('ShadowDomSelector Selector class spec', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('If no shadowRoot traverse, queries should behave as the native ones', () => {
    cy.window()
      .then(async (win) => {

        const doc = win.document;
        const Selector = win.ShadowDomSelector.Selector;

        const selector = Selector({
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
        const Selector = win.ShadowDomSelector.Selector;

        const selector = Selector();

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
        const Selector = win.ShadowDomSelector.Selector;

        const article = doc
          .querySelector('section')
          .shadowRoot
          .querySelector('article');

        const selector = Selector(article);

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

        const Selector = win.ShadowDomSelector.Selector;

        const selector = Selector({
          retries: 100
        });

        expect(
          await selector['#section'].$['.article'].$['.delayed-list-container'].$.ul['li:nth-of-type(2)'].element
        ).to.text('Delayed List item 2');

        expect(
          (await selector.section.$.article.$['.delayed-list-container'].$['ul > li'].all).length
        ).to.equal(3);

      });

  });

  it('Inherited params', () => {

    cy.window()
      .then(async (win) => {

        const Selector = win.ShadowDomSelector.Selector;

        const selector = Selector({
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

  it('Should throw errors', () => {

    cy.window()
      .then(async (win) => {

        const doc = win.document;
        const Selector = win.ShadowDomSelector.Selector;

        const selector = Selector({
          delay: 5
        });

        const selectorFromSection = Selector(
          doc.querySelector('section').shadowRoot,
          {
            delay: 5
          }
        );

        cy.wrap(null).then(async () => {
          return selector.section.$.$.element
            .catch((error: Error) => {
              expect(error.message).to.equal('Cannot query a shadowRoot of a shadowRoot');
            });
        });

        cy.wrap(null).then(async () => {
          return selectorFromSection.$.element
            .catch((error: Error) => {
              expect(error.message).to.equal('Cannot query a shadowRoot of a shadowRoot');
            });
        });

        cy.wrap(null).then(async () => {
          return selector.all
            .catch((error: Error) => {
              expect(error.message).to.equal('Cannot call "all" method in the starting element');
            });
        });

      });

  });

});