<template>
  <div class="ethiopian-datepicker relative inline-block w-full sm:w-auto">
    <label v-if="label" class="block text-sm font-medium mb-1">
      {{ label }}
    </label>

    <!-- Display Input -->
    <div
      class="border rounded px-3 py-2 flex items-center justify-between cursor-pointer bg-white w-full"
      @click="toggleCalendar"
    >
      <span v-if="modelValue">{{ formatted }}</span>
      <span v-else class="text-gray-400">Select date</span>
      <i class="mdi mdi-calendar text-gray-500 ml-2"></i>
    </div>

    <!-- Popup Calendar -->
    <div
      v-if="showCalendar"
      class="absolute sm:mt-2 sm:w-72 z-50 bg-white border rounded-lg shadow-lg p-3 w-full left-0 sm:left-auto sm:right-0 sm:rounded-lg sm:p-3 max-h-[80vh] overflow-y-auto"
    >
      <!-- Month/Year controls -->
      <div class="flex justify-between items-center mb-2">
        <button
          @click="prevMonth"
          type="button"
          class="px-2 py-1 text-gray-600 hover:text-black"
        >
          &lt;
        </button>
        <span class="font-semibold text-center">
          {{ months[selected.month - 1] }} {{ selected.year }}
        </span>
        <button
          @click="nextMonth"
          type="button"
          class="px-2 py-1 text-gray-600 hover:text-black"
        >
          &gt;
        </button>
      </div>

      <!-- Days of week -->
      <div
        class="grid grid-cols-7 gap-1 text-center font-medium text-gray-500 text-sm"
      >
        <span v-for="d in weekDays" :key="d">{{ d }}</span>
      </div>

      <!-- Days -->
      <div class="grid grid-cols-7 gap-1 text-center mt-1">
        <span
          v-for="day in daysForMonth"
          :key="day"
          @click="selectDate(day)"
          class="cursor-pointer rounded-lg px-2 py-1 hover:bg-blue-100"
          :class="{
            'bg-blue-500 text-white': day === selected.day,
          }"
        >
          {{ day }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import {
  gregorianToEthiopianObj,
  ethiopianToIso,
  ETHIOPIAN_MONTHS,
} from "@/utils/ethiopianDate";

export default {
  name: "EthiopianDatePicker",
  props: {
    modelValue: { type: [String, Date, null], default: null }, // ISO string
    label: { type: String, default: "" },
  },
  emits: ["update:modelValue"],

  setup(props, { emit }) {
    const months = ETHIOPIAN_MONTHS;
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    // initialize selected date
    const init = () => {
      const eth = gregorianToEthiopianObj(props.modelValue || new Date());
      return {
        year: eth ? eth.year : new Date().getFullYear(),
        month: eth ? eth.month : 1,
        day: eth ? eth.day : 1,
      };
    };
    const selected = ref(init());

    // calendar visibility
    const showCalendar = ref(false);

    // days in current Ethiopian month
    const daysForMonth = computed(() => {
      if (selected.value.month === 13) {
        // Pagume: 5 or 6, but safe to show 6
        return Array.from({ length: 6 }, (_, i) => i + 1);
      }
      return Array.from({ length: 30 }, (_, i) => i + 1);
    });

    // formatted label in input
    const formatted = computed(() => {
      if (!selected.value.day || !selected.value.month || !selected.value.year)
        return "";
      return `${months[selected.value.month - 1]} ${selected.value.day}, ${
        selected.value.year
      } ዓ.ም`;
    });

    // select a day and emit ISO date
    const selectDate = (day) => {
      selected.value.day = day;
      const iso = ethiopianToIso(selected.value);
      emit("update:modelValue", iso);
      showCalendar.value = false;
    };

    const toggleCalendar = () => {
      showCalendar.value = !showCalendar.value;
    };

    const prevMonth = () => {
      if (selected.value.month === 1) {
        selected.value.month = 13;
        selected.value.year--;
      } else {
        selected.value.month--;
      }
    };

    const nextMonth = () => {
      if (selected.value.month === 13) {
        selected.value.month = 1;
        selected.value.year++;
      } else {
        selected.value.month++;
      }
    };

    // watch incoming modelValue (external changes)
    watch(
      () => props.modelValue,
      (newVal) => {
        if (!newVal) {
          selected.value = init();
          return;
        }
        const eth = gregorianToEthiopianObj(newVal);
        if (eth)
          selected.value = { year: eth.year, month: eth.month, day: eth.day };
      },
      { immediate: true }
    );

    return {
      months,
      weekDays,
      selected,
      showCalendar,
      daysForMonth,
      formatted,
      toggleCalendar,
      selectDate,
      prevMonth,
      nextMonth,
    };
  },
};
</script>
