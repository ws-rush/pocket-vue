# Reactivity in Depth

At the core of `pocket-vue` is a powerful but lightweight reactivity system. When your data changes, the DOM updates automatically.

## `v-effect`

The `v-effect` directive is a powerful tool for running reactive inline statements. It's perfect for situations where you need to perform a side effect whenever a piece of reactive data changes.

An effect will re-run whenever any of its reactive dependencies change.

### Example: Tracking Element Size

In this example, the `v-effect` re-runs every time the `count` property changes, updating the element's text content.

```html
<div v-scope="{ count: 0 }">
  <div v-effect="$el.textContent = `Count is: ${count}`"></div>
  <button @click="count++">Increment</button>
</div>
```

### Example: Focusing an Input

Here, `v-effect` is used to automatically focus an input element when it becomes the one being edited.

```html
<li v-for="todo in todos">
  <input v-model="todo.text" v-effect="if (todo === editedTodo) $el.focus()">
</li>
```

## Global State with `reactive`

For managing state that needs to be shared across different parts of your application, you can use the `reactive` method. This creates a reactive object that can be accessed from any `v-scope`.

`reactive` is re-exported from `@vue/reactivity`.

### Example

```html
<script type="module">
  import { createApp, reactive } from 'https://unpkg.com/pocket-vue?module'

  // Create a global store
  const store = reactive({
    count: 0,
    inc() {
      this.count++
    }
  })

  createApp({
    // Expose the store to all v-scope instances
    store
  }).mount()
</script>

<div v-scope>
  <p>Global count: {{ store.count }}</p>
  <button @click="store.inc">Increment Global</button>
</div>

<div v-scope="{ localCount: 0 }">
  <p>Local count: {{ localCount }}</p>
  <button @click="localCount++">Increment Local</button>
</div>
```

By creating a `store` object with `reactive`, we create a singleton that can be manipulated from anywhere. When `store.count` changes, any part of the DOM that depends on it will automatically update.