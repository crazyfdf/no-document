<template>
  <NuxtLayout name="custom">
    <template #header> Some header template content. </template>

    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
definePageMeta({
  layout: false,
});
</script>
