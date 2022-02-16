<template>
  <div>
    <slot name="header" />
    <slot />
  </div>
</template>

<script setup>
definePageMeta({
  layout: true,
});
</script>
