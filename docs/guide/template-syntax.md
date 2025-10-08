# Template Syntax

`pocket-vue` supports a subset of Vue's template syntax, making it easy to pick up if you're already familiar with Vue.

## Text Interpolation

The most basic data binding is text interpolation using the "Mustache" syntax (double curly braces):

```html
<div v-scope="{ message: 'Hello, pocket-vue!' }">
  <span>Message: {{ message }}</span>
</div>
```

## Directives

Directives are special attributes with the `v-` prefix. Directive attribute values are expected to be a single JavaScript expression.

### `v-bind`

Dynamically binds one or more attributes, or a component prop to an expression.

-   **Shorthand:** `:`

```html
<!-- bind an attribute -->
<img :src="imageSrc">

<!-- bind a class -->
<div :class="{ active: isActive }"></div>

<!-- bind a style -->
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

### `v-on`

Attaches an event listener to the element.

-   **Shorthand:** `@`

```html
<!-- method handler -->
<button @click="doThis">Click me</button>

<!-- inline statement -->
<button @click="count++">Add 1</button>
```

### `v-if`, `v-else`, `v-else-if`

Conditionally render an element or a template fragment based on the truthiness of an expression.

```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else>
  Not A/B
</div>
```

### `v-for`

Render the element or template block multiple times based on a source data.

```html
<!-- On an Array -->
<ul>
  <li v-for="item in items">
    {{ item.text }}
  </li>
</ul>

<!-- With index -->
<ul>
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
```

### `v-model`

Creates a two-way binding on a form input element or a component.

```html
<input v-model="message" placeholder="edit me">
<p>Message is: {{ message }}</p>
```

### `v-show`

Toggles the element's `display` CSS property based on the truthiness of an expression.

```html
<h1 v-show="ok">Hello!</h1>
```

### `v-html` and `v-text`

Updates the element's `innerHTML` or `textContent`.

```html
<div v-html="rawHtml"></div>
<div v-text="plainText"></div>
```

### `v-cloak`

This directive will remain on the element until the associated `pocket-vue` instance finishes compilation. Combined with CSS rules such as `[v-cloak] { display: none }`, it can be used to hide un-compiled mustaches until the app is ready.

```css
[v-cloak] {
  display: none;
}
```

```html
<div v-cloak>
  {{ message }}
</div>
```