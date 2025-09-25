const evalCache: Record<string, Function> = Object.create(null)

export const evaluate = (scope: object, exp: string, el: Element) => {
  try {
    return new Function(`with (this) { return ${exp} }`).call(scope)
  } catch (e) {
    // ... error handling
  }
}

export const execute = (scope: any, exp: string, el?: Node) => {
  const fn = evalCache[exp] || (evalCache[exp] = toFunction(exp))
  try {
    return fn(scope, el)
  } catch (e) {
    if (import.meta.env.DEV) {
      console.warn(`Error when evaluating expression "${exp}":`)
    }
    console.error(e)
  }
}

const toFunction = (exp: string): Function => {
  try {
    return new Function(`$data`, `$el`, `with($data){${exp}}`)
  } catch (e) {
    console.error(`${(e as Error).message} in expression: ${exp}`)
    return () => {}
  }
}
