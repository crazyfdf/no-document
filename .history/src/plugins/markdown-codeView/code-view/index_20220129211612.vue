<template>
  <div class="y-title">{{ title }}</div>
  <y-card>
    <template #title></template>
    <template #content v-if="demoComponent">
      <component :is="demoComponent" v-bind="$attrs" />
      <y-divider></y-divider>
      <slot></slot>
      <y-divider></y-divider>
      <div @click="showCodeView" class="code-view-handler">
        <svg viewBox="0 0 1024 1024" width="22" height="22">
          <path
            d="M368.64 223.146667a42.666667 42.666667 0 0 0-60.16 5.546666l-213.333333 256a42.666667 42.666667 0 0 0 0 54.186667l206.08 256a42.666667 42.666667 0 0 0 33.28 15.786667 42.666667 42.666667 0 0 0 33.28-69.546667L183.04 512l191.146667-228.693333a42.666667 42.666667 0 0 0-5.546667-60.16zM929.28 485.12l-203.946667-256a42.666667 42.666667 0 0 0-60.16-6.4 42.666667 42.666667 0 0 0-6.4 60.16L840.96 512l-191.146667 229.12a42.666667 42.666667 0 0 0 5.546667 60.16A42.666667 42.666667 0 0 0 682.666667 810.666667a42.666667 42.666667 0 0 0 32.853333-15.36l213.333333-256a42.666667 42.666667 0 0 0 0.426667-54.186667z"
            v-show="!visit"
            fill="#707070"
          ></path>
          <path
            v-show="visit"
            d="M352.571429 799.428571l-28.571429 28.571429q-5.714286 5.714286-13.142857 5.714286t-13.142857-5.714286L31.428571 561.714286q-5.714286-5.714286-5.714285-13.142857t5.714285-13.142858l266.285715-266.285714q5.714286-5.714286 13.142857-5.714286t13.142857 5.714286l28.571429 28.571429q5.714286 5.714286 5.714285 13.142857t-5.714285 13.142857L128 548.571429l224.571429 224.571428q5.714286 5.714286 5.714285 13.142857t-5.714285 13.142857z m337.714285-609.714285L477.142857 927.428571q-2.285714 7.428571-8.857143 11.142858T454.857143 940l-35.428572-9.714286q-7.428571-2.285714-11.142857-8.857143T406.857143 907.428571l213.142857-737.714285q2.285714-7.428571 8.857143-11.142857t13.428571-1.428572l35.428572 9.714286q7.428571 2.285714 11.142857 8.857143t1.428571 14z m375.428572 372l-266.285715 266.285714q-5.714286 5.714286-13.142857 5.714286t-13.142857-5.714286l-28.571428-28.571429q-5.714286-5.714286-5.714286-13.142857t5.714286-13.142857l224.571428-224.571428-224.571428-224.571429q-5.714286-5.714286-5.714286-13.142857t5.714286-13.142857l28.571428-28.571429q5.714286-5.714286 13.142857-5.714286t13.142857 5.714286l266.285715 266.285714q5.714286 5.714286 5.714285 13.142858t-5.714285 13.142857z"
            fill="#707070"
          ></path>
        </svg>
      </div>
    </template>
    <template #footer>
      <pre class="code-content" v-show="visit">
        <code class="language-html" ref="codeView"></code>
      </pre>
    </template>
  </y-card>
</template>

<script lang="ts" setup>
import "../../../prism.css";
import YCard from "../card/index.vue";
import YDivider from "../divider/index.vue";
import Prism from "prismjs";
const context = import.meta.globEager("../../../components/**/index.vue");

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  desc: {
    type: String,
    default: "",
  },
  showCode: {
    type: Boolean,
    default: false,
  },
  code: {
    type: String,
    default: "",
  },
  path: {
    type: String,
    default: "",
  },
});
const codeView = ref<HTMLElement>();
const visit = ref<boolean>(props.showCode);
const demoComponent = context[`../../../components/${props.path}/index.vue`].default;

onMounted(() => {
  watch(
    () => props.code,
    () => {
      codeView.value.innerHTML = Prism.highlight(props.code, Prism.languages.html, "html");
    }
  );
});

function showCodeView() {
  visit.value = !visit.value;
}
</script>
<style scoped>
p,
ol,
ul {
  margin: 0;
  line-height: inherit;
}
.y-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.code-content {
  display: flex;
  padding: 0.5rem;
  border: 1px solid #eff1f8;
}
pre code {
  background-color: transparent;
  /* font-weight: 700; */
}
.code-view-handler {
  display: flex;
  justify-content: center;
  width: 100%;
  cursor: pointer;
}
</style>
