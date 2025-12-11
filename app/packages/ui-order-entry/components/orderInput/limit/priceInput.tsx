import { FC } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { OrderType } from "@orderly.network/types";
import { cn, inputFormatter } from "@orderly.network/ui";
import { OrderEntryScriptReturn } from "../../../orderEntry.script";
import { InputType } from "../../../types";
import { BBOStatus } from "../../../utils";
import { CustomInput } from "../../customInput";
import { useOrderEntryContext } from "../../orderEntryContext";
import { BBOOrderTypeSelect } from "./bboOrderTypeSelect";
import { PriceLabelButtons } from "./priceLabelButtons";

export type PriceInputProps = {
  order_type: OrderType;
  order_price?: string;
  bbo: Pick<
    OrderEntryScriptReturn,
    "bboStatus" | "bboType" | "onBBOChange" | "toggleBBO"
  >;
  priceInputContainerWidth?: number;
  fillMiddleValue: OrderEntryScriptReturn["fillMiddleValue"];
};

// TODO: memo component
export const PriceInput: FC<PriceInputProps> = (props) => {
  const { bbo } = props;
  const { t } = useTranslation();
  const {
    symbolInfo,
    onFocus,
    onBlur,
    getErrorMsg,
    setOrderValue,
    priceInputRef,
    priceInputContainerRef,
  } = useOrderEntryContext();

  const { quote, quote_dp } = symbolInfo;

  const readOnly = bbo.bboStatus === BBOStatus.ON;
  const isLimitOrder = props.order_type === OrderType.LIMIT;

  return (
    <div ref={priceInputContainerRef} className="oui-group oui-w-full">
      {/* 標籤在上方 */}
      <label
        htmlFor="order_price_input"
        className="oui-block oui-mb-1 oui-text-2xs oui-text-base-contrast-36"
      >
        {t("common.price")}
      </label>

      {/* Input Box 和 BBO/Mid 按鈕同一行 */}
      <div className="oui-flex oui-items-center oui-gap-2">
        {/* Input Box */}
        <div className="oui-relative oui-flex-1">
          <CustomInput
            id="order_price_input"
            name="order_price_input"
            label=""
            externalLabel={false}
            suffix={quote}
            value={props.order_price}
            onChange={(e) => {
              setOrderValue("order_price", e);
            }}
            error={getErrorMsg("order_price")}
            formatters={[inputFormatter.dpFormatter(quote_dp)]}
            onFocus={onFocus(InputType.PRICE)}
            onBlur={onBlur(InputType.PRICE)}
            readonly={readOnly}
            ref={priceInputRef}
            classNames={{
              root: cn(readOnly && "focus-within:oui-outline-transparent"),
              input: cn(readOnly && "oui-cursor-auto"),
            }}
          />
          {bbo.bboStatus === BBOStatus.ON && (
            <div className="oui-absolute oui-bottom-1 oui-left-0">
              <BBOOrderTypeSelect
                value={bbo.bboType}
                onChange={bbo.onBBOChange}
                contentStyle={{
                  width: props.priceInputContainerWidth,
                }}
              />
            </div>
          )}
        </div>

        {/* BBO | Mid 按鈕在 Input 右邊 */}
        {isLimitOrder && (
          <PriceLabelButtons
            bbo={bbo}
            fillMiddleValue={props.fillMiddleValue}
          />
        )}
      </div>
    </div>
  );
};
