# Comparison with Standard Vue

While `pocket-vue` shares the same template syntax and reactivity system as standard Vue, its purpose and implementation are fundamentally different. Understanding these differences is key to knowing when to use it.

## The Goal: Progressive Enhancement

`pocket-vue` is not intended to be a smaller replacement for Vue. It is specifically designed for **progressive enhancement**. This means it's optimized for "sprinkling" a small amount of interactivity onto existing HTML pages that are primarily rendered by a server framework (like Rails, Django, or Laravel).

## Implementation Differences

The key difference lies in how templates are handled.

### Standard Vue (without a build step)

When you use standard Vue by mounting it to in-DOM templates, the process is less than optimal for simple enhancements:

1.  **Compiler Overhead**: You must ship the full Vue template compiler to the browser, which adds around 13kb to your bundle size.
2.  **DOM to String**: The compiler has to retrieve the template as a string from the already-instantiated DOM.
3.  **Compilation**: The string is then compiled into a JavaScript render function.
4.  **Virtual DOM & Replacement**: Vue creates a virtual DOM from the render function and then replaces the existing DOM template with new DOM nodes.

This process is powerful and necessary for building complex Single-Page Applications (SPAs), but it's overkill for adding simple interactions.

### `pocket-vue`

`pocket-vue` avoids this overhead by taking a more direct approach, similar to Vue 1:

1.  **No Compiler**: There's no template compiler shipped to the browser.
2.  **Direct DOM Manipulation**: It walks the existing DOM and attaches fine-grained reactive effects directly to the elements. The DOM itself is the template.

This makes `pocket-vue` much more efficient and lightweight for its intended use case.

## Trade-offs

This direct-to-DOM approach comes with trade-offs:

-   **Platform Agnostic Rendering**: Because it's tightly coupled to the DOM, `pocket-vue` cannot be used for platform-agnostic rendering (e.g., native mobile).
-   **No Render Functions**: You lose the ability to work with render functions for advanced abstractions.
-   **No SSR**: JavaScript SSR is not possible.

However, these capabilities are rarely needed in the context of progressive enhancement, making `pocket-vue` the optimal tool for the job. If you find yourself needing these features, you should probably be using standard Vue with a build setup.