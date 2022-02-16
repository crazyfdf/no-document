<template>
  <div>
    通用布局页，default.vue:
    <slot />
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
});
</script>
