<script setup lang="ts">
import type { AnalysisResult } from "../domain";
import type { Copy } from "../i18n";
import EvidenceView from "./EvidenceView.vue";
defineProps<{ t: Copy; result: AnalysisResult | null; copied: boolean }>();
const tab = defineModel<"evidence" | "markdown">("tab", { required: true });
const reviewed = defineModel<boolean>("reviewed", { required: true });
defineEmits<{ copy: [] }>();
function moveTab(event: KeyboardEvent) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  tab.value =
    event.key === "Home"
      ? "evidence"
      : event.key === "End"
        ? "markdown"
        : tab.value === "evidence"
          ? "markdown"
          : "evidence";
  document.getElementById(`${tab.value}-tab`)?.focus();
}
</script>
<template>
  <section class="result-column" aria-labelledby="result-title">
    <h2 id="result-title">{{ t.result }}</h2>
    <p class="section-description">{{ t.resultHint }}</p>
    <div v-if="!result" class="empty-state">
      <div class="empty-mark" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
      <h3>{{ t.empty }}</h3>
      <p>{{ t.emptyHint }}</p>
    </div>
    <template v-else>
      <div class="stats">
        <span
          ><strong>{{ result.stats.includedLineCount }}</strong>
          {{ t.lines }}</span
        ><span
          ><strong>{{ result.stats.omittedLineCount }}</strong>
          {{ t.omitted }}</span
        ><span
          ><strong>{{ result.redaction.replacements }}</strong>
          {{ t.masks }}</span
        >
      </div>
      <div
        class="tabs"
        role="tablist"
        :aria-label="t.result"
        @keydown="moveTab"
      >
        <button
          id="evidence-tab"
          type="button"
          role="tab"
          :aria-selected="tab === 'evidence'"
          :tabindex="tab === 'evidence' ? 0 : -1"
          aria-controls="evidence-panel"
          @click="tab = 'evidence'"
        >
          {{ t.evidence }}</button
        ><button
          id="markdown-tab"
          type="button"
          role="tab"
          :aria-selected="tab === 'markdown'"
          :tabindex="tab === 'markdown' ? 0 : -1"
          aria-controls="markdown-panel"
          @click="tab = 'markdown'"
        >
          {{ t.markdown }}
        </button>
      </div>
      <div
        v-if="tab === 'evidence'"
        id="evidence-panel"
        role="tabpanel"
        aria-labelledby="evidence-tab"
      >
        <EvidenceView :result="result" :t="t" />
      </div>
      <div
        v-else
        id="markdown-panel"
        role="tabpanel"
        aria-labelledby="markdown-tab"
      >
        <label for="markdown-preview" class="preview-label">{{
          t.preview
        }}</label
        ><textarea
          id="markdown-preview"
          class="markdown-preview"
          :value="result.markdown"
          readonly
          spellcheck="false"
        />
      </div>
      <div class="copy-area">
        <label class="review-label"
          ><input v-model="reviewed" type="checkbox" />
          <span>{{ t.review }}</span></label
        ><button
          type="button"
          class="primary"
          :disabled="!reviewed"
          @click="$emit('copy')"
        >
          {{ copied ? t.copied : t.copy }}
        </button>
      </div>
    </template>
  </section>
</template>
