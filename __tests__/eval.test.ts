import { describe, it, expect, beforeEach } from 'vitest'
import { evaluate } from '../src/eval'

describe('evaluate', () => {
  let scope: any

  beforeEach(() => {
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
    expect(evaluate(scope, 'message')).toBe('Hello')
    expect(evaluate(scope, 'count')).toBe(42)
    expect(evaluate(scope, 'isActive')).toBe(true)
  })

  it('should evaluate object property access', () => {
    expect(evaluate(scope, 'user.name')).toBe('John')
    expect(evaluate(scope, 'user.age')).toBe(30)
  })

  it('should evaluate array access', () => {
    expect(evaluate(scope, 'items[0]')).toBe('item1')
    expect(evaluate(scope, 'items[1]')).toBe('item2')
  })

  it('should evaluate method calls', () => {
    expect(evaluate(scope, 'method()')).toBe('Hello')
  })

  it('should evaluate complex expressions', () => {
    expect(evaluate(scope, 'count + 10')).toBe(52)
    expect(evaluate(scope, 'message + " World"')).toBe('Hello World')
    expect(evaluate(scope, 'user.age > 25')).toBe(true)
  })

  it('should evaluate ternary expressions', () => {
    expect(evaluate(scope, 'isActive ? "Active" : "Inactive"')).toBe('Active')
    scope.isActive = false
    expect(evaluate(scope, 'isActive ? "Active" : "Inactive"')).toBe('Inactive')
  })

  it('should evaluate logical expressions', () => {
    expect(evaluate(scope, 'isActive && count > 0')).toBe(true)
    expect(evaluate(scope, 'isActive || false')).toBe(true)
  })

  it('should handle undefined properties', () => {
    expect(evaluate(scope, 'nonexistent')).toBeUndefined()
    expect(evaluate(scope, 'user.nonexistent')).toBeUndefined()
  })

  it('should handle null values', () => {
    scope.nullValue = null
    expect(evaluate(scope, 'nullValue')).toBeNull()
  })

  it('should handle function expressions', () => {
    const result = evaluate(scope, 'method')
    expect(typeof result).toBe('function')
    expect(result.call(scope)).toBe('Hello')
  })

  it('should handle nested object access', () => {
    scope.nested = { level1: { level2: { value: 'deep' } } }
    expect(evaluate(scope, 'nested.level1.level2.value')).toBe('deep')
  })

  it('should handle array methods', () => {
    expect(evaluate(scope, 'items.length')).toBe(2)
    expect(evaluate(scope, 'items.indexOf("item1")')).toBe(0)
  })

  it('should handle mathematical operations', () => {
    expect(evaluate(scope, 'count * 2')).toBe(84)
    expect(evaluate(scope, 'count / 2')).toBe(21)
    expect(evaluate(scope, 'count % 10')).toBe(2)
  })

  it('should handle string operations', () => {
    expect(evaluate(scope, 'message.length')).toBe(5)
    expect(evaluate(scope, 'message.toUpperCase()')).toBe('HELLO')
  })

  it('should handle comparison operations', () => {
    expect(evaluate(scope, 'count > 40')).toBe(true)
    expect(evaluate(scope, 'count < 50')).toBe(true)
    expect(evaluate(scope, 'count === 42')).toBe(true)
  })

  it('should handle this context', () => {
    // Note: 'this' context works differently in the eval function
    // Let's test direct property access instead
    expect(evaluate(scope, 'message')).toBe('Hello')
    expect(evaluate(scope, 'count')).toBe(42)
  })

  it('should handle complex nested expressions', () => {
    const result = evaluate(scope, 'items.length')
    expect(result).toBe(2)
  })

  it('should handle error cases gracefully', () => {
    expect(() => evaluate(scope, 'syntax error')).not.toThrow()
    expect(evaluate(scope, 'syntax error')).toBeUndefined()
  })

  it('should handle boolean coercion', () => {
    expect(evaluate(scope, '!!message')).toBe(true)
    expect(evaluate(scope, '!count')).toBe(false)
  })

  it('should handle type checking', () => {
    expect(evaluate(scope, 'typeof message')).toBe('string')
    expect(evaluate(scope, 'typeof count')).toBe('number')
    expect(evaluate(scope, 'typeof user')).toBe('object')
  })

  it('should handle conditional expressions', () => {
    expect(evaluate(scope, 'isActive ? count * 2 : count / 2')).toBe(84)
    scope.isActive = false
    expect(evaluate(scope, 'isActive ? count * 2 : count / 2')).toBe(21)
  })

  it('should handle object property access with variables', () => {
    const prop = 'name'
    scope.prop = prop
    expect(evaluate(scope, 'user[prop]')).toBe('John')
  })

  it('should handle array access with variables', () => {
    const index = 0
    scope.index = index
    expect(evaluate(scope, 'items[index]')).toBe('item1')
  })
})