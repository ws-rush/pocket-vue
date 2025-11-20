/**
 * Element metadata storage using WeakMap for automatic memory management
 */
/**
 * Metadata structure for storing element-related information
 * This allows us to store additional data without polluting the DOM
 */
interface ElementMetadata {
    /** Original display value for v-show directive */
    originalDisplay?: string;
    /** Event listeners attached to this element */
    eventListeners?: Map<string, EventListener[]>;
    /** Custom properties stored on this element */
    customProperties?: Map<string, any>;
    /** Original class value for bind directive */
    originalClass?: string;
}
/**
 * Get metadata for an element, creating it if needed
 */
export declare function getElementMetadata(el: Element): ElementMetadata;
/**
 * Set a specific metadata property for an element
 */
export declare function setElementMetadata<K extends keyof ElementMetadata>(el: Element, key: K, value: ElementMetadata[K]): void;
/**
 * Clear metadata for an element
 */
export declare function clearElementMetadata(el: Element): void;
export {};
