<template>
  <div class="y-scrollpanel y-component">
    <div class="y-scrollpanel-wrapper">
      <div ref="content" class="y-scrollpanel-content" @scroll="moveBar" @mouseenter="moveBar">
        <slot></slot>
      </div>
    </div>
    <div
      ref="xBar"
      class="y-scrollpanel-bar y-scrollpanel-bar-x"
      @mousedown="onXBarMouseDown"
    ></div>
    <div
      ref="yBar"
      class="y-scrollpanel-bar y-scrollpanel-bar-y"
      @mousedown="onYBarMouseDown"
    ></div>
  </div>
</template>

<script>
import { DomHandler } from "primevue/utils";

export default {
  name: "ScrollPanel",
  initialized: false,
  documentResizeListener: null,
  documentMouseMoveListener: null,
  documentMouseUpListener: null,
  frame: null,
  scrollXRatio: null,
  scrollYRatio: null,
  isXBarClicked: false,
  isYBarClicked: false,
  lastPageX: null,
  lastPageY: null,
  mounted() {
    if (this.$el.offsetParent) {
      this.initialize();
    }
  },
  updated() {
    if (!this.initialized && this.$el.offsetParent) {
      this.initialize();
    }
  },
  beforeUnmount() {
    this.unbindDocumentResizeListener();

    if (this.frame) {
      window.cancelAnimationFrame(this.frame);
    }
  },
  methods: {
    initialize() {
      this.moveBar();
      this.bindDocumentResizeListener();
      this.calculateContainerHeight();
    },
    calculateContainerHeight() {
      let containerStyles = getComputedStyle(this.$el),
        xBarStyles = getComputedStyle(this.$refs.xBar),
        pureContainerHeight = DomHandler.getHeight(this.$el) - parseInt(xBarStyles["height"], 10);

      if (containerStyles["max-height"] !== "none" && pureContainerHeight === 0) {
        if (
          this.$refs.content.offsetHeight + parseInt(xBarStyles["height"], 10) >
          parseInt(containerStyles["max-height"], 10)
        ) {
          this.$el.style.height = containerStyles["max-height"];
        } else {
          this.$el.style.height =
            this.$refs.content.offsetHeight +
            parseFloat(containerStyles.paddingTop) +
            parseFloat(containerStyles.paddingBottom) +
            parseFloat(containerStyles.borderTopWidth) +
            parseFloat(containerStyles.borderBottomWidth) +
            "px";
        }
      }
    },
    moveBar() {
      /* horizontal scroll */
      let totalWidth = this.$refs.content.scrollWidth;
      let ownWidth = this.$refs.content.clientWidth;
      let bottom = (this.$el.clientHeight - this.$refs.xBar.clientHeight) * -1;

      this.scrollXRatio = ownWidth / totalWidth;

      /* vertical scroll */
      let totalHeight = this.$refs.content.scrollHeight;
      let ownHeight = this.$refs.content.clientHeight;
      let right = (this.$el.clientWidth - this.$refs.yBar.clientWidth) * -1;

      this.scrollYRatio = ownHeight / totalHeight;

      this.frame = this.requestAnimationFrame(() => {
        if (this.scrollXRatio >= 1) {
          DomHandler.addClass(this.$refs.xBar, "y-scrollpanel-hidden");
        } else {
          DomHandler.removeClass(this.$refs.xBar, "y-scrollpanel-hidden");
          this.$refs.xBar.style.cssText =
            "width:" +
            Math.max(this.scrollXRatio * 100, 10) +
            "%; left:" +
            (this.$refs.content.scrollLeft / totalWidth) * 100 +
            "%;bottom:" +
            bottom +
            "px;";
        }

        if (this.scrollYRatio >= 1) {
          DomHandler.addClass(this.$refs.yBar, "y-scrollpanel-hidden");
        } else {
          DomHandler.removeClass(this.$refs.yBar, "y-scrollpanel-hidden");
          this.$refs.yBar.style.cssText =
            "height:" +
            Math.max(this.scrollYRatio * 100, 10) +
            "%; top: calc(" +
            (this.$refs.content.scrollTop / totalHeight) * 100 +
            "% - " +
            this.$refs.xBar.clientHeight +
            "px);right:" +
            right +
            "px;";
        }
      });
    },
    onYBarMouseDown(e) {
      this.isYBarClicked = true;
      this.lastPageY = e.pageY;
      DomHandler.addClass(this.$refs.yBar, "y-scrollpanel-grabbed");
      DomHandler.addClass(document.body, "y-scrollpanel-grabbed");

      this.bindDocumentMouseListeners();
      e.preventDefault();
    },
    onXBarMouseDown(e) {
      this.isXBarClicked = true;
      this.lastPageX = e.pageX;
      DomHandler.addClass(this.$refs.xBar, "y-scrollpanel-grabbed");
      DomHandler.addClass(document.body, "y-scrollpanel-grabbed");

      this.bindDocumentMouseListeners();
      e.preventDefault();
    },
    onDocumentMouseMove(e) {
      if (this.isXBarClicked) {
        this.onMouseMoveForXBar(e);
      } else if (this.isYBarClicked) {
        this.onMouseMoveForYBar(e);
      } else {
        this.onMouseMoveForXBar(e);
        this.onMouseMoveForYBar(e);
      }
    },
    onMouseMoveForXBar(e) {
      let deltaX = e.pageX - this.lastPageX;
      this.lastPageX = e.pageX;

      this.frame = this.requestAnimationFrame(() => {
        this.$refs.content.scrollLeft += deltaX / this.scrollXRatio;
      });
    },
    onMouseMoveForYBar(e) {
      let deltaY = e.pageY - this.lastPageY;
      this.lastPageY = e.pageY;

      this.frame = this.requestAnimationFrame(() => {
        this.$refs.content.scrollTop += deltaY / this.scrollYRatio;
      });
    },
    onDocumentMouseUp() {
      DomHandler.removeClass(this.$refs.yBar, "y-scrollpanel-grabbed");
      DomHandler.removeClass(this.$refs.xBar, "y-scrollpanel-grabbed");
      DomHandler.removeClass(document.body, "y-scrollpanel-grabbed");

      this.unbindDocumentMouseListeners();
      this.isXBarClicked = false;
      this.isYBarClicked = false;
    },
    requestAnimationFrame(f) {
      let frame = window.requestAnimationFrame || this.timeoutFrame;
      return frame(f);
    },
    refresh() {
      this.moveBar();
    },
    scrollTop(scrollTop) {
      let scrollableHeight = this.$refs.content.scrollHeight - this.$refs.content.clientHeight;
      scrollTop = scrollTop > scrollableHeight ? scrollableHeight : scrollTop > 0 ? scrollTop : 0;
      this.$refs.contentscrollTop = scrollTop;
    },
    bindDocumentMouseListeners() {
      if (!this.documentMouseMoveListener) {
        this.documentMouseMoveListener = (e) => {
          this.onDocumentMouseMove(e);
        };

        document.addEventListener("mousemove", this.documentMouseMoveListener);
      }

      if (!this.documentMouseUpListener) {
        this.documentMouseUpListener = (e) => {
          this.onDocumentMouseUp(e);
        };

        document.addEventListener("mouseup", this.documentMouseUpListener);
      }
    },
    unbindDocumentMouseListeners() {
      if (this.documentMouseMoveListener) {
        document.removeEventListener("mousemove", this.documentMouseMoveListener);
        this.documentMouseMoveListener = null;
      }

      if (this.documentMouseUpListener) {
        document.removeEventListener("mouseup", this.documentMouseUpListener);
        this.documentMouseUpListener = null;
      }
    },
    bindDocumentResizeListener() {
      if (!this.documentResizeListener) {
        this.documentResizeListener = () => {
          this.moveBar();
        };

        window.addEventListener("resize", this.documentResizeListener);
      }
    },
    unbindDocumentResizeListener() {
      if (this.documentResizeListener) {
        window.removeEventListener("resize", this.documentResizeListener);
        this.documentResizeListener = null;
      }
    },
  },
};
</script>

<style scoped>
.y-scrollpanel-wrapper {
  overflow: scroll;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
  float: left;
}

.y-scrollpanel-content {
  height: 100%;
  width: 100%;
  overflow: scroll;
  position: relative;
  box-sizing: border-box;
}

.y-scrollpanel-bar {
  position: relative;
  background: #c1c1c1;
  border-radius: 3px;
  z-index: 2;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.25s linear;
}

.y-scrollpanel-bar-y {
  width: 9px;
  top: 0;
}

.y-scrollpanel-bar-x {
  height: 9px;
  bottom: 0;
}

.y-scrollpanel-hidden {
  visibility: hidden;
}

.y-scrollpanel:hover .y-scrollpanel-bar,
.y-scrollpanel:active .y-scrollpanel-bar {
  opacity: 1;
}

.y-scrollpanel-grabbed {
  user-select: none;
}
</style>
