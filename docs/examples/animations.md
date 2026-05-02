# CSS Transitions

This recipe shows how to use pocket-vue to apply CSS transitions to elements when they are shown or hidden.

## Example Code

```html
<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
</style>

<div v-scope="{ 
  show: true,
  
  toggle() {
    this.show = !this.show;
  }
}">
  <div class="animation-container">
    <button @click="toggle">Toggle Fade</button>
    
    <div v-if="show" class="fade">
      <p>This is a fading element!</p>
    </div>
  </div>
</div>
```

---

## How it works

1.  **CSS Classes**: We define CSS classes for the enter and leave transitions using standard naming conventions (e.g., `.fade-enter-active`, `.fade-leave-active`).
2.  **Reactive State**: We use a `show` boolean to control the visibility of the element.
3.  **Conditional Rendering**: We use `v-if="show"` to conditionally render the element.
4.  **Transition Timing**: The transition duration and easing are controlled by CSS properties.
5.  **Simplified UI**: This approach is efficient and easy to maintain, providing smooth transitions for common UI patterns.
6.  **Browser Compatibility**: CSS transitions are widely supported in modern browsers, providing a consistent experience across different platforms.
