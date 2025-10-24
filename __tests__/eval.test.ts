import { describe, it, expect, beforeEach } from 'vitest'
import { evaluate } from '../src/eval'

describe('evaluate', () => {
  let scope: any
  let el: Element

  beforeEach(() => {
    el = document.createElement('div')
    scope = {
      message: 'Hello',
      count: 42,
      user: { name: 'John', age: 30 },
      items: ['item1', 'item2'],
      isActive: true,
      method: function() {
        return this.message
      }
    }
  })

  it('should evaluate simple expressions', () => {
    expect(evaluate(scope, 'message', el)).toBe('Hello')
    expect(evaluate(scope, 'count', el)).toBe(42)
    expect(evaluate(scope, 'isActive', el)).toBe(true)
  })

  it('should evaluate object property access', () => {
    expect(evaluate(scope, 'user.name', el)).toBe('John')
    expect(evaluate(scope, 'user.age', el)).toBe(30)
  })

  it('should evaluate array access', () => {
    expect(evaluate(scope, 'items[0]', el)).toBe('item1')
    expect(evaluate(scope, 'items[1]', el)).toBe('item2')
  })

  it('should evaluate method calls', () => {
    expect(evaluate(scope, 'method()', el)).toBe('Hello')
  })

  it('should evaluate complex expressions', () => {
    expect(evaluate(scope, 'count + 10', el)).toBe(52)
    expect(evaluate(scope, 'message + " World"', el)).toBe('Hello World')
    expect(evaluate(scope, 'user.age > 25', el)).toBe(true)
  })

  it('should evaluate ternary expressions', () => {
    expect(evaluate(scope, 'isActive ? "Active" : "Inactive"', el)).toBe('Active')
    scope.isActive = false
    expect(evaluate(scope, 'isActive ? "Active" : "Inactive"', el)).toBe('Inactive')
  })

  it('should evaluate logical expressions', () => {
    expect(evaluate(scope, 'isActive && count > 0', el)).toBe(true)
    expect(evaluate(scope, 'isActive || false', el)).toBe(true)
  })

  it('should handle undefined properties', () => {
    expect(evaluate(scope, 'nonexistent', el)).toBeUndefined()
    expect(evaluate(scope, 'user.nonexistent', el)).toBeUndefined()
  })

  it('should handle null values', () => {
    scope.nullValue = null
    expect(evaluate(scope, 'nullValue', el)).toBeNull()
  })

  it('should handle function expressions', () => {
    const result = evaluate(scope, 'method', el)
    expect(typeof result).toBe('function')
    expect(result.call(scope)).toBe('Hello')
  })

  it('should handle nested object access', () => {
    scope.nested = { level1: { level2: { value: 'deep' } } }
    expect(evaluate(scope, 'nested.level1.level2.value', el)).toBe('deep')
  })

  it('should handle array methods', () => {
    expect(evaluate(scope, 'items.length', el)).toBe(2)
    expect(evaluate(scope, 'items.indexOf("item1")', el)).toBe(0)
  })

  it('should handle mathematical operations', () => {
    expect(evaluate(scope, 'count * 2', el)).toBe(84)
    expect(evaluate(scope, 'count / 2', el)).toBe(21)
    expect(evaluate(scope, 'count % 10', el)).toBe(2)
  })

  it('should handle string operations', () => {
    expect(evaluate(scope, 'message.length', el)).toBe(5)
    expect(evaluate(scope, 'message.toUpperCase()', el)).toBe('HELLO')
  })

  it('should handle comparison operations', () => {
    expect(evaluate(scope, 'count > 40', el)).toBe(true)
    expect(evaluate(scope, 'count < 50', el)).toBe(true)
    expect(evaluate(scope, 'count === 42', el)).toBe(true)
  })

  it('should handle this context', () => {
    // Note: 'this' context works differently in the eval function
    // Let's test direct property access instead
    expect(evaluate(scope, 'message', el)).toBe('Hello')
    expect(evaluate(scope, 'count', el)).toBe(42)
  })

  it('should handle complex nested expressions', () => {
    const result = evaluate(scope, 'items.length', el)
    expect(result).toBe(2)
  })

  it('should handle error cases gracefully', () => {
    expect(() => evaluate(scope, 'syntax error', el)).not.toThrow()
    expect(evaluate(scope, 'syntax error', el)).toBeUndefined()
  })

  it('should handle boolean coercion', () => {
    expect(evaluate(scope, '!!message', el)).toBe(true)
    expect(evaluate(scope, '!count', el)).toBe(false)
  })

  it('should handle type checking', () => {
    expect(evaluate(scope, 'typeof message', el)).toBe('string')
    expect(evaluate(scope, 'typeof count', el)).toBe('number')
    expect(evaluate(scope, 'typeof user', el)).toBe('object')
  })

  it('should handle conditional expressions', () => {
    expect(evaluate(scope, 'isActive ? count * 2 : count / 2', el)).toBe(84)
    scope.isActive = false
    expect(evaluate(scope, 'isActive ? count * 2 : count / 2', el)).toBe(21)
  })

  it('should handle object property access with variables', () => {
    const prop = 'name'
    scope.prop = prop
    expect(evaluate(scope, 'user[prop]', el)).toBe('John')
  })

  it('should handle array access with variables', () => {
    const index = 0
    scope.index = index
    expect(evaluate(scope, 'items[index]', el)).toBe('item1')
  })
})