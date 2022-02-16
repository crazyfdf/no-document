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

<script lang="ts" setup name="Example">
const emit = defineEmits({
  /**
   * Document your event here
   * @arg {string} payload The first argument
   */
  submit: (payload) => {
    if (payload.email && payload.password) {
      return true;
    } else {
      console.warn("Invalid submit event payload!");
      return false;
    }
  },
});
withDefaults(
  defineProps<{
    loading: boolean;
    /**
     * A very nice prop, now accepting numbers
     */
    testProp: number;
    /**
     * An old prop
     * @deprecated prefer using the other prop
     */
    anotherTestProps?: boolean;
  }>(),
  {
    /**
     * loading
     */
    loading: false,
  }
);

const row = ref({
  item: {
    icon: "IconMenu",
    text: "asd",
  },
});
</script>
