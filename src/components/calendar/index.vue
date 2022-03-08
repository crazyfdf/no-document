<template>
  <span ref="container" :class="containerClass" :style="style">
    <y-button
      :icon="icon"
      tabindex="-1"
      class="p-datepicker-trigger"
      :disabled="disabled"
      @click="onButtonClick"
      :aria-label="inputFieldValue"
    />
    <div
      ref="input"
      v-if="!inline"
      contenteditable
      :class="[
        'p-inputtext p-component',
        inputClass,
        { 'p-input-range': isRangeSelection() },
        { 'p-input-Multiple': isMultipleSelection() },
      ]"
      :style="inputStyle"
      @input="onInput"
      v-bind="$attrs"
      @focus="onFocus"
      @blur="onBlur"
    ></div>

    <Teleport :to="appendTarget" :disabled="appendDisabled">
      <transition
        name="p-connected-overlay"
        @enter="onOverlayEnter($event)"
        @after-enter="onOverlayEnterComplete"
        @after-leave="onOverlayAfterLeave"
        @leave="onOverlayLeave"
      >
        <div
          v-if="inline ? true : overlayVisible"
          ref="overlay"
          :class="panelStyleClass"
          :role="inline ? undefined : 'dialog'"
          @click="onOverlayClick"
          @mouseup="onOverlayMouseUp"
        >
          <div class="p-datepicker-group-container">
            <div
              class="p-datepicker-group"
              v-for="(month, groupIndex) of months"
              :key="month.month + month.year"
            >
              <div class="p-datepicker-header">
                <slot name="header"></slot>
                <y-button
                  v-if="view === 'date'"
                  class="p-datepicker-prev p-link"
                  v-show="groupIndex === 0"
                  @click="onPrevYearButtonClick"
                  :disabled="disabled"
                >
                  <span class="p-datepicker-prev-icon pi pi-angle-double-left"></span>
                </y-button>
                <y-button
                  class="p-datepicker-prev p-link"
                  v-show="groupIndex === 0"
                  @click="onPrevButtonClick"
                  :disabled="disabled"
                >
                  <span class="p-datepicker-prev-icon pi pi-angle-left"></span>
                </y-button>
                <div class="p-datepicker-title">
                  <y-button
                    @click="switchToYearView"
                    v-if="currentView !== 'year'"
                    class="p-datepicker-year p-link p-button-text"
                    :disabled="switchViewButtonDisabled"
                  >
                    {{ getYear(month) }}
                  </y-button>
                  <y-button
                    @click="switchToMonthView"
                    v-if="currentView === 'date'"
                    class="p-datepicker-month p-link p-button-text"
                    :disabled="switchViewButtonDisabled"
                  >
                    {{ getMonthName(month.month) }}
                  </y-button>
                  <span class="p-datepicker-decade" v-if="currentView === 'year'">
                    <slot name="decade" :years="yearPickerValues">
                      {{ yearPickerValues[0] }} -
                      {{ yearPickerValues[yearPickerValues.length - 1] }}
                    </slot>
                  </span>
                </div>
                <y-button
                  class="p-datepicker-next p-link"
                  v-show="numberOfMonths === 1 ? true : groupIndex === numberOfMonths - 1"
                  @click="onNextButtonClick"
                  :disabled="disabled"
                >
                  <span class="p-datepicker-next-icon pi pi-angle-right"></span>
                </y-button>
                <y-button
                  v-if="view === 'date'"
                  class="p-datepicker-next p-link"
                  v-show="numberOfMonths === 1 ? true : groupIndex === numberOfMonths - 1"
                  @click="onNextYearButtonClick"
                  :disabled="disabled"
                >
                  <span class="p-datepicker-next-icon pi pi-angle-double-right"></span>
                </y-button>
              </div>
              <div class="p-datepicker-main">
                <div class="p-datepicker-calendar-container" v-if="currentView === 'date'">
                  <table class="p-datepicker-calendar">
                    <thead>
                      <tr>
                        <th scope="col" v-if="showWeek" class="p-datepicker-weekheader p-disabled">
                          <span>{{ weekHeaderLabel }}</span>
                        </th>
                        <th scope="col" v-for="weekDay of weekDays" :key="weekDay">
                          <span>{{ weekDay }}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(week, i) of month.dates" :key="week[0].day + '' + week[0].month">
                        <td v-if="showWeek" class="p-datepicker-weeknumber">
                          <span class="p-disabled">
                            <span style="visibility: hidden" v-if="month.weekNumbers[i] < 10">
                              0
                            </span>
                            {{ month.weekNumbers[i] }}
                          </span>
                        </td>
                        <td
                          v-for="date of week"
                          :key="date.day + '' + date.month"
                          :class="{
                            'p-datepicker-other-month': date.otherMonth,
                            'p-datepicker-today': date.today,
                          }"
                        >
                          <span
                            :class="{
                              'p-highlight': isSelected(date),
                              'p-disabled': !date.selectable,
                            }"
                            @click="onDateSelect($event, date)"
                            draggable="false"
                          >
                            <slot name="date" :date="date">
                              {{ date.day }}
                            </slot>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="y-timepicker" v-if="showTime && currentView === 'date'">
                  <time-picker
                    role="start"
                    v-model="currentTime"
                    :showSeconds="!showSeconds"
                  ></time-picker>
                </div>
              </div>
            </div>
            <div class="p-monthpicker" v-if="currentView === 'month'">
              <span
                v-for="(m, i) of monthPickerValues"
                :key="m"
                @click="onMonthSelect($event, i)"
                class="p-monthpicker-month"
                :class="{ 'p-highlight': isMonthSelected(i) }"
              >
                {{ m }}
              </span>
            </div>
            <div class="p-yearpicker" v-if="currentView === 'year'">
              <span
                v-for="y of yearPickerValues"
                :key="y"
                @click="onYearSelect($event, y)"
                class="p-yearpicker-year"
                :class="{ 'p-highlight': isYearSelected(y) }"
              >
                {{ y }}
              </span>
            </div>
          </div>
          <div class="p-datepicker-buttonbar" v-if="showButtonBar">
            <y-button
              :label="clearLabel"
              @click="onClearButtonClick($event)"
              class="p-button-text"
            />
            <y-button
              :label="applyLabel"
              @click="onApplyButtonClick($event)"
              class="p-button-text"
            />
          </div>
          <slot name="footer"></slot>
        </div>
      </transition>
    </Teleport>
  </span>
