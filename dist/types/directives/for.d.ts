import { Block } from '../block';
import { Context } from '../context';
export type KeyToIndexMap = Map<any, number>;
export declare const updateBlocks: (childCtxs: Context[], blocks: Block[], keyToIndexMap: KeyToIndexMap, prevKeyToIndexMap: KeyToIndexMap, anchor: Node, parent: Element, el: Element, ctx: Context) => Block[];
export declare const _for: (el: Element, exp: string, ctx: Context) => ChildNode | null | undefined;
