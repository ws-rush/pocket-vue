# Global State Management

For simple cases, passing props to your components is sufficient. However, when you need to share state across many components, prop drilling can become cumbersome. In these situations, `pocket-vue` offers a simple and effective solution for global state management using `reactive`.

## The `reactive` Method

You can create a "store" object using the `reactive` method, which is re-exported from `@vue/reactivity`. This object becomes a reactive singleton that can be shared across your entire application. Any component that uses data from this store will automatically update when the data changes.

### How to Use It

1.  **Create a store**: Define a `store` object using `reactive`. This object will hold your shared state and the methods to manipulate it.
2.  **Provide the store**: Pass the `store` object to `createApp()`. This makes it available to all `v-scope` instances in your application.
3.  **Access the store**: In your templates, you can access the store's state and methods directly.

### Example

```html
<script type="module">
  import { createApp, reactive } from 'https://unpkg.com/pocket-vue?module'

  // 1. Create a reactive store
  const store = reactive({
    count: 0,
    inc() {
      this.count++
    }
  })

  // You can even manipulate it directly in your script
  store.inc() // count is now 1

  // 2. Provide the store to the app
  createApp({
    store
  }).mount()
</script>

<!-- 3. Access the store from any component -->
<div v-scope="{ localData: 'abc' }">
  <p>Global Count: {{ store.count }}</p>
  <button @click="store.inc">Increment Global</button>

  <p>Local Data: {{ localData }}</p>
</div>

<div v-scope>
  <p>Another component accessing the same store: {{ store.count }}</p>
</div>
```

This pattern is a simple yet powerful way to manage global state without introducing the complexity of a full-blown state management library. It's ideal for the progressive enhancement scenarios that `pocket-vue` is designed for.