# Custom Directives

While `pocket-vue` comes with a comprehensive set of built-in directives, you may find you need custom functionality. You can register your own custom directives using the `app.directive()` method.

## Registering a Custom Directive

You can register a directive by calling `app.directive(name, definition)`.

-   **`name`**: The name of the directive (without the `v-` prefix).
-   **`definition`**: A function that defines the directive's behavior. This function receives a `context` object as its argument.

### The Context Object (`ctx`)

The `definition` function receives a context object with the following properties:

-   `ctx.el`: The element the directive is bound to.
-   `ctx.exp`: The raw expression the directive was given (as a string). For `v-mydir="foo"`, `ctx.exp` would be `"foo"`.
-   `ctx.arg`: The argument, if any. For `v-mydir:hello`, `ctx.arg` would be `"hello"`.
-   `ctx.modifiers`: An object containing modifiers, if any. For `v-mydir.a.b`, `ctx.modifiers` would be `{ a: true, b: true }`.
-   `ctx.get()`: A function that evaluates the expression (`ctx.exp`) and returns its value.
-   `ctx.effect(callback)`: A function to run a reactive effect. The `callback` will be re-run whenever the reactive dependencies it uses are changed.

The definition function can optionally return a **cleanup function**, which will be executed when the element is unmounted.

## Example: `v-focus`

Here is an example of a custom directive that automatically focuses an input element when it's mounted.

```js
import { createApp } from 'pocket-vue'

const app = createApp({})

// Register the custom directive
app.directive('focus', (ctx) => {
  // Focus the element when it's mounted
  ctx.el.focus()
})

app.mount()
```

```html
<input v-focus />
```

## Example: `v-html` (Implementation)

The built-in `v-html` directive is a great example of how to use `ctx.effect` to create a directive that reacts to data changes. Its implementation is quite simple:

```js
const htmlDirective = (ctx) => {
  // Use ctx.effect to create a reactive update
  ctx.effect(() => {
    // ctx.get() evaluates the expression passed to the directive
    ctx.el.innerHTML = ctx.get()
  })
}

// app.directive('html', htmlDirective)
```

This simple structure allows you to create powerful, reactive directives to extend `pocket-vue` to meet your specific needs.