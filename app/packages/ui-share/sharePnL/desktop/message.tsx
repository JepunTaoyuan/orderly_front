import { FC, useRef, useState } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { CloseCircleFillIcon, Input, toast } from "@orderly.network/ui";
import { Checkbox } from "./checkbox";

export const Message: FC<{
  message: string;
  setMessage: any;
  check: boolean;
  setCheck: any;
}> = (props) => {
  const { message, setMessage, check, setCheck } = props;
  const [focus, setFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation();

  return (
    <div className="oui-flex oui-items-center oui-gap-3">
      <div className="oui-text-xs oui-font-semibold oui-text-base-contrast-60 oui-whitespace-nowrap">
        {t("share.pnl.optionalInfo.message")}
      </div>
      <div className="oui-flex-1 oui-h-7 custom-apply-to-everything oui-rounded-md oui-flex oui-items-center oui-gap-1">
        <Input
          ref={inputRef}
          placeholder={t("share.pnl.optionalInfo.message.placeholder")}
          classNames={{
            root: "oui-flex-1 oui-border-none oui-bg-transparent",
            input: "oui-bg-transparent oui-border-none oui-text-xs",
          }}
          size="sm"
          value={message}
          autoFocus={false}
          suffix={
            focus &&
            message && (
              <button
                className="oui-cursor-pointer"
                onMouseDown={(e) => {
                  setMessage("");
                  setTimeout(() => {
                    inputRef.current?.focus();
                  }, 50);
                  e.stopPropagation();
                }}
              >
                <CloseCircleFillIcon size={14} color="white" />
              </button>
            )
          }
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={(e) => {
            if (e.target.value.length > 25) {
              toast.error(t("share.pnl.optionalInfo.message.maxLength"));
              return;
            }
            setCheck(e.target.value.length > 0);
            setMessage(e.target.value);
          }}
        />
      </div>
    </div>
  );
};
