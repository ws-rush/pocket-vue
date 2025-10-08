# Global API

This section provides a detailed reference for the global API methods available in `pocket-vue`.

## `createApp([root])`

Initializes a `pocket-vue` application instance.

-   **`root`** (optional): An object that serves as the root scope for all expressions on the page. Properties on this object can be accessed directly in your templates.

-   **Returns**: An `app` instance with the following methods:
    -   `.mount([target])`: Mounts the application.
        -   `target` (optional): A CSS selector or an element. If provided, `pocket-vue` will only process elements within this target. If omitted, it processes the entire document.
    -   `.directive(name, definition)`: Registers a custom directive.
    -   `.use(plugin)`: Installs a plugin.

### Example

```js
import { createApp } from 'pocket-vue'

const app = createApp({
  // Global properties
  message: 'Hello, World!'
})

app.mount('#app')
```

## `reactive(obj)`

Returns a reactive proxy of the object. This is the core of `pocket-vue`'s reactivity system and is re-exported from `@vue/reactivity`.

-   **`obj`**: The object to be made reactive.

### Example

```js
import { reactive } from 'pocket-vue'

const state = reactive({
  count: 0
})

// The `state` object is now reactive.
// Any changes to `state.count` will trigger updates in the DOM.
```

## `nextTick(callback)`

Defer a callback to be executed after the next DOM update cycle. Use this to wait for the DOM to be updated after you've changed some data.

-   **`callback`**: The function to execute after the DOM has been updated.

### Example

```js
import { createApp, nextTick } from 'pocket-vue'

createApp({
  count: 0,
  async increment() {
    this.count++
    // DOM is not yet updated.
    await nextTick()
    // Now the DOM is updated.
    console.log('DOM has been updated.')
  }
}).mount()
```

## `watchEffect(effect)`

Runs a function immediately while reactively tracking its dependencies, and re-runs it whenever the dependencies change.

-   **`effect`**: The function to run.

### Example

```js
import { reactive, watchEffect } from 'pocket-vue'

const store = reactive({
  count: 0,
})

// This will run immediately, and then again every time store.count changes.
watchEffect(() => {
  console.log(`The count is now: ${store.count}`)
})

// This will trigger the effect to run again.
store.count++
```