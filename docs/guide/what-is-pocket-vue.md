# What is pocket-vue?

`pocket-vue` is a fork of `petite-vue`, which is an alternative distribution of [Vue](https://vuejs.org) optimized for [progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement). It provides the same template syntax and reactivity mental model as standard Vue. However, it is specifically optimized for "sprinkling" a small amount of interactions on an existing HTML page rendered by a server framework.

- **Only ~9kb**: A tiny footprint for performance-critical applications.
- **Vue-Compatible**: Leverage your existing Vue knowledge.
- **DOM-based**: It mutates the DOM in place, which is highly efficient for its use case.
- **Reactivity**: Powered by `@vue/reactivity`.

## Our Goals

The original `petite-vue` is no longer actively maintained. This fork was created to continue its development, providing bug fixes, new features, and a clear path forward. While we aim to add new capabilities, our primary goal is to stay true to the original philosophy of being a small, fast, and easy-to-use tool for progressive enhancement.