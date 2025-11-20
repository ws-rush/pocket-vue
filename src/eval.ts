const evalCache: Record<string, Function> = Object.create(null)

// Expression validation patterns - more conservative to avoid blocking legitimate code
const DANGEROUS_PATTERNS = [
  /\b(eval|Function|setTimeout|setInterval|XMLHttpRequest|fetch|WebSocket|Worker)\b/,
  /\b(window|document|globalThis|global|process|require|import|export)\b/,
  /\b(delete|void|typeof|instanceof)\b.*\(/,
]

const validateExpression = (exp: string): boolean => {
  if (exp == null || exp === '' || exp.length > 1000) return false
  return !DANGEROUS_PATTERNS.some(pattern => pattern.test(exp))
}

export const evaluate = (scope: object, exp: string, _el: Element) => {
  if (!validateExpression(exp)) {
    if (import.meta.env.DEV) {
      console.warn(`Potentially unsafe expression rejected: "${exp}"`)
    }
    return undefined
  }

  try {
    return new Function(`with (this) { return ${exp} }`).call(scope)
  } catch (e) {
    if (import.meta.env.DEV) {
      console.error(`Error evaluating expression "${exp}":`, e)
    }
    return undefined
  }
}

export const execute = (scope: any, exp: string, el?: Node) => {
  if (!validateExpression(exp)) {
    if (import.meta.env.DEV) {
      console.warn(`Potentially unsafe expression rejected: "${exp}"`)
    }
    return undefined
  }

  const fn = evalCache[exp] ?? (evalCache[exp] = toFunction(exp))
  try {
    return fn(scope, el)
  } catch (e) {
    if (import.meta.env.DEV) {
      console.error(`Error executing expression "${exp}":`, e)
    }
    // Remove from cache on error to prevent future failures
    delete evalCache[exp]
    return undefined
  }
}

const toFunction = (exp: string): Function => {
  try {
    return new Function(`$data`, `$el`, `with($data){${exp}}`)
  } catch (e) {
    if (import.meta.env.DEV) {
      console.error(`Invalid expression: ${exp}`, e)
    }
    return () => { }
  }
}
