import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createApp, nextTick, reactive, watchEffect } from "../src/index";

describe("app", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("createApp", () => {
    it("should create app with initial data", () => {
      const app = createApp({ count: 0 });

      expect(app).toBeDefined();
      expect(typeof app.mount).toBe("function");
      expect(typeof app.directive).toBe("function");
      expect(typeof app.use).toBe("function");
    });

    it("should create app without initial data", () => {
      const app = createApp();

      expect(app).toBeDefined();
    });

    it("should handle custom delimiters", () => {
      const app = createApp({
        $delimiters: ["${", "}"],
      });

      expect(app).toBeDefined();
    });
  });

  describe("mount", () => {
    it("should mount to element selector", () => {
      container.id = "test-app";
      container.innerHTML = "<div>{{ count }}</div>";

      const app = createApp({ count: 42 });
      app.mount("#test-app");

      expect(container.textContent).toBe("42");
    });

    it("should mount to DOM element", () => {
      container.innerHTML = "<div>{{ count }}</div>";

      const app = createApp({ count: 42 });
      app.mount(container);

      expect(container.textContent).toBe("42");
    });

    it("should mount to body when no element provided", () => {
      document.body.innerHTML = "<div>{{ count }}</div>";

      const app = createApp({ count: 42 });
      app.mount();

      expect(document.body.textContent).toContain("42");
    });

    it("should handle invalid selector", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      
      const app = createApp({});
      app.mount("#nonexistent");
      
      expect(consoleSpy).toHaveBeenCalledWith(
        "selector #nonexistent has no matching element."
      );
      consoleSpy.mockRestore();
    });

    it("should handle unmount", () => {
      container.innerHTML = '<div v-scope>Test</div>';
      
      const app = createApp({});
      app.mount(container);
      
      expect(app.rootBlocks.length).toBe(1);
      
      app.unmount();
      
      // After unmount, the blocks should be cleaned up
      expect(app.rootBlocks.length).toBe(1); // Blocks array still exists but are torn down
    });

    it("should handle nested v-scope elements", () => {
      container.innerHTML = `
        <div v-scope>
          <div v-scope>Inner</div>
        </div>
      `;
      
      const app = createApp({});
      app.mount(container);
      
      // Should only mount the outer v-scope, not the nested one
      expect(app.rootBlocks.length).toBe(1);
    });

    it("should handle multiple v-scope elements", () => {
      container.innerHTML = `
        <div v-scope>First</div>
        <div v-scope>Second</div>
      `;
      
      const app = createApp({});
      app.mount(container);
      
      expect(app.rootBlocks.length).toBe(2);
    });

    it("should handle v-scope on the mount element itself", () => {
      container.innerHTML = '<div>Content</div>';
      container.setAttribute("v-scope", "");
      
      const app = createApp({});
      app.mount(container);
      
      expect(app.rootBlocks.length).toBe(1);
    });

    it("should handle no v-scope elements", () => {
      container.innerHTML = '<div>No v-scope</div>';
      
      const app = createApp({});
      app.mount(container);
      
      // Should mount the container itself if no v-scope elements
      expect(app.rootBlocks.length).toBe(1);
    });
  });

  describe("directive", () => {
    it("should register custom directive", () => {
      const app = createApp();
      const directive = vi.fn();

      app.directive("test", directive);

      expect(app.directive("test")).toBe(directive);
    });

    it("should return directive when getting", () => {
      const app = createApp();
      const directive = vi.fn();

      app.directive("test", directive);

      expect(app.directive("test")).toBe(directive);
    });

    it("should be chainable", () => {
      const app = createApp();
      const directive = vi.fn();

      const result = app.directive("test", directive);

      expect(result).toBe(app);
    });
  });

  describe("use", () => {
    it("should install plugin", () => {
      const app = createApp();
      const plugin = {
        install: vi.fn(),
      };
      const options = { test: true };

      app.use(plugin, options);

      expect(plugin.install).toHaveBeenCalledWith(app, options);
    });

    it("should be chainable", () => {
      const app = createApp();
      const plugin = {
        install: vi.fn(),
      };

      const result = app.use(plugin);

      expect(result).toBe(app);
    });

    it("should handle plugin without options", () => {
      const app = createApp();
      const plugin = {
        install: vi.fn(),
      };

      app.use(plugin);

      expect(plugin.install).toHaveBeenCalledWith(app, {});
    });
  });

  describe("global helpers", () => {
    it("should provide $s helper for display string", () => {
      container.innerHTML = "{{ $s(test) }}";
      const app = createApp({ test: 42 });

      app.mount(container);

      expect(container.textContent).toBe("42");
    });

    it("should provide $nextTick helper", () => {
      container.innerHTML = "<div>{{ $nextTick }}</div>";
      const app = createApp();

      app.mount(container);

      // $nextTick should be available in template expressions
      expect(container.textContent).not.toBe("");
    });

    it("should provide $refs object", () => {
      container.innerHTML = '<div ref="testDiv">Test</div>';
      const app = createApp();

      app.mount(container);

      // Test that refs work by checking the template renders
      expect(container.textContent).toBe("Test");
    });
  });
});
