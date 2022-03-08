<template>
  <y-toast v-bind="$attrs" />
  <y-toast group="right" position="right" v-bind="$attrs" />
</template>
<script lang="ts" setup>
import YToast from './toast.vue';
</script>
