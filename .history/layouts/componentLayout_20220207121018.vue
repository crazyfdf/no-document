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

<style>
.y-body {
  padding: 4rem;
}
</style>
