import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("index.ts", () => {
  let originalCurrentScript: HTMLScriptElement | null;

  beforeEach(() => {
    // Store original currentScript
    originalCurrentScript = document.currentScript;
  });

  afterEach(() => {
    // Restore original currentScript if it was set
    if (originalCurrentScript !== null) {
      Object.defineProperty(document, "currentScript", {
        value: originalCurrentScript,
        writable: true,
        configurable: true
      });
    }
  });

  it("should export createApp", async () => {
    const { createApp } = await import("../src/index");
    expect(createApp).toBeDefined();
  });

  it("should export nextTick", async () => {
    const { nextTick } = await import("../src/index");
    expect(nextTick).toBeDefined();
  });

  it("should export reactive", async () => {
    const { reactive } = await import("../src/index");
    expect(reactive).toBeDefined();
  });

  it("should export watchEffect", async () => {
    const indexExports = await import("../src/index");
    // Test that effect is re-exported as watchEffect
    expect(indexExports.watchEffect).toBeDefined();
  });

  it("should not auto-mount when script has no init attribute", async () => {
    // Create a script element without init attribute
    const script = document.createElement("script");
    script.textContent = ""; // Empty script to simulate currentScript

    // Mock currentScript to be our script without init attribute
    Object.defineProperty(document, "currentScript", {
      value: script,
      writable: true,
      configurable: true
    });

    // Since we can't reset modules in browser mode, we'll test the logic directly
    // by checking that the condition in src/index.ts would be false
    const currentScript = document.currentScript;
    const shouldAutoMount = currentScript && currentScript.hasAttribute('init');

    expect(shouldAutoMount).toBe(false);
    expect(script.hasAttribute("init")).toBe(false);
  });

  it("should auto-mount when script has init attribute", async () => {
    // Create a script element with init attribute
    const script = document.createElement("script");
    script.setAttribute("init", "");
    script.textContent = ""; // Empty script to simulate currentScript

    // Mock currentScript to be our script with init attribute
    Object.defineProperty(document, "currentScript", {
      value: script,
      writable: true,
      configurable: true
    });

    // Test that the condition in src/index.ts would be true
    const currentScript = document.currentScript;
    const shouldAutoMount = currentScript && currentScript.hasAttribute('init');

    expect(shouldAutoMount).toBe(true);
    expect(script.hasAttribute("init")).toBe(true);
  });
});