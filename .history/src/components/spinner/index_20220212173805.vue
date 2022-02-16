<template>
  <div v-if="loading">
    <div class="spinner" :style="getSizeStyle(size)">
      <svg v-if="type === 'svg'" class="spinner-svg" viewBox="25 25 50 50" :style="svgStyle">
        <circle
          :class="color ? 'spinner-circle' : 'spinner-circle spinner-color'"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          :stroke="color"
          :stroke-width="strokeWidth"
          stroke-miterlimit="10"
        />
      </svg>
      <div v-else class="spinner-svg">
        <!-- @slot icon插槽 -->
        <slot name="icon">
          <svg viewBox="0 0 1024 1024" class="icon" :style="getSizeStyle(size)">
            <path
              d="M1021.269 443.961c-3.186-19.797-7.054-39.367-12.061-58.709-6.371-24.576-14.563-48.925-24.576-72.363-20.253-48.242-48.014-93.298-81.693-133.347-36.409-43.008-80.327-80.099-129.024-108.544-48.014-28.217-100.352-48.242-154.965-59.392-28.217-5.689-56.661-9.102-85.561-9.33-22.528-0.227-45.056 0.683-67.357 2.731-58.027 5.689-115.371 21.845-168.163 46.649-45.283 21.39-87.381 49.152-124.701 82.375-37.319 33.223-69.859 71.907-96.029 114.461-28.899 47.331-50.517 98.987-62.35 153.145-9.557 43.235-14.109 87.837-11.833 132.21 2.048 43.008 8.647 86.016 21.618 127.203 8.192 26.169 17.977 51.655 30.265 76.459 12.061 24.349 26.169 47.787 41.87 69.859 31.403 43.918 69.632 82.83 113.323 114.915 44.601 32.995 94.891 58.482 147.683 75.321 55.069 17.522 113.55 25.714 171.349 23.666 56.434-1.821 112.413-12.743 165.205-32.995 50.745-19.57 98.304-47.559 139.947-82.603 20.935-17.749 39.595-37.774 57.117-58.937 17.749-21.39 33.678-43.918 46.877-68.267 11.378-20.935 20.935-42.781 29.127-64.853 4.096-10.923 7.965-21.845 11.15-33.223 3.413-12.061 5.917-24.576 8.192-36.864 3.413-19.342 4.779-39.367 2.958-58.937-1.593 8.647-2.958 17.067-5.006 25.486-2.503 9.785-5.689 19.342-9.33 28.672-7.282 19.797-16.384 38.912-25.031 58.027-11.15 24.349-24.121 47.559-38.229 70.087-7.282 11.605-14.791 22.983-22.983 33.906-8.192 10.923-17.522 21.39-26.851 31.63-18.659 20.707-38.912 39.139-61.44 55.523-22.983 16.839-47.331 31.63-73.045 43.918-51.427 25.031-107.634 40.05-164.523 45.056-58.254 5.006-117.646-0.683-173.625-17.294-53.248-15.701-103.765-41.187-148.139-74.638-43.008-32.541-80.327-72.59-109.682-117.874-30.72-46.194-51.883-98.304-63.488-152.69-2.958-14.109-5.234-28.672-6.827-43.008-1.365-12.288-2.503-24.803-2.958-37.319-0.683-25.714 0.91-52.338 4.779-77.824 8.419-55.979 26.624-109.909 54.841-159.061 25.031-43.918 57.571-83.513 95.801-116.963 38.229-33.678 81.92-60.757 129.251-79.872 27.307-11.15 55.979-19.342 85.106-24.803 14.791-2.731 29.582-5.006 44.373-6.144 7.282-0.683 14.336-0.683 21.618-1.365 2.958 0 5.917 0.227 8.875 0.227 49.379-0.91 98.987 5.461 146.091 20.253 50.745 15.929 98.531 41.643 139.947 75.093 43.463 35.043 79.645 78.279 106.951 126.976 23.211 41.415 39.822 86.016 49.835 132.437 2.275 10.695 4.096 21.39 5.917 32.085 1.593 9.785 7.054 18.887 15.474 24.349 17.749 11.833 42.553 3.869 51.2-15.246 2.958-6.599 3.869-13.653 2.731-20.253z"
              :fill="color ? color : '#cdcdcd'"
            />
          </svg>
        </slot>
      </div>
    </div>
    <!-- @slot text插槽 -->
    <slot name="text"></slot>
  </div>
</template>

<script lang="ts" setup>
/**
 * Spinner.
 * @see [Spinner](http://localhost:3000/component/spinner)
 * @author SongYang
 * @displayName Spinner
 **/
import { PropType, computed, defineExpose, defineEmits } from "vue";
import { getSizeStyle } from "../../utils";
const emit = defineEmits({
  /**
   *
   * @param {Function} callBack
   */
  submit: (callBack: Function) => {
    callBack();
  },
});
defineExpose({ getSize });
/**
 *
 * @param size
 * @public This is a public method
 */
function getSize(size) {
  return getSizeStyle(size);
}
const props = defineProps({
  /**
   * 圆环宽度（icon不支持）
   */
  strokeWidth: {
    type: Number,
    default: 4,
  },
  /**
   * 动画持续时间
   */
  animationDuration: {
    type: String,
    default: "2s",
  },
  /**
   * 圆环颜色（只支持纯色）
   * @type color
   */
  color: {
    type: String,
  },
  /**
   * 圆环类型
   * @type select
   * @values svg,icon
   */
  type: {
    type: String as PropType<"svg" | "icon">,
    default: "icon",
  },
  /**
   * 圆环大小
   */
  size: { type: Number, default: 18 },

  /**
   * 是否正在加载
   */
  loading: { type: Boolean, default: true },
});
const svgStyle = computed(() => ({
  "animation-duration": props.animationDuration,
}));
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
</style>
