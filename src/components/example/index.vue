<template>
  <div>
    <div slot-scope="row" class="list-item1">
      <!--
  	@slot Menu Item footer
		@binding {object} icon icon of the menu item
		@binding {string} text text of the menu item
	  -->
      <slot name="test" :icon="row.item.icon" :text="row.item.text" />
      {{ row.item.text }}
    </div>
    <div>
      <y-calendar
        v-model="date"
        show-button-bar
        show-time
        selectionMode="multiple"
        view="month"
        :min-date="new Date()"
      />
      <y-time-picker v-model="time" show-button-bar format="HH:mm:ss" />
    </div>
    <div>
      <button @click="showSuccess">Success</button>
    </div>
    <y-toast :base-z-index="99999" :auto-z-index="true" />
  </div>
</template>

<script lang="ts" setup name="Example">
import YToast from "../toast/index.vue";
import { useToast } from "../toast";
import YCalendar from "../calendar/index.vue";
import YTimePicker from "../time-picker/index.vue";

const toast = useToast();

const showSuccess = () => {
  toast.add({
    severity: "warning",
    detail: "Message Content",
    title: "你好",
  });
};

const date = ref("");
const time = ref("");

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
    colorSelect: string;
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
    text: "",
  },
});
</script>