</template>

<script lang="ts" setup>
import {
  ConnectedOverlayScrollHandler,
  DomHandler,
  ZIndexUtils,
  UniqueComponentId,
} from "primevue/utils";
import OverlayEventBus from "./calendareventbus";
import { computed, onMounted, ref, watch, onUpdated, onBeforeUnmount, PropType } from "vue";
// import { useConfig } from '@/utils/config/config';
import { usePrimeVue } from "primevue/config";
import TimePicker from "../time-picker/time-picker.vue";
import { isArray, isDate } from "@vue/shared";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

// const yaochn = useConfig();
const primevue = usePrimeVue();
const emits = defineEmits([
  "show",
  "hide",
  "input",
  "month-change",
  "year-change",
  "date-select",
  "update:modelValue",
  "today-click",
  "clear-click",
  "focus",
  "blur",
]);
interface responsiveOptionsInterface {
  breakpoint: string;
  numMonths: number;
}
interface dateMetaInterface {
  day?: number;
  month: number;
  year: number;
  otherMonth?: boolean;
  today?: boolean;
  selectable: boolean;
}
const props = defineProps({
  modelValue: null,
  selectionMode: {
    type: String,
    default: "single",
  },
  dateFormat: {
    type: String,
    default: null,
  },
  timeFormat: {
    type: String,
    default: null,
  },
  inline: {
    type: Boolean,
    default: false,
  },
  showIcon: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: "pi pi-calendar",
  },
  numberOfMonths: {
    type: Number,
    default: 1,
  },
  /**
   * @type array
   */
  responsiveOptions: Array as PropType<responsiveOptionsInterface[]>,
  view: {
    type: String,
    default: "date",
  },
  touchUI: {
    type: Boolean,
    default: false,
  },
  panelClass: {
    type: String,
    default: null,
  },
  minDate: {
    type: Date,
    value: null,
  },
  maxDate: {
    type: Date,
    value: null,
  },
  /**
   * @type array
   */
  disabledDates: {
    type: Array as PropType<Date[]>,
    value: null,
  },
  /**
   * @type array
   */
  disabledDays: {
    type: Array,
    value: null,
  },
  maxDateCount: {
    type: Number,
    value: null,
  },
  baseZIndex: {
    type: Number,
    default: 0,
  },
  showButtonBar: {
    type: Boolean,
    default: false,
  },
  showTime: {
    type: Boolean,
    default: false,
  },
  showSeconds: {
    type: Boolean,
    default: false,
  },
  showWeek: {
    type: Boolean,
    default: true,
  },
  manualInput: {
    type: Boolean,
    default: true,
  },
  appendTo: {
    type: String,
    default: "body",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  inputClass: null,
  inputStyle: null,
  class: null,
  style: null,
});
let navigationState: { button?: boolean; backward: boolean } | null = null;
let timePickerChange = false;
let scrollHandler: ConnectedOverlayScrollHandler | null = null;
let outsideClickListener: {
  (event: Event): void;
} | null = null;
// eslint-disable
let maskClickListener: any = null;
let resizeListener: {
  (): void;
} | null = null;

const input = ref();
let mask: HTMLElement | null = null;
let timePickerTimer: number;
let preventFocus = false;
let typeUpdate = false;
const container = ref();
let responsiveStyleElement: HTMLStyleElement | null;
const currentMonth = ref();
const currentYear = ref();
const currentTime = ref(dayjs(new Date()));

const focused = ref();
const overlayVisible = ref();
const currentView = ref(props.view);
const overlay = ref<HTMLElement | null>();

updateCurrentMetaData();

