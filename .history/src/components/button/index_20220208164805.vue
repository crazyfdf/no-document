<template>
  <button :loading="loading">asd</button>
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from "vue";
import { getSizeStyle, isObject } from "../../utils";

function getPath(viewBoxSize: number) {
  return `M ${viewBoxSize / 2} ${
    viewBoxSize / 2
  } m 0, -500 a 500, 500 0 1, 1 0, 1000 a 500, 500 0 1, 1 0, -1000`;
}

/**
 *
 * @displayName button
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
  computed: {
    svgStyle() {
      return {
        "animation-duration": this.animationDuration,
      };
    },
  },
});
</script>

<style scoped>
.spinner {
  display: flex;
  position: relative;
  display: inline-block;
}

.spinner-svg {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: spinner-rotate 2s linear infinite;
  height: 100%;
  width: 100%;
  transform-origin: center center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.spinner-circle {
  stroke-dasharray: 89, 200;
  stroke-dashoffset: 0;
  animation: spinner-dash v-bind(animationDuration) ease-in-out infinite;
  stroke-linecap: round;
}
.spinner-color {
  animation: spinner-dash v-bind(animationDuration) ease-in-out infinite,
    spinner-color v-bind(animationDuration) ease-in-out infinite;
}
@keyframes spinner-rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spinner-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124px;
  }
}

@keyframes spinner-color {
  100%,
  0% {
    stroke: #fff;
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
.spinner__hover {
  fill: none;
  stroke: #1989fa;
  stroke-linecap: round;
}
</style>
