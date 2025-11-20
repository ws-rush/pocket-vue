import { isArray, isObject } from '@vue/shared'
import { Block } from '../block'
import { evaluate } from '../eval'
import { Context, createScopedContext } from '../context'
import { DIRECTIVE_PATTERNS } from '../utils'

// Use centralized regex patterns
const forAliasRE = DIRECTIVE_PATTERNS.FOR_ALIAS_RE
const forIteratorRE = DIRECTIVE_PATTERNS.FOR_ITERATOR_RE
const stripParensRE = DIRECTIVE_PATTERNS.STRIP_PARENS_RE
const destructureRE = DIRECTIVE_PATTERNS.DESTRUCTURE_RE

type KeyToIndexMap = Map<any, number>

const updateBlocks = (
  newChildCtxs: Context[],
  oldBlocks: Block[],
  newKeyToIndexMap: KeyToIndexMap,
  prevKeyToIndexMap: KeyToIndexMap,
  anchor: Node,
  parent: Element,
  el: Element,
  ctx: Context
): Block[] => {
  const newBlocks: Block[] = new Array(newChildCtxs.length)
  const oldKeyToBlockMap: Map<any, Block> = new Map()

  // Map old blocks by key for efficient lookup
  oldBlocks.forEach(block => {
    if (block.key != null) {
      oldKeyToBlockMap.set(block.key, block)
    }
  })

  // Iterate new children, trying to reuse or create blocks
  for (let i = 0; i < newChildCtxs.length; i++) {
    const newChildCtx = newChildCtxs[i]
    const newKey = newChildCtx.key
    let block: Block | undefined

    if (newKey != null) {
      // Try to find an old block with the same key
      block = oldKeyToBlockMap.get(newKey)
      if (block) {
        // Reuse existing block
        Object.assign(block.ctx.scope, newChildCtx.scope)
        oldKeyToBlockMap.delete(newKey) // Mark as used
      }
    }

    if (!block) {
      // No reusable block found, create a new one
      block = new Block(el, newChildCtx)
      block.key = newKey
    }
    newBlocks[i] = block
  }

  // Remove old blocks that were not reused
  oldKeyToBlockMap.forEach(block => block.remove())

  // Perform DOM operations (insert/move) to match the new order
  // We need to insert blocks in reverse order to ensure the anchor points are valid
  for (let i = newBlocks.length - 1; i >= 0; i--) {
    const block = newBlocks[i]
    const nextBlock = newBlocks[i + 1]
    const expectedNextEl = nextBlock ? nextBlock.el : anchor

    // Check if block needs to be moved
    // For fragments, we check the end marker's nextSibling
    // For regular elements, we check the element's nextSibling
    const blockEnd = block.isFragment ? block.end : block.el
    const actualNextEl = blockEnd?.nextSibling

    // Only move if not already in the correct position
    if (actualNextEl !== expectedNextEl) {
      block.insert(parent, expectedNextEl)
    }
  }

  return newBlocks
}

export const _for = (el: Element, exp: string, ctx: Context) => {
  const inMatch = exp.match(forAliasRE)
  if (!inMatch) {
    import.meta.env.DEV && console.warn(`invalid v-for expression: ${exp}`)
    return
  }

  const nextNode = el.nextSibling

  const parent = el.parentElement!
  const anchor = new Text('')
  parent.insertBefore(anchor, el)
  parent.removeChild(el)

  const sourceExp = inMatch[2].trim()
  let valueExp = inMatch[1].trim().replace(stripParensRE, '').trim()
  let destructureBindings: string[] | undefined
  let isArrayDestructure = false
  let indexExp: string | undefined
  let objIndexExp: string | undefined

  let keyAttr = 'key'
  let keyExp =
    el.getAttribute(keyAttr) ||
    el.getAttribute((keyAttr = ':key')) ||
    el.getAttribute((keyAttr = 'v-bind:key'))
  if (keyExp) {
    el.removeAttribute(keyAttr)
    if (keyAttr === 'key') keyExp = JSON.stringify(keyExp)
  }

  let match
  if ((match = valueExp.match(forIteratorRE))) {
    valueExp = valueExp.replace(forIteratorRE, '').trim()
    indexExp = match[1].trim()
    if (match[2]) {
      objIndexExp = match[2].trim()
    }
  }

  if ((match = valueExp.match(destructureRE))) {
    destructureBindings = match[1].split(',').map((s) => s.trim())
    isArrayDestructure = valueExp[0] === '['
  }

  let mounted = false
  let blocks: Block[]
  let childCtxs: Context[]
  let keyToIndexMap: Map<any, number>

  const createChildContexts = (source: unknown): [Context[], KeyToIndexMap] => {
    const map: KeyToIndexMap = new Map()
    const ctxs: Context[] = []

    if (isArray(source)) {
      for (let i = 0; i < source.length; i++) {
        ctxs.push(createChildContext(map, source[i], i))
      }
    } else if (typeof source === 'number') {
      for (let i = 0; i < source; i++) {
        ctxs.push(createChildContext(map, i + 1, i))
      }
    } else if (isObject(source)) {
      let i = 0
      for (const key in source) {
        ctxs.push(createChildContext(map, source[key], i++, key))
      }
    }

    return [ctxs, map]
  }

  const createChildContext = (
    map: KeyToIndexMap,
    value: any,
    index: number,
    objKey?: string
  ): Context => {
    const data: any = {}
    if (destructureBindings) {
      destructureBindings.forEach(
        (b, i) => (data[b] = value[isArrayDestructure ? i : b])
      )
    } else {
      data[valueExp] = value
    }
    if (objKey) {
      indexExp && (data[indexExp] = objKey)
      objIndexExp && (data[objIndexExp] = index)
    } else {
      indexExp && (data[indexExp] = index)
    }
    const childCtx = createScopedContext(ctx, data)
    const key = keyExp ? evaluate(childCtx.scope, keyExp, el) : index
    map.set(key, index)
    childCtx.key = key
    return childCtx
  }

  const mountBlock = (ctx: Context, ref: Node) => {
    const block = new Block(el, ctx)
    block.key = ctx.key
    block.insert(parent, ref)
    return block
  }

  ctx.effect(() => {
    const source = evaluate(ctx.scope, sourceExp, el)
    const prevKeyToIndexMap = keyToIndexMap
      ;[childCtxs, keyToIndexMap] = createChildContexts(source)
    if (!mounted) {
      blocks = childCtxs.map((s) => mountBlock(s, anchor))
      mounted = true
    } else {
      blocks = updateBlocks(childCtxs, blocks, keyToIndexMap, prevKeyToIndexMap, anchor, parent, el, ctx)
    }
  })

  return nextNode
}
