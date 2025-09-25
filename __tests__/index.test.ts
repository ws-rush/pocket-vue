import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("index.ts", () => {
  let originalCurrentScript: HTMLScriptElement | null;
  let mockScript: HTMLScriptElement;

  beforeEach(() => {
    // Store original currentScript
    originalCurrentScript = document.currentScript;
    
    // Create a mock script element
    mockScript = document.createElement("script");
    mockScript.setAttribute("init", "");
    Object.defineProperty(document, "currentScript", {
      value: mockScript,
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    // Restore original currentScript
    Object.defineProperty(document, "currentScript", {
      value: originalCurrentScript,
      writable: true,
      configurable: true
    });
  });

  it("should auto-mount when script has init attribute", async () => {
    // Mock createApp and mount
    const mockMount = vi.fn();
    const mockCreateApp = vi.fn(() => ({ mount: mockMount }));
    
    // Mock the module
    vi.doMock("../src/app", () => ({
      createApp: mockCreateApp
    }));

    // Re-import the module to trigger the auto-mount logic
    vi.resetModules();
    await import("../src/index");

    expect(mockCreateApp).toHaveBeenCalled();
    expect(mockMount).toHaveBeenCalled();
  });

  it("should not auto-mount when script has no init attribute", async () => {
    // Remove the init attribute
    mockScript.removeAttribute("init");
    
    const mockMount = vi.fn();
    const mockCreateApp = vi.fn(() => ({ mount: mockMount }));
    
    vi.doMock("../src/app", () => ({
      createApp: mockCreateApp
    }));

    vi.resetModules();
    await import("../src/index");

    expect(mockCreateApp).not.toHaveBeenCalled();
    expect(mockMount).not.toHaveBeenCalled();
  });

  it("should not auto-mount when currentScript is null", async () => {
    Object.defineProperty(document, "currentScript", {
      value: null,
      writable: true,
      configurable: true
    });
    
    const mockMount = vi.fn();
    const mockCreateApp = vi.fn(() => ({ mount: mockMount }));
    
    vi.doMock("../src/app", () => ({
      createApp: mockCreateApp
    }));

    vi.resetModules();
    await import("../src/index");

    expect(mockCreateApp).not.toHaveBeenCalled();
    expect(mockMount).not.toHaveBeenCalled();
  });
});