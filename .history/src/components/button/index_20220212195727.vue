<template>
  <button :loading="loading">asd</button>
  <div slot-scope="row" class="list-item1">
    <!--
  	@slot Menu Item footer
		@binding {object} icon icon of the menu item
		@binding {string} text text of the menu item
	  -->
    <slot name="test" :icon="row.item.icon" :text="row.item.text" />
    {{ row.item.text }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
const emit = defineEmits([
  /**
   * the success event
   * @param {Function} callBack 123
   */
  "submit",
]);
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
  setup() {
    const row = ref({
      item: {
        icon: "IconMenu",
        text: "asd",
      },
    });
    return {
      row,
    };
  },
});
</script>
