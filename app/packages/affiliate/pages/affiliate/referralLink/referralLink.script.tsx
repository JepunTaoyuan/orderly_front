import { useMemo } from "react";
import { RefferalAPI, useLocalStorage } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import { toast } from "@orderly.network/ui";
import { Decimal } from "@orderly.network/utils";
import { useReferralContext } from "../../../provider";
import { addQueryParam } from "../../../utils/utils";

export type ReferralLinkReturns = {
  onCopy?: (value: string) => void;
  refLink?: string;
  refCode?: string;
  earn?: string;
  share?: string;
  brokerName?: string;
};

export const useReferralLinkScript = (): ReferralLinkReturns => {
  const { t } = useTranslation();

  const onCopy = (value: string) => {
    toast.success(t("common.copy.copied"));
  };

  const { referralInfo, referralLinkUrl, overwrite, referralCodesStats } =
    useReferralContext();
  const [pinCodes, setPinCodes] = useLocalStorage<string[]>(
    "orderly_referral_codes",
    [] as string[],
  );

  const codes = useMemo((): RefferalAPI.ReferralCode[] => {
    let referralCodes: RefferalAPI.ReferralCode[] = [];

    // 優先使用 Legacy Orderly API
    if (referralInfo?.referrer_info?.referral_codes?.length) {
      referralCodes = [...referralInfo.referrer_info.referral_codes];
    }
    // Fallback 到 orderly_refer API (referralCodesStats)
    else if (referralCodesStats?.codes?.length) {
      referralCodes = referralCodesStats.codes.map((code) => ({
        code: code.code,
        referrer_rebate_rate: code.owner_commission_ratio,
        referee_rebate_rate: code.fee_discount_rate,
        total_invites: code.total_invites,
        total_traded: code.total_traded,
        max_rebate_rate: code.owner_commission_ratio + code.fee_discount_rate,
      }));
    } else {
      return [];
    }

    const pinedItems: RefferalAPI.ReferralCode[] = [];

    for (let i = 0; i < pinCodes.length; i++) {
      const code = pinCodes[i];

      const index = referralCodes.findIndex((item) => item.code === code);
      if (index !== -1) {
        pinedItems.push({ ...referralCodes[index] });
        referralCodes.splice(index, 1);
      }
    }

    return [...pinedItems, ...referralCodes];
  }, [
    referralInfo?.referrer_info?.referral_codes,
    referralCodesStats,
    pinCodes,
  ]);

  const firstCode = useMemo(() => {
    if (codes.length === 0) {
      return undefined;
    }

    return codes[0];
  }, [codes]);

  const code = useMemo(() => {
    return firstCode?.code;
  }, [firstCode]);

  const referralLink = useMemo(() => {
    if (!firstCode) return "";

    return addQueryParam(referralLinkUrl, "ref", firstCode.code);
  }, [firstCode]);

  const earn = useMemo(() => {
    const value = new Decimal(firstCode?.referrer_rebate_rate || "0")
      .mul(100)
      .toDecimalPlaces(0, Decimal.ROUND_DOWN)
      .toString();
    return `${value}%`;
  }, [firstCode?.referrer_rebate_rate]);

  const share = useMemo(() => {
    const value = new Decimal(firstCode?.referee_rebate_rate || "0")
      .mul(100)
      .toDecimalPlaces(0, Decimal.ROUND_DOWN)
      .toString();
    return `${value}%`;
  }, [firstCode?.referee_rebate_rate]);

  return {
    onCopy,
    refLink: referralLink,
    refCode: code,
    share,
    earn,
    brokerName: overwrite?.brokerName ?? overwrite?.shortBrokerName,
  };
};
