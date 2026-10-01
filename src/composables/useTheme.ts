import { onMounted, onUnmounted, ref, watch } from "vue";
export type Theme = "system" | "light" | "dark";
export function useTheme() {
  const theme = ref<Theme>("system");
  const dark = ref(false);
  let media: MediaQueryList | undefined;
  const sync = () => {
    dark.value =
      theme.value === "dark" ||
      (theme.value === "system" && Boolean(media?.matches));
  };
  watch(theme, sync);
  onMounted(() => {
    media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", sync);
    sync();
  });
  onUnmounted(() => media?.removeEventListener("change", sync));
  return { theme, dark };
}
