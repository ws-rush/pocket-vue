import { Context } from './context';
export declare class Block {
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
