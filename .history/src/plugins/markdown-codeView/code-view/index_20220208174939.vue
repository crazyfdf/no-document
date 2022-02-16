<template>
  <y-card>
    <template #title></template>
    <template #content v-if="demoComponent">
      <component :is="demoComponent" v-bind="componentProps" />
      <y-divider></y-divider>
      <slot></slot>
      <div @click="showCodeView" class="code-view-handler">
        <svg viewBox="0 0 1024 1024" width="22" height="22">
          <path
            d="M925.731 288.698c-1.261-1.18-3.607-3.272-6.902-6.343-5.486-5.112-11.615-10.758-18.236-16.891-18.921-17.526-38.003-35.028-56.046-51.397-2.038-1.848-2.038-1.835-4.077-3.682-24.075-21.795-44.156-39.556-58.996-52.076-8.682-7.325-15.517-12.807-20.539-16.426-3.333-2.402-6.043-4.13-8.715-5.396-3.365-1.595-6.48-2.566-10.905-2.483C729.478 134.227 720 143.77 720 155.734l0 42.475 0 42.475 0 84.95L720 347l21.205 0L890 347l0 595L358.689 942C323.429 942 295 913.132 295 877.922L295 177l361.205 0c11.736 0 21.25-9.771 21.25-21.5s-9.514-21.5-21.25-21.5l-382.5 0L252 134l0 21.734L252 813l-52.421 0C166.646 813 140 786.928 140 754.678L140 72l566.286 0C739.29 72 766 98.154 766 130.404L766 134l40 0 0-3.596C806 76.596 761.271 33 706.286 33L119.958 33 100 33l0 19.506 0 702.172C100 808.463 144.642 852 199.579 852L252 852l0 25.922C252 936.612 299.979 984 358.689 984l552.515 0L932 984l0-21.237L932 325.635 932 304l0.433 0C932.432 299 930.196 292.878 925.731 288.698zM762 304l0-63.315L762 198.21l0-0.273c14 11.479 30.3 26.369 49.711 43.942 2.022 1.832 2.136 1.832 4.157 3.665 17.923 16.259 36.957 33.492 55.779 50.926 2.878 2.666 5.713 5.531 8.391 7.531L762 304.001z"
            p-id="3428"
          ></path>
        </svg>
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
import YCard from "../card/index.vue";
import YDivider from "../divider/index.vue";
import Prism from "prismjs";
import "./prism.css";

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
  componentProps: {
    type: Object,
    default: {},
  },
});
const codeView = ref<HTMLElement>();
const visit = ref<boolean>(props.showCode);
const demoComponent = computed(
  () => context[`../../../components/${props.path}/index.vue`].default
);

onMounted(() => {
  codeView.value.innerHTML = Prism.highlight(
    decodeURIComponent(props.code),
    Prism.languages.html,
    "html"
  );
  watch(
    () => props.code,
    () => {
      codeView.value.innerHTML = Prism.highlight(
        decodeURIComponent(props.code),
        Prism.languages.html,
        "html"
      );
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

.code-content {
  display: flex;
  padding: 0.5rem;
  border: 1px solid #eff1f8;
}

.code-view-handler {
  display: flex;
  justify-content: center;
  width: 100%;
  cursor: pointer;
}
</style>
