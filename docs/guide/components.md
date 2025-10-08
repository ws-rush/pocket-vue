# Components

In `pocket-vue`, the concept of "Components" is more lightweight compared to standard Vue, but it provides a powerful way to create reusable logic and templates.

## Reusable Logic with Functions

You can create reusable scope logic by defining functions. These functions can accept props and return an object that defines the state and methods for a `v-scope`.

### Example

```html
<script type="module">
  import { createApp } from 'https://unpkg.com/pocket-vue?module'

  // This function acts as a component constructor
  function Counter(props) {
    return {
      count: props.initialCount,
      inc() {
        this.count++
      },
      mounted() {
        console.log(`Counter mounted with initial value: ${this.count}`)
      }
    }
  }

  createApp({
    // Expose the Counter function to the template
    Counter
  }).mount()
</script>

<!-- Use the function in v-scope to create a component instance -->
<div v-scope="Counter({ initialCount: 1 })" @vue:mounted="mounted">
  <p>Count: {{ count }}</p>
  <button @click="inc">Increment</button>
</div>

<div v-scope="Counter({ initialCount: 10 })">
  <p>Count: {{ count }}</p>
  <button @click="inc">Increment</button>
</div>
```

## Reusing Templates

If you want to reuse a piece of template, you can add a special `$template` key to the object returned by your component function. The value can be either an ID selector for a `<template>` element or an inline template string.

Using a `<template>` element is generally more efficient as it can be cloned natively by the browser.

### Example with `<template>`

```html
<script type="module">
  import { createApp } from 'https://unpkg.com/pocket-vue?module'

  function Counter(props) {
    return {
      $template: '#counter-template',
      count: props.initialCount,
      inc() {
        this.count++
      }
    }
  }

  createApp({
    Counter
  }).mount()
</script>

<!-- The template to be reused -->
<template id="counter-template">
  <p>My count is {{ count }}</p>
  <button @click="inc">Increment</button>
</template>

<!-- Create instances of the component -->
<div v-scope="Counter({ initialCount: 1 })"></div>
<div v-scope="Counter({ initialCount: 2 })"></div>
```

When `pocket-vue` encounters a `$template` key, it will ignore the element's existing `innerHTML` and instead populate it with a clone of the specified template.