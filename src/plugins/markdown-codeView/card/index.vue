<template>
  <div class="y-card y-component">
    <div class="y-card-header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <div class="y-card-body">
      <div class="y-card-title" v-if="$slots.title">
        <slot name="title"></slot>
      </div>
      <div class="y-card-subtitle" v-if="$slots.subtitle">
        <slot name="subtitle"></slot>
      </div>
      <div class="y-card-content">
        <slot name="content"></slot>
      </div>
      <div class="y-card-footer" v-if="$slots.footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'YCard',
});
</script>

<style scoped>
.y-card {
  margin: 0;
  padding: 0;
  width: 100%;
  transition: all 0.2s ease;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
}
.y-card-body {
  padding: 1rem;
}
.y-card-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.y-card-subtitle {
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.y-card-content {
  margin-bottom: 0.5rem;
}
.y-card-header img {
  width: 100%;
}
</style>
