import { useEffect, useRef, useState } from "react";
import { cleanStringStyle, useMutation } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Flex,
  Input,
  modal,
  toast,
  useModal,
} from "@orderly.network/ui";
import { Decimal } from "@orderly.network/utils";
import { ReferralCodeType } from "./referralCodes.script";

export const EditReferralRate = modal.create<{
  code: ReferralCodeType;
  mutate: any;
}>((props) => {
  const { code, mutate } = props;
  const { visible, hide, resolve, reject, onOpenChange } = useModal();
  const maxRate = new Decimal(code.max_rebate_rate ?? 0).mul(100);
  const [refereeRebateRate, setRefereeRebateRate] = useState(
    `${new Decimal(code.referee_rebate_rate ?? 0).mul(100)}`,
  );
  const [referrerRebateRate, setReferrerRebateRate] = useState(
    `${new Decimal(code.referrer_rebate_rate ?? 0).mul(100)}`,
  );
  const [showError, setShowError] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length,
      );
    }
  }, [inputRef]);

  useEffect(() => {
    setRefereeRebateRate(
      `${new Decimal(code.referee_rebate_rate ?? 0).mul(100)}`,
    );
    setReferrerRebateRate(
      `${new Decimal(code.referrer_rebate_rate ?? 0).mul(100)}`,
    );
  }, [code]);

  const [editRate, { error, isMutating }] = useMutation(
    "/v1/referral/edit_split",
    "POST",
  );
  const onClickConfirm = async () => {
    try {
      const r1 = Number.parseFloat(refereeRebateRate);
      const r2 = Number.parseFloat(referrerRebateRate);

      await editRate({
        referral_code: code.code,
        referee_rebate_rate: r1 / 100,
        referrer_rebate_rate: r2 / 100,
      });
      toast.success(t("affiliate.referralRate.editRateModal.success"));
      mutate();
      hide();
    } catch (e) {
      // @ts-ignore
      toast.error(e?.message || e || "");
    }
  };

  return (
    <Dialog open={visible} onOpenChange={onOpenChange}>
      <DialogContent
        size="md"
        className="oui-px-6 oui-rounded-sm oui-shadow-[0px_12px_20px_0px_rgba(0,0,0,0.25)]"
        style={{ backgroundColor: "#0c0d10" }}
        closable
      >
        <DialogTitle>
          <div className="oui-my-3">{t("Edit a referral code")}</div>
          <Divider />
        </DialogTitle>

        <div className="oui-mt-3 oui-h-full oui-flex oui-flex-col oui-justify-end">
          {/* Total Commission Display */}
          <div className="oui-text-xs oui-text-base-contrast-80 oui-mt-2 oui-flex oui-justify-between">
            {t("Total commission rate")}
            <div className="oui-text-primary oui-pl-1">
              {`${new Decimal(code.max_rebate_rate)
                .mul(100)
                .toFixed(0, Decimal.ROUND_DOWN)}%`}
            </div>
          </div>

          {/* Description */}
          <div className="oui-pb-5 oui-text-xs oui-text-base-contrast-54">
            {t(
              "New rates apply to new users only Existing users are unchanged.",
            )}
          </div>

          {/* Referral Code (Read Only or Label) */}
          <div className="oui-flex oui-flex-col oui-gap-2 oui-pb-5">
            <label className="oui-text-xs oui-text-white/60">
              Referral code
            </label>
            <input
              type="text"
              className="oui-bg-base-9 oui-w-full oui-h-10 oui-px-3 oui-text-white oui-rounded-md oui-flex oui-items-center"
              value={code.code}
            />
          </div>

          {/* Rate inputs Row */}
          <div className="oui-flex oui-items-center oui-gap-1 oui-pb-3">
            {/* For You Input */}
            <div className="oui-flex oui-flex-col oui-flex-1">
              <label className="oui-text-gray-400 oui-text-xs font-semibold mb-1">
                {t("affiliate.referralRate.editRateModal.label.you")}
              </label>
              <div
                className={`oui-bg-base-9 oui-flex oui-items-center oui-rounded-md oui-px-3 oui-py-2 ${showError ? "oui-border oui-border-danger" : ""}`}
              >
                <input
                  type="text"
                  inputMode="decimal"
                  className="oui-bg-base-9 oui-text-white oui-text-md oui-font-bold oui-w-full oui-outline-none"
                  value={referrerRebateRate}
                  onChange={(e) => {
                    const text = cleanStringStyle(e.target.value);
                    const rate = Number.parseFloat(text);
                    setReferrerRebateRate(text);
                    if (!Number.isNaN(rate)) {
                      setRefereeRebateRate(
                        `${maxDecimal(new Decimal(0), maxRate.sub(rate))}`,
                      );
                      setShowError(maxRate.sub(rate) < new Decimal(0));
                    } else {
                      setRefereeRebateRate("");
                      setReferrerRebateRate("");
                    }
                  }}
                />
                <span className="oui-text-gray-400 oui-font-medium">%</span>
              </div>
            </div>

            <div className="oui-font-bold oui-text-xl oui-flex oui-items-end oui-h-11 oui-text-base-contrast-54">
              +
            </div>

            {/* For Referee Input */}
            <div className="oui-flex oui-flex-col oui-flex-1">
              <label className="oui-text-gray-400 oui-text-xs font-semibold mb-1">
                {t("affiliate.referralRate.editRateModal.label.referee")}
              </label>
              <div
                className={`oui-bg-base-9 oui-flex oui-items-center oui-rounded-md oui-px-3 oui-py-2 ${showError ? "oui-border oui-border-danger" : ""}`}
              >
                <input
                  type="text"
                  inputMode="decimal"
                  className="oui-bg-base-9 oui-text-white oui-text-md oui-font-bold oui-w-full oui-outline-none"
                  value={refereeRebateRate}
                  onChange={(e) => {
                    const text = cleanStringStyle(e.target.value);
                    const rate = Number.parseFloat(text);
                    setRefereeRebateRate(text);
                    if (!Number.isNaN(rate)) {
                      setReferrerRebateRate(
                        `${maxDecimal(new Decimal(0), maxRate.sub(rate))}`,
                      );
                      setShowError(maxRate.sub(rate) < new Decimal(0));
                    } else {
                      setRefereeRebateRate("");
                      setReferrerRebateRate("");
                    }
                  }}
                />
                <span className="oui-text-gray-400 oui-font-medium">%</span>
              </div>
            </div>

            <div className="oui-text-base-contrast-54 oui-font-bold oui-text-xl oui-flex oui-items-end oui-h-11">
              =
            </div>

            <div className="oui-text-primary oui-font-bold oui-text-md oui-flex oui-items-end oui-h-11">
              {`${maxRate.toString()}%`}
            </div>
          </div>

          {/* Error Message */}
          {showError && (
            <div className="oui-text-danger oui-text-xs oui-mt-2 oui-text-center">
              {t("affiliate.referralRate.editRateModal.helpText.max")}
            </div>
          )}

          {/* Action Buttons */}
          <div className="oui-flex oui-gap-2 oui-justify-end oui-w-full oui-py-5">
            <Button
              variant="outlined"
              color="gray"
              className="oui-rounded-full oui-text-base-contrast-54 oui-flex-1"
              onClick={hide}
            >
              {t("common.cancel")}
            </Button>
            <Button
              loading={isMutating}
              disabled={
                refereeRebateRate.length === 0 ||
                referrerRebateRate.length === 0 ||
                showError
              }
              className="oui-flex-1 oui-rounded-full oui-text-white"
              onClick={(e) => {
                e.stopPropagation();
                onClickConfirm();
              }}
            >
              {t("common.confirm")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    // 原本
    // <Dialog open={visible} onOpenChange={onOpenChange}>
    //   <DialogContent
    //     className="oui-px-6 oui-max-w-[320px] oui-bg-base-8 oui-shadow-[0px_12px_20px_0px_rgba(0,0,0,0.25)]"
    //     closable
    //   >
    //     <DialogTitle>
    //       <div className="oui-my-3">
    //         {t("affiliate.referralRate.editRateModal.title")}
    //       </div>
    //       <Divider />
    //     </DialogTitle>

    //     <div className="oui-mt-3 oui-h-full oui-flex oui-flex-col oui-justify-end">
    //       <div className="oui-text-xs oui-text-base-contrast-54">
    //         {t("affiliate.referralRate.editRateModal.description")}
    //       </div>
    //       <div className="oui-text-xs oui-text-base-contrast-80 oui-mt-2 oui-flex">
    //         {t("affiliate.referralRate.editRateModal.label")}
    //         <div className="oui-text-warning-darken oui-pl-1">{`${new Decimal(
    //           code.max_rebate_rate,
    //         )
    //           .mul(100)
    //           .toFixed(0, Decimal.ROUND_DOWN)}%`}</div>
    //       </div>

    //       <div className="oui-text-2xs oui-mt-6 oui-text-base-contrast-80">
    //         {t("affiliate.referralRate.editRateModal.label.you")}
    //       </div>
    //       <Input
    //         ref={inputRef}
    //         containerClassName="oui-h-[40px] oui-mt-3 oui-bg-base-700 oui-outline oui-outline-1 oui-outline-base-contrast-12 focus-within:oui-outline-primary-darken"
    //         placeholder="Enter code"
    //         type="text"
    //         inputMode="decimal"
    //         autoComplete="off"
    //         value={referrerRebateRate}
    //         onChange={(e) => {
    //           const text = cleanStringStyle(e.target.value);
    //           const rate = Number.parseFloat(text);
    //           setReferrerRebateRate(text);
    //           if (!Number.isNaN(rate)) {
    //             setRefereeRebateRate(
    //               `${maxDecimal(new Decimal(0), maxRate.sub(rate))}`,
    //             );
    //             setShowError(maxRate.sub(rate) < new Decimal(0));
    //           } else {
    //             setRefereeRebateRate("");
    //             setReferrerRebateRate("");
    //           }
    //         }}
    //         suffix={
    //           <div className="oui-px-3 oui-text-base-contrast-54 oui-text-base">
    //             %
    //           </div>
    //         }
    //         color={showError ? "danger" : undefined}
    //       />

    //       <div className="oui-text-2xs oui-mt-6 oui-text-base-contrast-80">
    //         {t("affiliate.referralRate.editRateModal.label.referee")}
    //       </div>
    //       <Input
    //         containerClassName="oui-h-[40px] oui-mt-3 oui-bg-base-700 oui-outline oui-outline-1 oui-outline-base-contrast-12 focus-within:oui-outline-primary-darken"
    //         placeholder="Enter code"
    //         type="text"
    //         inputMode="decimal"
    //         autoComplete="off"
    //         autoFocus={false}
    //         value={refereeRebateRate}
    //         onChange={(e) => {
    //           const text = cleanStringStyle(e.target.value);
    //           const rate = Number.parseFloat(text);
    //           setRefereeRebateRate(text);
    //           if (!Number.isNaN(rate)) {
    //             setReferrerRebateRate(
    //               `${maxDecimal(new Decimal(0), maxRate.sub(rate))}`,
    //             );
    //             setShowError(maxRate.sub(rate) < new Decimal(0));
    //           } else {
    //             setRefereeRebateRate("");
    //             setReferrerRebateRate("");
    //           }
    //         }}
    //         suffix={
    //           <div className="oui-px-3 oui-text-base-contrast-54 oui-text-base">
    //             %
    //           </div>
    //         }
    //         color={showError ? "danger" : undefined}
    //       />

    //       {showError && (
    //         <div className="oui-text-danger oui-text-xs oui-mt-8 oui-text-center oui-px-4">
    //           {t("affiliate.referralRate.editRateModal.helpText.max")}
    //         </div>
    //       )}

    //       <Flex width={"100%"} justify={"center"}>
    //         <Button
    //           id="referral_bind_referral_code_btn"
    //           disabled={
    //             refereeRebateRate.length === 0 ||
    //             referrerRebateRate.length === 0 ||
    //             showError
    //           }
    //           loading={isMutating}
    //           className={cn(
    //             "oui-mt-8 oui-mb-4 oui-w-[154px]",
    //             showError && "oui-mt-3",
    //           )}
    //           onClick={(e) => {
    //             e.stopPropagation();
    //             onClickConfirm();
    //           }}
    //         >
    //           {t("common.confirm")}
    //         </Button>
    //       </Flex>
    //     </div>
    //   </DialogContent>
    // </Dialog>
  );
});

function maxDecimal(a: Decimal, b: Decimal) {
  return a > b ? a : b;
}
