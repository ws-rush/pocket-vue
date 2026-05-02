# Reactivity APIs

pico-vue re-exports a subset of Vue's reactivity APIs: `reactive()` and `watchEffect()`. These are the core primitives you need for building reactive applications.

## Usage

When using the CDN build, these APIs are available on the global `PicoVue` object.

```html
<script src="https://unpkg.com/pico-vue"></script>
<script>
  const { reactive, watchEffect } = PicoVue
</script>
```

When using the ES module build, you can import them from `pico-vue`.

```javascript
import { reactive, watchEffect } from 'pico-vue'
```

---

## API Reference

### `reactive(object)`

Returns a reactive proxy of the given object. This is typically used for defining the initial state of your application.

```javascript
const state = reactive({ count: 0 })
```

### `watchEffect(effect)`

Runs a function immediately while reactively tracking its dependencies and re-runs it whenever the dependencies change.

```javascript
const state = reactive({ count: 0 })
watchEffect(() => console.log(state.count)) // prints 0
state.count++ // prints 1
```

---

## Additional Reactivity APIs

pico-vue only re-exports `reactive` and `watchEffect` from `@vue/reactivity`. If you need additional reactivity utilities like `ref()`, `computed()`, or `watch()`, you can import them directly from `@vue/reactivity`:

```javascript
import { ref, computed } from '@vue/reactivity'
```

---

## Best Practices

- **Use `reactive` for state objects**: This is the most common pattern for defining your application state.
- **Use getters for computed values**: Instead of `computed()`, use JavaScript getters in your reactive objects:
  ```javascript
  const state = reactive({
    count: 0,
    get double() {
      return this.count * 2
    }
  })
  ```
- **Use `watchEffect` for side effects**: Use it when you need to react to state changes with side effects like logging, network requests, or DOM manipulation.
