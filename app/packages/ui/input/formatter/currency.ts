import { commify } from "@orderly.network/utils";
import { InputFormatter, InputFormatterOptions } from "./inputFormatter";

export const currencyFormatter: InputFormatter = {
  onRenderBefore: function (
    value: string | number,
    options: InputFormatterOptions,
  ): string {
    if (value === null || value === undefined) return "";
    return commify(value);
  },
  onSendBefore: function (
    value: string,
    options: InputFormatterOptions,
  ): string {
    if (value === null || value === undefined) return "";

    value = value.replace(/,/g, "");

    return value;
  },
};
