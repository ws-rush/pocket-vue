# Fetch API Integration

This recipe shows how to use pocket-vue to fetch and display data from an external API using the native Fetch API.

## Example Code

```html
<div v-scope="{
  posts: [],
  loading: false,
  error: null,
  
  async fetchPosts() {
    this.loading = true;
    this.error = null;
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
      if (!response.ok) throw new Error('Failed to fetch posts');
      this.posts = await response.json();
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  },
}" @vue:mounted="fetchPosts()">
  <div class="fetch-api-container">
    <button :disabled="loading" @click="fetchPosts">
      {{ loading ? 'Loading...' : 'Refresh Posts' }}
    </button>
    
    <div v-show="error" style="color: red;">
      Error: {{ error }}
    </div>
    
    <ul v-if="posts.length">
      <li v-for="post in posts" :key="post.id">
        <strong>{{ post.title }}</strong>
        <p>{{ post.body }}</p>
      </li>
    </ul>
    
    <p v-else-if="!loading">No posts available.</p>
  </div>
</div>
```

---

## How it works

1.  **Reactive State**: We use `posts`, `loading`, and `error` to manage the API state.
2.  **Fetch Logic**: We define an `async` `fetchPosts()` method to perform the API call and update the state.
3.  **Error Handling**: We use `try/catch` and `finally` blocks to handle errors and loading states.
4.  **Lifecycle Hook**: We use `@vue:mounted="fetchPosts()"` to load the data as soon as the component is mounted.
5.  **Conditional Rendering**: We use `v-if`, `v-else-if`, and `v-show` to display the data, loading indicator, and error messages.
6.  **Refresh Mechanism**: We provide a "Refresh Posts" button to manually trigger the API call.
7.  **Optimized Rendering**: By using `:key="post.id"`, we ensure that pocket-vue efficiently updates the DOM when the data changes.
