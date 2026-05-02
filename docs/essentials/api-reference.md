# API Reference

This page provides a comprehensive reference of the pico-vue core API.

## `createApp()`

The `createApp` function accepts a data object and returns an application instance.

```typescript
function createApp(initialData?: object): AppInstance
```

- **`initialData`**: Optional object to initialize the application state.

### `AppInstance` Methods

- **`mount(el?: string | Element)`**: Mount the app to the DOM. Returns the app instance.
- **`unmount()`**: Unmount the app and cleanup resources.
- **`directive(name: string, def?: Directive)`**: Register a global custom directive.
- **`use(plugin: any, options?: any)`**: Install a plugin.

### `AppInstance` Properties

- **`scope`**: The reactive root scope of the application.
- **`rootBlocks`**: Internal representation of the mounted roots.

---

## Reactivity

### `reactive()`

```typescript
function reactive<T extends object>(target: T): T
```

Creates a reactive proxy of the given object. Re-exported from `@vue/reactivity`.

### `watchEffect()`

```typescript
function watchEffect(effect: () => void): void
```

Runs a function and tracks its reactive dependencies. This is a re-export of `effect` from `@vue/reactivity`.

> [!NOTE]
> Only `reactive` and `watchEffect` are re-exported from `@rush/pico-vue`. If you need `ref()`, `computed()`, or other reactivity APIs, import them directly from `@vue/reactivity`.

---

## Directives

### `v-scope`

Marks an element as a pico-vue component and defines its scope.

```html
<div v-scope="{ count: 0 }"></div>
```

### `v-if`, `v-else-if`, `v-else`

Conditionally render elements.

```html
<div v-if="ok">Yes</div>
<div v-else>No</div>
```

### `v-for`

Iterate over an array or object.

```html
<li v-for="item in items">{{ item }}</li>
<li v-for="(val, key, index) in obj">{{ key }}: {{ val }}</li>
```

### `v-model`

Two-way data binding on form inputs.

```html
<input v-model="text">
```

### `v-bind` (or `:`)

Reactive attribute binding.

```html
<div :class="{ active: isActive }"></div>
```

### `v-on` (or `@`)

Event listener binding.

```html
<button @click="increment">+</button>
```

### `v-show`

Toggles element visibility using CSS `display`.

```html
<div v-show="isVisible">Hello</div>
```

### `v-effect`

Runs an effect when its reactive dependencies change.

```html
<div v-effect="console.log(count)"></div>
```

### `v-text`

Sets the text content of the element.

```html
<span v-text="msg"></span>
```

### `v-html`

Sets the inner HTML of the element.

```html
<div v-html="rawHtml"></div>
```

### `v-cloak`

Removes the attribute once the app is mounted. Used for hiding uncompiled templates.

```html
<style>[v-cloak] { display: none; }</style>
<div v-cloak>{{ msg }}</div>
```

### `v-pre`

Skips compilation for this element and all its children.

<div v-pre>

```html
<div v-pre>{{ this will not be compiled }}</div>
```

</div>

### `v-once`

Compiles the element and its children only once and skips future updates.

```html
<div v-once>{{ initialValue }}</div>
```

### `ref`

Registers a reference to an element or component.

```html
<div ref="myDiv"></div>
```

---

## Special Properties

### Available in all directive expressions

- **`$el`**: The current element the directive is bound to. Available in all directives (`v-on`, `v-bind`, `v-effect`, etc.).
- **`$root`**: The root element of the `v-scope` component.
- **`$refs`**: A collection of elements marked with the `ref` directive.
- **`$nextTick`**: Function to defer a callback until after the next DOM update cycle.
- **`$data`**: The current scope object.

### Available in `v-on` inline handlers

- **`$event`**: The original DOM event object, available as a special variable in inline event handler expressions.
