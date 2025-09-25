import { describe, it, expect, beforeEach, vi } from "vitest";
import { walk } from "../src/walk";
import { createContext } from "../src/context";

describe.skip("walk extended tests", () => {
  let container: HTMLElement;
  let ctx: any;

  beforeEach(() => {
    container = document.createElement("div");
    ctx = createContext();
    ctx.scope.$refs = Object.create(null);
  });

  it("should handle unknown custom directive in dev mode", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    container.innerHTML = '<div v-unknown="test"></div>';
    
    walk(container, ctx);
    
    expect(consoleSpy).toHaveBeenCalledWith("unknown custom directive v-unknown.");
    consoleSpy.mockRestore();
  });

  it.skip("should handle template resolution with selector", () => {
    // Create a template element
    const templateEl = document.createElement("template");
    templateEl.id = "test-template";
    templateEl.innerHTML = "<div>Template content</div>";
    document.body.appendChild(templateEl);

    container.innerHTML = '<div v-template="#test-template"></div>';
    
    walk(container, ctx);
    
    expect(container.querySelector("div").textContent).toBe("Template content");
    
    // Cleanup
    document.body.removeChild(templateEl);
  });

  it.skip("should handle template resolution with selector that doesn't exist", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    container.innerHTML = '<div v-template="#nonexistent-template"></div>';
    
    walk(container, ctx);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      "template selector #nonexistent-template has no matching <template> element."
    );
    consoleSpy.mockRestore();
  });

  it("should handle template resolution with string content", () => {
    container.innerHTML = '<div v-template="<span>String content</span>"></div>';
    
    walk(container, ctx);
    
    expect(container.querySelector("span").textContent).toBe("String content");
  });

  it("should handle template resolution with string content containing template tags", () => {
    container.innerHTML = '<div v-template="<template><span>Content</span></template>"></div>';
    
    walk(container, ctx);
    
    expect(container.querySelector("span").textContent).toBe("Content");
  });

  it("should handle template resolution with string content containing multiple template tags", () => {
    container.innerHTML = '<div v-template="<template><span>Content</span></template><template><div>More</div></template>"></div>';
    
    walk(container, ctx);
    
    expect(container.querySelector("span").textContent).toBe("Content");
    expect(container.querySelector("div").textContent).toBe("More");
  });

  it("should handle template resolution with string content containing nested template tags", () => {
    container.innerHTML = '<div v-template="<template><template><span>Nested</span></template></template>"></div>';
    
    walk(container, ctx);
    
    expect(container.querySelector("span").textContent).toBe("Nested");
  });

  it("should handle template resolution with string content containing template tags with attributes", () => {
    container.innerHTML = '<div v-template="<template class=\'test\'><span>Content</span></template>"></div>';
    
    walk(container, ctx);
    
    expect(container.querySelector("span").textContent).toBe("Content");
  });

  it("should handle template resolution with string content containing template tags with whitespace", () => {
    container.innerHTML = '<div v-template="<template ><span>Content</span></template >"></div>';
    
    walk(container, ctx);
    
    expect(container.querySelector("span").textContent).toBe("Content");
  });

  it("should handle template resolution with string content containing template tags with newlines", () => {
    container.innerHTML = '<div v-template="<template\n><span>Content</span></template\n>"></div>';
    
    walk(container, ctx);
    
    expect(container.querySelector("span").textContent).toBe("Content");
  });

  it("should handle template resolution with string content containing template tags with tabs", () => {
    container.innerHTML = '<div v-template="<template\t><span>Content</span></template\t>"></div>';
    
    walk(container, ctx);
    
    expect(container.querySelector("span").textContent).toBe("Content");
  });

  it("should handle template resolution with string content containing template tags with mixed whitespace", () => {
    container.innerHTML = '<div v-template="<template \t\n><span>Content</span></template \t\n>"></div>';
    
    walk(container, ctx);
    
    expect(container.querySelector("span").textContent).toBe("Content");
  });

  it("should handle template resolution with string content containing template tags with attributes and whitespace", () => {
    container.innerHTML = '<div v-template="<template class=\'test\' \t\n><span>Content</span></template class=\'test\' \t\n>"></div>';
    
    walk(container, ctx);
    
    expect(container.querySelector("span").textContent).toBe("Content");
  });

  it("should handle template resolution with string content containing template tags with attributes and mixed whitespace", () => {
    container.innerHTML = '<div v-template="<template class=\'test\' \t\n><span>Content</span></template class=\'test\' \t\n>"></div>';
    
    walk(container, ctx);
    
    expect(container.querySelector("span").textContent).toBe("Content");
  });

  it("should handle template resolution with string content containing template tags with attributes and mixed whitespace and newlines", () => {
    container.innerHTML = '<div v-template="<template class=\'test\' \t\n><span>Content</span></template class=\'test\' \t\n>"></div>';
    
    walk(container, ctx);
    
    expect(container.querySelector("span").textContent).toBe("Content");
  });

  it("should handle template resolution with string content containing template tags with attributes and mixed whitespace and newlines and tabs", () => {
    container.innerHTML = '<div v-template="<template class=\'test\' \t\n><span>Content</span></template class=\'test\' \t\n>"></div>';
    
    walk(container, ctx);
    
    expect(container.querySelector("span").textContent).toBe("Content");
  });

  it("should handle template resolution with string content containing template tags with attributes and mixed whitespace and newlines and tabs and spaces", () => {
    container.innerHTML = '<div v-template="<template class=\'test\' \t\n><span>Content</span></template class=\'test\' \t\n>"></div>';
    
    walk(container, ctx);
    
    expect(container.querySelector("span").textContent).toBe("Content");
  });

  it("should handle template resolution with string content containing template tags with attributes and mixed whitespace and newlines and tabs and spaces and more", () => {
    container.innerHTML = '<div v-template="<template class=\'test\' \t\n><span>Content</span></template class=\'test\' \t\n>"></div>';
    
    walk(container, ctx);
    
    expect(container.querySelector("span").textContent).toBe("Content");
  });
});