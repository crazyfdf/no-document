<!-- eslint-disable -->
<template>
  <div class="y-time-spinner" :class="{ 'has-seconds': showSeconds }">
    <template v-if="!arrowControl">
      <div
        v-for="item in spinnerItems"
        :key="item"
        :ref="(scrollbar) => setRef(scrollbar as Element, item as listRefsType)"
        class="y-time-spinner__wrapper"
        @mouseenter="emitSelectRange(item as listRefsType)"
        @mousemove="adjustCurrentSpinner(item as listRefsType)"
      >
        <div class="y-scrollbar__wrap">
          <ul class="y-time-spinner__list">
            <li
              v-for="(disabled, key) in listMap[item as listRefsType].value"
              :key="key"
              class="y-time-spinner__item"
              :class="{ active: key === timePartsMap[item as listRefsType].value, disabled }"
              @click="handleClick(item as listRefsType, key, disabled)"
            >
              <template v-if="item === 'hours'">
                {{ ("0" + (amPmMode ? key % 12 || 12 : key)).slice(-2) }}{{ getAmPmFlag(key) }}
              </template>
              <template v-else>
                {{ ("0" + key).slice(-2) }}
              </template>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <template v-if="arrowControl">
      <div
        v-for="item in spinnerItems"
        :key="item"
        class="y-time-spinner__wrapper is-arrow"
        @mouseenter="emitSelectRange(item as listRefsType)"
      >
        <i
          v-repeat-click="onDecreaseClick"
          class="y-time-spinner__arrow arrow-up pi pi-angle-up"
        ></i>
        <i
          v-repeat-click="onIncreaseClick"
          class="y-time-spinner__arrow arrow-down pi pi-angle-down"
        ></i>

        <ul class="y-time-spinner__list">
          <li
            v-for="(time, key) in arrowListMap[item as listRefsType].value"
            :key="key"
            class="y-time-spinner__item"
            :class="{
              active: time === timePartsMap[item as listRefsType].value,
              disabled: listMap[item as listRefsType].value[time as number],
            }"
          >
            <template v-if="typeof time === 'number'">
              <template v-if="item === 'hours'">
                {{ ("0" + (amPmMode ? time % 12 || 12 : time)).slice(-2) }}{{ getAmPmFlag(time) }}
              </template>
              <template v-else>
                {{ ("0" + time).slice(-2) }}
              </template>
            </template>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { ref, nextTick, computed, onMounted, watch } from "vue";
import { debounce } from "lodash";
import { RepeatClick as vRepeatClick } from "../../directives";
import { getTimeLists } from "./useTimePicker";
import dayjs from "dayjs";
import type { PropType, Ref } from "vue";
import type { Dayjs } from "dayjs";
export type listRefsType = "hours" | "minutes" | "seconds";

const props = defineProps({
  role: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Object as PropType<Dayjs>,
    required: true,
    default: dayjs(),
  },
  showSeconds: {
    type: Boolean,
    default: true,
  },
  arrowControl: Boolean,
  amPmMode: {
    type: String,
    default: "", // 'a': am/pm; 'A': AM/PM
  },
  disabledHours: {
    type: Function,
  },
  disabledMinutes: {
    type: Function,
  },
  disabledSeconds: {
    type: Function,
  },
});

const emits = defineEmits(["change", "select-range", "set-option", "update:modelValue"]);

// data
let isScrolling = false;
const debouncedResetScroll = debounce((type) => {
  isScrolling = false;
  adjustCurrentSpinner(type);
}, 200);
const currentScrollbar = ref<listRefsType | undefined>();
const listHoursRef: Ref<Element | null> = ref(null);
const listMinutesRef: Ref<Element | null> = ref(null);
const listSecondsRef: Ref<Element | null> = ref(null);
const listRefsMap = {
  hours: listHoursRef,
  minutes: listMinutesRef,
  seconds: listSecondsRef,
};

