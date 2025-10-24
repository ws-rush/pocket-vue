import { describe, it, expect, beforeEach, vi } from 'vitest'
import { walk } from '../src/walk'
import { createContext } from '../src/context'

describe('walk', () => {
  let container: HTMLElement
  let ctx: any

  beforeEach(() => {
    container = document.createElement('div')
    ctx = createContext()
    ctx.scope.$refs = Object.create(null)
    ctx.scope.$s = (value: any) => value == null ? '' : String(value)
  })

  it('should walk through DOM elements', () => {
    container.innerHTML = '<div v-scope><span>{{ message }}</span><button @click="handleClick">Click</button></div>'

    ctx.scope.message = 'Hello'
    ctx.scope.handleClick = vi.fn()
    walk(container, ctx)

    expect(container.innerHTML).toContain('Hello')
  })

  it('should handle v-scope directive', () => {
    container.innerHTML = '<div v-scope="{ localCount: 0 }"><span>{{ localCount }}</span></div>'

    walk(container, ctx)

    expect(container.innerHTML).toContain('0')
  })

  it('should handle v-if directive', () => {
    // Test with show = true
    const container1 = document.createElement('div')
    container1.innerHTML = '<div v-if="show">Visible</div>'
    ctx.scope.show = true
    walk(container1, ctx)
    expect(container1.innerHTML).toContain('Visible')

    // Test with show = false
    const container2 = document.createElement('div')
    container2.innerHTML = '<div v-if="show">Visible</div>'
    ctx.scope.show = false
    walk(container2, ctx)
    expect(container2.innerHTML).not.toContain('Visible')
  })

  it('should handle v-for directive', () => {
    container.innerHTML = '<ul><li v-for="item in items">{{ item }}</li></ul>'

    ctx.scope.items = ['Item 1', 'Item 2']
    walk(container, ctx)

    const items = container.querySelectorAll('li')
    expect(items.length).toBe(2)
    expect(items[0]?.textContent).toBe('Item 1')
    expect(items[1]?.textContent).toBe('Item 2')
  })

  it('should handle attribute interpolation', () => {
    container.innerHTML = '<div :id="dynamicId" :class="dynamicClass">Content</div>'

    ctx.scope.dynamicId = 'test-id'
    ctx.scope.dynamicClass = 'test-class'
    walk(container, ctx)

    const div = container.querySelector('div')
    expect(div?.getAttribute('id')).toBe('test-id')
    expect(div?.getAttribute('class')).toBe('test-class')
  })

  it('should handle text interpolation', () => {
    container.innerHTML = '<div>{{ message }}</div>'

    ctx.scope.message = 'Hello World'
    walk(container, ctx)

    const div = container.querySelector('div')
    expect(div?.textContent).toBe('Hello World')
  })

  it('should handle event handlers', () => {
    container.innerHTML = '<button @click="handleClick">Click</button>'

    const handleClick = vi.fn()
    ctx.scope.handleClick = handleClick
    walk(container, ctx)

    const button = container.querySelector('button')
    button?.click()

    expect(handleClick).toHaveBeenCalled()
  })

  it('should handle nested directives', () => {
    container.innerHTML = '<div v-scope="{ localData: { count: 0 } }"><div v-if="show"><span>{{ localData.count }}</span></div></div>'

    ctx.scope.show = true
    walk(container, ctx)

    expect(container.innerHTML).toContain('0')
  })

  it('should handle multiple directives on same element', () => {
    container.innerHTML = '<div v-show="isVisible" :class="dynamicClass">Content</div>'

    ctx.scope.isVisible = true
    ctx.scope.dynamicClass = 'active'
    walk(container, ctx)

    const div = container.querySelector('div')
    expect(div?.style.display).not.toBe('none')
    expect(div?.getAttribute('class')).toBe('active')
  })

  it('should handle custom delimiters', () => {
    container.innerHTML = '<div>${ message }</div>'

    ctx.scope.message = 'Hello'
    ctx.delimiters = ['${', '}']
    ctx.delimitersRE = /\$\{([^]+?)\}/g

    walk(container, ctx)

    const div = container.querySelector('div')
    expect(div?.textContent).toBe('Hello')
  })
})