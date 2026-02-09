import { FC, ReactNode, useMemo, useState, useCallback } from "react";
import { useMediaQuery } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import {
  Button,
  DataTable,
  Divider,
  Flex,
  ListView,
  Statistic,
  Text,
  cn,
  Column,
  CopyIcon,
  DialogTitle,
  DialogContent,
  Dialog,
  modal,
  useModal,
  toast,
} from "@orderly.network/ui";
import { Decimal } from "@orderly.network/utils";
import { referralApi } from "@/services/referral.client";
import { EditCode } from "../../../components/editCodeBtn";
import { EditIcon } from "../../../components/editIcon";
import { PinBtn } from "../../../components/pinButton";
import { useReferralContext } from "../../../provider/context";
import { ReferralCodesReturns, ReferralCodeType } from "./referralCodes.script";

export const ReferralCodes: FC<ReferralCodesReturns> = (props) => {
  const isTablet = useMediaQuery("(max-width: 767px)");
  return (
    <Flex
      r={"md"}
      p={6}
      width={"100%"}
      gap={4}
      direction={"column"}
      className="oui-h-full oui-bg-base-9 oui-p-6 oui-tabular-nums"
    >
      <Title {...props} />

      <div className="oui-flex oui-w-full oui-flex-col 2xl:oui-h-full">
        <Divider />
        {isTablet ? <MobileLayout {...props} /> : <DesktopLayout {...props} />}
      </div>
    </Flex>
  );
};
// 新增邀請碼
export const CreateReferralCodeModal = modal.create<{
  mutate: () => void;
}>((props) => {
  const { mutate } = props;
  const { visible, hide, onOpenChange } = useModal();
  const { t } = useTranslation();
  const { userId, userInfo } = useReferralContext();

  // 從 userInfo 獲取 max_referral_rate，頂級代理預設 40% (0.4)
  const totalRate = userInfo?.max_referral_rate ?? 0.4;
  const totalRatePercent = totalRate * 100;

  // State 管理
  const [customCode, setCustomCode] = useState<string>("");
  const [referrerRate, setReferrerRate] = useState<string>(
    String((totalRatePercent / 2).toFixed(1)),
  );
  const [refereeRate, setRefereeRate] = useState<string>(
    String((totalRatePercent / 2).toFixed(1)),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 處理 "For you" rate 變更
  const handleReferrerRateChange = useCallback(
    (value: string) => {
      const numValue = parseFloat(value) || 0;
      const clampedValue = Math.min(Math.max(0, numValue), totalRatePercent);
      setReferrerRate(String(clampedValue));

      // 自動調整 referee rate 以確保總和不超過 total
      const currentReferee = parseFloat(refereeRate) || 0;
      if (clampedValue + currentReferee > totalRatePercent) {
        setRefereeRate(String((totalRatePercent - clampedValue).toFixed(1)));
      }
    },
    [totalRatePercent, refereeRate],
  );

  // 處理 "For referee" rate 變更
  const handleRefereeRateChange = useCallback(
    (value: string) => {
      const numValue = parseFloat(value) || 0;
      const clampedValue = Math.min(Math.max(0, numValue), totalRatePercent);
      setRefereeRate(String(clampedValue));

      // 自動調整 referrer rate 以確保總和不超過 total
      const currentReferrer = parseFloat(referrerRate) || 0;
      if (currentReferrer + clampedValue > totalRatePercent) {
        setReferrerRate(String((totalRatePercent - clampedValue).toFixed(1)));
      }
    },
    [totalRatePercent, referrerRate],
  );

  // 計算當前總和
  const currentTotal =
    (parseFloat(referrerRate) || 0) + (parseFloat(refereeRate) || 0);

  // 驗證 custom code 格式 (4-10 字元, A-Z 或 0-9)
  const isValidCode =
    customCode.length === 0 ||
    (customCode.length >= 4 &&
      customCode.length <= 10 &&
      /^[A-Z0-9]+$/.test(customCode.toUpperCase()));

  const handleSubmit = async () => {
    if (!userId) {
      setError("User not logged in");
      return;
    }

    if (customCode && !isValidCode) {
      setError("Referral code must be 4-10 characters (A-Z, 0-9)");
      return;
    }

    if (currentTotal > totalRatePercent) {
      setError(`Total rate cannot exceed ${totalRatePercent}%`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 調用 referralApi.createForAffiliate
      await referralApi.createForAffiliate({
        affiliate_id: userId,
        fee_discount_rate: parseFloat(refereeRate) / 100,
        custom_code: customCode.toUpperCase() || undefined,
      });

      toast.success(
        t("affiliate.createCode.success", "Referral code created successfully"),
      );
      mutate();
      hide();
    } catch (err: any) {
      console.error("Failed to create referral code:", err);
      setError(
        err?.message ||
          t("affiliate.createCode.error", "Failed to create referral code"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={visible} onOpenChange={onOpenChange}>
      <DialogContent
        size="md"
        className="oui-py-2 oui-rounded-sm"
        style={{ backgroundColor: "#0c0d10" }}
      >
        <DialogTitle>
          {t("affiliate.createCode.title", "Create a referral code")}
        </DialogTitle>
        {/* 表單 */}
        <div className="oui-flex oui-flex-col oui-gap-6 oui-pt-5">
          {/* 總佣金 */}
          <div className="oui-flex oui-flex-col oui-gap-1">
            <div className="oui-flex oui-justify-between oui-items-center">
              <span className="oui-text-xs oui-font-semibold oui-text-white/80">
                {t("affiliate.createCode.totalRate", "Total commission rate")}
              </span>
              <span className="oui-text-xs oui-font-semibold oui-text-primary">
                {totalRatePercent.toFixed(0)}%
              </span>
            </div>
            <span className="oui-text-2xs oui-text-white/50">
              {t(
                "affiliate.createCode.rateNote",
                "New rates apply to new users only. Existing users are unchanged.",
              )}
            </span>
          </div>

          {/* Referral code 輸入 */}
          <div className="oui-flex oui-flex-col oui-gap-1">
            <label className="oui-text-xs oui-text-white/60">
              {t("affiliate.referralCode", "Referral code")}
            </label>
            <input
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
              placeholder={t(
                "affiliate.createCode.codePlaceholder",
                "Referral code (optional)",
              )}
              className="oui-bg-base-9 oui-w-full oui-h-10 oui-px-3 oui-bg-white/5 oui-text-white oui-rounded-md"
              maxLength={10}
            />
            <span className="oui-text-2xs oui-text-white/50">
              {t(
                "affiliate.createCode.codeHint",
                "Use 4–10 characters: A–Z or 0–9. Leave empty for auto-generated code.",
              )}
            </span>
          </div>

          {/* Rate inputs */}
          <div className="oui-flex oui-items-center oui-gap-3">
            <div className="oui-flex oui-flex-col oui-flex-1">
              <label className="oui-text-gray-400 oui-text-xs oui-font-semibold oui-mb-1">
                {t("affiliate.createCode.forYou", "For you")}
              </label>
              <div className="oui-bg-base-9 oui-flex oui-items-center oui-bg-base-8 oui-rounded-md oui-px-3 oui-py-2">
                <input
                  type="number"
                  value={referrerRate}
                  onChange={(e) => handleReferrerRateChange(e.target.value)}
                  min={0}
                  max={totalRatePercent}
                  step={0.1}
                  className="oui-bg-transparent oui-text-white oui-text-lg oui-font-bold oui-w-full oui-outline-none"
                />
                <span className="oui-text-gray-400 oui-font-medium">%</span>
              </div>
            </div>

            <div className="oui-font-bold oui-text-xl oui-flex oui-items-end oui-h-11 oui-text-base-contrast-54">
              +
            </div>

            <div className="oui-flex oui-flex-col oui-flex-1">
              <label className="oui-text-gray-400 oui-text-xs oui-font-semibold oui-mb-1">
                {t("affiliate.createCode.forReferee", "For referee")}
              </label>
              <div className="oui-border oui-border-line-12 oui-bg-base-9 oui-flex oui-items-center oui-bg-base-8 oui-rounded-md oui-px-3 oui-py-2">
                <input
                  type="number"
                  value={refereeRate}
                  onChange={(e) => handleRefereeRateChange(e.target.value)}
                  min={0}
                  max={totalRatePercent}
                  step={0.1}
                  className="oui-bg-transparent oui-text-white oui-text-lg oui-font-bold oui-w-full oui-outline-none"
                />
                <span className="oui-text-gray-400 oui-font-medium">%</span>
              </div>
            </div>

            <div className="oui-text-base-contrast-54 oui-font-bold oui-text-xl oui-flex oui-items-end oui-h-11">
              =
            </div>

            <div
              className={cn(
                "oui-font-bold oui-text-md oui-flex oui-items-end oui-h-11",
                currentTotal > totalRatePercent
                  ? "oui-text-danger"
                  : "oui-text-primary",
              )}
            >
              {currentTotal.toFixed(0)}%
            </div>
          </div>

          {/* 錯誤訊息 */}
          {error && (
            <span className="oui-text-danger oui-text-sm">{error}</span>
          )}
        </div>
        <div className="oui-flex oui-gap-2 oui-justify-end oui-w-full oui-py-5">
          <Button
            variant="outlined"
            color="gray"
            className="oui-rounded-full oui-text-base-contrast-54 oui-flex-1"
            onClick={hide}
            disabled={isLoading}
          >
            {t("common.cancel", "Cancel")}
          </Button>
          <Button
            className="oui-flex-1 oui-rounded-full oui-text-white"
            onClick={handleSubmit}
            disabled={
              isLoading ||
              currentTotal > totalRatePercent ||
              (customCode.length > 0 && !isValidCode)
            }
            loading={isLoading}
          >
            {t("common.create", "Create")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

const Title: FC<ReferralCodesReturns> = (props) => {
  const { t } = useTranslation();
  const handleCreate = () => {
    modal.show(CreateReferralCodeModal, {
      mutate: props.mutate,
    });
  };
  return (
    <Flex direction={"row"} justify={"between"} width={"100%"}>
      <Text className="oui-text-lg">{t("affiliate.referralCodes")}</Text>
      <div className="oui-text-2xs md:oui-text-xs xl:oui-text-sm">
        <Button
          className={`oui-rounded-full oui-text-xs oui-px-5 oui-font-semibold`}
          style={{
            background:
              "linear-gradient(90deg, #7053F3 0%, #78CBC1 45%, #CDEB78 96%)",
          }}
          size="md"
          onClick={handleCreate}
        >
          Create
        </Button>
      </div>
    </Flex>
  );
};
// 原本
// const Title: FC<ReferralCodesReturns> = (props) => {
//   const { t } = useTranslation();

//   return (
//     <Flex direction={"row"} justify={"between"} width={"100%"}>
//       <Text className="oui-text-lg">{t("affiliate.referralCodes")}</Text>
//       <div className="oui-text-2xs md:oui-text-xs xl:oui-text-sm">
//         <Text className="oui-text-base-contrast-54">
//           {`${t("affiliate.referralCodes.remaining")}: `}
//         </Text>
//         <Text className="oui-text-primary-light">
//           {props.codes?.length || "--"}
//         </Text>
//       </div>
//     </Flex>
//   );
// };
const MobileLayout: FC<ReferralCodesReturns> = (props) => {
  return (
    <ListView
      dataSource={props.codes}
      className="oui-max-h-[240px] oui-w-full"
      renderItem={(e, index) => {
        return (
          <Flex direction={"column"}>
            <MobileCell
              key={index}
              data={e}
              editRate={props.editRate}
              copyLink={props.copyLink}
              copyCode={props.copyCode}
              setPinCode={props.setPinCode}
              editCode={props.editCode}
            />
            <Divider className="oui-mt-3 oui-w-full" />
          </Flex>
        );
      }}
    />
  );
};

const MobileCellItem: FC<{
  // key: string;
  title: string;
  value: string | ReactNode;
  copyable?: boolean;
  align?: "start" | "end" | undefined;
  className?: string;
  editRate?: () => void;
  onCopy?: () => void;
}> = (props) => {
  const { title, copyable, value, align, className, editRate, onCopy } = props;
  return (
    <Statistic
      id="oui-affiliate-affiliate-referralCodes"
      className={cn("oui-flex-1", className)}
      label={
        <Text className="oui-text-2xs oui-text-base-contrast-36">{title}</Text>
      }
      align={align}
      children={
        <Flex direction={"row"} gap={1}>
          <Text.formatted
            copyable={copyable}
            onCopy={() => {
              onCopy?.();
            }}
            className="oui-mt-[6px] oui-text-sm oui-text-base-contrast-80"
          >
            {value as string}
          </Text.formatted>
          {editRate && (
            <EditIcon
              className="oui-mt-px oui-cursor-pointer oui-fill-white/[.36] hover:oui-fill-white/80"
              fillOpacity={1}
              fill="currentColor"
              onClick={() => editRate()}
            />
          )}
        </Flex>
      }
    />
  );
};
const MobileCell: FC<{
  data: ReferralCodeType;
  setPinCode: (code: string, del?: boolean) => void;
  copyLink: (code: string) => void;
  copyCode: (code: string) => void;
  editRate: (code: ReferralCodeType) => void;
  editCode: (code: ReferralCodeType) => void;
}> = (props) => {
  const { data, setPinCode, copyLink, editRate, editCode } = props;
  const { t } = useTranslation();

  return (
    <Flex key={data.code} gap={3} direction={"column"} className="oui-w-full">
      <Flex
        direction={"row"}
        justify={"between"}
        itemAlign={"stretch"}
        width={"100%"}
      >
        <MobileCellItem
          title={t("affiliate.referralCode")}
          value={data.code}
          copyable
          onCopy={() => {
            props.copyCode?.(data.code);
          }}
          editRate={() => {
            editCode(data);
          }}
        />
        <MobileCellItem
          title={t("affiliate.referralCodes.column.you&Referee")}
          value={getRate(data)}
          align="end"
          editRate={() => {
            editRate(data);
          }}
        />
        <MobileCellItem
          title={t("affiliate.referralCodes.column.referees&Traders")}
          value={getCount(data)}
          align="end"
          className={"oui-hidden md:oui-flex"}
        />
      </Flex>
      <Flex
        direction={"row"}
        justify={"between"}
        itemAlign={"stretch"}
        width={"100%"}
        className="md:oui-hidden"
      >
        <MobileCellItem
          title={t("affiliate.referees")}
          value={getCount(data).split("/")?.[0]}
          align="start"
        />
        <MobileCellItem
          title={t("affiliate.referralCodes.column.traders")}
          value={getCount(data).split("/")?.[1]}
          align="end"
        />
      </Flex>
      <Flex
        direction={"row"}
        justify={"between"}
        itemAlign={"stretch"}
        width={"100%"}
      >
        <PinBtn
          pinned={data.isPined || false}
          onClick={(e) => {
            setPinCode(data.code, !e);
          }}
        />
        <Button
          variant="outlined"
          size="xs"
          className="oui-px-[20px]"
          onClick={(e) => {
            copyLink(data.code);
          }}
        >
          {t("affiliate.referralCodes.copyLink")}
        </Button>
      </Flex>
    </Flex>
  );
};

const DesktopLayout: FC<ReferralCodesReturns> = (props) => {
  const { t } = useTranslation();

  const moreColumn = useMediaQuery("(min-width: 1024px)");

  const columns = useMemo(() => {
    const cols: Column[] = [
      {
        title: t("affiliate.referralCode"),
        dataIndex: "code",
        width: moreColumn ? 115 : 120,
        className: "!oui-px-0",
        render: (value, data) => {
          return (
            <Flex direction={"row"} itemAlign={"center"} gap={1}>
              <PinBtn
                size={12}
                pinned={data.isPined || false}
                onClick={(e) => {
                  props.setPinCode(data.code, !e);
                }}
              />
              <Text.formatted
                // rule={""}
                suffix={
                  <>
                    {data.isAutoGenerated && data.total_invites < 1 && (
                      <EditCode onClick={() => props.editCode?.(data)} />
                    )}
                    <CopyIcon
                      className="oui-cursor-pointer"
                      size={12}
                      color="white"
                      onClick={() => props.copyCode?.(data.code)}
                    />
                  </>
                }
                copyable
                onCopy={() => {
                  props.copyCode?.(data.code);
                }}
              >
                {value}
              </Text.formatted>
            </Flex>
          );
        },
      },
      {
        title: t("affiliate.referralCodes.column.you&Referee"),
        dataIndex: "dffd",
        width: moreColumn ? 120 : 120,
        className: "oui-pr-0",
        render: (value, data) => {
          return (
            <Flex direction={"row"} itemAlign={"center"} gap={1}>
              {getRate(data)}
              <EditIcon
                className="oui-mt-[6px] oui-cursor-pointer oui-fill-white/[.36] hover:oui-fill-white/80"
                fillOpacity={1}
                fill="currentColor"
                onClick={(e) => props.editRate?.(data)}
              />
            </Flex>
          );
        },
      },
    ];

    if (moreColumn) {
      cols.push({
        title: t("affiliate.referees"),
        dataIndex: "referee_rebate_rate",
        width: 65,
        className: "oui-pr-0",
        render: (value, data) => getCount(data).split("/")[0],
      });
      cols.push({
        title: t("affiliate.referralCodes.column.traders"),
        dataIndex: "referrer_rebate_rate",
        width: 65,
        className: "oui-pr-0",
        render: (value, data) => getCount(data).split("/")[1],
      });
    } else {
      cols.push({
        title: t("affiliate.referralCodes.column.referees&Traders"),
        dataIndex: "total_invites/total_traded",
        width: 120,
        fixed: "left",
        render: (value, data) => getCount(data),
      });
    }

    cols.push({
      dataIndex: "link",
      align: "right",
      width: 74,
      className: "!oui-px-0",
      render: (value, data) => (
        <Button
          variant="outlined"
          color="gray"
          size="sm"
          className="oui-px-5 oui-rounded-full"
          onClick={(e) => {
            props?.copyLink?.(data.code);
          }}
        >
          {t("affiliate.referralCodes.copyLink")}
        </Button>
      ),
    });

    return cols;
  }, [moreColumn, t]);

  return (
    <DataTable
      bordered
      columns={columns}
      dataSource={props.codes}
      classNames={{
        header: "oui-px-0",
        root: "2xl:oui-flex-1 2xl:oui-max-h-[230px] 3xl:oui-max-h-[300px]",
      }}
      onRow={(record) => {
        return {
          className: "oui-h-[45px]",
        };
      }}
    />
  );
};

const getRate = (item: ReferralCodeType) => {
  const refereeRate = new Decimal(item.referee_rebate_rate ?? 0)
    .mul(100)
    .toFixed(1, Decimal.ROUND_DOWN)
    .toString();
  const referralRate = new Decimal(item.referrer_rebate_rate ?? 0)
    .mul(100)
    .toFixed(1, Decimal.ROUND_DOWN)
    .toString();
  return `${referralRate}% / ${refereeRate}%`;
};

const getCount = (item: ReferralCodeType) => {
  return `${item.total_invites} / ${item.total_traded}`;
};
