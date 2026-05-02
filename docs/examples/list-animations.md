# List Animations

This recipe shows how to animate items in a `v-for` list as they are added or removed.

## Example Code

```html
<style>
  .list-enter-active, .list-leave-active {
    transition: all 0.5s ease;
  }
  .list-enter-from, .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
</style>

<div v-scope="{ 
  items: ['Item 1', 'Item 2', 'Item 3'],
  nextId: 4,
  
  addItem() {
    this.items.push('Item ' + this.nextId++);
  },
  
  removeItem(index) {
    this.items.splice(index, 1);
  }
}">
  <div class="list-animation-container">
    <button @click="addItem">Add Item</button>
    
    <div v-for="(item, index) in items" :key="item" class="list-item">
      <span>{{ item }}</span>
      <button @click="removeItem(index)">Remove</button>
    </div>
  </div>
</div>
```

---

## How it works

1.  **CSS Classes**: We define CSS classes for the enter and leave transitions for individual list items.
2.  **Reactive State**: We use an `items` array to store our list content and a `nextId` to track the ID of the next item to be added.
3.  **List Operations**: We provide `addItem()` and `removeItem(index)` methods to update the `items` array.
4.  **Transition Timing**: The transition duration and easing are controlled by CSS properties.
5.  **Simplified UI**: This approach is efficient and easy to maintain, providing smooth transitions for common UI patterns.
6.  **Optimized Rendering**: By using `:key="item"`, we ensure that pocket-vue efficiently updates only the new or removed items in the DOM.
