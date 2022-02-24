<template>
  <div class="flex justify-between">
    <y-spinner />
    <y-spinner v-for="item in items" :key="item.color" :color="item.color" :type="item.type" />
    <!-- type 为 svg时，可以通过覆盖关键帧动画来更改圆环变幻的颜色 -->
    <y-spinner type="svg" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      items: [
        { type: "icon", color: "red" },
        { type: "icon", color: "orange" },
        { type: "icon", color: "yellow" },
        { type: "svg", color: "green" },
        { type: "svg", color: "blue" },
        { type: "svg", color: "cyan" },
        { type: "svg", color: "purple" },
      ],
    };
  },
});
</script>
<style>
@keyframes spinner-color {
  100%,
  0% {
    stroke: rgb(26, 24, 24);
  }
  40% {
    stroke: #53abac;
  }
  66% {
    stroke: #7589c6;
  }
  80%,
  90% {
    stroke: #3451a1;
  }
}
</style>
