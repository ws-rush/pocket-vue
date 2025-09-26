import { reactive } from '@vue/reactivity';
import { ReactiveEffectRunner } from '@vue/reactivity';
import { effect as watchEffect } from '@vue/reactivity';

declare class Block {
    template: Element | DocumentFragment;
    ctx: Context;
    key?: any;
    parentCtx?: Context;
    isFragment: boolean;
    start?: Text;
    end?: Text;
    get el(): Element | Text;
    constructor(template: Element, parentCtx: Context, isRoot?: boolean);
    insert(parent: Element | DocumentFragment | Document, anchor?: Node | null): void;
    remove(): void;
    teardown(): void;
}

declare interface Context {
    key?: any;
    scope: Record<string, any>;
    dirs: Record<string, Directive>;
    blocks: Block[];
    effect: typeof watchEffect;
    effects: ReactiveEffectRunner[];
    cleanups: (() => void)[];
    delimiters: [string, string];
    delimitersRE: RegExp;
}

export declare const createApp: (initialData?: any) => {
    directive(name: string, def?: Directive): Directive<Element> | /*elided*/ any;
    use(plugin: any, options?: {}): /*elided*/ any;
    mount(el?: string | Element | null): /*elided*/ any | undefined;
    unmount(): void;
    readonly rootBlocks: Block[];
    readonly scope: Record<string, any>;
};

declare interface Directive<T = Element> {
    (ctx: DirectiveContext<T>): (() => void) | void;
}

declare interface DirectiveContext<T = Element> {
    el: T;
    get: (exp?: string) => any;
    effect: typeof watchEffect;
    exp: string;
    arg?: string;
    modifiers?: Record<string, true>;
    ctx: Context;
}

export declare const nextTick: (fn?: () => void) => Promise<unknown>;

export { reactive }

export { watchEffect }

export { }
