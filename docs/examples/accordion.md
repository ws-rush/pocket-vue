# Accordion Component

This example shows how to build a collapsible accordion component using pocket-vue.

## Example Code

```html
<div v-scope="{ 
  activeSection: null,
  
  toggle(section) {
    if (this.activeSection === section) {
      this.activeSection = null;
    } else {
      this.activeSection = section;
    }
  },
  
  isOpen(section) {
    return this.activeSection === section;
  }
}">
  <div class="accordion">
    <!-- Section 1 -->
    <div class="section">
      <button class="header" @click="toggle('s1')">
        Section 1 Header {{ isOpen('s1') ? '-' : '+' }}
      </button>
      <div v-show="isOpen('s1')" class="content">
        <p>This is the content for Section 1.</p>
      </div>
    </div>

    <!-- Section 2 -->
    <div class="section">
      <button class="header" @click="toggle('s2')">
        Section 2 Header {{ isOpen('s2') ? '-' : '+' }}
      </button>
      <div v-show="isOpen('s2')" class="content">
        <p>This is the content for Section 2.</p>
      </div>
    </div>
  </div>
</div>
```

---

## How it works

1.  **State Management**: We use `activeSection` to store the ID of the currently expanded section.
2.  **Toggle Method**: We provide a `toggle(section)` method to update the `activeSection` based on user interaction.
3.  **Visibility Control**: We use `v-show` with a helper method `isOpen(section)` to show or hide the content for each section.
4.  **Interactive Header**: The header button updates the state and also changes its label (`+` vs `-`) based on the section state.
5.  **Exclusive Selection**: This implementation ensures that only one section is open at a time.
