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