<template>
  <div :class="containerClass" role="separator">
    <div class="y-divider-content" v-if="$slots.default">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "YDivider",
  props: {
    align: {
      type: String,
      default: null,
    },
    layout: {
      type: String,
      default: "horizontal",
    },
    type: {
      type: String,
      default: "solid",
    },
  },
  computed: {
    containerClass() {
      return [
        "y-divider",
        "y-divider-" + this.layout,
        "y-divider-" + this.type,
        {
          "y-divider-left": this.layout === "horizontal" && (!this.align || this.align === "left"),
        },
        {
          "y-divider-center": this.layout === "horizontal" && this.align === "center",
        },
        {
          "y-divider-right": this.layout === "horizontal" && this.align === "right",
        },
        { "y-divider-top": this.layout === "vertical" && this.align === "top" },
        {
          "y-divider-center":
            this.layout === "vertical" && (!this.align || this.align === "center"),
        },
        {
          "y-divider-bottom": this.layout === "vertical" && this.align === "bottom",
        },
      ];
    },
  },
});
</script>

<style scoped>
.y-divider .y-divider-content {
  background-color: #ffffff;
}
.y-divider.y-divider-horizontal {
  margin: 1rem 0;
}
.y-divider.y-divider-horizontal:before {
  border-top: 1px #dee2e6;
}
.y-divider.y-divider-horizontal .y-divider-content {
  padding: 0 0.5rem;
}
.y-divider.y-divider-vertical {
  margin: 0 1rem;
  padding: 1rem 0;
}
.y-divider.y-divider-vertical:before {
  border-left: 1px #dee2e6;
}
.y-divider.y-divider-vertical .y-divider-content {
  padding: 0.5rem 0;
}
.y-divider-horizontal {
  display: flex;
  width: 100%;
  position: relative;
  align-items: center;
}

.y-divider-horizontal:before {
  position: absolute;
  display: block;
  top: 50%;
  left: 0;
  width: 100%;
  content: "";
}

.y-divider-horizontal.y-divider-left {
  justify-content: flex-start;
}

.y-divider-horizontal.y-divider-right {
  justify-content: flex-end;
}

.y-divider-horizontal.y-divider-center {
  justify-content: center;
}

.y-divider-content {
  z-index: 1;
}

.y-divider-vertical {
  min-height: 100%;
  margin: 0 1rem;
  display: flex;
  position: relative;
  justify-content: center;
}

.y-divider-vertical:before {
  position: absolute;
  display: block;
  top: 0;
  left: 50%;
  height: 100%;
  content: "";
}

.y-divider-vertical.y-divider-top {
  align-items: flex-start;
}

.y-divider-vertical.y-divider-center {
  align-items: center;
}

.y-divider-vertical.y-divider-bottom {
  align-items: flex-end;
}

.y-divider-solid.y-divider-horizontal:before {
  border-top-style: solid;
}

.y-divider-solid.y-divider-vertical:before {
  border-left-style: solid;
}

.y-divider-dashed.y-divider-horizontal:before {
  border-top-style: dashed;
}

.y-divider-dashed.y-divider-vertical:before {
  border-left-style: dashed;
}

.y-divider-dotted.y-divider-horizontal:before {
  border-top-style: dotted;
}

.y-divider-dotted.y-divider-horizontal:before {
  border-left-style: dotted;
}
</style>
