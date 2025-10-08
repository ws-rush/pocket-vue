# Built-in Directives

This page provides a quick reference for all the built-in directives available in `pocket-vue`.

### `v-scope`

-   **Expects**: `Object`
-   **Details**: Marks an element and its children as a reactive scope controlled by `pocket-vue`. The object passed to it defines the state and methods for that scope.

### `v-effect`

-   **Expects**: `Expression`
-   **Details**: Executes a JavaScript expression and reactively re-runs it whenever its dependencies change.

### `v-bind`

-   **Shorthand**: `:`
-   **Expects**: `any`
-   **Details**: Dynamically binds one or more attributes. Handles `class` and `style` with special logic.

### `v-on`

-   **Shorthand**: `@`
-   **Expects**: `Function | Expression`
-   **Details**: Attaches an event listener to the element.

### `v-model`

-   **Expects**: `any`
-   **Details**: Creates a two-way binding on form inputs (`<input>`, `<select>`, `<textarea>`).

### `v-if` / `v-else` / `v-else-if`

-   **Expects**: `any`
-   **Details**: Conditionally renders an element based on the truthiness of an expression.

### `v-for`

-   **Expects**: `Array | Object | number | string`
-   **Details**: Renders an element or template block multiple times based on the source data.

### `v-show`

-   **Expects**: `any`
-   **Details**: Toggles the element's visibility by changing its `display` CSS property.

### `v-html`

-   **Expects**: `string`
-   **Details**: Updates the element's `innerHTML`. **Note**: This can be dangerous as it may lead to XSS attacks if the content is user-provided.

### `v-text`

-   **Expects**: `string`
-   **Details**: Updates the element's `textContent`.

### `v-pre`

-   **Details**: Skips compilation for this element and all its children.

### `v-once`

-   **Details**: Renders the element and component once. On subsequent re-renders, the element/component and all its children will be treated as static content and skipped.

### `v-cloak`

-   **Details**: Used to hide un-compiled templates until the `pocket-vue` instance is ready. It's removed after compilation.