# Tooltip Component

This example shows how to build a simple tooltip component using pocket-vue.

## Example Code

```html
<div v-scope="{ 
  showTooltip: false,
  
  toggleTooltip(show) {
    this.showTooltip = show;
  }
}">
  <div class="tooltip-container" @mouseenter="toggleTooltip(true)" @mouseleave="toggleTooltip(false)">
    <p>Hover over this text to see the tooltip.</p>
    
    <div v-show="showTooltip" class="tooltip">
      <p>This is a tooltip!</p>
    </div>
  </div>
</div>
```

---

## How it works

1.  **State Property**: We use `showTooltip` to store the ID of the currently active tooltip.
2.  **Toggle Method**: We provide a `toggleTooltip(show)` method to change the `showTooltip` property.
3.  **Event Handling**: We use `@mouseenter="toggleTooltip(true)"` and `@mouseleave="toggleTooltip(false)"` to listen for mouse enter and leave events.
4.  **Visibility Control**: We use `v-show="showTooltip"` to show or hide the tooltip based on the current state.
5.  **Simplified UI**: This approach is efficient and easy to maintain, even for a large number of tooltips.
