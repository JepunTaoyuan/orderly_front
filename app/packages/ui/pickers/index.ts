import { DateRangePicker } from "./dateRangePicker";
import { DatePicker as DatePickerBase } from "./datepicker";

export { Calendar } from "./date/calendar";

type DatePickerType = typeof DatePickerBase & {
  range: typeof DateRangePicker;
};

const DatePicker = DatePickerBase as DatePickerType;
DatePicker.range = DateRangePicker;

export { DatePicker };
export type { DatePickerProps } from "./datepicker";

export { Picker } from "./picker";
