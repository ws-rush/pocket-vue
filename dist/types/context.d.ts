import { effect as rawEffect, ReactiveEffectRunner } from '@vue/reactivity';
import { Block } from './block';
import { Directive } from './directives';
export interface Context {
    key?: any;
    scope: Record<string, any>;
    dirs: Record<string, Directive>;
    blocks: Block[];
    effect: typeof rawEffect;
    effects: ReactiveEffectRunner[];
    cleanups: (() => void)[];
    delimiters: [string, string];
    delimitersRE: RegExp;
}
export declare const createContext: (parent?: Context) => Context;
export declare const createScopedContext: (ctx: Context, data?: {}) => Context;
export declare const bindContextMethods: (scope: Record<string, any>) => void;
