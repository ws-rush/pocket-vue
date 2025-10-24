import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { nextTick } from "../src/scheduler";
import { reactive } from "@vue/reactivity";
import { createApp } from "../src/app";
import { builtInDirectives } from "../src/directives";

describe("directives", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("built-in directives", () => {
    it("should have all built-in directives", () => {
      expect(builtInDirectives.bind).toBeDefined();
      expect(builtInDirectives.on).toBeDefined();
      expect(builtInDirectives.show).toBeDefined();
      expect(builtInDirectives.text).toBeDefined();
      expect(builtInDirectives.html).toBeDefined();
      expect(builtInDirectives.model).toBeDefined();
      expect(builtInDirectives.effect).toBeDefined();
    });
  });

  describe("v-bind", () => {
    it("should bind attribute", () => {
      container.innerHTML = '<div v-bind:id="dynamicId"></div>';
      const app = createApp({ dynamicId: "test-id" });
      app.mount(container);
      const div = container.querySelector("div");
      expect(div?.getAttribute("id")).toBe("test-id");
    });

    it("should update attribute when data changes", async () => {
      container.innerHTML = '<div v-bind:id="dynamicId"></div>';
      const data = reactive({ dynamicId: "initial" });
      const app = createApp(data);
      app.mount(container);
      const div = container.querySelector("div");
      expect(div?.getAttribute("id")).toBe("initial");
      data.dynamicId = "updated";
      await nextTick();
      const updatedDiv = container.querySelector("div");
      expect(updatedDiv?.getAttribute("id")).toBe("updated");
    });

    it("should handle shorthand syntax", () => {
      container.innerHTML = '<div :id="dynamicId"></div>';
      const app = createApp({ dynamicId: "test-id" });
      app.mount(container);
      const div = container.querySelector("div");
      expect(div?.getAttribute("id")).toBe("test-id");
    });

    it("should bind a full object of attributes", async () => {
      container.innerHTML = '<div v-bind="attrs"></div>';
      const attrs = reactive({ id: "test-id", "data-foo": "bar" });
      const app = createApp({ attrs });
      app.mount(container);
      const div = container.querySelector("div");
      expect(div?.getAttribute("id")).toBe("test-id");
      expect(div?.getAttribute("data-foo")).toBe("bar");

      attrs.id = "new-id";
      attrs["data-foo"] = undefined;
      await nextTick();
      expect(div?.getAttribute("id")).toBe("new-id");
      expect(div?.hasAttribute("data-foo")).toBe(false);
    });

    it("should handle .camel modifier", () => {
      container.innerHTML = '<div :foo-bar.camel="id"></div>';
      const app = createApp({ id: "test" });
      app.mount(container);
      const div = container.querySelector("div");
      // @ts-ignore
      expect(div.fooBar).toBe("test");
    });

    it("should bind style as string", async () => {
      container.innerHTML = '<div :style="style"></div>';
      const data = reactive({ style: "color: red" });
      const app = createApp(data);
      app.mount(container);
      const div = container.querySelector("div");
      expect(div?.style.color).toBe("red");

      data.style = "color: blue";
      await nextTick();
      expect(div?.style.color).toBe("blue");
    });

    it("should bind style as object", async () => {
      container.innerHTML = '<div :style="style"></div>';
      const data = reactive({ style: { color: "red", fontSize: "12px" } });
      const app = createApp(data);
      app.mount(container);
      const div = container.querySelector("div");
      expect(div?.style.color).toBe("red");
      expect(div?.style.fontSize).toBe("12px");

      data.style = { color: "blue" };
      await nextTick();
      expect(div?.style.color).toBe("blue");
      expect(div?.style.fontSize).toBe("");
    });

    it("should bind style with !important", async () => {
      container.innerHTML = '<div :style="style"></div>';
      const data = reactive({ style: { color: "red !important" } });
      createApp(data).mount(container);
      const div = container.querySelector("div")!;
      expect(div.style.getPropertyValue("color")).toBe("red");
      expect(div.style.getPropertyPriority("color")).toBe("important");
    });

    it("should bind style with CSS variables", async () => {
      container.innerHTML = '<div :style="style"></div>';
      const data = reactive({ style: { "--color": "red" } });
      createApp(data).mount(container);
      const div = container.querySelector("div")!;
      expect(div.style.getPropertyValue("--color")).toBe("red");
    });

    it("should remove attribute if value is null or undefined", async () => {
      container.innerHTML = '<div :id="id"></div>';
      const data = reactive({ id: "test-id" });
      const app = createApp(data);
      app.mount(container);
      const div = container.querySelector("div");
      expect(div?.getAttribute("id")).toBe("test-id");

      data.id = "test-id";
      await nextTick();
      expect(div?.getAttribute("id")).toBe("test-id");

      data.id = undefined;
      await nextTick();
      expect(div?.hasAttribute("id")).toBe(false);
    });

    it("should bind true-value and false-value for checkboxes", async () => {
      container.innerHTML =
        '<input type="checkbox" :true-value="a" :false-value="b" v-model="checked">';
      const data = reactive({ a: "yes", b: "no", checked: "yes" });
      const app = createApp(data);
      app.mount(container);
      const input = container.querySelector("input")!;
      expect(input.checked).toBe(true);

      input.click();
      await nextTick();
      expect(data.checked).toBe("no");

      data.checked = "yes";
      await nextTick();
      expect(input.checked).toBe(true);
    });

    it("should merge with existing class", async () => {
      container.innerHTML = '<div class="static" :class="dynamic"></div>';
      const data = reactive({ dynamic: "dynamic" });
      const app = createApp(data);
      app.mount(container);
      const div = container.querySelector("div");
      expect(div?.className).toBe("static dynamic");

      data.dynamic = "updated";
      await nextTick();
      expect(div?.className).toBe("static updated");
    });

    it("should bind value for input", async () => {
      container.innerHTML = '<input :value="message">';
      const data = reactive({ message: "hello" });
      const app = createApp(data);
      app.mount(container);
      const input = container.querySelector("input")!;
      expect(input.value).toBe("hello");

      data.message = "world";
      await nextTick();
      expect(input.value).toBe("world");
    });
  });

  describe("v-on", () => {
    it("should attach event handler", () => {
      container.innerHTML = '<button v-on:click="handleClick">Click</button>';

      const handleClick = vi.fn();
      const app = createApp({ handleClick });
      app.mount(container);

      const button = container.querySelector("button");
      button?.click();

      expect(handleClick).toHaveBeenCalled();
    });

    it("should handle shorthand syntax", () => {
      container.innerHTML = '<button @click="handleClick">Click</button>';

      const handleClick = vi.fn();
      const app = createApp({ handleClick });
      app.mount(container);

      const button = container.querySelector("button");
      button?.click();

      expect(handleClick).toHaveBeenCalled();
    });

    it("should handle event modifiers", () => {
      container.innerHTML =
        '<button @click.prevent="handleClick">Click</button>';

      const handleClick = vi.fn();
      const app = createApp({ handleClick });
      app.mount(container);

      const button = container.querySelector("button");
      const event = new MouseEvent("click", { cancelable: true });
      button?.dispatchEvent(event);

      expect(handleClick).toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe("v-show", () => {
    it("should toggle display based on condition", async () => {
      container.innerHTML = '<div v-show="isVisible">Content</div>';

      const data = reactive({ isVisible: true });
      const app = createApp(data);
      app.mount(container);

      const div = container.querySelector("div");
      expect(div?.style.display).not.toBe("none");

      data.isVisible = false;

      // Wait for reactivity to take effect
      await nextTick();

      expect(div?.style.display).toBe("none");
    });
  });

  describe("v-text", () => {
    it("should set text content", () => {
      container.innerHTML = '<div v-text="message"></div>';

      const app = createApp({ message: "Hello World" });
      app.mount(container);

      const div = container.querySelector("div");
      expect(div?.textContent).toBe("Hello World");
    });

    it("should update text content when data changes", async () => {
      container.innerHTML = '<div v-text="message"></div>';

      const data = reactive({ message: "Initial" });
      const app = createApp(data);
      app.mount(container);

      data.message = "Updated";

      // Wait for reactivity to take effect
      await nextTick();

      const div = container.querySelector("div");
      expect(div?.textContent).toBe("Updated");
    });
  });

  describe("v-html", () => {
    it("should set HTML content", () => {
      container.innerHTML = '<div v-html="htmlContent"></div>';

      const app = createApp({ htmlContent: "<span>HTML Content</span>" });
      app.mount(container);

      const div = container.querySelector("div");
      expect(div?.innerHTML).toBe("<span>HTML Content</span>");
    });

    it("should update HTML content when data changes", async () => {
      container.innerHTML = '<div v-html="htmlContent"></div>';

      const data = reactive({ htmlContent: "<span>Initial</span>" });
      const app = createApp(data);
      app.mount(container);

      data.htmlContent = "<span>Updated</span>";

      // Wait for reactivity to take effect
      await nextTick();

      const div = container.querySelector("div");
      expect(div?.innerHTML).toBe("<span>Updated</span>");
    });
  });

  describe("v-model", () => {
    it("should bind input value", () => {
      container.innerHTML = '<input v-model="message">';

      const app = createApp({ message: "test" });
      app.mount(container);

      const input = container.querySelector("input");
      expect(input?.value).toBe("test");
    });

    it("should update data when input changes", () => {
      container.innerHTML = '<input v-model="message">';

      const data = reactive({ message: "initial" });
      const app = createApp(data);
      app.mount(container);

      const input = container.querySelector("input");
      input!.value = "updated";
      input?.dispatchEvent(new Event("input"));

      expect(data.message).toBe("updated");
    });

    it("should work with checkbox with array", async () => {
      container.innerHTML = `
        <input type="checkbox" value="a" v-model="checked">
        <input type="checkbox" value="b" v-model="checked">
      `;

      const data = reactive({ checked: ["a"] });
      const app = createApp(data);
      app.mount(container);

      const a = container.querySelector('input[value="a"]') as HTMLInputElement;
      const b = container.querySelector('input[value="b"]') as HTMLInputElement;

      expect(a.checked).toBe(true);
      expect(b.checked).toBe(false);

      b.click();
      await nextTick();
      expect(data.checked).toEqual(["a", "b"]);

      a.click();
      await nextTick();
      expect(data.checked).toEqual(["b"]);
    });

    it("should work with radio buttons", async () => {
      container.innerHTML = `
        <input type="radio" value="a" v-model="picked">
        <input type="radio" value="b" v-model="picked">
      `;

      const data = reactive({ picked: "a" });
      const app = createApp(data);
      app.mount(container);

      const a = container.querySelector('input[value="a"]') as HTMLInputElement;
      const b = container.querySelector('input[value="b"]') as HTMLInputElement;

      expect(a.checked).toBe(true);
      expect(b.checked).toBe(false);

      b.click();
      await nextTick();
      expect(data.picked).toBe("b");
    });

    it("should work with .lazy modifier", async () => {
      container.innerHTML = '<input v-model.lazy="message">';

      const data = reactive({ message: "initial" });
      const app = createApp(data);
      app.mount(container);

      const input = container.querySelector("input")!;
      input.value = "updated";
      input.dispatchEvent(new Event("input"));
      await nextTick();
      expect(data.message).toBe("initial");

      input.dispatchEvent(new Event("change"));
      await nextTick();
      expect(data.message).toBe("updated");
    });

    it("should work with textarea", () => {
      container.innerHTML = '<textarea v-model="message"></textarea>';

      const app = createApp({ message: "test" });
      app.mount(container);

      const textarea = container.querySelector("textarea");
      expect(textarea?.value).toBe("test");
    });

    it("should work with select", () => {
      container.innerHTML = `
        <select v-model="selected">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>
      `;

      const app = createApp({ selected: "option2" });
      app.mount(container);

      const select = container.querySelector("select");
      expect(select?.value).toBe("option2");
    });

    it("should work with select with multiple attribute", async () => {
      container.innerHTML = `
        <select v-model="selected" multiple>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      `;

      const data = reactive({ selected: ["option1", "option3"] });
      const app = createApp(data);
      app.mount(container);

      const select = container.querySelector("select")!;
      expect(select.selectedOptions[0].value).toBe("option1");
      expect(select.selectedOptions[1].value).toBe("option3");

      select.options[1].selected = true;
      select.dispatchEvent(new Event("change"));
      await nextTick();
      expect(data.selected.sort()).toEqual(
        ["option1", "option2", "option3"].sort(),
      );
    });

    it("should handle composition events", async () => {
      container.innerHTML = '<input v-model="message" />';

      const app = createApp({ message: "" });
      app.mount(container);

      const input = container.querySelector("input") as HTMLInputElement;
      
      // Simulate composition start
      const compositionStartEvent = new Event("compositionstart");
      Object.defineProperty(compositionStartEvent, 'target', {
        value: input,
        writable: false
      });
      input.dispatchEvent(compositionStartEvent);

      // Change value during composition
      input.value = "test";
      input.dispatchEvent(new Event("input"));

      // Should not update the model during composition
      expect(app.scope.message).toBe("");

      // Simulate composition end
      const compositionEndEvent = new Event("compositionend");
      Object.defineProperty(compositionEndEvent, 'target', {
        value: input,
        writable: false
      });
      input.dispatchEvent(compositionEndEvent);

      // Should trigger input event after composition
      const inputEvent = new Event("input");
      input.dispatchEvent(inputEvent);
      expect(app.scope.message).toBe("test");
    });

    it("should handle checkbox with array values", () => {
      container.innerHTML = `
        <input type="checkbox" v-model="selected" value="option1" />
        <input type="checkbox" v-model="selected" value="option2" />
        <input type="checkbox" v-model="selected" value="option3" />
      `;

      const app = createApp({ selected: ["option1", "option3"] });
      app.mount(container);

      const checkboxes = container.querySelectorAll("input[type='checkbox']");
      expect((checkboxes[0] as HTMLInputElement).checked).toBe(true);
      expect((checkboxes[1] as HTMLInputElement).checked).toBe(false);
      expect((checkboxes[2] as HTMLInputElement).checked).toBe(true);

      // Uncheck first option
      (checkboxes[0] as HTMLInputElement).checked = false;
      checkboxes[0].dispatchEvent(new Event("change"));
      expect(app.scope.selected).toEqual(["option3"]);

      // Check second option
      (checkboxes[1] as HTMLInputElement).checked = true;
      checkboxes[1].dispatchEvent(new Event("change"));
      expect(app.scope.selected).toEqual(["option3", "option2"]);
    });

    it("should handle radio buttons", () => {
      container.innerHTML = `
        <input type="radio" v-model="selected" value="option1" />
        <input type="radio" v-model="selected" value="option2" />
        <input type="radio" v-model="selected" value="option3" />
      `;

      const app = createApp({ selected: "option2" });
      app.mount(container);

      const radios = container.querySelectorAll("input[type='radio']");
      expect((radios[0] as HTMLInputElement).checked).toBe(false);
      expect((radios[1] as HTMLInputElement).checked).toBe(true);
      expect((radios[2] as HTMLInputElement).checked).toBe(false);

      // Select first option
      (radios[0] as HTMLInputElement).checked = true;
      radios[0].dispatchEvent(new Event("change"));
      expect(app.scope.selected).toBe("option1");
    });

    it("should handle lazy modifier", async () => {
      container.innerHTML = '<input v-model.lazy="message" />';

      const app = createApp({ message: "" });
      app.mount(container);

      const input = container.querySelector("input") as HTMLInputElement;
      input.value = "test";
      
      // Should not update on input event
      input.dispatchEvent(new Event("input"));
      expect(app.scope.message).toBe("");

      // Should update on change event
      input.dispatchEvent(new Event("change"));
      expect(app.scope.message).toBe("test");
    });

    it("should handle number modifier", () => {
      container.innerHTML = '<input v-model.number="count" />';

      const app = createApp({ count: 0 });
      app.mount(container);

      const input = container.querySelector("input") as HTMLInputElement;
      input.value = "42";
      input.dispatchEvent(new Event("input"));
      expect(app.scope.count).toBe(42);
      expect(typeof app.scope.count).toBe("number");

      input.value = "not a number";
      input.dispatchEvent(new Event("input"));
      expect(app.scope.count).toBe("not a number");
      expect(typeof app.scope.count).toBe("string");
    });

    it("should handle trim modifier", () => {
      container.innerHTML = '<input v-model.trim="message" />';

      const app = createApp({ message: "" });
      app.mount(container);

      const input = container.querySelector("input") as HTMLInputElement;
      input.value = "  test  ";
      input.dispatchEvent(new Event("input"));
      expect(app.scope.message).toBe("test");
    });
  });

  describe("v-ref", () => {
    it("should register element in $refs", () => {
      container.innerHTML = '<div v-ref="myRef"></div>';

      const app = createApp({});
      app.mount(container);

      expect(app.scope.$refs.myRef).toBeTruthy();
      expect(app.scope.$refs.myRef.tagName).toBe("DIV");
    });

    it("should update ref when expression changes", async () => {
      container.innerHTML = '<div v-ref="refName"></div>';

      const app = createApp({ refName: "firstRef" });
      app.mount(container);

      expect(app.scope.$refs.firstRef).toBeTruthy();
      expect(app.scope.$refs.firstRef.tagName).toBe("DIV");

      // Change ref name
      app.scope.refName = "secondRef";
      await nextTick();
      expect(app.scope.$refs.firstRef).toBeUndefined();
      expect(app.scope.$refs.secondRef).toBeTruthy();
    });

    it("should cleanup old ref when ref changes", async () => {
      container.innerHTML = '<div v-ref="refName"></div>';

      const app = createApp({ refName: "firstRef" });
      app.mount(container);

      const element = app.scope.$refs.firstRef;
      expect(element).toBeTruthy();

      // Change ref name
      app.scope.refName = "secondRef";
      await nextTick();
      
      // Old ref should be cleaned up
      expect(app.scope.$refs.firstRef).toBeUndefined();
      // New ref should be set
      expect(app.scope.$refs.secondRef).toBe(element);
    });

    it("should cleanup ref on unmount", () => {
      container.innerHTML = '<div v-ref="myRef"></div>';

      const app = createApp({});
      app.mount(container);

      const element = app.scope.$refs.myRef;
      expect(element).toBeTruthy();

      // Unmount the app
      app.unmount();
      
      // Ref should be cleaned up
      expect(app.scope.$refs.myRef).toBeUndefined();
    });
  });

  describe("v-for", () => {
    it("should render list items", () => {
      container.innerHTML = `
        <div v-for="item in items" :key="item.id">
          {{ item.name }}
        </div>
      `;

      const app = createApp({
        items: [
          { id: 1, name: "Item 1" },
          { id: 2, name: "Item 2" }
        ]
      });
      app.mount(container);

      const divs = container.querySelectorAll("div");
      expect(divs.length).toBe(2);
      expect(divs[0].textContent?.trim()).toBe("Item 1");
      expect(divs[1].textContent?.trim()).toBe("Item 2");
    });

    it("should handle object iteration", () => {
      container.innerHTML = `
        <div v-for="(value, key) in obj" :key="key">
          {{ key }}: {{ value }}
        </div>
      `;

      const app = createApp({
        obj: { a: 1, b: 2 }
      });
      app.mount(container);

      const divs = container.querySelectorAll("div");
      expect(divs.length).toBe(2);
      expect(divs[0].textContent?.trim()).toBe("a: 1");
      expect(divs[1].textContent?.trim()).toBe("b: 2");
    });

    it("should handle array with index", () => {
      container.innerHTML = `
        <div v-for="(item, index) in items" :key="index">
          {{ index }}: {{ item }}
        </div>
      `;

      const app = createApp({
        items: ["a", "b"]
      });
      app.mount(container);

      const divs = container.querySelectorAll("div");
      expect(divs.length).toBe(2);
      expect(divs[0].textContent?.trim()).toBe("0: a");
      expect(divs[1].textContent?.trim()).toBe("1: b");
    });

    it("should handle object iteration with index", () => {
      container.innerHTML = `
        <div v-for="(value, key, index) in obj" :key="key">
          {{ index }}: {{ key }}: {{ value }}
        </div>
      `;

      const app = createApp({
        obj: { a: 1, b: 2 }
      });
      app.mount(container);

      const divs = container.querySelectorAll("div");
      expect(divs.length).toBe(2);
      expect(divs[0].textContent?.trim()).toBe("0: a: 1");
      expect(divs[1].textContent?.trim()).toBe("1: b: 2");
    });

    it("should handle nested object iteration", () => {
      container.innerHTML = `
        <div v-for="(value, key) in obj" :key="key">
          <span v-for="(nestedValue, nestedKey) in value" :key="nestedKey">
            {{ nestedKey }}: {{ nestedValue }}
          </span>
        </div>
      `;

      const app = createApp({
        obj: { 
          group1: { a: 1, b: 2 },
          group2: { c: 3, d: 4 }
        }
      });
      app.mount(container);

      const spans = container.querySelectorAll("span");
      expect(spans.length).toBe(4);
      expect(spans[0].textContent?.trim()).toBe("a: 1");
      expect(spans[1].textContent?.trim()).toBe("b: 2");
      expect(spans[2].textContent?.trim()).toBe("c: 3");
      expect(spans[3].textContent?.trim()).toBe("d: 4");
    });

    it("should handle dynamic list updates", async () => {
      container.innerHTML = `
        <div v-for="item in items" :key="item">
          {{ item }}
        </div>
      `;

      const app = createApp({
        items: ["a", "b"]
      });
      app.mount(container);

      let divs = container.querySelectorAll("div");
      expect(divs.length).toBe(2);

      // Add new item
      app.scope.items.push("c");
      await nextTick();
      divs = container.querySelectorAll("div");
      expect(divs.length).toBe(3);
      expect(divs[2].textContent?.trim()).toBe("c");

      // Remove item
      app.scope.items.pop();
      await nextTick();
      divs = container.querySelectorAll("div");
      expect(divs.length).toBe(2);
    });

    it("should handle empty array", () => {
      container.innerHTML = `
        <div v-for="item in items" :key="item">
          {{ item }}
        </div>
      `;

      const app = createApp({
        items: []
      });
      app.mount(container);

      const divs = container.querySelectorAll("div");
      expect(divs.length).toBe(0);
    });

    it("should handle null/undefined array", () => {
      container.innerHTML = `
        <div v-for="item in items" :key="item">
          {{ item }}
        </div>
      `;

      const app = createApp({
        items: null
      });
      app.mount(container);

      const divs = container.querySelectorAll("div");
      expect(divs.length).toBe(0);

      // Set to undefined
      app.scope.items = undefined;
      expect(divs.length).toBe(0);
    });
  });

  describe("v-effect", () => {
    it("should run effect when mounted", async () => {
      container.innerHTML = '<div v-effect="sideEffect()"></div>';

      const sideEffect = vi.fn();
      const app = createApp({ sideEffect });
      app.mount(container);

      // Wait for effect to run
      await nextTick();

      expect(sideEffect).toHaveBeenCalled();
    });

    it("should run effect when dependencies change", async () => {
      container.innerHTML = '<div v-effect="sideEffect()"></div>';

      let callCount = 0;
      const app = createApp({
        sideEffect: () => {
          callCount++;
        },
      });
      app.mount(container);

      // Wait for effect to run
      await nextTick();

      expect(callCount).toBe(1);
    });
  });
});
