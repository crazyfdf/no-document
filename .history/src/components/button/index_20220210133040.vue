<template>
  <button :loading="loading">asd</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

/**
 *
 * @displayName Button
 */
export default defineComponent({
  props: {
    /**
     * loading
     */
    loading: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
