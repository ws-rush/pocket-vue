# Installation

pico-vue is designed to be used without a build step. You can simply load it from a CDN.

## CDN

### Unpkg

```html
<script src="https://unpkg.com/@rush/pico-vue" defer init></script>
```

### jsDelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@rush/pico-vue" defer init></script>
```

### esm.sh

```html
<script type="module">
  import { createApp } from 'https://esm.sh/@rush/pico-vue'
  createApp().mount()
</script>
```

> [!TIP] Production Tip
> For production, it is recommended to pin a specific version number to avoid unexpected breakage from newer versions.
> ```html
> <script src="https://unpkg.com/@rush/pico-vue@0.0.4" defer init></script>
> ```

## Auto Initialization

The `init` attribute on the script tag tells pico-vue to automatically query and initialize all elements that have `v-scope` on the page.

```html
<script src="https://unpkg.com/@rush/pico-vue" defer init></script>
```

## Manual Initialization

If you don't want the auto init, remove the `init` attribute and move the scripts to end of `<body>`:

```html
<script src="https://unpkg.com/@rush/pico-vue"></script>
<script>
  PicoVue.createApp().mount()
</script>
```

Or, use the ES module build:

```html
<script type="module">
  import { createApp } from 'https://unpkg.com/@rush/pico-vue?module'
  createApp().mount()
</script>
```

## NPM

You can also install pico-vue via npm:

```bash
npm install @rush/pico-vue
```

Then import it in your project:

```js
import { createApp } from '@rush/pico-vue'
createApp().mount()
```

## Troubleshooting

### Content Security Policy (CSP)

If you are using a strict CSP, you might run into issues because pico-vue uses `new Function()` to evaluate expressions. You may need to add `'unsafe-eval'` to your `script-src` policy.

### Loading Order

Always use `defer` when loading pico-vue in the `<head>` to ensure the DOM is ready before pico-vue tries to initialize. If you put the script at the end of `<body>`, `defer` is not strictly necessary but still good practice.
