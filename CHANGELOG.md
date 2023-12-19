# Changelog

## [4.1.1] - 2023-12-19

- Publish the package using npm provenance

## [4.1.0] - 2023-12-16

- Refactor the whole library to reduce repetitive and unnecessary code
- All the methods admit at the moment a `shadowRoot` as a root element

## [4.0.0] - 2023-12-15

- Implement a `deepQuerySelector` method to query for elements even if they are deep in the shadowDOM tree
- Implement a `deepQuerySelectorAll` method to perform a querySelectorAll even if the elements are deep in the shadowDOM tree
- Implement an `asyncDeepQuerySelector` method to query in an async way for elements even if they are deep in the shadowDOM tree
- Implement an `asyncDeepQuerySelectorAll` method to perform an asynchronous querySelectorAll even if the elements are deep in the shadowDOM tree
- Implement a `deepQuery` method in the `AsyncSelector` class to query for elements even if they are deep in the shadowDOM tree

## [3.0.1] - 2023-12-13

- Removed private class properties to make the code ES5 compliant

## [3.0.0] - 2023-12-05

- Refactor the `buildAsyncSelector` from a function to a class (`AsyncSelector`)
- Dot notation queries have changed to make them more type safe

## [2.0.4] - 2023-12-04

- Fix a bug in `buildAsyncSelector`, if a Promise was sent, `document` was used

## [2.0.3] - 2023-12-04

- Allow `buildAsyncSelector` method to receive a Promise

## [2.0.2] - 2023-12-04

- `AsyncSelector` has been renamed to `buildAsyncSelector`

## [2.0.1] - 2023-12-04

- Export `AsyncParams` and `AsyncSelectorProxy`

## [2.0.0] - 2023-12-03

- Implement query selection through dot notation

## [1.0.2] - 2023-11-15

- Fix a bug selecting a shadowRoot from an element

## [1.0.0] - 2023-11-14

- Release of `shadow-dom-selector`