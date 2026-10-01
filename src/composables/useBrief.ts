import { computed, reactive, ref, watch } from "vue";
import {
  analyzeLog,
  InputLimitError,
  sampleLogs,
  type AnalysisResult,
} from "../domain";
import { messages, type Locale } from "../i18n";
export function useBrief() {
  const locale = ref<Locale>("en");
  const t = computed(() => messages[locale.value]);
  const input = reactive({
    log: "",
    command: "",
    workingDirectory: "",
    environment: "",
    question: "",
    literals: "",
  });
  const result = ref<AnalysisResult | null>(null);
  const reviewed = ref(false);
  const tab = ref<"evidence" | "markdown">("evidence");
  const status = ref("");
  const error = ref("");
  const copied = ref(false);
  watch(
    [input, locale],
    () => {
      if (result.value) status.value = t.value.changed;
      result.value = null;
      reviewed.value = false;
      copied.value = false;
      error.value = "";
    },
    { flush: "sync" },
  );
  function generate() {
    error.value = "";
    copied.value = false;
    reviewed.value = false;
    if (!input.log.trim()) {
      error.value = t.value.required;
      return;
    }
    try {
      result.value = analyzeLog({
        log: input.log,
        metadata: {
          command: input.command,
          workingDirectory: input.workingDirectory,
          environment: input.environment,
          question: input.question,
        },
        redactionLiterals: input.literals.split("\n").filter(Boolean),
        locale: locale.value,
      });
      status.value = t.value.generated;
      tab.value = "evidence";
    } catch (caught) {
      result.value = null;
      error.value =
        caught instanceof InputLimitError
          ? locale.value === "zh"
            ? "输入超出限制。日志最多 1 MiB、20,000 行；背景信息与脱敏文本也必须控制长度。请缩小输入后重试。"
            : caught.message
          : t.value.failed;
    }
  }
  function replaceInput(example: boolean) {
    if (
      Object.values(input).some(Boolean) &&
      !window.confirm(example ? t.value.resetConfirm : t.value.clearConfirm)
    )
      return;
    Object.assign(input, {
      log: example ? sampleLogs.maven : "",
      command: example ? "mvn clean package -DskipTests" : "",
      workingDirectory: example ? "/example/demo" : "",
      environment: example ? "JDK 21 · Maven 3.9" : "",
      question: example ? "Why did test compilation run with -DskipTests?" : "",
      literals: "",
    });
    result.value = null;
    reviewed.value = false;
    copied.value = false;
    error.value = "";
    status.value = example ? t.value.exampleLabel : "";
  }
  async function copyBrief() {
    if (!result.value || !reviewed.value) return;
    const requestedResult = result.value;
    try {
      await navigator.clipboard.writeText(requestedResult.markdown);
      if (result.value !== requestedResult || !reviewed.value) return;
      copied.value = true;
      status.value = t.value.copied;
    } catch {
      if (result.value !== requestedResult || !reviewed.value) return;
      copied.value = false;
      tab.value = "markdown";
      status.value = t.value.copyFailed;
    }
  }
  return {
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
  };
}
