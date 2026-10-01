import { expect, it, vi } from "vitest";
const mount = vi.fn();
const createApp = vi.fn(() => ({ mount }));
vi.mock("vue", async (importOriginal) => ({
  ...(await importOriginal<typeof import("vue")>()),
  createApp,
}));
it("mounts the Vue application into the page entrypoint", async () => {
  await import("../../src/main");
  expect(createApp).toHaveBeenCalledOnce();
  expect(mount).toHaveBeenCalledWith("#app");
});
