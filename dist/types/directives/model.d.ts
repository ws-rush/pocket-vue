import { Directive } from '.';
export declare const model: Directive<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
export declare const onCompositionStart: (e: Event) => void;
export declare const onCompositionEnd: (e: Event) => void;
export declare const handleRadioChange: (el: HTMLInputElement, assign: (val: any) => void) => void;
export declare const updateCheckboxValue: (el: HTMLInputElement, get: () => any, oldValue: any) => void;
export declare const handleTextInput: (el: HTMLInputElement | HTMLTextAreaElement, assign: (val: any) => void, resolveValue: (val: string) => any) => void;
export declare const handleCheckboxChange: (el: HTMLInputElement, get: () => any, assign: (val: any) => void) => void;
export declare const updateTextValue: (el: HTMLInputElement | HTMLTextAreaElement, get: () => any, resolveValue: (val: string) => any) => void;
