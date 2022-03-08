<template>
  <div ref="container">
    <div
      ref="input"
      contenteditable
      :class="[
        'p-inputtext p-component',
        { 'p-input-range': isRangeSelection() },
        { 'p-input-Multiple': isMultipleSelection() },
      ]"
      @focus="onFocus"
      v-bind="$attrs"
    ></div>
  </div>
  <Teleport :to="appendTarget">
    <transition :name="transitionName" @enter="onOverlayEnter($event)" name="p-connected-overlay">
      <div v-if="actualVisible || visible" :class="panelStyleClass" ref="timeOverlay">
        <div class="p-time-panel__content" :class="{ 'has-seconds': showSeconds }">
          <time-spinner
            ref="spinner"
            :role="datetimeRole || 'start'"
            :arrow-control="arrowControl"
            :show-seconds="showSeconds"
            :am-pm-mode="amPmMode"
            v-model="currentTime"
            :disabled-hours="disabledHours"
            :disabled-minutes="disabledMinutes"
            :disabled-seconds="disabledSeconds"
            @set-option="onSetOption"
            @select-range="setSelectionRange"
          />
        </div>
        <div class="p-datepicker-buttonbar" v-if="showButtonBar">
          <y-button :label="clearLabel" @click="onClearButtonClick($event)" class="p-button-text" />
          <y-button :label="applyLabel" @click="onApplyButtonClick($event)" class="p-button-text" />
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";
import { EVENT_CODE } from "@/utils/dom/aria";
import TimeSpinner from "./time-picker.vue";
import { getAvailableArrs, useOldValue } from "./useTimePicker";

import type { PropType } from "vue";
import type { Dayjs } from "dayjs";
import { usePrimeVue } from "primevue/config";
import { isArray } from "@vue/shared";
import { DomHandler, ZIndexUtils } from "primevue/utils";
const primevue = usePrimeVue();
const timeOverlay = ref();
const container = ref();
const panelStyleClass = computed(() => {
  return [
    "p-datepicker p-component",
    {
      "p-input-filled": primevue.config.inputStyle === "filled",
      "p-ripple-disabled": primevue.config.ripple === false,
    },
  ];
});
const applyLabel = computed(() => {
  return primevue.config.locale?.apply;
});
const clearLabel = computed(() => {
  return primevue.config.locale?.clear;
});
const appendTarget = computed(() => {
  return props.appendTo;
});
const props = defineProps({
  appendTo: {
    type: String,
    default: "body",
  },
  actualVisible: {
    type: Boolean,
    default: undefined,
  },
  datetimeRole: {
    type: String,
  },
  modelValue: {
    type: [String, Object] as PropType<String | Dayjs>,
  },
  format: {
    type: String,
    default: "",
  },
  showButtonBar: {
    type: Boolean,
    default: false,
  },
  arrowControl: {
    type: Boolean,
    default: false,
  },
  selectionMode: {
    type: String,
    default: "single",
  },
  disabledHours: Function,
  disabledMinutes: Function,
  disabledSeconds: Function,
  defaultValue: {
    type: [Date, Array] as PropType<Date | Date[]>,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  baseZIndex: {
    type: Number,
    default: 0,
  },
});
const input = ref();
const currentTime = ref(dayjs(new Date()));
watch(currentTime, (newValue) => {
  updateModel(newValue.toDate());
});
watch(
  () => props.modelValue,
  (newValue) => {
    input.value.innerHTML = formatValue(newValue);
  }
);
function updateModel(value: Date | Date[]) {
  emits("update:modelValue", value);
}
function formatValue(value: string | Dayjs | Dayjs[]) {
  if (typeof value === "string") {
    return value;
  }

  let formattedValue: string = "";
  try {
    if (isSingleSelection()) {
      formattedValue = formatDateTime(value as Dayjs);
    } else if (isMultipleSelection() && isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        let dateAsString = formatDateTime(value[i]);
        formattedValue += dateAsString;
        if (i !== value.length - 1) {
          formattedValue += ", ";
        }
      }
    } else if (isRangeSelection() && isArray(value)) {
      if (value && value.length) {
        let startDate = value[0];
        let endDate = value[1];

        formattedValue = formatDateTime(startDate);
        if (endDate) {
          formattedValue += " - " + formatDateTime(endDate);
        }
      }
    }
  } catch {
    console.error();
  }

  return formattedValue;
}
const timePattern = computed(() => {
  return `${showSeconds.value ? props.format || "HH:mm:ss" : "HH:mm"}`;
});
function formatDateTime(date: Dayjs): string {
  return date.format(timePattern.value);
}
function isSingleSelection() {
  return props.selectionMode === "single";
}
function isRangeSelection() {
  return props.selectionMode === "range";
}
function isMultipleSelection() {
  return props.selectionMode === "multiple";
}
const emits = defineEmits(["pick", "select-range", "set-picker-option", "update:modelValue"]);
const visible = ref(false);
// data
const selectionRange = ref([0, 2]);
const oldValue = useOldValue(props);
// computed
const transitionName = computed(() => {
  return props.actualVisible === undefined ? "el-zoom-in-top" : "";
});
const showSeconds = computed(() => {
  return props.format.includes("ss");
});
const amPmMode = computed(() => {
  if (props.format.includes("A")) return "A";
  if (props.format.includes("a")) return "a";
  return "";
});
// method
const isValidValue = (_date: Dayjs) => {
  const parsedDate = dayjs(_date).locale("en-US");
  const result = getRangeAvailableTime(parsedDate);
  return parsedDate.isSame(result);
};
const handleCancel = () => {
  emits("pick", oldValue.value, false);
};
const handleConfirm = (visible = false, first = false) => {
  if (first) return;
  emits("pick", props.modelValue, visible);
};