// computed
const spinnerItems = computed(() => {
  const arr = ["hours", "minutes", "seconds"];
  return props.showSeconds ? arr : arr.slice(0, 2);
});
const hours = computed(() => {
  return props.modelValue.hour();
});
const minutes = computed(() => {
  return props.modelValue.minute();
});
const seconds = computed(() => {
  return props.modelValue.second();
});
const timePartsMap = computed(() => ({
  hours,
  minutes,
  seconds,
}));
const hoursList = computed(() => {
  return getHoursList(props.role);
});
const minutesList = computed(() => {
  return getMinutesList(hours.value, props.role);
});
const secondsList = computed(() => {
  return getSecondsList(hours.value, minutes.value, props.role);
});
const listMap = computed(() => ({
  hours: hoursList,
  minutes: minutesList,
  seconds: secondsList,
}));
const arrowHourList = computed(() => {
  const hour = hours.value;
  return [hour > 0 ? hour - 1 : undefined, hour, hour < 23 ? hour + 1 : undefined];
});
const arrowMinuteList = computed(() => {
  const minute = minutes.value;
  return [minute > 0 ? minute - 1 : undefined, minute, minute < 59 ? minute + 1 : undefined];
});
const arrowSecondList = computed(() => {
  const second = seconds.value;
  return [second > 0 ? second - 1 : undefined, second, second < 59 ? second + 1 : undefined];
});
const arrowListMap = computed(() => ({
  hours: arrowHourList,
  minutes: arrowMinuteList,
  seconds: arrowSecondList,
}));
const getAmPmFlag = (hour: number) => {
  const shouldShowAmPm = !!props.amPmMode;
  if (!shouldShowAmPm) return "";
  const isCapital = props.amPmMode === "A";
  // todo locale
  let content = hour < 12 ? " am" : " pm";
  if (isCapital) content = content.toUpperCase();
  return content;
};

const emitSelectRange = (type: listRefsType) => {
  if (type === "hours") {
    emits("select-range", 0, 2);
  } else if (type === "minutes") {
    emits("select-range", 3, 5);
  } else if (type === "seconds") {
    emits("select-range", 6, 8);
  }
  currentScrollbar.value = type;
};

const adjustCurrentSpinner = (type: listRefsType) => {
  // adjustSpinner(type, timePartsMap.value[type].value);
};

// NOTE: used by datetime / date-range panel
//       renamed from adjustScrollTop
//       should try to refactory it
const adjustSpinners = () => {
  adjustCurrentSpinner("hours");
  adjustCurrentSpinner("minutes");
  adjustCurrentSpinner("seconds");
};

const adjustSpinner = (type: listRefsType, value: number) => {
  if (props.arrowControl) return;
  const el = listRefsMap[type];

  if (el.value && el.value.querySelector(".y-scrollbar__wrap")) {
    (el.value.querySelector(".y-scrollbar__wrap") as Element).scrollTop = Math.max(
      0,
      value * typeItemHeight(type)
    );
  }
};

const typeItemHeight = (type: listRefsType) => {
  const el = listRefsMap[type];
  return ((el.value as HTMLElement).querySelector("li") as HTMLElement).offsetHeight;
};

const onIncreaseClick = () => {
  scrollDown(1);
};

const onDecreaseClick = () => {
  scrollDown(-1);
};

const scrollDown = (step: number) => {
  if (!currentScrollbar.value) {
    emitSelectRange("hours");
  }

  const label = currentScrollbar.value as listRefsType;
  let now = timePartsMap.value[label].value;
  const total = currentScrollbar.value === "hours" ? 24 : 60;
  now = (now + step + total) % total;

  modifyDateField(label, now);
  adjustSpinner(label, now);
  nextTick(() => emitSelectRange(currentScrollbar.value as listRefsType));
};

const modifyDateField = (type: listRefsType, value: number) => {
  const list = listMap.value[type].value;
  const isDisabled = list[value];
  if (isDisabled) return;
  switch (type) {
    case "hours":
      emits(
        "update:modelValue",
        props.modelValue.hour(value).minute(minutes.value).second(seconds.value)
      );
      emits("change", props.modelValue.hour(value).minute(minutes.value).second(seconds.value));
      break;
    case "minutes":
      emits(
        "update:modelValue",
        props.modelValue.hour(hours.value).minute(value).second(seconds.value)
      );
      emits("change", props.modelValue.hour(hours.value).minute(value).second(seconds.value));
      break;
    case "seconds":
      emits(
        "update:modelValue",
        props.modelValue.hour(hours.value).minute(minutes.value).second(value)
      );
      emits("change", props.modelValue.hour(hours.value).minute(minutes.value).second(value));
      break;
  }
};

const handleClick = (type: listRefsType, value: number, disabled: boolean) => {
  if (!disabled) {
    modifyDateField(type, value);
    emitSelectRange(type);
    adjustSpinner(type, value);
  }
};

const handleScroll = (type: listRefsType) => {
  isScrolling = true;
  debouncedResetScroll(type);
  if (
    listRefsMap[type].value &&
    (listRefsMap[type].value as HTMLElement).querySelector(".y-scrollbar__wrap")
  ) {
    const value = Math.min(
      Math.round(
        (((listRefsMap[type].value as HTMLElement).querySelector(".y-scrollbar__wrap") as Element)
          .scrollTop -
          (scrollBarHeight(type) * 0.5 - 10) / typeItemHeight(type) +
          3) /
          typeItemHeight(type)
      ),
      type === "hours" ? 23 : 59
    );
    modifyDateField(type, value);
  }
};

const scrollBarHeight = (type: listRefsType) => {
  return (listRefsMap[type].value as HTMLElement).offsetHeight;
};

