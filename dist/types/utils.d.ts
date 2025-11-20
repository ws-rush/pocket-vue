export declare const checkAttr: (el: Element, name: string) => string | null;
export declare const listen: (el: Element, event: string, handler: EventListener, options?: AddEventListenerOptions) => void;
/**
 * Centralized regex patterns used across directives
 * These are defined once to improve performance and maintainability
 */
export declare const DIRECTIVE_PATTERNS: {
    /** Matches directive prefixes: v-, :, @ */
    readonly DIR_RE: RegExp;
    /** Matches modifiers like .camel, .lazy, etc. */
    readonly MODIFIER_RE: RegExp;
    /** Matches v-for alias pattern: "item in items" or "item of items" */
    readonly FOR_ALIAS_RE: RegExp;
    /** Matches v-for iterators: ", index" or ", key, index" */
    readonly FOR_ITERATOR_RE: RegExp;
    /** Matches parentheses to strip from expressions */
    readonly STRIP_PARENS_RE: RegExp;
    /** Matches destructuring patterns: [a, b] or {a, b} */
    readonly DESTRUCTURE_RE: RegExp;
};
