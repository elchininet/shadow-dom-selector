describe('ShadowDomSelector spec', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('If no shadowRoot traverse, methods should behave as the native ones', () => {
    cy.window()
      .then(async (win) => {

        const document = win.document;
        const ShadowDomSelector = win.ShadowDomSelector;
        const {
          querySelector,
          querySelectorAll,
          asyncQuerySelector,
          asyncQuerySelectorAll
        } = ShadowDomSelector;

        const section = document.querySelector('section');
        const allSections = document.querySelectorAll('section');

        expect(querySelector('section')).to.equal(section);
        expect(querySelectorAll('section')).to.deep.equal(allSections);
        expect(querySelector('li')).to.null;
        expect(querySelectorAll('li').length).to.equal(0);
        expect(querySelectorAll('li')).to.be.instanceOf(win.NodeList);

        const sectionPromised = await asyncQuerySelector('section', document, 1, 0);
        const sectionAllPromised = await asyncQuerySelectorAll('section', document, 1, 0);

        expect(sectionPromised).to.equal(section);
        expect(sectionAllPromised).to.deep.equal(allSections);

        const listPromised = await asyncQuerySelector('li', document, 1, 0);
        const allListsPromised = await asyncQuerySelectorAll('li', document, 1, 0);

        expect(listPromised).to.null;
        expect(allListsPromised.length).to.equal(0);
        expect(allListsPromised).to.be.instanceOf(win.NodeList);

      });
  });

  it('querySelector tests', () => {
    cy.window()
      .then((win) => {

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
          () => querySelector('section$ article$')
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
        const { querySelectorAll } = ShadowDomSelector;

        expect(
          querySelectorAll('section$ .article$ ul li')
        ).to.deep.equal(
          document.querySelector('section').shadowRoot.querySelector('.article').shadowRoot.querySelectorAll('ul li')
        );

        expect(
          () => querySelectorAll('section$ article$ ul$')
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
        const { queryShadowRootSelector } = ShadowDomSelector;

        expect(
          queryShadowRootSelector('section$')
        ).to.equal(
          document.querySelector('section').shadowRoot
        );

        expect(
          queryShadowRootSelector('section$ .article$')
        ).to.equal(
          document.querySelector('section').shadowRoot.querySelector('.article').shadowRoot
        );

        expect(
          () => queryShadowRootSelector('section$ article$ ul li')
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
        const { asyncQuerySelector } = ShadowDomSelector;

        expect(
          await asyncQuerySelector('section')
        ).to.equal(
          document.querySelector('section')
        );

        expect(
          await asyncQuerySelector('#section$ .article')
        ).to.equal(
          document.querySelector('#section').shadowRoot.querySelector('.article')
        );

        expect(
          (await asyncQuerySelector('#section$ .article$ > ul > li:nth-of-type(3)')).textContent
        ).to.equal(
          'List item 3'
        );

        expect(
          (await asyncQuerySelector('#section$ .article$ > .delayed-list-container$ ul > li:nth-of-type(2)')).textContent
        ).to.equal(
          'Delayed List item 2'
        );

        cy.wrap(null).then(() => {
          return asyncQuerySelector('section$ article$')
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
        const { asyncQuerySelectorAll } = ShadowDomSelector;

        expect(
          await asyncQuerySelectorAll('section')
        ).to.deep.equal(
          document.querySelectorAll('section')
        );

        expect(
          await asyncQuerySelectorAll('#section$ .article')
        ).to.deep.equal(
          document.querySelector('#section').shadowRoot.querySelectorAll('.article')
        );

        cy.wrap(null).then(() => {
          return asyncQuerySelectorAll('#section$ .article$ > ul > li')
            .then(lists => {
              expect(lists.length).to.equal(3);
              expect(lists[1].textContent).to.equal('List item 2');
            })
        });

        cy.wrap(null).then(() => {
          return asyncQuerySelectorAll('#section$ .article$ > .delayed-list-container$ ul > li')
            .then(lists => {
              expect(lists.length).to.equal(3);
              expect(lists[1].textContent).to.equal('Delayed List item 2');
            })
        });

        cy.wrap(null).then(() => {
          return asyncQuerySelectorAll('section$ article$')
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
        const { asyncQueryShadowRootSelector } = ShadowDomSelector;

        expect(
          await asyncQueryShadowRootSelector('section$')
        ).to.equal(
          document.querySelector('section').shadowRoot
        );

        expect(
          await asyncQueryShadowRootSelector('#section$ .article$')
        ).to.deep.equal(
          document.querySelector('#section').shadowRoot.querySelector('.article').shadowRoot
        );

        cy.wrap(null).then(() => {
          return asyncQueryShadowRootSelector('#section$ .article$ > .delayed-list-container$')
            .then(shadowRoot => {
              expect(shadowRoot).not.null;
            })
        });

        cy.wrap(null).then(() => {
          return asyncQueryShadowRootSelector('section$ article$ > .delayed-list-container$ ul > li')
            .catch((error: Error) => {
              expect(error.message).to.contain('asyncQueryShadowRootSelector must be used with a selector ending in a shadowRoot')
            })
        });

      });
  });

});