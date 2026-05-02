# Searchable Table

This recipe demonstrates how to implement a real-time searchable table using pocket-vue.

## Example Code

```html
<div v-scope="{ 
  query: '',
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' }
  ],
  
  get filteredUsers() {
    return this.users.filter(user => 
      user.name.toLowerCase().includes(this.query.toLowerCase()) ||
      user.email.toLowerCase().includes(this.query.toLowerCase())
    );
  }
}">
  <div class="search-container">
    <input v-model="query" placeholder="Search by name or email...">
    
    <table v-if="filteredUsers.length">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
        </tr>
      </tbody>
    </table>
    
    <p v-else>No users found matching "{{ query }}".</p>
  </div>
</div>
```

---

## How it works

1.  **Reactive State**: We define a `query` string and an array of `users` in our scope.
2.  **Computed Property**: We use the `filteredUsers` getter to automatically calculate the filtered list of users whenever the `query` or `users` data changes.
3.  **Two-way Binding**: We use `v-model="query"` to bind the search input to the `query` property.
4.  **List Rendering**: We use `v-for="user in filteredUsers"` to render only the matched users in the table.
5.  **Conditional Rendering**: We use `v-if` to show the table if any users match the search, and a fallback message if no matches are found.
6.  **Optimized Rendering**: By using `:key="user.id"`, we ensure that pocket-vue efficiently updates only the necessary parts of the DOM when the filtered results change.
