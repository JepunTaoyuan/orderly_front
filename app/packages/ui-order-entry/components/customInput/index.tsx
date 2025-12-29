import { forwardRef, PropsWithChildren, ReactNode } from "react";
import { EMPTY_LIST } from "@orderly.network/types";
import { cn, inputFormatter, Input, InputProps } from "@orderly.network/ui";
import { useOrderEntryContext } from "../orderEntryContext";

export type CustomInputProps = {
  label: string;
  suffix?: ReactNode;
  placeholder?: string;
  id: string;
  className?: string;
  name?: string;
  onChange?: (value: string) => void;
  value?: InputProps["value"];
  autoFocus?: InputProps["autoFocus"];
  error?: string;
  onFocus?: InputProps["onFocus"];
  onBlur?: InputProps["onBlur"];
  formatters?: InputProps["formatters"];
  overrideFormatters?: InputProps["formatters"];
  classNames?: InputProps["classNames"];
  readonly?: boolean;
  prefix?: ReactNode;
  /** 標籤是否顯示在 input 外部上方，預設 true */
  externalLabel?: boolean;
  /** 使用緊湊高度 (44px)，預設 true */
  compact?: boolean;
};

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (props, ref) => {
    const { placeholder = "0", externalLabel = true, compact = true } = props;
    const { errorMsgVisible } = useOrderEntryContext();

    // 根據 externalLabel 和 compact 決定樣式
    const inputHeight = compact ? "oui-h-[44px]" : "oui-h-[54px]";
    const inputPadding = externalLabel ? "oui-py-2" : "oui-py-1";
    const inputMargin = externalLabel ? "" : "oui-mb-1 oui-mt-5";

    const inputElement = (
      <Input.tooltip
        ref={ref}
        tooltip={errorMsgVisible ? props.error : undefined}
        autoComplete={"off"}
        autoFocus={props.autoFocus}
        size={"lg"}
        placeholder={props.readonly ? "" : placeholder}
        id={props.id}
        name={props.name}
        color={props.error ? "danger" : undefined}
        prefix={
          externalLabel
            ? props.prefix
            : props.prefix || (
                <InputLabel id={props.id} className={props.classNames?.prefix}>
                  {props.label}
                </InputLabel>
              )
        }
        suffix={props.suffix}
        value={props.readonly ? "" : props.value || ""}
        onValueChange={props.onChange}
        onFocus={(event) => {
          props.onFocus?.(event);
        }}
        onBlur={(event) => {
          props.onBlur?.(event);
        }}
        formatters={
          props.overrideFormatters || [
            ...(props.formatters ?? EMPTY_LIST),
            inputFormatter.numberFormatter,
            inputFormatter.currencyFormatter,
            inputFormatter.decimalPointFormatter,
          ]
        }
        classNames={{
          root: cn(
            "orderly-order-entry custom-apply-to-everything oui-relative oui-rounded-md oui-px-2",
            inputHeight,
            inputPadding,
            props.className,
            props.classNames?.root,
          ),
          input: cn("oui-h-5", inputMargin, props?.classNames?.input),
          suffix: cn(
            externalLabel
              ? "oui-flex oui-items-center oui-text-2xs oui-text-base-contrast-36"
              : "oui-absolute oui-right-0 oui-top-0 oui-justify-start oui-py-2 oui-text-2xs oui-text-base-contrast-36",
            props.classNames?.suffix,
          ),
        }}
        readOnly={props.readonly}
      />
    );

    // 如果使用外部標籤，包裹一層 div
    if (externalLabel) {
      return (
        <div className="oui-flex oui-flex-col">
          <label
            htmlFor={props.id}
            className="oui-mb-1 oui-text-2xs oui-text-base-contrast-36"
          >
            {props.label}
          </label>
          {inputElement}
        </div>
      );
    }

    return inputElement;
  },
);

CustomInput.displayName = "CustomInput";

const InputLabel = (
  props: PropsWithChildren<{ id: string; className?: string }>,
) => {
  return (
    <label
      htmlFor={props.id}
      className={cn(
        "oui-absolute oui-left-2 oui-top-[7px] oui-text-2xs oui-text-base-contrast-36",
        props.className,
      )}
    >
      {props.children}
    </label>
  );
};
