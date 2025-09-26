import { Block } from './block';
import { Directive } from './directives';
export declare const createApp: (initialData?: any) => {
    directive(name: string, def?: Directive): Directive<Element> | /*elided*/ any;
    use(plugin: any, options?: {}): /*elided*/ any;
    mount(el?: string | Element | null): /*elided*/ any | undefined;
    unmount(): void;
    readonly rootBlocks: Block[];
    readonly scope: Record<string, any>;
};
