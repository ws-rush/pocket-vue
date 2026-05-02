# TodoMVC

A classic example of a Todo application. This demonstrates list rendering, input handling, computed properties, and persistence.

## Example Code

```html
<script type="module">
  import { createApp } from 'pocket-vue'

  const STORAGE_KEY = 'pocket-vue-todomvc'

  const filters = {
    all: (todos) => todos,
    active: (todos) => todos.filter((todo) => !todo.completed),
    completed: (todos) => todos.filter((todo) => todo.completed)
  }

  createApp({
    todos: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),
    newTodo: '',
    editedTodo: null,
    visibility: 'all',

    get filteredTodos() {
      return filters[this.visibility](this.todos)
    },

    get remaining() {
      return filters.active(this.todos).length
    },

    get allDone() {
      return this.remaining === 0
    },

    set allDone(value) {
      this.todos.forEach((todo) => {
        todo.completed = value
      })
    },

    mounted() {
      window.addEventListener('hashchange', this.onHashChange)
      this.onHashChange()
    },

    onHashChange() {
      const visibility = window.location.hash.replace(/#\/?/, '')
      if (filters[visibility]) {
        this.visibility = visibility
      } else {
        window.location.hash = ''
        this.visibility = 'all'
      }
    },

    addTodo() {
      const value = this.newTodo && this.newTodo.trim()
      if (!value) {
        return
      }
      this.todos.push({
        id: Date.now(),
        title: value,
        completed: false
      })
      this.newTodo = ''
    },

    removeTodo(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1)
    },

    editTodo(todo) {
      this.beforeEditCache = todo.title
      this.editedTodo = todo
    },

    doneEdit(todo) {
      if (!this.editedTodo) {
        return
      }
      this.editedTodo = null
      todo.title = todo.title.trim()
      if (!todo.title) {
        this.removeTodo(todo)
      }
    },

    cancelEdit(todo) {
      this.editedTodo = null
      todo.title = this.beforeEditCache
    },

    removeCompleted() {
      this.todos = filters.active(this.todos)
    },
    
    $effect() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos))
    }
  }).mount('#app')
</script>

<div id="app" v-scope @vue:mounted="mounted">
  <header class="header">
    <h1>todos</h1>
    <input
      class="new-todo"
      autofocus
      autocomplete="off"
      placeholder="What needs to be done?"
      v-model="newTodo"
      @keyup.enter="addTodo"
    >
  </header>
  
  <section class="main" v-show="todos.length" v-cloak>
    <input
      id="toggle-all"
      class="toggle-all"
      type="checkbox"
      v-model="allDone"
    >
    <label for="toggle-all">Mark all as complete</label>
    
    <ul class="todo-list">
      <li
        v-for="todo in filteredTodos"
        class="todo"
        :class="{ completed: todo.completed, editing: todo === editedTodo }"
        :key="todo.id"
      >
        <div class="view">
          <input class="toggle" type="checkbox" v-model="todo.completed">
          <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
          <button class="destroy" @click="removeTodo(todo)"></button>
        </div>
        <input
          class="edit"
          type="text"
          v-model="todo.title"
          v-effect="if (todo === editedTodo) $el.focus()"
          @blur="doneEdit(todo)"
          @keyup.enter="doneEdit(todo)"
          @keyup.escape="cancelEdit(todo)"
        >
      </li>
    </ul>
  </section>
  
  <footer class="footer" v-show="todos.length" v-cloak>
    <span class="todo-count">
      <strong>{{ remaining }}</strong> {{ remaining === 1 ? 'item' : 'items' }} left
    </span>
    <ul class="filters">
      <li><a href="#/all" :class="{ selected: visibility === 'all' }">All</a></li>
      <li><a href="#/active" :class="{ selected: visibility === 'active' }">Active</a></li>
      <li><a href="#/completed" :class="{ selected: visibility === 'completed' }">Completed</a></li>
    </ul>
    <button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">
      Clear completed
    </button>
  </footer>
</div>
```
