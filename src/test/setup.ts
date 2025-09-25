import { vi } from 'vitest'

// Mock fetch for API calls
global.fetch = vi.fn()

// Mock Custom Elements API
global.customElements = {
  define: vi.fn(),
  get: vi.fn(),
  upgrade: vi.fn(),
  whenDefined: vi.fn(),
  getName: (() => null) as any
}

// Setup global test utilities
;(global as any).createApp = vi.fn()
;(global as any).reactive = vi.fn()

// happy-dom patching for attribute updates
const originalSetAttribute = Element.prototype.setAttribute;
Element.prototype.setAttribute = function(name: string, value: string) {
  const currentAttribute = this.getAttribute(name);
  if (currentAttribute !== value) {
    // Apply workaround for happy-dom for specific attributes
    if (['id', 'class', 'style', 'title', 'lang', 'dir'].includes(name)) {
      this.removeAttribute(name);
    }
  }
  originalSetAttribute.call(this, name, value);
};