# Infinite Scroll

This recipe demonstrates how to implement an infinite scroll pattern using pico-vue.

## Example Code

```html
<div v-scope="{ 
  items: [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ],
  loading: false,
  page: 1,
  
  loadMore() {
    if (this.loading) return;
    this.loading = true;
    setTimeout(() => {
      this.page++;
      const newItems = [
        { id: (this.page - 1) * 3 + 1, name: 'Item ' + ((this.page - 1) * 3 + 1) },
        { id: (this.page - 1) * 3 + 2, name: 'Item ' + ((this.page - 1) * 3 + 2) },
        { id: (this.page - 1) * 3 + 3, name: 'Item ' + ((this.page - 1) * 3 + 3) }
      ];
      this.items = [...this.items, ...newItems];
      this.loading = false;
    }, 1000);
  },

  setupScrollListener() {
    window.addEventListener('scroll', () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
        this.loadMore();
      }
    });
  }
}" @vue:mounted="setupScrollListener()">
  <div class="infinite-scroll">
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
    
    <p v-show="loading">Loading more items...</p>
    
    <button v-show="!loading" @click="loadMore">Load More</button>
  </div>
</div>
```

---

## How it works

1.  **Reactive State**: We use an `items` array, a `loading` boolean, and a `page` number to manage our state.
2.  **Load More Logic**: We provide a `loadMore()` method to fetch more items from the server and append them to the current list.
3.  **Scroll Event Listener**: We wire up `@vue:mounted="setupScrollListener()"` to attach a scroll event listener when the component is mounted, which detects when the user reaches the bottom of the page and triggers `loadMore`.
4.  **Loading State**: We use the `loading` property to show or hide a loading indicator and prevent multiple requests from being made at once.
5.  **List Rendering**: We use `v-for="item in items"` to render the concatenated list of items.
6.  **Optimized Rendering**: By using `:key="item.id"`, we ensure that pico-vue efficiently updates only the new items as they are added to the DOM.
7.  **Fallback Mechanism**: We provide a "Load More" button as a fallback for users who prefer manual navigation.