const inputFieldValue = computed(() => {
  return formatValue(currentTime.value);
});
const containerClass = computed(() => {
  return [
    "p-calendar p-component p-inputwrapper",
    props.class,
    {
      "p-calendar-w-btn": props.showIcon,
      "p-inputwrapper-filled": currentTime.value,
      "p-inputwrapper-focus": focused.value,
    },
  ];
});
const panelStyleClass = computed(() => {
  return [
    "p-datepicker p-component",
    props.panelClass,
    {
      "p-datepicker-inline": props.inline,
      "p-disabled": props.disabled,
      "p-datepicker-multiple-month": props.numberOfMonths > 1,
      "p-datepicker-monthpicker": currentView.value === "month",
      "p-datepicker-yearpicker": currentView.value === "year",
      "p-datepicker-touch-ui": props.touchUI,
      "p-input-filled": primevue.config.inputStyle === "filled",
      "p-ripple-disabled": primevue.config.ripple === false,
    },
  ];
});
const months = computed(() => {
  let months = [];
  for (let i = 0; i < props.numberOfMonths; i++) {
    let month = currentMonth.value + i;
    let year = currentYear.value;
    if (month > 11) {
      month = (month % 11) - 1;
      year = year + 1;
    }

    let dates = [];
    let firstDay = getFirstDayOfMonthIndex(month, year);
    let daysLength = getDaysCountInMonth(month, year);
    let prevMonthDaysLength = getDaysCountInPrevMonth(month, year);
    let dayNo = 1;
    let today = new Date();
    let weekNumbers = [];
    let monthRows = Math.ceil((daysLength + firstDay) / 7);

    for (let i = 0; i < monthRows; i++) {
      let week = [];

      if (i == 0) {
        for (let j = prevMonthDaysLength - firstDay + 1; j <= prevMonthDaysLength; j++) {
          let prev = getPreviousMonthAndYear(month, year);
          week.push({
            day: j,
            month: prev.month,
            year: prev.year,
            otherMonth: true,
            today: isToday(today, j, prev.month, prev.year),
            selectable: isSelectable(j, prev.month, prev.year, true),
          });
        }

        let remainingDaysLength = 7 - week.length;
        for (let j = 0; j < remainingDaysLength; j++) {
          week.push({
            day: dayNo,
            month: month,
            year: year,
            today: isToday(today, dayNo, month, year),
            selectable: isSelectable(dayNo, month, year, false),
          });
          dayNo++;
        }
      } else {
        for (let j = 0; j < 7; j++) {
          if (dayNo > daysLength) {
            let next = getNextMonthAndYear(month, year);
            week.push({
              day: dayNo - daysLength,
              month: next.month,
              year: next.year,
              otherMonth: true,
              today: isToday(today, dayNo - daysLength, next.month, next.year),
              selectable: isSelectable(dayNo - daysLength, next.month, next.year, true),
            });
          } else {
            week.push({
              day: dayNo,
              month: month,
              year: year,
              today: isToday(today, dayNo, month, year),
              selectable: isSelectable(dayNo, month, year, false),
            });
          }

          dayNo++;
        }
      }

      if (props.showWeek) {
        weekNumbers.push(getWeekNumber(new Date(week[0].year, week[0].month, week[0].day)));
      }

      dates.push(week);
    }

    months.push({
      month: month,
      year: year,
      dates: dates,
      weekNumbers: weekNumbers,
    });
  }

  return months;
});
const weekDays = computed(() => {
  let weekDays = [];
  let dayIndex = primevue.config.locale?.firstDayOfWeek as number;
  for (let i = 0; i < 7; i++) {
    weekDays.push(primevue.config.locale?.dayNamesMin[dayIndex]);
    dayIndex = dayIndex == 6 ? 0 : ++dayIndex;
  }

  return weekDays;
});
const sundayIndex = computed(() => {
  return (primevue.config.locale?.firstDayOfWeek as number) > 0
    ? 7 - (primevue.config.locale?.firstDayOfWeek as number)
    : 0;
});

const timePattern = computed(() => {
  return `${props.view === "year" ? props.dateFormat || "YYYY" : ""}${
    props.view === "month" ? props.dateFormat || "YYYY/MM" : ""
  }${props.view === "date" ? props.dateFormat || "YYYY/MM/DD" : ""} ${
    props.view === "date" ? props.showTime && (props.timeFormat || "HH:mm:ss") : ""
  }`;
});
const monthPickerValues = computed(() => {
  let monthPickerValues = [];
  for (let i = 0; i <= 11; i++) {
    monthPickerValues.push(primevue.config.locale?.monthNamesShort[i]);
  }

  return monthPickerValues;
});
const yearPickerValues = computed(() => {
  let yearPickerValues = [];
  let base = currentYear.value - (currentYear.value % 10);
  for (let i = 0; i < 10; i++) {
    yearPickerValues.push(base + i);
  }

  return yearPickerValues;
});
const applyLabel = computed(() => {
  return primevue.config.locale?.apply;
});
const clearLabel = computed(() => {
  return primevue.config.locale?.clear;
});
const weekHeaderLabel = computed(() => {
  return primevue.config.locale?.weekHeader;
});
const appendDisabled = computed(() => {
  return props.appendTo === "self" || props.inline;
});
const appendTarget = computed(() => {
  return appendDisabled.value ? null : props.appendTo;
});
const attributeSelector = computed(() => {
  return UniqueComponentId();
});
const switchViewButtonDisabled = computed(() => {
  return props.numberOfMonths > 1 || props.disabled;
});
onMounted(() => {
  createResponsiveStyle();
  if (!props.manualInput) {
    // input readonly
    input.value.addEventListener("keypress", function (e: { preventDefault: () => void }) {
      e.preventDefault();
    });
  }
  if (props.disabled) {
    input.value.addEventListener("keypress", function (e: { preventDefault: () => void }) {
      e.preventDefault();
    });
  }
  if (props.inline) {
    overlay.value && overlay.value.setAttribute(attributeSelector.value, "");

    if (!props.disabled) {
      initFocusableCell();

      if (props.numberOfMonths === 1) {
        if (overlay.value) {
          overlay.value.style.width = DomHandler.getOuterWidth(container.value, false) + "px";
        }
      }
    }
  } else {
    input.value = formatValue(currentTime.value);
  }
});
onUpdated(() => {
  if (overlay.value) {
    preventFocus = true;
    updateFocus();
  }
});
onBeforeUnmount(() => {
  if (timePickerTimer) {
    clearTimeout(timePickerTimer);
  }

  if (mask) {
    destroyMask();
  }
  destroyResponsiveStyleElement();

  unbindOutsideClickListener();
  unbindResizeListener();

  if (scrollHandler) {
    scrollHandler.destroy();
    scrollHandler = null;
  }

  if (overlay.value) {
    ZIndexUtils.clear(overlay.value);
  }
  overlay.value = null;
});

