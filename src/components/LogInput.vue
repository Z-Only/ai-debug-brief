<script setup lang="ts">
import type { Copy } from "../i18n";
export interface InputFields {
  log: string;
  command: string;
  workingDirectory: string;
  environment: string;
  question: string;
  literals: string;
}
defineProps<{ t: Copy; error: string }>();
const input = defineModel<InputFields>({ required: true });
defineEmits<{ generate: []; replace: [example: boolean] }>();
</script>
<template>
  <section aria-labelledby="source-title" class="source-column">
    <div class="section-heading">
      <h2 id="source-title">{{ t.source }}</h2>
      <div class="source-actions">
        <button
          class="text-button"
          type="button"
          @click="$emit('replace', true)"
        >
          {{ t.example }}</button
        ><button
          class="text-button"
          type="button"
          @click="$emit('replace', false)"
        >
          {{ t.clear }}
        </button>
      </div>
    </div>
    <form @submit.prevent="$emit('generate')">
      <label class="sr-only" for="build-log">{{ t.log }}</label>
      <textarea
        id="build-log"
        v-model="input.log"
        class="log-editor"
        spellcheck="false"
        autocapitalize="off"
        autocomplete="off"
        aria-describedby="log-hint"
        placeholder="[INFO] Build output…"
      />
      <p id="log-hint" class="field-hint">{{ t.logHint }}</p>
      <details class="form-group" open>
        <summary>{{ t.context }}</summary>
        <div class="fields">
          <label for="command">{{ t.command }}</label
          ><input
            id="command"
            v-model="input.command"
            spellcheck="false"
            autocomplete="off"
          />
          <label for="directory">{{ t.directory }}</label
          ><input
            id="directory"
            v-model="input.workingDirectory"
            spellcheck="false"
            autocomplete="off"
          />
          <label for="environment">{{ t.environment }}</label
          ><textarea
            id="environment"
            v-model="input.environment"
            rows="2"
            spellcheck="false"
          />
          <label for="question">{{ t.question }}</label
          ><textarea id="question" v-model="input.question" rows="2" />
        </div>
      </details>
      <details class="form-group" open>
        <summary>{{ t.redaction }}</summary>
        <div class="redaction-body">
          <p class="field-hint">{{ t.caution }}</p>
          <label for="literals">{{ t.literals }}</label
          ><textarea
            id="literals"
            v-model="input.literals"
            rows="2"
            spellcheck="false"
            aria-describedby="literal-hint"
          />
          <p id="literal-hint" class="field-hint">{{ t.literalHint }}</p>
        </div>
      </details>
      <p v-if="error" role="alert" class="error-message">{{ error }}</p>
      <button class="primary generate" type="submit">{{ t.generate }}</button>
    </form>
  </section>
</template>
