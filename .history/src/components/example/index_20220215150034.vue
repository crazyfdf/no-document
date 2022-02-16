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
interface Format {
  email: string;
  password: string;
}

defineEmits<{
  /**
   * Cancels everything
   */
  (event: "cancel"): void;
  /**
   * Save the world
   * @arg {{ email: string, password: string }} payload - The payload
   */
  (event: "save", payload: Format): void;
}>();

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
     * radio
     * @type radio
     * @values a,b,c
     */
    radio: string;
    /**
     * checkbox
     * @type checkbox
     * @values a,b,c
     */
    checkbox: string[];
    /**
     * progress
     * @type progress
     */
    progress: number;
    /**
     * color
     * @type color
     * @input colorFormat="hex"
     */
    color: string;
    /**
     * colorSelect
     * @type colorSelect
     */
    colorSelect: string[];
    /**
     * font
     * @type font
     */
    font: string;
    /**
     * text
     * @input rows="2",type="textarea"
     */
    text?: string;
    /**
     * An old prop
     * @deprecated prefer using the other prop
     */
    oldProp?: any;
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
<script>
defineProps<{
  /**
   * radio
   * @type radio
   * @values a,b,c
   */
  radio: string;
  /**
   * checkbox
   * @type checkbox
   * @values a,b,c
   */
  checkbox: string[];
  /**
   * progress
   * @type progress
   */
  progress: number;
  /**
   * color
   * @type color
   * @input colorFormat="hex"
   */
  color: string;
  /**
   * colorSelect
   * @type colorSelect
   */
  colorSelect: string[];
  /**
   * font
   * @type font
   */
  font: string;
}>()
</script>
