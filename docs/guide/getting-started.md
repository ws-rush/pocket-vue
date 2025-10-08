# Getting Started

This guide will help you get up and running with `pocket-vue`.

## From CDN

You can start using `pocket-vue` without any build step by simply including it from a CDN. This is the recommended approach for "sprinkling" interactivity on existing server-rendered pages.

```html
<script src="https://unpkg.com/pocket-vue" defer init></script>

<div v-scope="{ count: 0 }">
  <p>Count: {{ count }}</p>
  <button @click="count++">Increment</button>
</div>
```

### How it Works:

-   **`defer`**: This attribute ensures the script is executed after the HTML content has been fully parsed.
-   **`init`**: This attribute tells `pocket-vue` to automatically find and initialize all elements with the `v-scope` attribute.
-   **`v-scope`**: This directive marks a region of the page to be controlled by `pocket-vue`. The value of the attribute is an object that defines the reactive state for that region.

## Manual Initialization

If you prefer to have more control over when and how `pocket-vue` initializes, you can remove the `init` attribute and initialize it manually.

### Global Build

```html
<!-- Move to the end of <body> -->
<script src="https://unpkg.com/pocket-vue"></script>
<script>
  PetiteVue.createApp().mount()
</script>
```

### ES Module

```html
<script type="module">
  import { createApp } from 'https://unpkg.com/pocket-vue?module'

  createApp().mount()
</script>
```

## Using npm

For more complex applications or when you want to bundle your assets, you can install `pocket-vue` from npm:

```bash
pnpm add pocket-vue
```

Then, you can import it into your JavaScript files:

```js
import { createApp } from 'pocket-vue'

createApp({
  // Your global state and methods
}).mount('#app')
```