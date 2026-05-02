# Tabs Component

This recipe demonstrates how to build a tabbed interface using pocket-vue.

## Example Code

```html
<div v-scope="{ 
  activeTab: 'tab1',
  
  selectTab(tabId) {
    this.activeTab = tabId;
  },
  
  isActive(tabId) {
    return this.activeTab === tabId;
  }
}">
  <div class="tabs">
    <div class="tab-list">
      <button :class="{ active: isActive('tab1') }" @click="selectTab('tab1')">Tab 1</button>
      <button :class="{ active: isActive('tab2') }" @click="selectTab('tab2')">Tab 2</button>
      <button :class="{ active: isActive('tab3') }" @click="selectTab('tab3')">Tab 3</button>
    </div>

    <div class="tab-content">
      <div v-show="isActive('tab1')" class="panel">
        <h3>Panel 1</h3>
        <p>This is the content for panel 1.</p>
      </div>

      <div v-show="isActive('tab2')" class="panel">
        <h3>Panel 2</h3>
        <p>This is the content for panel 2.</p>
      </div>

      <div v-show="isActive('tab3')" class="panel">
        <h3>Panel 3</h3>
        <p>This is the content for panel 3.</p>
      </div>
    </div>
  </div>
</div>
```

---

## How it works

1.  **State Property**: We use `activeTab` to store the ID of the currently selected tab.
2.  **Tab Selection**: We provide a `selectTab(tabId)` method to change the `activeTab`.
3.  **Active State**: We use `:class="{ active: isActive('tab1') }"` to dynamically apply an `active` class to the tab button.
4.  **Content Management**: We use `v-show` with an `isActive(tabId)` helper method to display only the relevant panel based on the current state.
5.  **Simplified Navigation**: This approach is clean and easy to maintain, even for a large number of tabs.
