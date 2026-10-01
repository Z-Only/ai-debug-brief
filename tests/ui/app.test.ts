import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import App from "../../src/App.vue";
import * as domain from "../../src/domain";
import { useBrief } from "../../src/composables/useBrief";
import { defineComponent } from "vue";
let wrappers: VueWrapper[] = [];
let mediaListener: () => void;
let media: {
  matches: boolean;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
};
const writeText = vi.fn().mockResolvedValue(undefined);
function app() {
  const wrapper = mount(App, { attachTo: document.body });
  wrappers.push(wrapper);
  return wrapper;
}
async function example(wrapper: VueWrapper) {
  await wrapper.get(".source-actions button").trigger("click");
  await wrapper.get("form").trigger("submit");
}
beforeEach(() => {
  media = {
    matches: false,
    addEventListener: vi.fn((_name, listener) => {
      mediaListener = listener;
    }),
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => media),
  );
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
  writeText.mockReset().mockResolvedValue(undefined);
  vi.stubGlobal("confirm", vi.fn().mockReturnValue(true));
});
afterEach(() => {
  wrappers.forEach((wrapper) => wrapper.unmount());
  wrappers = [];
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
describe("local brief workflow", () => {
  it("starts empty and validates log input without transmitting data", async () => {
    const wrapper = app();
    expect(wrapper.get("textarea").element.value).toBe("");
    expect(wrapper.text()).toContain("no model runs");
    expect(wrapper.find(".empty-state").exists()).toBe(true);
    await wrapper.get("form").trigger("submit");
    expect(wrapper.get('[role="alert"]').text()).toContain("Paste a log");
  });
  it("generates line-linked synthetic evidence, reviews and copies complete Markdown", async () => {
    const wrapper = app();
    await example(wrapper);
    expect(wrapper.find(".signal").exists()).toBe(true);
    expect(wrapper.get(".signal-count").text()).toContain(
      "line references omitted",
    );
    expect(wrapper.get(".stats").text()).toContain("lines included");
    const copy = wrapper.get(".copy-area button");
    expect(copy.attributes("disabled")).toBeDefined();
    await wrapper.get("#markdown-tab").trigger("click");
    const markdown =
      wrapper.get<HTMLTextAreaElement>("#markdown-preview").element.value;
    expect(markdown).toContain("BEGIN UNTRUSTED LOG DATA");
    expect(markdown).toContain("maven");
    await wrapper.get(".review-label input").setValue(true);
    await copy.trigger("click");
    await flushPromises();
    expect(writeText).toHaveBeenCalledWith(markdown);
    expect(copy.text()).toBe("Copied");
    await wrapper.get("#evidence-tab").trigger("click");
    expect(wrapper.find(".evidence-view").exists()).toBe(true);
    await wrapper.get("form").trigger("submit");
    expect(
      wrapper.get(".copy-area button").attributes("disabled"),
    ).toBeDefined();
  });
  it("accepts all metadata and literal masks and invalidates a stale result", async () => {
    const wrapper = app();
    await wrapper
      .get("#build-log")
      .setValue("[ERROR] Example failure at private-project");
    await wrapper.get("#command").setValue("build private-project");
    await wrapper.get("#directory").setValue("/example/private-project");
    await wrapper.get("#environment").setValue("JDK 21");
    await wrapper.get("#question").setValue("Investigate private-project");
    await wrapper.get("#literals").setValue("private-project");
    await wrapper.get("form").trigger("submit");
    expect(wrapper.text()).toContain("No supported rule matched");
    expect(wrapper.get(".context-review").text()).not.toContain(
      "private-project",
    );
    expect(wrapper.get(".context-review").text()).toContain("[REDACTED_");
    expect(wrapper.get(".context-review").text()).toContain("JDK 21");
    await wrapper.get("#markdown-tab").trigger("click");
    const markdown =
      wrapper.get<HTMLTextAreaElement>("#markdown-preview").element.value;
    expect(markdown).not.toContain("private-project");
    expect(markdown).toContain("JDK 21");
    await wrapper.get("#command").setValue("changed command");
    expect(wrapper.find("#markdown-preview").exists()).toBe(false);
    expect(wrapper.get('[role="status"]').text()).toContain("Input changed");
  });
  it("confirms replacing or clearing user input and respects cancel", async () => {
    const wrapper = app();
    await wrapper.get("#build-log").setValue("keep this");
    vi.mocked(window.confirm).mockReturnValue(false);
    await wrapper.get(".source-actions button").trigger("click");
    expect(wrapper.get<HTMLTextAreaElement>("#build-log").element.value).toBe(
      "keep this",
    );
    await wrapper.findAll(".source-actions button")[1]!.trigger("click");
    expect(wrapper.get<HTMLTextAreaElement>("#build-log").element.value).toBe(
      "keep this",
    );
    vi.mocked(window.confirm).mockReturnValue(true);
    await example(wrapper);
    expect(wrapper.find(".signal").exists()).toBe(true);
    await wrapper.findAll(".source-actions button")[1]!.trigger("click");
    expect(wrapper.get<HTMLTextAreaElement>("#build-log").element.value).toBe(
      "",
    );
    expect(wrapper.find(".empty-state").exists()).toBe(true);
    expect(wrapper.get('[role="status"]').text()).toBe("");
  });
  it("falls back to selectable complete Markdown if clipboard permission fails", async () => {
    const wrapper = app();
    await example(wrapper);
    writeText.mockRejectedValue(new Error("denied"));
    await wrapper.get(".review-label input").setValue(true);
    await wrapper.get(".copy-area button").trigger("click");
    await flushPromises();
    expect(wrapper.get('[role="status"]').text()).toContain(
      "Clipboard unavailable",
    );
    expect(
      wrapper.get("#markdown-preview").attributes("readonly"),
    ).toBeDefined();
  });
  it("shows bounds errors and safe generic errors rather than raw exception data", async () => {
    const wrapper = app();
    await wrapper
      .get("#build-log")
      .setValue("x".repeat(domain.MAX_INPUT_BYTES + 1));
    await wrapper.get("form").trigger("submit");
    expect(wrapper.get('[role="alert"]').text()).toContain("1 MiB");
    const spy = vi.spyOn(domain, "analyzeLog").mockImplementation(() => {
      throw new Error("PRIVATE exception data");
    });
    await wrapper.get("#build-log").setValue("log");
    await wrapper.get("form").trigger("submit");
    expect(wrapper.get('[role="alert"]').text()).toContain("Unable to prepare");
    expect(wrapper.text()).not.toContain("PRIVATE exception data");
    spy.mockRestore();
  });
  it("localizes both interface and output, invalidating previous review", async () => {
    const wrapper = app();
    await example(wrapper);
    await wrapper.get("#language").setValue("zh");
    expect(wrapper.get(".app-shell").attributes("lang")).toBe("zh-CN");
    expect(wrapper.find(".empty-state").exists()).toBe(true);
    expect(wrapper.text()).toContain("生成简报");
    await wrapper.get("form").trigger("submit");
    await wrapper.get("#markdown-tab").trigger("click");
    expect(
      wrapper.get<HTMLTextAreaElement>("#markdown-preview").element.value,
    ).toContain("证据");
    await wrapper.get("#language").setValue("en");
    expect(wrapper.get(".app-shell").attributes("lang")).toBe("en");
  });
  it("supports system, light and dark appearance without storing preferences", async () => {
    const wrapper = app();
    expect(wrapper.get(".app-shell").attributes("data-theme")).toBe("light");
    await wrapper.get("#theme").setValue("dark");
    expect(wrapper.get(".app-shell").attributes("data-theme")).toBe("dark");
    await wrapper.get("#theme").setValue("light");
    expect(wrapper.get(".app-shell").attributes("data-theme")).toBe("light");
    await wrapper.get("#theme").setValue("system");
    media.matches = true;
    mediaListener();
    await nextTick();
    expect(wrapper.get(".app-shell").attributes("data-theme")).toBe("dark");
    wrapper.unmount();
    wrappers = [];
    expect(media.removeEventListener).toHaveBeenCalledWith(
      "change",
      mediaListener,
    );
  });
  it("supports keyboard navigation between accessible tabs", async () => {
    const wrapper = app();
    await example(wrapper);
    const tabs = wrapper.get('[role="tablist"]');
    wrapper.get<HTMLButtonElement>("#evidence-tab").element.focus();
    await tabs.trigger("keydown", { key: "ArrowRight" });
    expect(document.activeElement).toBe(wrapper.get("#markdown-tab").element);
    expect(wrapper.get("#markdown-tab").attributes("aria-selected")).toBe(
      "true",
    );
    await tabs.trigger("keydown", { key: "ArrowLeft" });
    expect(document.activeElement).toBe(wrapper.get("#evidence-tab").element);
    expect(wrapper.get("#evidence-tab").attributes("aria-selected")).toBe(
      "true",
    );
    await tabs.trigger("keydown", { key: "End" });
    expect(document.activeElement).toBe(wrapper.get("#markdown-tab").element);
    expect(wrapper.find("#markdown-panel").exists()).toBe(true);
    await tabs.trigger("keydown", { key: "Home" });
    expect(document.activeElement).toBe(wrapper.get("#evidence-tab").element);
    expect(wrapper.find("#evidence-panel").exists()).toBe(true);
    await tabs.trigger("keydown", { key: "x" });
    expect(wrapper.find("#evidence-panel").exists()).toBe(true);
  });
  it("renders HTML-looking logs as inert text", async () => {
    const wrapper = app();
    await wrapper
      .get("#build-log")
      .setValue("<img src=x onerror=alert(1)>\n[ERROR] test failure");
    await wrapper.get("form").trigger("submit");
    expect(wrapper.find(".evidence-view img").exists()).toBe(false);
    expect(wrapper.get(".evidence-view").text()).toContain(
      "<img src=x onerror=alert(1)>",
    );
  });
  it("will not write clipboard without a generated and reviewed brief", async () => {
    let state!: ReturnType<typeof useBrief>;
    const host = mount(
      defineComponent({
        setup() {
          state = useBrief();
          return () => null;
        },
      }),
    );
    wrappers.push(host);
    await state.copyBrief();
    state.input.log = domain.sampleLogs.maven;
    state.generate();
    await state.copyBrief();
    expect(writeText).not.toHaveBeenCalled();
  });
  it("ignores stale clipboard completion after edits and stale failure after regeneration", async () => {
    const wrapper = app();
    await example(wrapper);
    let resolve!: () => void;
    writeText.mockImplementationOnce(
      () =>
        new Promise<void>((done) => {
          resolve = done;
        }),
    );
    await wrapper.get(".review-label input").setValue(true);
    await wrapper.get(".copy-area button").trigger("click");
    await wrapper.get("#build-log").setValue("new log");
    resolve();
    await flushPromises();
    expect(wrapper.get('[role="status"]').text()).toContain("Input changed");
    await wrapper.get("form").trigger("submit");
    let reject!: (error: Error) => void;
    writeText.mockImplementationOnce(
      () =>
        new Promise<void>((_done, fail) => {
          reject = fail;
        }),
    );
    await wrapper.get(".review-label input").setValue(true);
    await wrapper.get(".copy-area button").trigger("click");
    await wrapper.get("form").trigger("submit");
    reject(new Error("late failure"));
    await flushPromises();
    expect(wrapper.get('[role="status"]').text()).toContain("Brief generated");
    expect(wrapper.find("#markdown-preview").exists()).toBe(false);
  });
  it("localizes input bounds messages", async () => {
    const wrapper = app();
    await wrapper.get("#language").setValue("zh");
    await wrapper
      .get("#build-log")
      .setValue("x".repeat(domain.MAX_INPUT_BYTES + 1));
    await wrapper.get("form").trigger("submit");
    expect(wrapper.get('[role="alert"]').text()).toContain("输入超出限制");
  });
});
