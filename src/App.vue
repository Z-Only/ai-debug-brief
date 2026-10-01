<script setup lang="ts">
import AppHeader from "./components/AppHeader.vue";
import LogInput from "./components/LogInput.vue";
import BriefOutput from "./components/BriefOutput.vue";
import { useBrief } from "./composables/useBrief";
import { useTheme } from "./composables/useTheme";
const {
  locale,
  t,
  input,
  result,
  reviewed,
  tab,
  status,
  error,
  copied,
  generate,
  replaceInput,
  copyBrief,
} = useBrief();
const { theme, dark } = useTheme();
</script>
<template>
  <div
    class="app-shell"
    :data-theme="dark ? 'dark' : 'light'"
    :lang="locale === 'zh' ? 'zh-CN' : 'en'"
  >
    <div class="page-container">
      <AppHeader v-model:locale="locale" v-model:theme="theme" :t="t" />
      <main>
        <div class="intro">
          <h1>{{ t.heading }}</h1>
          <p>{{ t.intro }}</p>
        </div>
        <div class="workspace">
          <LogInput
            :model-value="input"
            :t="t"
            :error="error"
            @generate="generate"
            @replace="replaceInput"
          /><BriefOutput
            v-model:tab="tab"
            v-model:reviewed="reviewed"
            :t="t"
            :result="result"
            :copied="copied"
            @copy="copyBrief"
          />
        </div>
        <p class="status" role="status" aria-live="polite">{{ status }}</p>
      </main>
      <footer>{{ t.privacy }}</footer>
    </div>
  </div>
</template>
