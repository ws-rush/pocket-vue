# File Upload Preview

This recipe shows how to use pocket-vue to provide a preview for an image before it is uploaded to the server.

## Example Code

```html
<div v-scope="{ 
  previewUrl: null,
  
  handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      this.previewUrl = URL.createObjectURL(file);
    }
  },
  
  removeFile() {
    this.previewUrl = null;
    // You might also need to clear the file input
    document.querySelector('input[type=file]').value = '';
  }
}">
  <div class="file-upload">
    <label>Select an image to preview:</label>
    <input type="file" accept="image/*" @change="handleFileChange($event)">
    
    <div v-if="previewUrl" class="preview">
      <img :src="previewUrl" alt="Preview Image" style="max-width: 200px;">
      <button type="button" @click="removeFile">Remove Image</button>
    </div>
  </div>
</div>
```

---

## How it works

1.  **State Property**: We use `previewUrl` to store the temporary URL for the selected image.
2.  **Event Handling**: We use `@change="handleFileChange($event)"` to listen for the file input change event.
3.  **File Reader**: Inside `handleFileChange`, we access the file from the event target and use `URL.createObjectURL(file)` to create a temporary URL for the image.
4.  **Reactive Binding**: We bind the `src` attribute of an `<img>` tag to the `previewUrl` property using `:src="previewUrl"`.
5.  **Conditional Rendering**: We only show the image preview and remove button if `previewUrl` is not null.
6.  **Cleanup**: We provide a `removeFile` method to clear the preview and reset the file input.
