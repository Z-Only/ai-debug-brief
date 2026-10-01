<script setup lang="ts">
import type { AnalysisResult } from "../domain";
import type { Copy } from "../i18n";
defineProps<{ result: AnalysisResult; t: Copy }>();
</script>
<template>
  <div class="evidence-view">
    <details class="context-review" open>
      <summary>{{ t.contextReview }}</summary>
      <dl>
        <dt>{{ t.command }}</dt>
        <dd>{{ result.metadata.command || t.notProvided }}</dd>
        <dt>{{ t.directory }}</dt>
        <dd>{{ result.metadata.workingDirectory || t.notProvided }}</dd>
        <dt>{{ t.environment }}</dt>
        <dd>{{ result.metadata.environment || t.notProvided }}</dd>
        <dt>{{ t.question }}</dt>
        <dd>{{ result.metadata.question || t.notProvided }}</dd>
      </dl>
    </details>
    <h3>{{ t.hypotheses }}</h3>
    <p v-if="!result.signals.length" class="notice">{{ t.noSignals }}</p>
    <article v-for="signal in result.signals" :key="signal.id" class="signal">
      <div class="signal-heading">
        <h4>{{ signal.title }}</h4>
        <a
          :href="signal.documentation.url"
          target="_blank"
          rel="noopener noreferrer"
          >{{ t.guidance
          }}<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path
              d="M4 12 12 4M5 4h7v7"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            /></svg
        ></a>
      </div>
      <div class="line-refs">
        <span v-for="line in signal.lineNumbers" :key="line">L{{ line }}</span>
      </div>
      <p class="signal-count">
        {{ signal.occurrences }} {{ t.occurrences }} ·
        {{ signal.omittedReferences }} {{ t.omittedRefs }}
      </p>
      <p>{{ signal.hypothesis }}</p>
      <h5>{{ t.missing }}</h5>
      <ul>
        <li v-for="question in signal.questions" :key="question">
          {{ question }}
        </li>
      </ul>
    </article>
    <h3 class="excerpt-title">{{ t.excerpt }}</h3>
    <div
      v-for="block in result.evidence"
      :key="block.startLine"
      class="excerpt"
    >
      <div class="excerpt-range">
        L{{ block.startLine }}–L{{ block.endLine }}
      </div>
      <div v-for="line in block.lines" :key="line.number" class="evidence-line">
        <span class="line-number">{{ line.number }}</span
        ><code>{{ line.text || " " }}</code>
      </div>
    </div>
    <details class="warnings">
      <summary>{{ t.limitations }}</summary>
      <ul>
        <li v-for="warning in result.warnings" :key="warning">{{ warning }}</li>
      </ul>
    </details>
  </div>
</template>