watch(
  () => props.modelValue,
  (newValue) => {
    updateCurrentMetaData();
    if (!typeUpdate && !props.inline && input.value) {
      newValue = isArray(newValue) ? newValue.filter(Boolean).map(dayjs) : dayjs(newValue);
      input.value.innerHTML = formatValue(newValue);
    }
    typeUpdate = false;
  }
);
watch(months, () => {
  if (overlay.value) {
    if (!focused.value) {
      setTimeout(updateFocus, 0);
    }
  }
});
watch(
  () => props.numberOfMonths,
  () => {
    destroyResponsiveStyleElement();
    createResponsiveStyle();
  }
);
watch(
  () => props.responsiveOptions,
  () => {
    destroyResponsiveStyleElement();
    createResponsiveStyle();
  }
);
watch(currentTime, () => {
  if (props.showTime && isEnabled()) {
    updateModelTime();
  }
});
function isComparable() {
  return props.modelValue != null && typeof props.modelValue !== "string";
}
function isSelected(dateMeta: dateMetaInterface) {
  if (!isComparable()) {
    return false;
  }

  if (props.modelValue) {
    if (isSingleSelection()) {
      return isDateEquals(props.modelValue, dateMeta);
    } else if (isMultipleSelection()) {
      let selected = false;
      for (let date of props.modelValue) {
        selected = isDateEquals(date, dateMeta);
        if (selected) {
          break;
        }
      }

      return selected;
    } else if (isRangeSelection()) {
      if (props.modelValue[1])
        return (
          isDateEquals(props.modelValue[0], dateMeta) ||
          isDateEquals(props.modelValue[1], dateMeta) ||
          isDateBetween(props.modelValue[0], props.modelValue[1], dateMeta)
        );
      else {
        return isDateEquals(props.modelValue[0], dateMeta);
      }
    }
  }

  return false;
}
function isMonthSelected(month: number) {
  if (isComparable()) {
    let value = isRangeSelection() ? props.modelValue[0] : props.modelValue;

    return !isMultipleSelection()
      ? value.getMonth() === month && value.getFullYear() === currentYear.value
      : false;
  }

  return false;
}
function isYearSelected(year: number) {
  if (isComparable()) {
    let value = isRangeSelection() ? props.modelValue[0] : props.modelValue;

    return !isMultipleSelection() && isComparable() ? value.getFullYear() === year : false;
  }

  return false;
}
function isDateEquals(value: Date, dateMeta: dateMetaInterface) {
  if (value)
    return (
      value.getDate() === dateMeta.day &&
      value.getMonth() === dateMeta.month &&
      value.getFullYear() === dateMeta.year
    );
  else return false;
}
function isDateBetween(
  start: { getTime: () => number },
  end: { getTime: () => number },
  dateMeta: dateMetaInterface
) {
  let between = false;
  if (start && end) {
    let date = new Date(dateMeta.year, dateMeta.month, dateMeta.day);
    return start.getTime() <= date.getTime() && end.getTime() >= date.getTime();
  }

  return between;
}
function getFirstDayOfMonthIndex(month: number, year: number) {
  let day = new Date();
  day.setDate(1);
  day.setMonth(month);
  day.setFullYear(year);

  let dayIndex = day.getDay() + sundayIndex.value;
  return dayIndex >= 7 ? dayIndex - 7 : dayIndex;
}
function getDaysCountInMonth(month: number, year: number) {
  return 32 - daylightSavingAdjust(new Date(year, month, 32)).getDate();
}
function getDaysCountInPrevMonth(month: number, year: number) {
  let prev = getPreviousMonthAndYear(month, year);
  return getDaysCountInMonth(prev.month, prev.year);
}
function getPreviousMonthAndYear(month: number, year: number) {
  let m, y;

  if (month === 0) {
    m = 11;
    y = year - 1;
  } else {
    m = month - 1;
    y = year;
  }

  return { month: m, year: y };
}
function getNextMonthAndYear(month: number, year: number) {
  let m, y;

  if (month === 11) {
    m = 0;
    y = year + 1;
  } else {
    m = month + 1;
    y = year;
  }

  return { month: m, year: y };
}
function daylightSavingAdjust(date: Date) {
  date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
  return date;
}
function isToday(today: Date, day: number, month: number, year: number) {
  return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
}
function isSelectable(day: number, month: number, year: number, otherMonth: boolean) {
  let validMin = true;
  let validMax = true;
  let validDate = true;
  let validDay = true;
  if (otherMonth) {
    return false;
  }
  if (props.minDate) {
    if (props.minDate.getFullYear() > year) {
      validMin = false;
    } else if (props.minDate.getFullYear() === year) {
      if (props.minDate.getMonth() > month) {
        validMin = false;
      } else if (props.minDate.getMonth() === month) {
        if (props.minDate.getDate() > day) {
          validMin = false;
        }
      }
    }
  }

  if (props.maxDate) {
    if (props.maxDate.getFullYear() < year) {
      validMax = false;
    } else if (props.maxDate.getFullYear() === year) {
      if (props.maxDate.getMonth() < month) {
        validMax = false;
      } else if (props.maxDate.getMonth() === month) {
        if (props.maxDate.getDate() < day) {
          validMax = false;
        }
      }
    }
  }

  if (props.disabledDates) {
    validDate = !isDateDisabled(day, month, year);
  }

  if (props.disabledDays) {
    validDay = !isDayDisabled(day, month, year);
  }

  return validMin && validMax && validDate && validDay;
}
function onOverlayEnter(el: Element) {
  el.setAttribute(attributeSelector.value, "");

  if (props.touchUI)
    ZIndexUtils.set("modal", el as HTMLElement, props.baseZIndex || primevue.config.zIndex.modal);
  else
    ZIndexUtils.set(
      "overlay",
      el as HTMLElement,
      props.baseZIndex || primevue.config.zIndex.overlay
    );
  alignOverlay();
  emits("show");
}
function onOverlayEnterComplete() {
  bindOutsideClickListener();
  bindScrollListener();
  bindResizeListener();
}
function onOverlayAfterLeave(el: Element) {
  ZIndexUtils.clear(el as HTMLElement);
}
function onOverlayLeave() {
  currentView.value = props.view;
  unbindOutsideClickListener();
  unbindScrollListener();
  unbindResizeListener();
  emits("hide");

  if (mask) {
    disableModality();
  }

  overlay.value = null;
}
function onPrevYearButtonClick(event: Event) {
  decrementYear();
}
function onNextYearButtonClick(event: Event) {
  incrementYear();
}
function onPrevButtonClick(event: Event) {
  navigationState = { backward: true, button: true };
  navBackward(event);
}
function onNextButtonClick(event: Event) {
  navigationState = { backward: false, button: true };
  navForward(event);
}
function navBackward(event: Event) {
  event.preventDefault();

  if (!isEnabled()) {
    return;
  }

  if (currentView.value === "month") {
    decrementYear();
  } else if (currentView.value === "year") {
    decrementDecade();
  } else {
    if (currentMonth.value === 0) {
      currentMonth.value = 11;
      decrementYear();
    } else {
      currentMonth.value--;
    }

    emits("month-change", {
      month: currentMonth.value,
      year: currentYear.value,
    });
  }
}
function navForward(event: Event) {
  event.preventDefault();

  if (!isEnabled()) {
    return;
  }

  if (currentView.value === "month") {
    incrementYear();
  } else if (currentView.value === "year") {
    incrementDecade();
  } else {
    if (currentMonth.value === 11) {
      currentMonth.value = 0;
      incrementYear();
    } else {
      currentMonth.value++;
    }

    emits("month-change", {
      month: currentMonth.value,
      year: currentYear.value,
    });
  }
}
function decrementYear() {
  currentYear.value--;
}
function decrementDecade() {
  currentYear.value = currentYear.value - 10;
}
function incrementYear() {
  currentYear.value++;
}
function incrementDecade() {
  currentYear.value = currentYear.value + 10;
}
function switchToMonthView(event: { preventDefault: () => void }) {
  currentView.value = "month";
  setTimeout(updateFocus, 0);
  event.preventDefault();
}
function switchToYearView(event: { preventDefault: () => void }) {
  currentView.value = "year";
  setTimeout(updateFocus, 0);
  event.preventDefault();
}
function isEnabled() {
  return !props.disabled && !props.readonly;
}

