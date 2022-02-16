<template>
  <y-spinner :loading="loading"></y-spinner>
  <y-button @click="loading = !loading">Toggle</y-button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup() {
    const loading = ref<boolean>(true);
    return {
      loading,
    };
  },
});
</script>
