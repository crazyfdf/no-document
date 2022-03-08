<template>
  <teleport to="body">
    <div ref="container" :class="containerClass" v-bind="$attrs">
      <transition-group name="p-toast-message" tag="div" @enter="onEnter" @leave="onLeave">
        <toast-message
          v-for="msg of messages"
          :key="msg.id"
          :message="msg"
          @close="remove($event)"
          :template="$slots.message"
        />
      </transition-group>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import ToastMessage from "./ToastMessage.vue";
import { UniqueComponentId, ZIndex } from "@/utils";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { ToastEventBus } from "./ToastService";
import type { ToastOptions } from "./index";
import { usePrimeVue } from "primevue/config";
type _ToastOptions =
  | ToastOptions
  | {
      id: number;
    };
const primevue = usePrimeVue();
const props = defineProps({
  group: {
    type: String,
    default: "top",
  },
  position: {
    type: String,
    default: "top",
  },
  baseZIndex: {
    type: Number,
  },
  breakpoints: {
    type: Object,
    default: null,
  },
});
let messageIdx = 0;

const messages = ref<_ToastOptions[]>([]);
const container = ref();
let styleElement: HTMLStyleElement | null = null;
const containerClass = computed(() => {
  return ["p-toast p-component p-toast-" + props.position];
});
const attributeSelector = computed(() => {
  return UniqueComponentId();
});
onMounted(() => {
  ToastEventBus.on("add", onAdd);
  ToastEventBus.on("remove", onRemove);
  ToastEventBus.on("remove-group", onRemoveGroup);
  ToastEventBus.on("remove-all-groups", onRemoveAllGroups);
  onEnter();
});

if (props.breakpoints) {
  createStyle();
}
onBeforeUnmount(() => {
  destroyStyle();
  if (container.value) {
    ZIndex.clear(container.value, props.baseZIndex ?? primevue.config.zIndex.modal);
  }

  ToastEventBus.off("add", onAdd);
  ToastEventBus.off("remove", onRemove);
  ToastEventBus.off("remove-group", onRemoveGroup);
  ToastEventBus.off("remove-all-groups", onRemoveAllGroups);
});

function add(message: _ToastOptions) {
  if (message.id !== undefined) {
    messages.value = messages.value.filter((item) => item.id !== message.id);
  } else {
    message.id = messageIdx++;
  }
  messages.value = [...messages.value, message];
}
function remove(message: ToastOptions) {
  let index = -1;
  for (let i = 0; i < messages.value.length; i++) {
    if (messages.value[i] === message) {
      index = i;
      break;
    }
  }

  messages.value.splice(index, 1);
}
function onAdd(message: ToastOptions) {
  if (props.group === message.group) {
    add(message);
  }
}
function onRemove(id: string | symbol) {
  messages.value = messages.value.filter((item) => item.id !== id);
}
function onRemoveGroup(group: string) {
  if (props.group === group) {
    messages.value = [];
  }
}
function onRemoveAllGroups() {
  messages.value = [];
}
function onEnter() {
  container.value.setAttribute(attributeSelector.value, "");

  ZIndex.set("modal", container.value, props.baseZIndex ?? primevue.config.zIndex.modal);
}
function onLeave() {
  if (container.value) {
    ZIndex.clear(container.value, props.baseZIndex ?? primevue.config.zIndex.modal);
  }
}
function createStyle() {
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.type = "text/css";
    document.head.appendChild(styleElement);

    let innerHTML = "";
    for (const breakpoint in props.breakpoints) {
      let breakpointStyle = "";
      for (const styleProp in props.breakpoints[breakpoint]) {
        breakpointStyle +=
          styleProp + ":" + props.breakpoints[breakpoint][styleProp] + "!important;";
      }
      innerHTML += `
                      @media screen and (max-width: ${breakpoint}) {
                          .p-toast[${attributeSelector.value}] {
                              ${breakpointStyle}
                          }
                      }
                  `;
    }

    styleElement.innerHTML = innerHTML;
  }
}
function destroyStyle() {
  if (styleElement) {
    document.head.removeChild(styleElement);
    styleElement = null;
  }
}
</script>

<style scoped>
.p-toast {
  opacity: 0.9;
  position: fixed;
  width: 25rem;
}

.p-toast-right {
  top: 20px;
  right: 20px;
}

.p-toast-top-left {
  top: 20px;
  left: 20px;
}

.p-toast-bottom-left {
  bottom: 20px;
  left: 20px;
}

.p-toast-bottom-right {
  bottom: 20px;
  right: 20px;
}

.p-toast-top {
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.p-toast-bottom-center {
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.p-toast-center {
  left: 50%;
  top: 50%;
  min-width: 20vw;
  transform: translate(-50%, -50%);
}
</style>
