describe('DomSubtreeSelector spec', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('If no shadowRoot traverse, methods should behave as the native ones', () => {
    cy.window()
      .then(async (win) => {

        const document = win.document;
        const DomSubtreeSelector = win.DomSubtreeSelector;
        const selector = new DomSubtreeSelector({ retries: 1, retriesDelay: 0 });

        const section = document.querySelector('section');
        const allSections = document.querySelectorAll('section');

        expect(selector.querySelector('section')).to.equal(section);
        expect(selector.querySelectorAll('section')).to.deep.equal(allSections);
        expect(selector.querySelector('li')).to.null;
        expect(selector.querySelectorAll('li').length).to.equal(0);
        expect(selector.querySelectorAll('li')).to.be.instanceOf(win.NodeList);

        const sectionPromised = await selector.promisableQuerySelector('section');
        const sectionAllPromised = await selector.promisableQuerySelectorAll('section');

        expect(sectionPromised).to.equal(section);
        expect(sectionAllPromised).to.deep.equal(allSections);

        const listPromised = await selector.promisableQuerySelector('li');
        const allListsPromised = await selector.promisableQuerySelectorAll('li');

        expect(listPromised).to.null;
        expect(allListsPromised.length).to.equal(0);
        expect(allListsPromised).to.be.instanceOf(win.NodeList);

      });
  });

  it('querySelector tests', () => {
    cy.window()
      .then((win) => {

        const DomSubtreeSelector = win.DomSubtreeSelector;
        const selector = new DomSubtreeSelector();

        const ul = selector.querySelector('#section$ article$ ul');
        expect(ul).to.not.null;
        expect(ul).to.be.instanceOf(win.HTMLUListElement);
        
        expect(
          selector.querySelector('#section$ .article$ > ul > li:nth-of-type(2)').textContent
        ).to.equal(
          'List item 2'
        );

        expect(
          selector.querySelector('section$ article$ li:last-of-type').textContent
        ).to.equal(
          'List item 3'
        );

        expect(
          () => selector.querySelector('section$ article$')
        ).to.throw(
          'querySelector cannot be used with a selector ending in a shadowRoot'
        );

      });
  });

  it('querySelectorAll tests', () => {
    cy.window()
      .then((win) => {

        const document = win.document;
        const DomSubtreeSelector = win.DomSubtreeSelector;
        const selector = new DomSubtreeSelector();

        expect(
          selector.querySelectorAll('section$ .article$ ul li')
        ).to.deep.equal(
          document.querySelector('section').shadowRoot.querySelector('.article').shadowRoot.querySelectorAll('ul li')
        );

        expect(
          () => selector.querySelectorAll('section$ article$ ul$')
        ).to.throw(
          'querySelectorAll cannot be used with a selector ending in a shadowRoot'
        );

      });
  });

  it('queryShadowRootSelector tests', () => {
    cy.window()
      .then((win) => {

        const document = win.document;
        const DomSubtreeSelector = win.DomSubtreeSelector;
        const selector = new DomSubtreeSelector();

        expect(
          selector.queryShadowRootSelector('section$')
        ).to.equal(
          document.querySelector('section').shadowRoot
        );

        expect(
          selector.queryShadowRootSelector('section$ .article$')
        ).to.equal(
          document.querySelector('section').shadowRoot.querySelector('.article').shadowRoot
        );

        expect(
          () => selector.queryShadowRootSelector('section$ article$ ul li')
        ).to.throw(
          'queryShadowRootSelector must be used with a selector ending in a shadowRoot'
        );

      });
  });

  it('promisableQuerySelector tests', () => {
    cy.window()
      .then(async (win) => {

        const document = win.document;
        const DomSubtreeSelector = win.DomSubtreeSelector;
        const selector = new DomSubtreeSelector();

        expect(
          await selector.promisableQuerySelector('section')
        ).to.equal(
          document.querySelector('section')
        );

        expect(
          await selector.promisableQuerySelector('#section$ .article')
        ).to.equal(
          document.querySelector('#section').shadowRoot.querySelector('.article')
        );

        expect(
          (await selector.promisableQuerySelector('#section$ .article$ > ul > li:nth-of-type(3)')).textContent
        ).to.equal(
          'List item 3'
        );

        expect(
          (await selector.promisableQuerySelector('#section$ .article$ > .delayed-list-container$ ul > li:nth-of-type(2)')).textContent
        ).to.equal(
          'Delayed List item 2'
        );

        cy.wrap(null).then(() => {
          return selector.promisableQuerySelector('section$ article$')
            .catch((error: Error) => {
              expect(error.message).to.contain('promisableQuerySelector cannot be used with a selector ending in a shadowRoot')
            })
        });

      });
  });

  it('promisableQuerySelectorAll tests', () => {
    cy.window()
      .then(async (win) => {

        const document = win.document;
        const DomSubtreeSelector = win.DomSubtreeSelector;
        const selector = new DomSubtreeSelector();

        expect(
          await selector.promisableQuerySelectorAll('section')
        ).to.deep.equal(
          document.querySelectorAll('section')
        );

        expect(
          await selector.promisableQuerySelectorAll('#section$ .article')
        ).to.deep.equal(
          document.querySelector('#section').shadowRoot.querySelectorAll('.article')
        );

        cy.wrap(null).then(() => {
          return selector.promisableQuerySelectorAll('#section$ .article$ > ul > li')
            .then(lists => {
              expect(lists.length).to.equal(3);
              expect(lists[1].textContent).to.equal('List item 2');
            })
        });

        cy.wrap(null).then(() => {
          return selector.promisableQuerySelectorAll('#section$ .article$ > .delayed-list-container$ ul > li')
            .then(lists => {
              expect(lists.length).to.equal(3);
              expect(lists[1].textContent).to.equal('Delayed List item 2');
            })
        });

        cy.wrap(null).then(() => {
          return selector.promisableQuerySelectorAll('section$ article$')
            .catch((error: Error) => {
              expect(error.message).to.contain('promisableQuerySelectorAll cannot be used with a selector ending in a shadowRoot')
            })
        });

      });
  });

  it('promisableQueryShadowRootSelector tests', () => {
    cy.window()
      .then(async (win) => {

        const document = win.document;
        const DomSubtreeSelector = win.DomSubtreeSelector;
        const selector = new DomSubtreeSelector();

        expect(
          await selector.promisableQueryShadowRootSelector('section$')
        ).to.equal(
          document.querySelector('section').shadowRoot
        );

        expect(
          await selector.promisableQueryShadowRootSelector('#section$ .article$')
        ).to.deep.equal(
          document.querySelector('#section').shadowRoot.querySelector('.article').shadowRoot
        );

        cy.wrap(null).then(() => {
          return selector.promisableQueryShadowRootSelector('#section$ .article$ > .delayed-list-container$')
            .then(shadowRoot => {
              expect(shadowRoot).not.null;
            })
        });

        cy.wrap(null).then(() => {
          return selector.promisableQueryShadowRootSelector('section$ article$ > .delayed-list-container$ ul > li')
            .catch((error: Error) => {
              expect(error.message).to.contain('promisableQueryShadowRootSelector must be used with a selector ending in a shadowRoot')
            })
        });

      });
  });

});