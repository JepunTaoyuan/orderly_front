import { useMemo, useState } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { useReferralContext } from "../../../provider";
import { SummaryFilter } from "../../../utils/types";

export type SummaryReturns = {
  period: string;
  periodTypes: { label: string; value: string }[];
  onPeriodChange: (item: string) => void;
  commission: number;
  referralVol: number;
  referees: number;
  refereesTades: number;
};

export const useSummaryScript = (): SummaryReturns => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<SummaryFilter>("All");

  const periodTypes: { label: string; value: SummaryFilter }[] = [
    { label: t("common.all"), value: "All" },
    { label: t("common.select.1d"), value: "1D" },
    { label: t("common.select.7d"), value: "7D" },
    { label: t("common.select.30d"), value: "30D" },
  ];

  const { affiliateSummary, referralInfo } = useReferralContext();

  const commission = useMemo(() => {
    // 優先使用 orderly_refer API
    if (affiliateSummary) {
      switch (period) {
        case "All":
          return affiliateSummary.total_referrer_rebate;
        case "1D":
          return affiliateSummary.day_1_referrer_rebate;
        case "7D":
          return affiliateSummary.day_7_referrer_rebate;
        case "30D":
          return affiliateSummary.day_30_referrer_rebate;
        default:
          return affiliateSummary.total_referrer_rebate;
      }
    }
    // 回退到 Orderly API
    if (!referralInfo || !referralInfo.referrer_info) {
      return 0;
    }
    switch (period) {
      case "All":
        return referralInfo.referrer_info.total_referrer_rebate;
      case "1D":
        return referralInfo.referrer_info["1d_referrer_rebate"];
      case "7D":
        return referralInfo.referrer_info["7d_referrer_rebate"];
      case "30D":
        return referralInfo.referrer_info["30d_referrer_rebate"];
      default:
        return referralInfo.referrer_info.total_referrer_rebate;
    }
  }, [affiliateSummary, referralInfo, period]);

  const referralVol = useMemo(() => {
    // 優先使用 orderly_refer API
    if (affiliateSummary) {
      switch (period) {
        case "All":
          return affiliateSummary.total_referee_volume;
        case "1D":
          return affiliateSummary.day_1_referee_volume;
        case "7D":
          return affiliateSummary.day_7_referee_volume;
        case "30D":
          return affiliateSummary.day_30_referee_volume;
        default:
          return affiliateSummary.total_referee_volume;
      }
    }
    // 回退到 Orderly API
    if (!referralInfo || !referralInfo.referrer_info) {
      return 0;
    }
    switch (period) {
      case "All":
        return referralInfo.referrer_info.total_referee_volume;
      case "1D":
        return referralInfo.referrer_info["1d_referee_volume"];
      case "7D":
        return referralInfo.referrer_info["7d_referee_volume"];
      case "30D":
        return referralInfo.referrer_info["30d_referee_volume"];
      default:
        return referralInfo.referrer_info.total_referee_volume;
    }
  }, [affiliateSummary, referralInfo, period]);

  const referees = useMemo(() => {
    // 優先使用 orderly_refer API
    if (affiliateSummary) {
      switch (period) {
        case "All":
          return affiliateSummary.total_invites;
        case "1D":
          return affiliateSummary.day_1_invites;
        case "7D":
          return affiliateSummary.day_7_invites;
        case "30D":
          return affiliateSummary.day_30_invites;
        default:
          return affiliateSummary.total_invites;
      }
    }
    // 回退到 Orderly API
    if (!referralInfo || !referralInfo.referrer_info) {
      return 0;
    }
    switch (period) {
      case "All":
        return referralInfo.referrer_info.total_invites;
      case "1D":
        return referralInfo.referrer_info["1d_invites"];
      case "7D":
        return referralInfo.referrer_info["7d_invites"];
      case "30D":
        return referralInfo.referrer_info["30d_invites"];
      default:
        return referralInfo.referrer_info.total_invites;
    }
  }, [affiliateSummary, referralInfo, period]);

  const refereesTades = useMemo(() => {
    // 優先使用 orderly_refer API
    if (affiliateSummary) {
      switch (period) {
        case "All":
          return affiliateSummary.total_traded;
        case "1D":
          return affiliateSummary.day_1_traded;
        case "7D":
          return affiliateSummary.day_7_traded;
        case "30D":
          return affiliateSummary.day_30_traded;
        default:
          return affiliateSummary.total_traded;
      }
    }
    // 回退到 Orderly API
    if (!referralInfo || !referralInfo.referrer_info) {
      return 0;
    }
    switch (period) {
      case "All":
        return referralInfo.referrer_info.total_traded;
      case "1D":
        return referralInfo.referrer_info["1d_traded"];
      case "7D":
        return referralInfo.referrer_info["7d_traded"];
      case "30D":
        return referralInfo.referrer_info["30d_traded"];
      default:
        return referralInfo.referrer_info.total_traded;
    }
  }, [affiliateSummary, referralInfo, period]);

  const onPeriodChange = (item: string) => {
    setPeriod(item as SummaryFilter);
  };

  return {
    period,
    periodTypes,
    onPeriodChange,
    commission,
    referralVol,
    referees,
    refereesTades,
  };
};
