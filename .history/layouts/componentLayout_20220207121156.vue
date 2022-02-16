<template>
  <div class="y-body">
    <slot name="header" />
    <slot />
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
});
</script>

<style scoped>
.y-body {
  padding: 4rem;
}
</style>
