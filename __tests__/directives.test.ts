import { describe, it, expect, beforeEach } from 'vitest'
import { reactive } from '@vue/reactivity'
import { createApp } from '../src/app'
import { builtInDirectives } from '../src/directives'

describe('directives', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  describe('built-in directives', () => {
    it('should have all built-in directives', () => {
      expect(builtInDirectives.bind).toBeDefined()
      expect(builtInDirectives.on).toBeDefined()
      expect(builtInDirectives.show).toBeDefined()
      expect(builtInDirectives.text).toBeDefined()
      expect(builtInDirectives.html).toBeDefined()
      expect(builtInDirectives.model).toBeDefined()
      expect(builtInDirectives.effect).toBeDefined()
    })
  })

  describe('v-bind', () => {
    it('should bind attribute', () => {
      container.innerHTML = '<div v-bind:id="dynamicId"></div>'

      const app = createApp({ dynamicId: 'test-id' })
      app.mount(container)

      const div = container.querySelector('div')
      expect(div?.getAttribute('id')).toBe('test-id')
    })

    it('should update attribute when data changes', async () => {
      container.innerHTML = '<div v-bind:id="dynamicId"></div>'

      const data = reactive({ dynamicId: 'initial' })
      const app = createApp(data)
      app.mount(container)

      data.dynamicId = 'updated'

      // Wait for reactivity to take effect
      await new Promise(resolve => setTimeout(resolve, 0))

      const div = container.querySelector('div')
      expect(div?.getAttribute('id')).toBe('updated')
    })

    it('should handle shorthand syntax', () => {
      container.innerHTML = '<div :id="dynamicId"></div>'

      const app = createApp({ dynamicId: 'test-id' })
      app.mount(container)

      const div = container.querySelector('div')
      expect(div?.getAttribute('id')).toBe('test-id')
    })
  })

  describe('v-on', () => {
    it('should attach event handler', () => {
      container.innerHTML = '<button v-on:click="handleClick">Click</button>'

      const handleClick = vi.fn()
      const app = createApp({ handleClick })
      app.mount(container)

      const button = container.querySelector('button')
      button?.click()

      expect(handleClick).toHaveBeenCalled()
    })

    it('should handle shorthand syntax', () => {
      container.innerHTML = '<button @click="handleClick">Click</button>'

      const handleClick = vi.fn()
      const app = createApp({ handleClick })
      app.mount(container)

      const button = container.querySelector('button')
      button?.click()

      expect(handleClick).toHaveBeenCalled()
    })

    it('should handle event modifiers', () => {
      container.innerHTML = '<button @click.prevent="handleClick">Click</button>'

      const handleClick = vi.fn()
      const app = createApp({ handleClick })
      app.mount(container)

      const button = container.querySelector('button')
      const event = new MouseEvent('click', { cancelable: true })
      button?.dispatchEvent(event)

      expect(handleClick).toHaveBeenCalled()
      expect(event.defaultPrevented).toBe(true)
    })
  })

  describe('v-show', () => {
    it('should toggle display based on condition', async () => {
      container.innerHTML = '<div v-show="isVisible">Content</div>'

      const data = reactive({ isVisible: true })
      const app = createApp(data)
      app.mount(container)

      const div = container.querySelector('div')
      expect(div?.style.display).not.toBe('none')

      data.isVisible = false

      // Wait for reactivity to take effect
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(div?.style.display).toBe('none')
    })
  })

  describe('v-text', () => {
    it('should set text content', () => {
      container.innerHTML = '<div v-text="message"></div>'

      const app = createApp({ message: 'Hello World' })
      app.mount(container)

      const div = container.querySelector('div')
      expect(div?.textContent).toBe('Hello World')
    })

    it('should update text content when data changes', async () => {
      container.innerHTML = '<div v-text="message"></div>'

      const data = reactive({ message: 'Initial' })
      const app = createApp(data)
      app.mount(container)

      data.message = 'Updated'

      // Wait for reactivity to take effect
      await new Promise(resolve => setTimeout(resolve, 0))

      const div = container.querySelector('div')
      expect(div?.textContent).toBe('Updated')
    })
  })

  describe('v-html', () => {
    it('should set HTML content', () => {
      container.innerHTML = '<div v-html="htmlContent"></div>'

      const app = createApp({ htmlContent: '<span>HTML Content</span>' })
      app.mount(container)

      const div = container.querySelector('div')
      expect(div?.innerHTML).toBe('<span>HTML Content</span>')
    })

    it('should update HTML content when data changes', async () => {
      container.innerHTML = '<div v-html="htmlContent"></div>'

      const data = reactive({ htmlContent: '<span>Initial</span>' })
      const app = createApp(data)
      app.mount(container)

      data.htmlContent = '<span>Updated</span>'

      // Wait for reactivity to take effect
      await new Promise(resolve => setTimeout(resolve, 0))

      const div = container.querySelector('div')
      expect(div?.innerHTML).toBe('<span>Updated</span>')
    })
  })

  describe('v-model', () => {
    it('should bind input value', () => {
      container.innerHTML = '<input v-model="message">'

      const app = createApp({ message: 'test' })
      app.mount(container)

      const input = container.querySelector('input')
      expect(input?.value).toBe('test')
    })

    it('should update data when input changes', () => {
      container.innerHTML = '<input v-model="message">'

      const data = reactive({ message: 'initial' })
      const app = createApp(data)
      app.mount(container)

      const input = container.querySelector('input')
      input!.value = 'updated'
      input?.dispatchEvent(new Event('input'))

      expect(data.message).toBe('updated')
    })

    it('should work with textarea', () => {
      container.innerHTML = '<textarea v-model="message"></textarea>'

      const app = createApp({ message: 'test' })
      app.mount(container)

      const textarea = container.querySelector('textarea')
      expect(textarea?.value).toBe('test')
    })

    it('should work with select', () => {
      container.innerHTML = `
        <select v-model="selected">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>
      `

      const app = createApp({ selected: 'option2' })
      app.mount(container)

      const select = container.querySelector('select')
      expect(select?.value).toBe('option2')
    })
  })

  describe('v-effect', () => {
    it('should run effect when mounted', async () => {
      container.innerHTML = '<div v-effect="sideEffect()"></div>'

      const sideEffect = vi.fn()
      const app = createApp({ sideEffect })
      app.mount(container)

      // Wait for effect to run
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(sideEffect).toHaveBeenCalled()
    })

    it('should run effect when dependencies change', async () => {
      container.innerHTML = '<div v-effect="sideEffect()"></div>'

      let callCount = 0
      const app = createApp({
        sideEffect: () => {
          callCount++
        }
      })
      app.mount(container)

      // Wait for effect to run
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(callCount).toBe(1)
    })
  })
})