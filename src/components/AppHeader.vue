<script setup lang="ts">
import type { Copy, Locale } from "../i18n";
import type { Theme } from "../composables/useTheme";
defineProps<{ t: Copy }>();
const locale = defineModel<Locale>("locale", { required: true });
const theme = defineModel<Theme>("theme", { required: true });
</script>
<template>
  <header class="app-header">
    <span class="brand">AI Debug Brief</span>
    <div class="preferences">
      <label class="sr-only" for="language">{{ t.language }}</label>
      <select id="language" v-model="locale">
        <option value="en">English</option>
        <option value="zh">中文</option>
      </select>
      <label class="sr-only" for="theme">{{ t.theme }}</label>
      <select id="theme" v-model="theme">
        <option value="system">{{ t.system }}</option>
        <option value="light">{{ t.light }}</option>
        <option value="dark">{{ t.dark }}</option>
      </select>
    </div>
  </header>
</template>
