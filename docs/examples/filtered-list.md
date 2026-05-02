# Filtered List

This recipe shows how to implement a filtered list with category-based filtering using pocket-vue.

## Example Code

```html
<div v-scope="{ 
  category: 'All',
  items: [
    { id: 1, name: 'Apple', category: 'Fruits' },
    { id: 2, name: 'Banana', category: 'Fruits' },
    { id: 3, name: 'Carrot', category: 'Vegetables' },
    { id: 4, name: 'Potato', category: 'Vegetables' }
  ],
  
  get filteredItems() {
    if (this.category === 'All') return this.items;
    return this.items.filter(item => item.category === this.category);
  }
}">
  <div class="category-filter">
    <button :class="{ active: category === 'All' }" @click="category = 'All'">All</button>
    <button :class="{ active: category === 'Fruits' }" @click="category = 'Fruits'">Fruits</button>
    <button :class="{ active: category === 'Vegetables' }" @click="category = 'Vegetables'">Vegetables</button>
    
    <ul>
      <li v-for="item in filteredItems" :key="item.id">
        {{ item.name }} ({{ item.category }})
      </li>
    </ul>
    
    <p v-show="filteredItems.length === 0">No items found for this category.</p>
  </div>
</div>
```

---

## How it works

1.  **Reactive State**: We use a `category` property to store the currently selected filter.
2.  **Computed Property**: We define a `filteredItems` getter to calculate the subset of items that match the selected category.
3.  **Active State**: We use `:class="{ active: category === 'All' }"` to dynamically apply an `active` class to the currently selected category button.
4.  **List Rendering**: We use `v-for="item in filteredItems"` to render only the matched items in the list.
5.  **Visibility Control**: We use `v-show` to display a fallback message if no items match the selected category.
6.  **Simplified UI**: This approach is efficient and easy to maintain, even for a large number of categories.
7.  **Optimized Rendering**: By using `:key="item.id"`, we ensure that pocket-vue efficiently updates only the necessary parts of the DOM when the filtered results change.