const bindScrollEvent = () => {
  const bindFuntion = (type: listRefsType) => {
    if (
      listRefsMap[type].value &&
      (listRefsMap[type].value as HTMLElement).querySelector(".y-scrollbar__wrap")
    ) {
      (
        (listRefsMap[type].value as HTMLElement).querySelector(
          ".y-scrollbar__wrap"
        ) as unknown as HTMLElement
      ).onscroll = () => {
        // TODO: scroll is emitted when set scrollTop programatically
        // should find better solutions in the future!
        handleScroll(type);
      };
    }
  };
  bindFuntion("hours");
  bindFuntion("minutes");
  bindFuntion("seconds");
};

onMounted(() => {
  nextTick(() => {
    !props.arrowControl && bindScrollEvent();
    adjustSpinners();
    // set selection on the first hour part
    if (props.role === "start") emitSelectRange("hours");
  });
});

const setRef = (scrollbar: Element | null, type: listRefsType) => {
  listRefsMap[type].value = scrollbar;
};

emits("set-option", [`${props.role}_scrollDown`, scrollDown]);
emits("set-option", [`${props.role}_emitSelectRange`, emitSelectRange]);

const { getHoursList, getMinutesList, getSecondsList } = getTimeLists(
  props.disabledHours as Function,
  props.disabledMinutes as Function,
  props.disabledSeconds as Function
);

watch(
  () => props.modelValue,
  () => {
    if (isScrolling) return;
    adjustSpinners();
  }
);
</script>
<style scoped>
.y-time-spinner {
  width: 12rem;
  display: flex;
}
.y-time-spinner__wrapper {
  width: 33.3%;
}

.y-scrollbar__wrap {
  width: 100%;
  overflow: hidden;
  height: 100%;
  max-height: inherit;
}
.y-scrollbar__wrap:hover {
  overflow-y: auto;
}

.y-time-spinner__wrapper {
  max-height: 13rem;
  height: 100%;
  overflow: auto;
  display: inline-block;
  width: 50%;
  vertical-align: top;
  position: relative;
}

.y-time-spinner__wrapper .y-scrollbar__wrap:not(.y-scrollbar__wrap--hidden-default) {
  padding-bottom: 15px;
}
.y-time-spinner__wrapper.is-arrow {
  box-sizing: border-box;
  text-align: center;
  overflow: hidden;
}
.y-time-spinner__wrapper.is-arrow .y-time-spinner__item:hover:not(.disabled):not(.active) {
  background: #fff;
  cursor: default;
}
.y-time-spinner__arrow {
  font-size: 12px;
  color: var(--y-text-color-secondary);
  position: absolute;
  left: 0;
  width: 100%;
  z-index: var(--y-index-normal);
  text-align: center;
  height: 1.875rem;
  line-height: 1.875rem;
  cursor: pointer;
}
.y-time-spinner__arrow:hover {
  color: var(--y-color-primary);
}
.y-time-spinner__arrow.arrow-up {
  top: 10px;
}
.y-time-spinner__arrow.arrow-down {
  bottom: 10px;
}
.y-time-spinner__input.y-input {
  width: 70%;
}
.y-time-spinner__input.y-input .y-input__inner {
  padding: 0;
  text-align: center;
}
.y-time-spinner__list {
  padding: 0;
  margin: 0;
  list-style: none;
  text-align: center;
  margin-left: 4px;
}
.y-time-spinner__list li {
  padding: 0;
  margin: 0;
  list-style: none;
}
.y-time-spinner__list:after,
.y-time-spinner__list:before {
  content: "";
  display: block;
  width: 100%;
  height: 5rem;
}
.y-time-spinner__wrapper.is-arrow .y-time-spinner__list {
  margin-top: -2rem;
}
.y-time-spinner__item {
  height: 2rem;
  line-height: 2rem;
  font-size: 12px;
  text-align: center;
  color: var(--y-text-color-regular);
  max-width: 3.125rem;
  min-width: 3rem;
  border-radius: 2px;
}
.y-time-spinner__item:hover:not(.disabled):not(.active) {
  cursor: pointer;
  background-color: #d6dff7;
}
.y-time-spinner__item.active:not(.disabled) {
  color: #fff;
  background-color: #23408c;
}
.y-time-spinner__item.disabled {
  color: var(--y-text-color-placeholder);
  cursor: not-allowed;
}
::-webkit-scrollbar {
  position: absolute;
  width: 0.375rem;
  background-color: #fff;
}
::-webkit-scrollbar-track {
  background-color: transparent;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
::-webkit-scrollbar-track-piece {
  background-color: transparent;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
::-webkit-scrollbar-thumb {
  background-color: #e9e7e7;
  -webkit-border-radius: 2em;
  -moz-border-radius: 2em;
  border-radius: 2em;
}
</style>
