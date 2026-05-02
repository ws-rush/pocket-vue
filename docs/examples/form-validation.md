# Real-time Form Validation

This example shows how to use pocket-vue to provide instant feedback to users as they fill out a form.

## Example Code

```html
<div v-scope="{ 
  username: '',
  email: '',
  password: '',
  
  get usernameError() {
    if (!this.username) return ''
    if (this.username.length < 3) return 'Username must be at least 3 characters'
    return ''
  },
  
  get emailError() {
    if (!this.email) return ''
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(this.email)) return 'Invalid email address'
    return ''
  },
  
  get isFormValid() {
    return this.username.length >= 3 && 
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email) &&
           this.password.length >= 8
  }
}">
  <form @submit.prevent="console.log('Form submitted!')">
    <div>
      <label>Username:</label>
      <input v-model="username" :class="{ error: usernameError }">
      <span v-show="usernameError" class="error-msg">{{ usernameError }}</span>
    </div>

    <div>
      <label>Email:</label>
      <input v-model="email" :class="{ error: emailError }">
      <span v-show="emailError" class="error-msg">{{ emailError }}</span>
    </div>

    <div>
      <label>Password:</label>
      <input type="password" v-model="password">
      <span v-show="password && password.length < 8" class="error-msg">
        Password must be at least 8 characters
      </span>
    </div>

    <button :disabled="!isFormValid">Submit</button>
  </form>
</div>
```

---

## How it works

1.  **Reactive State**: We define `username`, `email`, and `password` as reactive properties in our scope.
2.  **Computed Properties**: We use getters (`usernameError`, `emailError`, `isFormValid`) to calculate validation states automatically whenever the underlying data changes.
3.  **Class Binding**: We use `:class="{ error: usernameError }"` to dynamically apply an error class to the input field.
4.  **Conditional Rendering**: We use `v-show` to display error messages only when an error exists and the user has started typing.
5.  **Disabled State**: The submit button is automatically enabled or disabled based on the `isFormValid` getter.
