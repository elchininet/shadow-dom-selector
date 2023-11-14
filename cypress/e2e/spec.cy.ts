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
        const asyncParams = { retries: 1, delay: 0 };

        expect(querySelector('section')).to.equal(section);
        expect(querySelectorAll('section')).to.deep.equal(allSections);
        expect(querySelector('li')).to.null;
        expect(querySelectorAll('li').length).to.equal(0);
        expect(querySelectorAll('li')).to.be.instanceOf(win.NodeList);

        const sectionPromised = await asyncQuerySelector('section', asyncParams);
        const sectionAllPromised = await asyncQuerySelectorAll('section', asyncParams);

        expect(sectionPromised).to.equal(section);
        expect(sectionAllPromised).to.deep.equal(allSections);

        const listPromised = await asyncQuerySelector('li');
        const allListsPromised = await asyncQuerySelectorAll('li', asyncParams);

        expect(listPromised).to.null;
        expect(allListsPromised.length).to.equal(0);
        expect(allListsPromised).to.be.instanceOf(win.NodeList);

        expect(
          querySelector('p, a, section')
        ).to.equal(
          document.querySelector('p, a, section')
        );

      });
  });

  it('querySelector tests', () => {
    cy.window()
      .then((win) => {

        const document = win.document;
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
          querySelector(document.querySelector('section'), '$ article$ li')
        ).to.equal(
          document.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelector('li')
        );

        expect(
          querySelector(document.body, '$ article$ li')
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
          'You can not select a shadowRoot'
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
          querySelectorAll(document.querySelector('section'), '$ article$ li')
        ).to.deep.equal(
          document.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelectorAll('li')
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
          'You can not select a shadowRoot'
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
          queryShadowRootSelector(document.querySelector('section'), '$ article$')
        ).to.equal(
          document.querySelector('section').shadowRoot.querySelector('article').shadowRoot
        );

        expect(
          queryShadowRootSelector('section$ .article$ ul$')
        ).to.null;

        expect(
          queryShadowRootSelector('section$ .article$ h3$')
        ).to.null;

        expect(
          () => queryShadowRootSelector('section$ article$ ul li')
        ).to.throw(
          'queryShadowRootSelector must be used with a selector ending in a shadowRoot'
        );

        expect(
          () => queryShadowRootSelector('$ section$ article$')
        ).to.throw(
          'You can not select a shadowRoot'
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

        expect(
          await asyncQuerySelector(
            document.querySelector('section'),
            '$ article$ li:nth-of-type(2)'
          )
        ).to.equal(
          document.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelector('li:nth-of-type(2)')
        );

        expect(
          await asyncQuerySelector(
            document.querySelector('section'),
            '$ article$ li:nth-of-type(3)',
            { retries: 5 }
          )
        ).to.equal(
          document.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelector('li:nth-of-type(3)')
        );

        expect(
          await asyncQuerySelector(
            document.querySelector('section'),
            '$ article$ li',
            { delay: 10 }
          )
        ).to.equal(
          document.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelector('li')
        );

        expect(
          await asyncQuerySelector(
            'section$ article$ ul > li',
            { retries: 10 }
          )
        ).to.equal(
          document.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelector('ul > li')
        );

        expect(
          await asyncQuerySelector(
            'section$ article$ li:nth-of-type(2)',
            { delay: 1 }
          )
        ).to.equal(
          document.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelector('li:nth-of-type(2)')
        );

        expect(
          await asyncQuerySelector(document.body, '$ article$ li')
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
              expect(error.message).to.contain('You can not select a shadowRoot');
            });
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
            });
        });

        cy.wrap(null).then(() => {
          return asyncQuerySelectorAll('#section$ .article$ > .delayed-list-container$ ul > li')
            .then(lists => {
              expect(lists.length).to.equal(3);
              expect(lists[1].textContent).to.equal('Delayed List item 2');
            });
        });

        expect(
          await asyncQuerySelectorAll(
            document.querySelector('section'),
            '$ article$ li'
          )
        ).to.deep.equal(
          document.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelectorAll('li')
        );

        expect(
          await asyncQuerySelectorAll(
            document.querySelector('section'),
            '$ article$ li',
            { retries: 5 }
          )
        ).to.deep.equal(
          document.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelectorAll('li')
        );

        expect(
          await asyncQuerySelectorAll(
            document.querySelector('section'),
            '$ article$ li',
            { delay: 10 }
          )
        ).to.deep.equal(
          document.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelectorAll('li')
        );

        expect(
          await asyncQuerySelectorAll(
            'section$ article$ ul > li',
            { retries: 10 }
          )
        ).to.deep.equal(
          document.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelectorAll('ul > li')
        );

        expect(
          await asyncQuerySelectorAll(
            'section$ article$ li',
            { delay: 1 }
          )
        ).to.deep.equal(
          document.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelectorAll('li')
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
              expect(error.message).to.contain('You can not select a shadowRoot');
            });
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
            });
        });

        expect(
          await asyncQueryShadowRootSelector(
            document.querySelector('section'),
            '$ article$'
          )
        ).to.equal(
          document.querySelector('section').shadowRoot.querySelector('article').shadowRoot
        );

        expect(
          await asyncQueryShadowRootSelector(
            document.querySelector('section'),
            '$ article$',
            { retries: 5 }
          )
        ).to.equal(
          document.querySelector('section').shadowRoot.querySelector('article').shadowRoot
        );

        expect(
          await asyncQueryShadowRootSelector(
            document.querySelector('section'),
            '$ article$',
            { delay: 10 },
          )
        ).to.equal(
          document.querySelector('section').shadowRoot.querySelector('article').shadowRoot
        );

        expect(
          await asyncQueryShadowRootSelector(
            'section$ article$',
            { retries: 10 }
          )
        ).to.equal(
          document.querySelector('section').shadowRoot.querySelector('article').shadowRoot
        );

        expect(
          await asyncQueryShadowRootSelector(
            'section$ article$',
            { delay: 1 }
          )
        ).to.equal(
          document.querySelector('section').shadowRoot.querySelector('article').shadowRoot
        );

        expect(
          await asyncQueryShadowRootSelector('#section$ div$', { retries: 1, delay: 0 })
        ).to.null;

        cy.wrap(null).then(() => {
          return asyncQueryShadowRootSelector('#section$ .article$ > .empty-div$', { retries: 10, delay: 5 })
            .then(shadowRoot => {
              expect(shadowRoot).null;
            });
        });

        cy.wrap(null).then(() => {
          return asyncQueryShadowRootSelector('section$ article$ > .delayed-list-container$ ul > li')
            .catch((error: Error) => {
              expect(error.message).to.contain('asyncQueryShadowRootSelector must be used with a selector ending in a shadowRoot');
            });
        });

        cy.wrap(null).then(() => {
          return asyncQueryShadowRootSelector('$ section$ article$')
            .catch((error: Error) => {
              expect(error.message).to.contain('You can not select a shadowRoot');
            });
        });

      });
  });

});