function bindOutsideClickListener() {
  if (!outsideClickListener) {
    outsideClickListener = (event: Event) => {
      if (overlayVisible.value && isOutsideClicked(event)) {
        overlayVisible.value = false;
      }
    };
    document.addEventListener("mousedown", outsideClickListener);
  }
}
function unbindOutsideClickListener() {
  if (outsideClickListener) {
    document.removeEventListener("mousedown", outsideClickListener);
    outsideClickListener = null;
  }
}
function bindScrollListener() {
  if (!scrollHandler) {
    scrollHandler = new ConnectedOverlayScrollHandler(container.value, () => {
      if (overlayVisible.value) {
        overlayVisible.value = false;
      }
    });
  }

  scrollHandler.bindScrollListener();
}
function unbindScrollListener() {
  if (scrollHandler) {
    scrollHandler.unbindScrollListener();
  }
}
function bindResizeListener() {
  if (!resizeListener) {
    resizeListener = () => {
      if (overlayVisible.value) {
        overlayVisible.value = false;
      }
    };
    window.addEventListener("resize", resizeListener);
  }
}
function unbindResizeListener() {
  if (resizeListener) {
    window.removeEventListener("resize", resizeListener);
    resizeListener = null;
  }
}
function isOutsideClicked(event: Event) {
  return !(
    container.value.isSameNode(event.target) ||
    isNavIconClicked(event) ||
    container.value.contains(event.target) ||
    (overlay.value && overlay.value.contains(event.target as HTMLElement))
  );
}
function isNavIconClicked(event: Event) {
  return (
    DomHandler.hasClass(event.target as HTMLElement, "p-datepicker-prev") ||
    DomHandler.hasClass(event.target as HTMLElement, "p-datepicker-prev-icon") ||
    DomHandler.hasClass(event.target as HTMLElement, "p-datepicker-next") ||
    DomHandler.hasClass(event.target as HTMLElement, "p-datepicker-next-icon")
  );
}
function alignOverlay() {
  if (props.touchUI) {
    enableModality();
  } else if (overlay.value) {
    if (appendDisabled.value) {
      DomHandler.relativePosition(overlay.value, container.value);
    } else {
      if (props.view === "date") {
        overlay.value.style.width = DomHandler.getOuterWidth(overlay.value, false) + "px";
        overlay.value.style.minWidth = DomHandler.getOuterWidth(container.value, false) + "px";
      } else {
        overlay.value.style.width = DomHandler.getOuterWidth(container.value, false) + "px";
      }

      DomHandler.absolutePosition(overlay.value, container.value);
    }
  }
}
function onButtonClick() {
  if (isEnabled()) {
    if (!overlayVisible.value) {
      input.value.focus();
      overlayVisible.value = true;
    } else {
      overlayVisible.value = false;
    }
  }
}
function isDateDisabled(day: number, month: number, year: number) {
  if (props.disabledDates) {
    for (let disabledDate of props.disabledDates) {
      if (
        disabledDate.getFullYear() === year &&
        disabledDate.getMonth() === month &&
        disabledDate.getDate() === day
      ) {
        return true;
      }
    }
  }

  return false;
}
function isDayDisabled(day: number | undefined, month: number, year: number) {
  if (props.disabledDays) {
    let weekday = new Date(year, month, day);
    let weekdayNumber = weekday.getDay();
    return props.disabledDays.indexOf(weekdayNumber) !== -1;
  }
  return false;
}
function onDateSelect(event: Event | null, dateMeta: dateMetaInterface) {
  if (props.disabled || !dateMeta.selectable) {
    return;
  }
  if (overlay.value) {
    DomHandler.find(overlay.value, ".p-datepicker-calendar td span:not(.p-disabled)").forEach(
      (cell) => (cell.tabIndex = -1)
    );
  }

  if (event) {
    event.currentTarget && (event.currentTarget as HTMLElement).focus();
  }

  if (isMultipleSelection() && isSelected(dateMeta)) {
    let newValue = props.modelValue.filter((date: Date) => !isDateEquals(date, dateMeta));
    updateModel(newValue);
  } else {
    if (shouldSelectDate()) {
      if (dateMeta.otherMonth) {
        currentMonth.value = dateMeta.month;
        currentYear.value = dateMeta.year;
        selectDate(dateMeta);
      } else {
        selectDate(dateMeta);
      }
    }
  }

  if (isSingleSelection() && !props.showTime) {
    setTimeout(() => {
      overlayVisible.value = false;
    }, 150);
  }
}
function selectDate(dateMeta: dateMetaInterface) {
  let date = new Date(dateMeta.year, dateMeta.month, dateMeta.day);

  if (props.minDate && props.minDate > date) {
    date = props.minDate;
  }

  if (props.maxDate && props.maxDate < date) {
    date = props.maxDate;
  }

  let modelVal = null;

  if (isSingleSelection()) {
    modelVal = date;
  } else if (isMultipleSelection()) {
    modelVal = props.modelValue ? [...props.modelValue, date] : [date];
  } else if (isRangeSelection()) {
    if (props.modelValue && props.modelValue.length) {
      let startDate = props.modelValue[0];
      let endDate = props.modelValue[1];

      if (!endDate && date.getTime() >= startDate.getTime()) {
        endDate = date;
      } else {
        startDate = date;
        endDate = null;
      }
      modelVal = [startDate, endDate];
    } else {
      modelVal = [date, null];
    }
  }
  if (date !== null) {
    if (isSingleSelection()) {
      currentTime.value = dayjs(date);
    } else {
      updateModel(modelVal).then(() => {
        currentTime.value = dayjs(date);
      });
    }
  }
  emits("date-select", date);
}
async function updateModel(value: Date | Date[] | null) {
  console.log(value);
  emits("update:modelValue", value);
}
function updateModelTime() {
  timePickerChange = true;
  let value = null;
  let _value = currentTime.value.toDate();

  if (isRangeSelection()) {
    _value = props.modelValue[1] || props.modelValue[0] || currentTime.value.toDate();
  }
  if (isMultipleSelection()) {
    _value = props.modelValue ? props.modelValue[props.modelValue.length - 1] : new Date();
  }
  console.log(currentTime.value, _value);
  if (isDate(_value)) {
    _value.setHours(currentTime.value.hour());
    _value.setMinutes(currentTime.value.minute());
    _value.setSeconds(currentTime.value.second());
  }
  if (isSingleSelection()) {
    value = _value;
  }
  if (isRangeSelection()) {
    if (props.modelValue[1]) value = [props.modelValue[0], _value];
    else value = [_value, null];
  }
  if (isMultipleSelection()) {
    value = [...props.modelValue.slice(0, -1), _value];
  }
  updateModel(value);
  emits("date-select", value);
  setTimeout(() => (timePickerChange = false), 0);
}
function shouldSelectDate() {
  if (isMultipleSelection())
    return props.maxDateCount != null
      ? props.maxDateCount > (props.modelValue ? props.modelValue.length : 0)
      : true;
  else return true;
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

function formatDateTime(date: Dayjs): string {
  return date.format(timePattern.value);
}

function onApplyButtonClick(event: { preventDefault: () => void }) {
  overlayVisible.value = false;
}

function onClearButtonClick(event: { preventDefault: () => void }) {
  updateModel(null);
  overlayVisible.value = false;
  emits("clear-click", event);
  event.preventDefault();
}
function onMonthSelect(event: Event, index: number) {
  if (props.view === "month") {
    onDateSelect(event, {
      year: currentYear.value,
      month: index,
      day: 1,
      selectable: true,
    });
  } else {
    currentMonth.value = index;
    currentView.value = "date";
    emits("month-change", {
      month: currentMonth.value + 1,
      year: currentYear.value,
    });
  }

  setTimeout(updateFocus, 0);
}
function onYearSelect(event: Event, year: number) {
  if (props.view === "year") {
    onDateSelect(event, {
      year: year,
      month: 0,
      day: 1,
      selectable: true,
    });
  } else {
    currentYear.value = year;
    currentView.value = "month";
    emits("year-change", {
      month: currentMonth.value + 1,
      year: currentYear.value,
    });
  }

  setTimeout(updateFocus, 0);
}
function enableModality() {
  if (!mask) {
    mask = document.createElement("div");
    if (overlay.value) {
      mask.style.zIndex = String(parseInt(overlay.value.style.zIndex, 10) - 1);
    }
    DomHandler.addMultipleClasses(
      mask,
      "p-datepicker-mask p-datepicker-mask-scrollblocker p-component-overlay p-component-overlay-enter"
    );

    maskClickListener = () => {
      overlayVisible.value = false;
    };
    mask.addEventListener("click", maskClickListener);

    document.body.appendChild(mask);
    DomHandler.addClass(document.body, "p-overflow-hidden");
  }
}
function disableModality() {
  if (mask) {
    DomHandler.addClass(mask, "p-component-overlay-leave");
    mask.addEventListener("animationend", () => {
      destroyMask();
    });
  }
}
function destroyMask() {
  if (mask) {
    mask.removeEventListener("click", maskClickListener);
    maskClickListener = null;
    document.body.removeChild(mask as Node);
  }
  mask = null;

  let bodyChildren = document.body.children;
  let hasBlockerMasks;
  for (let i = 0; i < bodyChildren.length; i++) {
    let bodyChild = bodyChildren[i];
    if (DomHandler.hasClass(bodyChild as HTMLElement, "p-datepicker-mask-scrollblocker")) {
      hasBlockerMasks = true;
      break;
    }
  }

  if (!hasBlockerMasks) {
    DomHandler.removeClass(document.body, "p-overflow-hidden");
  }
}
function updateCurrentMetaData() {
  currentMonth.value = currentTime.value.month();
  currentYear.value = currentTime.value.year();
}
function isValidSelection(value: Date[] | Date | null) {
  if (value == null) {
    return true;
  }

  let isValid = true;
  if (isSingleSelection()) {
    if (
      !isSelectable(
        (value as Date).getDate(),
        (value as Date).getMonth(),
        (value as Date).getFullYear(),
        false
      ) ||
      isNaN((value as Date).getTime())
    ) {
      isValid = false;
    }
  } else if (
    (value as Date[]).every((v) => isSelectable(v.getDate(), v.getMonth(), v.getFullYear(), false))
  ) {
    if (isRangeSelection()) {
      isValid =
        (value as Date[]).length > 1 && (value as Date[])[1] > (value as Date[])[0] ? true : false;
    }
  }
  return isValid;
}
function getWeekNumber(date: Date) {
  let checkDate = new Date(date.getTime());
  checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
  let time = checkDate.getTime();
  checkDate.setMonth(0);
  checkDate.setDate(1);
  return Math.floor(Math.round((time - checkDate.getTime()) / 86400000) / 7) + 1;
}

function updateFocus() {
  let cell;

  if (navigationState && overlay.value) {
    if (navigationState.button) {
      initFocusableCell();

      if (navigationState.backward)
        DomHandler.findSingle(overlay.value, ".p-datepicker-prev").focus();
      else DomHandler.findSingle(overlay.value, ".p-datepicker-next").focus();
    } else {
      if (navigationState.backward) {
        let cells;

        if (currentView.value === "month") {
          cells = DomHandler.find(
            overlay.value,
            ".p-monthpicker .p-monthpicker-month:not(.p-disabled)"
          );
        } else if (currentView.value === "year") {
          cells = DomHandler.find(
            overlay.value,
            ".p-yearpicker .p-yearpicker-year:not(.p-disabled)"
          );
        } else {
          cells = DomHandler.find(
            overlay.value,
            ".p-datepicker-calendar td span:not(.p-disabled):not(.p-ink)"
          );
        }

        if (cells && cells.length > 0) {
          cell = cells[cells.length - 1];
        }
      } else {
        if (currentView.value === "month") {
          cell = DomHandler.findSingle(
            overlay.value,
            ".p-monthpicker .p-monthpicker-month:not(.p-disabled)"
          );
        } else if (currentView.value === "year") {
          cell = DomHandler.findSingle(
            overlay.value,
            ".p-yearpicker .p-yearpicker-year:not(.p-disabled)"
          );
        } else {
          cell = DomHandler.findSingle(
            overlay.value,
            ".p-datepicker-calendar td span:not(.p-disabled):not(.p-ink)"
          );
        }
      }

      if (cell) {
        cell.tabIndex = "0";
        cell.focus();
      }
    }

    navigationState = null;
  } else {
    initFocusableCell();
  }
}
function initFocusableCell() {
  let cell;
  if (overlay.value) {
    if (currentView.value === "month") {
      let cells = DomHandler.find(overlay.value, ".p-monthpicker .p-monthpicker-month");
      let selectedCell = DomHandler.findSingle(
        overlay.value,
        ".p-monthpicker .p-monthpicker-month.p-highlight"
      );
      cells.forEach((cell) => (cell.tabIndex = -1));
      cell = selectedCell || cells[0];
    } else if (currentView.value === "year") {
      let cells = DomHandler.find(overlay.value, ".p-yearpicker .p-yearpicker-year");
      let selectedCell = DomHandler.findSingle(
        overlay.value,
        ".p-yearpicker .p-yearpicker-year.p-highlight"
      );
      cells.forEach((cell) => (cell.tabIndex = -1));
      cell = selectedCell || cells[0];
    } else {
      cell = DomHandler.findSingle(overlay.value, "span.p-highlight");
      if (!cell) {
        let todayCell = DomHandler.findSingle(
          overlay.value,
          "td.p-datepicker-today span:not(.p-disabled):not(.p-ink"
        );
        if (todayCell) cell = todayCell;
        else
          cell = DomHandler.findSingle(
            overlay.value,
            ".p-datepicker-calendar td span:not(.p-disabled):not(.p-ink"
          );
      }
    }
  }
  if (cell) {
    cell.tabIndex = "0";
    if (!preventFocus && (!navigationState || !navigationState.button) && !timePickerChange) {
      cell.focus();
    }
    preventFocus = false;
  }
}

function onInput(event: HTMLElement) {
  try {
    let value = dayjs(input.value.innerHTML);

    if (isValidSelection(value.toDate())) {
      currentTime.value = value;
      typeUpdate = true;
      // updateModel(value.toDate());
    }
  } catch (err) {
    /* NoOp */
  }

  emits("input", event);
}
function onFocus(event: Event) {
  if (isEnabled()) {
    overlayVisible.value = true;
  }
  focused.value = true;
  emits("focus", event);
}
function onBlur(event: Event) {
  emits("blur", { originalEvent: event, value: input.value });

  focused.value = false;
  input.value = formatValue(props.modelValue);
}

function getMonthName(index: number) {
  return primevue.config.locale?.monthNames[index];
}
function getYear(month: { year: number }) {
  return currentView.value === "month" ? currentYear.value : month.year;
}
function onOverlayClick(event: Event) {
  if (!props.inline) {
    OverlayEventBus.emit("overlay-click", {
      originalEvent: event,
      target: container.value,
    });
  }
}
function onOverlayMouseUp(event: Event) {
  onOverlayClick(event);
}
function createResponsiveStyle() {
  if (props.numberOfMonths > 1 && props.responsiveOptions) {
    if (!responsiveStyleElement) {
      responsiveStyleElement = document.createElement("style");
      responsiveStyleElement.type = "text/css";
      document.body.appendChild(responsiveStyleElement);
    }

    let innerHTML = "";
    if (props.responsiveOptions) {
      let responsiveOptions = [...props.responsiveOptions]
        .filter((o) => !!(o.breakpoint && o.numMonths))
        .sort(
          (o1, o2) =>
            -1 *
            o1.breakpoint.localeCompare(o2.breakpoint, undefined, {
              numeric: true,
            })
        );

      for (let i = 0; i < responsiveOptions.length; i++) {
        let { breakpoint, numMonths } = responsiveOptions[i];
        let styles = `
                            .p-datepicker[${attributeSelector.value}] .p-datepicker-group:nth-child(${numMonths}) .p-datepicker-next {
                                display: inline-flex !important;
                            }
                        `;

        for (let j = numMonths; j < props.numberOfMonths; j++) {
          styles += `
                                .p-datepicker[${
                                  attributeSelector.value
                                }] .p-datepicker-group:nth-child(${j + 1}) {
                                    display: none !important;
                                }
                            `;
        }

        innerHTML += `
                            @media screen and (max-width: ${breakpoint}) {
                                ${styles}
                            }
                        `;
      }
    }

    responsiveStyleElement.innerHTML = innerHTML;
  }
}
function destroyResponsiveStyleElement() {
  if (responsiveStyleElement) {
    responsiveStyleElement.remove();
    responsiveStyleElement = null;
  }
}
</script>

<style scoped>
.p-calendar {
  position: relative;
  display: inline-flex;
  max-width: 100%;
}

.p-calendar .p-inputtext {
  min-width: 10rem;
}

.p-inputtext {
  flex: 1 auto;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.p-datepicker-trigger {
  flex: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

/* Fluid */
.p-fluid .p-calendar {
  display: flex;
}

.p-fluid .p-calendar .p-inputtext {
  width: 1%;
}

/* Datepicker */
.p-calendar .p-datepicker {
  display: flex;
  min-width: 100%;
}

.p-datepicker {
  width: auto;
  position: absolute;
  top: 0;
  left: 0;
}
.p-datepicker-main {
  display: flex;
}
.p-datepicker-inline {
  display: inline-block;
  position: static;
  overflow-x: auto;
}

/* Header */
.p-datepicker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.p-datepicker-header .p-datepicker-title {
  margin: 0 auto;
}

.p-datepicker-prev,
.p-datepicker-next {
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

/* Multiple Month DatePicker */
.p-datepicker-multiple-month .p-datepicker-group-container {
  display: flex;
}

.p-datepicker-multiple-month .p-datepicker-group-container .p-datepicker-group {
  flex: 1 1 auto;
}

/* DatePicker Table */
.p-datepicker table {
  width: 100%;
  border-collapse: collapse;
}

.p-datepicker td > span {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
}

/* Month Picker */
.p-monthpicker-month {
  width: 33.3%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

/* Year Picker */
.p-yearpicker-year {
  width: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

/*  Button Bar */
.p-datepicker-buttonbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* Time Picker */
.y-timepicker {
  width: 12.5rem;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Touch UI */
.p-datepicker-touch-ui,
.p-calendar .p-datepicker-touch-ui {
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 80vw;
  transform: translate(-50%, -50%);
}
.p-input-range {
  min-width: 22rem;
}
.p-input-Multiple {
  width: auto;
}
.p-datepicker-calendar-container {
  flex: 1 auto;
}
</style>
