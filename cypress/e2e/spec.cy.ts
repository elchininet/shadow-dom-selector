describe('ShadowDomSelector spec', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('If no shadowRoot traverse, methods should behave as the native ones', () => {
    cy.window()
      .then(async (win) => {

        const document = win.document;
        const ShadowDomSelector = win.ShadowDomSelector;
        const selector = new ShadowDomSelector({ retries: 1, retriesDelay: 0 });

        const section = document.querySelector('section');
        const allSections = document.querySelectorAll('section');

        expect(selector.querySelector('section')).to.equal(section);
        expect(selector.querySelectorAll('section')).to.deep.equal(allSections);
        expect(selector.querySelector('li')).to.null;
        expect(selector.querySelectorAll('li').length).to.equal(0);
        expect(selector.querySelectorAll('li')).to.be.instanceOf(win.NodeList);

        const sectionPromised = await selector.asyncQuerySelector('section');
        const sectionAllPromised = await selector.asyncQuerySelectorAll('section');

        expect(sectionPromised).to.equal(section);
        expect(sectionAllPromised).to.deep.equal(allSections);

        const listPromised = await selector.asyncQuerySelector('li');
        const allListsPromised = await selector.asyncQuerySelectorAll('li');

        expect(listPromised).to.null;
        expect(allListsPromised.length).to.equal(0);
        expect(allListsPromised).to.be.instanceOf(win.NodeList);

      });
  });

  it('querySelector tests', () => {
    cy.window()
      .then((win) => {

        const ShadowDomSelector = win.ShadowDomSelector;
        const selector = new ShadowDomSelector();

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
        const ShadowDomSelector = win.ShadowDomSelector;
        const selector = new ShadowDomSelector();

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
        const ShadowDomSelector = win.ShadowDomSelector;
        const selector = new ShadowDomSelector();

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

  it('asyncQuerySelector tests', () => {
    cy.window()
      .then(async (win) => {

        const document = win.document;
        const ShadowDomSelector = win.ShadowDomSelector;
        const selector = new ShadowDomSelector();

        expect(
          await selector.asyncQuerySelector('section')
        ).to.equal(
          document.querySelector('section')
        );

        expect(
          await selector.asyncQuerySelector('#section$ .article')
        ).to.equal(
          document.querySelector('#section').shadowRoot.querySelector('.article')
        );

        expect(
          (await selector.asyncQuerySelector('#section$ .article$ > ul > li:nth-of-type(3)')).textContent
        ).to.equal(
          'List item 3'
        );

        expect(
          (await selector.asyncQuerySelector('#section$ .article$ > .delayed-list-container$ ul > li:nth-of-type(2)')).textContent
        ).to.equal(
          'Delayed List item 2'
        );

        cy.wrap(null).then(() => {
          return selector.asyncQuerySelector('section$ article$')
            .catch((error: Error) => {
              expect(error.message).to.contain('asyncQuerySelector cannot be used with a selector ending in a shadowRoot')
            })
        });

      });
  });

  it('asyncQuerySelectorAll tests', () => {
    cy.window()
      .then(async (win) => {

        const document = win.document;
        const ShadowDomSelector = win.ShadowDomSelector;
        const selector = new ShadowDomSelector();

        expect(
          await selector.asyncQuerySelectorAll('section')
        ).to.deep.equal(
          document.querySelectorAll('section')
        );

        expect(
          await selector.asyncQuerySelectorAll('#section$ .article')
        ).to.deep.equal(
          document.querySelector('#section').shadowRoot.querySelectorAll('.article')
        );

        cy.wrap(null).then(() => {
          return selector.asyncQuerySelectorAll('#section$ .article$ > ul > li')
            .then(lists => {
              expect(lists.length).to.equal(3);
              expect(lists[1].textContent).to.equal('List item 2');
            })
        });

        cy.wrap(null).then(() => {
          return selector.asyncQuerySelectorAll('#section$ .article$ > .delayed-list-container$ ul > li')
            .then(lists => {
              expect(lists.length).to.equal(3);
              expect(lists[1].textContent).to.equal('Delayed List item 2');
            })
        });

        cy.wrap(null).then(() => {
          return selector.asyncQuerySelectorAll('section$ article$')
            .catch((error: Error) => {
              expect(error.message).to.contain('asyncQuerySelectorAll cannot be used with a selector ending in a shadowRoot')
            })
        });

      });
  });

  it('asyncQueryShadowRootSelector tests', () => {
    cy.window()
      .then(async (win) => {

        const document = win.document;
        const ShadowDomSelector = win.ShadowDomSelector;
        const selector = new ShadowDomSelector();

        expect(
          await selector.asyncQueryShadowRootSelector('section$')
        ).to.equal(
          document.querySelector('section').shadowRoot
        );

        expect(
          await selector.asyncQueryShadowRootSelector('#section$ .article$')
        ).to.deep.equal(
          document.querySelector('#section').shadowRoot.querySelector('.article').shadowRoot
        );

        cy.wrap(null).then(() => {
          return selector.asyncQueryShadowRootSelector('#section$ .article$ > .delayed-list-container$')
            .then(shadowRoot => {
              expect(shadowRoot).not.null;
            })
        });

        cy.wrap(null).then(() => {
          return selector.asyncQueryShadowRootSelector('section$ article$ > .delayed-list-container$ ul > li')
            .catch((error: Error) => {
              expect(error.message).to.contain('asyncQueryShadowRootSelector must be used with a selector ending in a shadowRoot')
            })
        });

      });
  });

});