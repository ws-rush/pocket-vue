export { define } from './define'
export { createApp } from './app'
export { nextTick } from './scheduler'
export { reactive } from './reactivity'

import { createApp } from './app'

const s = document.currentScript
if (s && s.hasAttribute('init')) {
  createApp().mount()
}
