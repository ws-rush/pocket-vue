import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "pocket-vue",
  description: "A petite-vue fork with plugins support",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/what-is-pocket-vue' },
      { text: 'API Reference', link: '/api/global-api' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is pocket-vue?', link: '/guide/what-is-pocket-vue' },
            { text: 'Getting Started', link: '/guide/getting-started' },
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Template Syntax', link: '/guide/template-syntax' },
            { text: 'Reactivity', link: '/guide/reactivity' },
            { text: 'Components', link: '/guide/components' },
            { text: 'State Management', link: '/guide/state-management' },
            { text: 'Plugins', link: '/guide/plugins' }
          ]
        },
        {
            text: 'Comparisons',
            items: [
              { text: 'With Standard Vue', link: '/guide/vs-vue' },
              { text: 'With Alpine.js', link: '/guide/vs-alpine' }
            ]
        }
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Global API', link: '/api/global-api' },
            { text: 'Directives', link: '/api/directives' },
            { text: 'Custom Directives', link: '/api/custom-directives' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ws-rush/pocket-vue' }
    ]
  }
})