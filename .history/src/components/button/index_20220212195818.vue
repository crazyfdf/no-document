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

<script lang="ts" setup>
import { defineComponent } from "vue";
const emit = defineEmits([
  /**
   * the success event
   * @param {Function} callBack 123
   */
  "submit",
]);

const props = defineProps({
  /**
   * loading
   */
  loading: {
    type: Boolean,
    default: false,
  },
});

const row = ref({
  item: {
    icon: "IconMenu",
    text: "asd",
  },
});
</script>
