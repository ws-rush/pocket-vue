import { vi } from 'vitest'

// Mock fetch for API calls
global.fetch = vi.fn()

// Mock Custom Elements API
global.customElements = {
  define: vi.fn(),
  get: vi.fn(),
  upgrade: vi.fn(),
  whenDefined: vi.fn()
}

// Setup global test utilities
global.createApp = vi.fn()
global.reactive = vi.fn()