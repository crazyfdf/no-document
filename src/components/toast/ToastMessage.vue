<template>
  <div :class="containerClass" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="p-toast-message-content" :class="message.contentStyleClass">
      <div class="p-toast-message-left">
        <template v-if="!template">
          <span :class="iconClass" v-if="!message.pending"></span>
          <y-spinner v-else></y-spinner>

          <div class="p-toast-message-text">
            <span class="p-toast-title">{{ message.title }}</span>
            <div class="p-toast-detail">{{ message.detail }}</div>
          </div>
        </template>
        <component v-else :is="template" :message="message"></component>
      </div>
      <component
        size="md"
        class="p-toast-icon-close p-link p-toast-message-text"
        :icon-color="iconCloseColor"
        :is="TypeComponents.RemoveIcon"
        @click="onCloseClick"
      ></component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount } from "vue";
import { TypeComponents } from "@/utils/vue/icon";
const props = defineProps({
  message: null,
  template: null,
});
const emits = defineEmits(["close"]);
let closeTimeout: number | null | undefined = null;

if (props.message.life && !props.message.pending) {
  closeTimeout = setTimeout(() => {
    close();
  }, props.message.life) as unknown as number;
}
onBeforeUnmount(() => {
  clearCloseTimeout();
});
function close() {
  emits("close", props.message);
}
function onCloseClick() {
  clearCloseTimeout();
  close();
}
function clearCloseTimeout() {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
    closeTimeout = null;
  }
}

const containerClass = computed(() => {
  return [
    "p-toast-message",
    props.message.styleClass,
    {
      "p-toast-message-info": props.message.severity === "info",
      "p-toast-message-warn": props.message.severity === "warn",
      "p-toast-message-error": props.message.severity === "error",
      "p-toast-message-success": props.message.severity === "success",
    },
  ];
});
const iconClass = computed(() => {
  return [
    "p-toast-message-icon pi",
    {
      "pi-info-circle": props.message.severity === "info",
      "pi-exclamation-triangle": props.message.severity === "warn",
      "pi-times": props.message.severity === "error",
      "pi-check": props.message.severity === "success",
    },
  ];
});

const iconCloseColor = computed(() => {
  return "#000";
});
</script>
<style scoped>
.p-toast-message-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.p-toast-message-left {
  display: flex;
  flex: 1 auto;
}
</style>
