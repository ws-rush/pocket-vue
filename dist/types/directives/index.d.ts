import { Context } from '../context';
import { effect as rawEffect } from '@vue/reactivity';
export interface Directive<T = Element> {
    (ctx: DirectiveContext<T>): (() => void) | void;
}
export interface DirectiveContext<T = Element> {
    el: T;
    get: (exp?: string) => any;
    effect: typeof rawEffect;
    exp: string;
    arg?: string;
    modifiers?: Record<string, true>;
    ctx: Context;
}
export declare const builtInDirectives: Record<string, Directive<any>>;
