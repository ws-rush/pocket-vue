# Comparison with Alpine.js

`pocket-vue` and [Alpine.js](https://alpinejs.dev) target a similar use case: adding interactivity to existing server-rendered HTML. However, they have different design philosophies and goals.

## Key Differences

### 1. Size

`pocket-vue` is designed to be as minimal as possible. At ~9kb, it's roughly half the size of Alpine.js. This makes it an excellent choice for projects where every kilobyte matters.

### 2. Ecosystem Alignment

`pocket-vue` is intended to be **part of the Vue ecosystem**. It strives to be as Vue-compatible as possible. This means:

-   The syntax and behavior align with standard Vue.
-   The reactivity system is powered by `@vue/reactivity`.
-   It provides a smooth upgrade path. If your project's interactivity needs grow, you can transition to standard Vue with less friction.

Alpine.js, while inspired by Vue, is not bound by its design decisions. It has its own unique syntax and features and may diverge further from Vue in the future. This gives it the freedom to evolve independently, but it also means there's less of a direct migration path to a full-featured framework like Vue.

### 3. Feature Set

To achieve its small size, `pocket-vue` intentionally omits certain features, such as a built-in transition system. Alpine.js includes a more extensive feature set out of the box.

## Which Should You Choose?

-   **Choose `pocket-vue` if:**
    -   You want the smallest possible footprint.
    -   You are already familiar with Vue and want to leverage that knowledge.
    -   You want a tool that is an official part of the Vue ecosystem, ensuring alignment and a potential upgrade path.

-   **Choose Alpine.js if:**
    -   You need a richer set of built-in features, like transitions.
    -   You are not concerned with strict Vue compatibility.
    -   You prefer its unique syntax and approach.

Both are excellent tools. `pocket-vue` simply prioritizes being a more minimal and Vue-aligned solution for progressive enhancement.