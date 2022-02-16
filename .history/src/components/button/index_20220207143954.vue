<template>
  <button>asd</button>
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
 * The only Spinner.
 * @displayName button
 */
export default defineComponent({
  props: {
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
      default: "",
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
  },
  computed: {
    svgStyle() {
      return {
        "animation-duration": this.animationDuration,
      };
    },
  },
  setup(props) {
    let uid = 0;
    const id = `spinner-${uid++}`;
    const strokeWidth = +props.strokeWidth * 10;
    const viewBoxSize = computed(() => strokeWidth * 10 + 1000);
    const path = computed(() => getPath(viewBoxSize.value));
    const hoverStyle = () => {
      const color = isObject(props.color) ? `url(#${id})` : props.color;

      const style = {
        stroke: color,
        strokeWidth: `${+strokeWidth + 10}px`,
      };

      return style;
    };
    const stops = () => {
      const { color } = props;
      if (!isObject(color)) {
        return;
      }
      const Stops = Object.keys(color).sort((a, b) => parseFloat(a) - parseFloat(b));
      return Stops;
    };
    return {
      id,
      path,
      viewBoxSize,
      getSizeStyle,
      stops,
      hoverStyle,
      isObject,
    };
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
