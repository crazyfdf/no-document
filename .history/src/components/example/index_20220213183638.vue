<template>
  <button>asd</button>
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
/**
 * This is a Example.
 * @see [Spinner](http://localhost:3000/component/example)
 * @author songyang@yaocheng.cn
 * @displayName Example
 */
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
    /**
     * string
     */
    string: string;
    /**
     * numbers
     */
    number: number;
    /**
     * boolean
     */
    boolean: boolean;
    /**
     * date
     */
    date: Date;
    /**
     * color
     * @type color
     */
    color: string;
    /**
     * radio
     * @type radio
     * @values a,b,c
     */
    radio: string;
    // /**
    //  * checkbox
    //  * @type checkbox
    //  */
    // checkbox: string[];
    /**
     * progress
     * @type progress
     */
    progress: string;
    /**
     * text
     * @type text
     */
    text: string;
    /**
     * An old prop
     * @deprecated prefer using the other prop
     */
    oldProp: any;
    /**
     * new prop
     */
    newProp?: any;
  }>(),
  {
    boolean: false,
  }
);

const row = ref({
  item: {
    icon: "IconMenu",
    text: "asd",
  },
});
</script>
