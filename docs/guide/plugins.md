# Plugins

`pocket-vue` can be extended with custom functionality through plugins. Plugins are a great way to bundle and share reusable logic, such as custom directives.

## Creating a Plugin

A plugin is simply an object with an `install` method. The `install` method receives the `app` instance as its first argument, allowing you to register directives or add global properties.

### Example Plugin

Let's create a simple `v-log` directive that logs an expression to the console.

**`log-plugin.js`**

```js
export default {
  install: (app, options) => {
    // Register a custom directive
    app.directive('log', (ctx) => {
      // The `ctx` object contains:
      // - el: the element the directive is on
      // - exp: the raw expression string
      // - get(): a function to evaluate the expression

      // Log the evaluated expression
      console.log(ctx.get());
    })
  }
}
```

## Using a Plugin

To use a plugin, you pass it to the `app.use()` method before mounting your application.

### Example

```html
<div v-scope="{ message: 'Hello from pocket-vue!' }" v-log="message">
  <!-- The `v-log` directive will log the `message` to the console -->
</div>

<script type="module">
  import { createApp } from 'pocket-vue'
  import logPlugin from './log-plugin.js'

  createApp()
    .use(logPlugin) // Use the plugin
    .mount()
</script>
```

The `.use()` method provides a clean and organized way to add functionality to your `pocket-vue` application, making it easy to share and reuse code across different projects.