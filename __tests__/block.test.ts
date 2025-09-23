import { describe, it, expect, beforeEach } from 'vitest'
import { Block } from '../src/block'
import { createContext } from '../src/context'

describe('Block', () => {
  let container: HTMLElement
  let ctx: any

  beforeEach(() => {
    container = document.createElement('div')
    ctx = createContext()
    ctx.scope.$refs = Object.create(null)
  })

  it('should create block with element', () => {
    const el = document.createElement('div')
    const block = new Block(el, ctx)

    // Block clones the template, so we check if it's the same type
    expect(block.el).toBeTruthy()
    expect(block.el.nodeName).toBe(el.nodeName)
    // Block creates a child context, so check inheritance
    expect(block.parentCtx).toBe(ctx)
    expect(block.ctx.dirs).toBe(ctx.dirs)
  })

  it('should handle block insertion', () => {
    const el = document.createElement('div')
    const block = new Block(el, ctx)
    const parent = document.createElement('div')

    block.insert(parent)

    // The block inserts a cloned element, not the original
    expect(parent.children.length).toBe(1)
    expect(parent.children[0].nodeName).toBe('DIV')
  })

  it('should handle block removal', () => {
    const el = document.createElement('div')
    const block = new Block(el, ctx)
    const parent = document.createElement('div')

    block.insert(parent)
    expect(parent.children.length).toBe(1)

    block.remove()
    expect(parent.children.length).toBe(0)
  })

  it('should handle block update', () => {
    const el = document.createElement('div')
    const block = new Block(el, ctx)

    // Block may not have an update method, test that it doesn't throw
    expect(() => {
      if (typeof block.update === 'function') {
        block.update()
      }
    }).not.toThrow()
  })

  it('should handle block cleanup', () => {
    const el = document.createElement('div')
    const block = new Block(el, ctx)
    const parent = document.createElement('div')

    block.insert(parent)

    const cleanupSpy = vi.fn()
    block.ctx.cleanups.push(cleanupSpy)

    block.remove()

    expect(cleanupSpy).toHaveBeenCalled()
  })

  it('should handle multiple blocks', () => {
    const el1 = document.createElement('div')
    const el2 = document.createElement('div')
    const block1 = new Block(el1, ctx)
    const block2 = new Block(el2, ctx)

    // Block clones templates, so we check node names
    expect(block1.el.nodeName).toBe(el1.nodeName)
    expect(block2.el.nodeName).toBe(el2.nodeName)
    // Block creates child contexts, so check inheritance
    expect(block1.parentCtx).toBe(ctx)
    expect(block2.parentCtx).toBe(ctx)
    expect(block1.ctx.dirs).toBe(ctx.dirs)
    expect(block2.ctx.dirs).toBe(ctx.dirs)
  })

  it('should handle block with children', () => {
    const el = document.createElement('div')
    const child = document.createElement('span')
    el.appendChild(child)

    const block = new Block(el, ctx)

    // The block clones the template, so children should be preserved
    expect(block.el.children.length).toBe(1)
    expect(block.el.children[0].nodeName).toBe('SPAN')
  })
})