function onApplyButtonClick(event: { preventDefault: () => void }) {
  visible.value = false;
}

function onClearButtonClick(event: { preventDefault: () => void }) {
  updateModel(null);
  visible.value = false;
  event.preventDefault();
}

const setSelectionRange = (start, end) => {
  emits("select-range", start, end);
  selectionRange.value = [start, end];
};

const changeSelectionRange = (step: number) => {
  const list = [0, 3].concat(showSeconds.value ? [6] : []);
  const mapping = ["hours", "minutes"].concat(showSeconds.value ? ["seconds"] : []);
  const index = list.indexOf(selectionRange.value[0]);
  const next = (index + step + list.length) % list.length;
  timePickerOptions["start_emitSelectRange"](mapping[next]);
};

const handleKeydown = (event: KeyboardEvent) => {
  const code = event.code;

  if (code === EVENT_CODE.left || code === EVENT_CODE.right) {
    const step = code === EVENT_CODE.left ? -1 : 1;
    changeSelectionRange(step);
    event.preventDefault();
    return;
  }

  if (code === EVENT_CODE.up || code === EVENT_CODE.down) {
    const step = code === EVENT_CODE.up ? -1 : 1;
    timePickerOptions["start_scrollDown"](step);
    event.preventDefault();
    return;
  }
};

const getRangeAvailableTime = (date: Dayjs) => {
  const availableMap = {
    hour: getAvailableHours,
    minute: getAvailableMinutes,
    second: getAvailableSeconds,
  };
  let result = date;
  ["hour", "minute", "second"].forEach((_) => {
    if (availableMap[_]) {
      let availableArr;
      const method = availableMap[_];
      if (_ === "minute") {
        availableArr = method(result.hour(), props.datetimeRole);
      } else if (_ === "second") {
        availableArr = method(result.hour(), result.minute(), props.datetimeRole);
      } else {
        availableArr = method(props.datetimeRole);
      }
      if (availableArr && availableArr.length && !availableArr.includes(result[_]())) {
        result = result[_](availableArr[0]);
      }
    }
  });
  return result;
};
const { arrowControl, disabledHours, disabledMinutes, disabledSeconds, defaultValue } = props;
const { getAvailableHours, getAvailableMinutes, getAvailableSeconds } = getAvailableArrs(
  disabledHours,
  disabledMinutes,
  disabledSeconds
);

const parseUserInput = (value: Dayjs) => {
  if (!value) return null;
  return dayjs(value, props.format).locale("en-US");
};

const formatToString = (value: Dayjs) => {
  if (!value) return null;
  return value.format(props.format);
};

const getDefaultValue = () => {
  return dayjs(defaultValue).locale("en-US");
};

function onOverlayEnter(el: Element) {
  ZIndexUtils.set(
    "timeOverlay",
    el as HTMLElement,
    props.baseZIndex || primevue.config.zIndex.overlay
  );
  alignOverlay();
}
function alignOverlay() {
  if (timeOverlay.value) {
    DomHandler.absolutePosition(timeOverlay.value, container.value);
  }
}
emits("set-picker-option", ["isValidValue", isValidValue]);
emits("set-picker-option", ["formatToString", formatToString]);
emits("set-picker-option", ["parseUserInput", parseUserInput]);
emits("set-picker-option", ["handleKeydown", handleKeydown]);
emits("set-picker-option", ["getRangeAvailableTime", getRangeAvailableTime]);
emits("set-picker-option", ["getDefaultValue", getDefaultValue]);
const timePickerOptions = {} as any;
const onSetOption = (e) => {
  timePickerOptions[e[0]] = e[1];
};

function isEnabled() {
  return !props.disabled && !props.readonly;
}
function onFocus(event: Event) {
  if (isEnabled()) {
    visible.value = true;
  }
}
</script>
<style scoped>
.p-datepicker {
  width: auto;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
