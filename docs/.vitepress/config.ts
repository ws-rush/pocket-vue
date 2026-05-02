import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { defineConfig } from 'vitepress'
import { withMermaid } from "vitepress-plugin-mermaid";

export default withMermaid(
    defineConfig({
        vite: {
            optimizeDeps: {
                include: ['mermaid', '@braintree/sanitize-url'],
            },
            resolve: {
                alias: {
                    dayjs: 'dayjs/',
                },
            },
        },
        title: "Pocket Vue",
        description: "A lightweight Vue-compatible library for progressive enhancement",
        base: '/',

        buildEnd(siteConfig) {
            const playgroundHtml = join(siteConfig.outDir, 'playground/index.html')
            mkdirSync(dirname(playgroundHtml), { recursive: true })
            copyFileSync(join(siteConfig.root, 'public/playground/index.html'), playgroundHtml)
        },

        themeConfig: {
            logo: '/logo.jpg',
            nav: [
                { text: 'Guide', link: '/start-here/installation' },
                { text: 'API', link: '/directives/v-bind' },
                { text: 'Playground', link: '/playground/', target: '_blank' },
                { text: 'GitHub', link: 'https://github.com/ws-rush/pocket-vue' }
            ],

            search: {
                provider: 'local'
            },

            sidebar: [
                {
                    text: 'Start Here',
                    items: [
                        { text: 'Installation', link: '/start-here/installation' },
                        { text: 'Quick Start', link: '/start-here/quick-start' }
                    ]
                },
                {
                    text: 'Essentials',
                    items: [
                        { text: 'createApp()', link: '/essentials/create-app' },
                        { text: 'v-scope', link: '/essentials/v-scope' },
                        { text: 'Reactivity', link: '/essentials/reactivity' },
                        { text: 'Root Scope', link: '/essentials/root-scope' },
                        { text: 'Scope and Context', link: '/essentials/scope-context' },
                        { text: 'Components', link: '/essentials/components' },
                        { text: 'Lifecycle', link: '/essentials/lifecycle' },
                        { text: 'API Reference', link: '/essentials/api-reference' }
                    ]
                },
                {
                    text: 'Guides',
                    items: [
                        { text: 'State Management', link: '/guides/state-management' },
                        { text: 'Server Integration', link: '/guides/server-integration' },
                        { text: 'Django', link: '/guides/django' },
                        { text: 'Rails', link: '/guides/rails' },
                        { text: 'Laravel', link: '/guides/laravel' },
                        { text: 'ASP.NET Core', link: '/guides/aspnet' },
                        { text: 'Form Handling', link: '/guides/form-handling' }
                    ]
                }, {
                    text: 'Directives',
                    items: [
                        { text: 'v-bind', link: '/directives/v-bind' },
                        { text: 'v-model', link: '/directives/v-model' },
                        { text: 'v-if', link: '/directives/v-if' },
                        { text: 'v-for', link: '/directives/v-for' },
                        { text: 'v-show', link: '/directives/v-show' },
                        { text: 'v-on', link: '/directives/v-on' },
                        { text: 'v-effect', link: '/directives/v-effect' },
                        { text: 'v-html', link: '/directives/v-html' },
                        { text: 'v-text', link: '/directives/v-text' },
                        { text: 'v-cloak', link: '/directives/v-cloak' },
                        { text: 'v-pre', link: '/directives/v-pre' },
                        { text: 'v-once', link: '/directives/v-once' },
                        { text: 'ref', link: '/directives/ref' }
                    ]
                },
                {
                    text: 'Globals',
                    items: [
                        { text: '$el', link: '/globals/el' },
                        { text: '$root', link: '/globals/root' },
                        { text: '$refs', link: '/globals/refs' },
                        { text: '$nextTick', link: '/globals/nextTick' }
                    ]
                },
                {
                    text: 'Advanced',
                    items: [
                        { text: 'Custom Directives', link: '/advanced/custom-directives' },
                        { text: 'Plugins', link: '/advanced/plugins' },
                        { text: 'Global State', link: '/advanced/global-state' },
                        { text: 'Custom Delimiters', link: '/advanced/custom-delimiters' },
                        { text: 'Security', link: '/advanced/security' }
                    ]
                }
            ],

            socialLinks: [
                { icon: 'github', link: 'https://github.com/ws-rush/pocket-vue' }
            ],

            footer: {
                message: 'Released under the MIT License.',
                copyright: 'Copyright © 2025-present'
            }
        }
    })
)