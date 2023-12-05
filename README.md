# shadow-dom-selector

A very small JavaScript utility to query DOM elements through the [Shadow DOM] subtrees in a sync or an async way.

[![Deployment Status](https://github.com/elchininet/shadow-dom-selector/actions/workflows/deploy.yaml/badge.svg)](https://github.com/elchininet/shadow-dom-selector/actions/workflows/deploy.yaml) &nbsp; [![Coverage Status](https://coveralls.io/repos/github/elchininet/shadow-dom-selector/badge.svg?branch=master)](https://coveralls.io/github/elchininet/shadow-dom-selector?branch=master) &nbsp; [![npm version](https://badge.fury.io/js/shadow-dom-selector.svg)](https://badge.fury.io/js/shadow-dom-selector)

## Introduction

Having a DOM tree formed of Shadow DOM subtrees like the next one:

```html
<body>
  <section>
    #shadow-root (open)
      <h1>Title</h1>
      <article>
        #shadow-root (open)
          <h2>Subtitle</h2>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 1</li>
          </ul>
      </article>
  </section>
</body>
```
If one wants to query for the `li` elements, it is required to do this:

```javascript
const secondLi = document.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelector('ul > li');

const allLis = document.querySelector('section').shadowRoot.querySelector('article').shadowRoot.querySelectorAll('ul > li');

const shadow = document.querySelector('section').shadowRoot.querySelector('article').shadowRoot;
```

`shadow-dom-selector` allows you to do the same in the next way:

```javascript
// $ character at the end of a selector means to select its Shadom DOM

import { querySelector, querySelectorAll, shadowRootQuerySelector } from 'shadow-dom-selector';

const secondLi querySelector('section$ article$ ul > li');
const allLis querySelectorAll('section$ article$ ul > li');
const shadow = shadowRootQuerySelector('section$ article$');
```

It will traverse all the Shadow DOM subtrees removing all the hassle of writing long concatenated queries.

### It checks for the existence of elements

With the same previous DOM tree, if we do this:

```javascript
const element = document.querySelector('article').shadowRoot.querySelector('div').shadowRoot.querySelector('section > h1');
```

It will throw an error, because none of the elements in those queries exist. If you don‘t know if the elements exist or not, you will require to wrap all the code in conditions or use [optional chaining] if your target is `ES2015` or greater:

```javascript
// With conditions
const article = document.querySelector('article');
if (article) {
  const articleShadowRoot = article.shadowRoot;
  if (articleShadowRoot) {
    const div = articleShadowRoot.querySelector('div');
    if (div) {
      const shadow = div.shadowRoot;
      if (shadow) {
        const element = shadow.querySelector('section > h1');
        const elements = shadow.querySelectorAll('p');
      }
    }
  }
}

// With optional chaining in ES2015+
const shadow = document.querySelector('article')?.shadowRoot?.querySelector('div')?.shadowRoot;
const element = document.querySelector('article')?.shadowRoot?.querySelector('div')?.shadowRoot?.querySelector('section > h1');
const elements = document.querySelector('article')?.shadowRoot?.querySelector('div')?.shadowRoot?.querySelectorAll('p');
```

Which will return `undefined` if some element doesn‘t exist. With `shadow-dom-selector`, you just need to write the query and it will return the same that is returned by the native `querySelector` and `querySelectorAll` if the query cannot be satisfied.

```javascript
import { querySelector, querySelectorAll, shadowRootQuerySelector } from 'shadow-dom-selector';

const shadow = shadowRootQuerySelector('article$ div$'); // null
const element = querySelector('article$ div$ section > h1'); // null
const elements = querySelectorAll('article$ div$ p'); // empty NodeList
```

### Async queries

If the elements are not already rendered into the DOM in the moment that the query is made you will receive `null`. `shadow-dom-selector` allows you to wait for the elements to appear deciding how many times it will try to query for the element before giving up and returning `null` or an empty `NodeList`.

```javascript
// Using the async methods
import { asyncQuerySelector, asyncQuerySelectorAll, asyncShadowRootQuerySelector } from 'shadow-dom-selector';

asyncShadowRootQuerySelector('article$ div$')
  .then((shadowRoot) => {
      // Do stuff with the shadowRoot
      // If it is not found after all the retries, it will return null
  });

asyncQuerySelector('article$ div$ section > h1')
  .then((h1) => {
      // Do stuff with the h1 element
      // If it is not found after all the retries, it will return null
  });

asyncQuerySelectorAll('article$ div$ p')
  .then((paragraphs) => {
      // Do stuff with the paragraphs
      // If they are not found after all the retries, it will return an empty NodeList
  });

// Using async dot notation
import { AsyncSelector } from 'shadow-dom-selector';

const selector = new AsyncSelector();

selector.query('article').$.query('div').$.element
  .then((shadowRoot) => {
    // Do stuff with the shadowRoot
    // If it is not found after all the retries, it will return null
  });

selector.query('article').$.query('div').$.query('section > h1').element
  .then((h1) => {
    // Do stuff with the h1 element
    // If it is not found after all the retries, it will return null
  });

selector.query('article').$.query('div').$.query('p').all
  .then((paragraphs) => {
    // Do stuff with the paragraphs
    // If they are not found after all the retries, it will return an empty NodeList
  });
```

Either the async methods or the async dot notation allow you to to specify the amount of retries and the delay between each one of them. Consult the [API](#api) section for more details.

## Install

#### npm

```bash
npm install shadow-dom-selector
```

#### yarn

```bash
yarn add shadow-dom-selector
```

#### PNPM

```bash
pnpm add shadow-dom-selector
```

#### In the browser

It is possible to include a compiled version of the package directly in an HTML file. It will create a global `ShadowDomSelector` object containing all the exported functions that can be accessed from anywhere in your JavaScript code.

1. Copy the JavaScript file `index.js`, located in the root of the `dist/` folder
2. Put it in the folder that you prefer in your web server
3. Include it in your HTML file

```html
<script src="wherever/you/want/to/place/index.js"></script>
```

```javascript
/* There will be a global variable named ShadowDomSelector containing all the functions */
ShadowDomSelector.querySelector;
ShadowDomSelector.querySelectorAll;
ShadowDomSelector.shadowRootQuerySelector;
ShadowDomSelector.asyncQuerySelector;
ShadowDomSelector.asyncQuerySelectorAll;
ShadowDomSelector.asyncShadowRootQuerySelector;
ShadowDomSelector.AsyncSelector;
```

## API

#### querySelector

```typescript
querySelector(selectors): Element | null;
```

```typescript
querySelector(root, selectors): Element | null;
```

| Parameter    | Optional      | Description                                        |
| ------------ | ------------- | -------------------------------------------------- |
| `selectors`  | no            | A string containing one or more selectors to match. Selectors must end in a Shadow DOM (`$`) |
| `root`       | yes           | The element from where the query should be performed, it defaults to `document` |

#### querySelectorAll

```typescript
querySelectorAll(selectors): NodeListOf<Element>;
```

```typescript
querySelectorAll(root, selectors): NodeListOf<Element>;
```

| Parameter    | Optional      | Description                                        |
| ------------ | ------------- | -------------------------------------------------- |
| `selectors`  | no            | A string containing one or more selectors to match. Selectors must end in a Shadow DOM (`$`) |
| `root`       | yes           | The element from where the query should be performed, it defaults to `document` |

#### shadowRootQuerySelector

```typescript
shadowRootQuerySelector(selectors): ShadowRoot | null;
```

```typescript
shadowRootQuerySelector(root, selectors): ShadowRoot | null;
```

| Parameter    | Optional      | Description                                        |
| ------------ | ------------- | -------------------------------------------------- |
| `selectors`  | no            | A string containing one or more selectors to match. Selectors must end in a Shadow DOM (`$`) |
| `root`       | yes           | The element from where the query should be performed, it defaults to `document` |

#### asyncQuerySelector

```typescript
asyncQuerySelector(selectors): Promise<Element | null>;
```

```typescript
asyncQuerySelector(root, selectors): Promise<Element | null>;
```

```typescript
asyncQuerySelector(selectors, asyncParams): Promise<Element | null>;
```

```typescript
asyncQuerySelector(root, selectors, asyncParams): Promise<Element | null>;
```

| Parameter     | Optional      | Description                                        |
| ------------- | ------------- | -------------------------------------------------- |
| `selectors`   | no            | A string containing one or more selectors to match. Selectors must end in a Shadow DOM (`$`) |
| `root`        | yes           | The element from where the query should be performed, it defaults to `document` |
| `asyncParams` | yes           | An object containing the parameters which control the retries |

```typescript
// asyncParams properties
{
  retries?: number; // how many retries before giving up (defaults to 10)
  delay?: number; // delay between each retry (defaults to 10)
}
```

#### asyncQuerySelectorAll

```typescript
asyncQuerySelectorAll(selectors): Promise<NodeListOf<Element>>;
```

```typescript
asyncQuerySelectorAll(root, selectors): Promise<NodeListOf<Element>>;
```

```typescript
asyncQuerySelectorAll(selectors, asyncParams): Promise<NodeListOf<Element>>;
```

```typescript
asyncQuerySelectorAll(root, selectors, asyncParams): Promise<NodeListOf<Element>>;
```

| Parameter     | Optional      | Description                                        |
| ------------- | ------------- | -------------------------------------------------- |
| `selectors`   | no            | A string containing one or more selectors to match. Selectors must end in a Shadow DOM (`$`) |
| `root`        | yes           | The element from where the query should be performed, it defaults to `document` |
| `asyncParams` | yes           | An object containing the parameters which control the retries |

```typescript
// asyncParams properties
{
  retries?: number; // how many retries before giving up (defaults to 10)
  delay?: number; // delay between each retry (defaults to 10)
}
```

#### asyncShadowRootQuerySelector

```typescript
asyncShadowRootQuerySelector(selectors): Promise<ShadowRoot | null>;
```

```typescript
asyncShadowRootQuerySelector(root, selectors): Promise<ShadowRoot | null>;
```

```typescript
asyncShadowRootQuerySelector(selectors, asyncParams): Promise<ShadowRoot | null>;
```

```typescript
asyncShadowRootQuerySelector(root, selectors, asyncParams): Promise<ShadowRoot | null>;
```

| Parameter     | Optional      | Description                                        |
| ------------- | ------------- | -------------------------------------------------- |
| `selectors`   | no            | A string containing one or more selectors to match. Selectors must end in a Shadow DOM (`$`) |
| `root`        | yes           | The element from where the query should be performed, it defaults to `document` |
| `asyncParams` | yes           | An object containing the parameters which control the retries |

```typescript
// asyncParams properties
{
  retries?: number; // how many retries before giving up (defaults to 10)
  delay?: number; // delay between each retry (defaults to 10)
}
```

#### AsyncSelector class

```typescript
new AsyncSelector();
```

```typescript
new AsyncSelector(root);
```

```typescript
new AsyncSelector(root, asyncParams);
```

| Parameter     | Optional      | Description                                        |
| ------------- | ------------- | -------------------------------------------------- |
| `root`        | yes           | The element or shadowRoot from where the query should be performed, it defaults to `document` |
| `asyncParams` | yes           | An object containing the parameters which control the retries |

```typescript
// asyncParams properties
{
  retries?: number; // how many retries before giving up (defaults to 10)
  delay?: number; // delay between each retry (defaults to 10)
}
```

The instances of this class have the next properties:

| Property         | Type                                     | Description                                                      |
| ---------------- | ---------------------------------------- | ---------------------------------------------------------------- |
| `element`        | `Promise<Element \| ShadowRoot \| null>` | A promise that resolves in the queried element                   |
| `all`            | `Promise<NodeListOf<Element>>`           | A promise that resolves in a Nodelist with all queried elements  |
| `$`              | `Promise<ShadowRoot \| null>`            | A promise that resolves in the shadowRoot of the queried element |
| `asyncParams`    | Same `asyncParams` previously shown      | An object containing the parameters which control the retries    |

And the next methods:

| Method                    | Return                     | Description                                                      |
| ------------------------- | -------------------------- | ---------------------------------------------------------------- |
| `eq(index: number)`       | `Promise<Element \| null>` | Returns a promise that resolves in the element in the index position of the queried elements (startig from `0`) |
| `query(selector: string)` | `AsyncSelector`            | Performs a query and returns a new AsyncSelector instance |

##### Examples of the AsyncSelector class

```typescript
const selector = new AsyncSelector(); // Starting to query in the document with the default asyncParams
await selector.element === document;
await selector.all; // Empty Node list
await selector.$; // null
await selector.eq(0); // null
```

```typescript
const selector = AsyncSelector({
  retries: 100,
  delay: 50
}); // Starting to query in the document with custom asyncParams
await selector.query('section').$.element === document.querySelector('section').shadowRoot;
await selector.query('section').$.all; // Empty Node list
await selector.query('section').$.query('article').all === document.querySelector('section').shadowRoot.querySelectorAll('article');
await selector.query('section').$.query('ul li').eq(1) === document.querySelector('section').shadowRoot.querySelectorAll('ul li')[1];
selector.query('section').$.query('article').asyncParams; // { retries: 100, delay: 50 }
```

[Shadow DOM]: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM
[optional chaining]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining