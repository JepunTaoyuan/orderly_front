import { useMemo } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { Text, Column, Box, useScreen, toast } from "@orderly.network/ui";
import { getCurrentAddressRowKey } from "./util";

export type RankingColumnFields =
  | "rank"
  | "address"
  | "volume"
  | "pnl"
  | "rewards"
  | "totalPoints";

export const useRankingColumns = (
  fields?: RankingColumnFields[],
  address?: string,
  enableSort?: boolean,
  brokerId?: string,
) => {
  const { t } = useTranslation();
  const { isMobile } = useScreen();

  return useMemo(() => {
    const columns = [
      {
        title: t("tradingLeaderboard.rank"),
        dataIndex: "rank",
        width: 50,
        render: (value: number, record: any) => {
          return (
            <Box width={20} pl={2} className="oui-text-center">
              {value}
            </Box>
          );
        },
      },
      {
        title: t("common.address"),
        dataIndex: "address",
        render: (value: string, record: any) => {
          const isYou = record.key === getCurrentAddressRowKey(address!);
          if (isMobile && isYou) {
            return <Text>You</Text>;
          }

          return (
            <a
              className="oui-flex oui-items-start oui-gap-1"
              href={`https://orderly-dashboard.orderly.network/address/${value}?broker_id=${brokerId}`}
              target="_blank"
              rel="noreferrer"
            >
              <Text.formatted
                rule="address"
                key={record.rank}
                copyable
                onCopy={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigator.clipboard.writeText(value);
                  toast.success(t("common.copy.copied"));
                }}
                className="oui-cursor-pointer oui-underline oui-decoration-line-16 oui-decoration-dashed oui-underline-offset-4"
              >
                {value}
              </Text.formatted>
              {isYou && <Text> (You)</Text>}
            </a>
          );
        },
        width: 90,
      },
      {
        title: t("tradingLeaderboard.tradingVolume"),
        dataIndex: "volume",
        onSort: enableSort,
        align: isMobile ? "right" : "left",
        render: (value: string) => {
          if (!value) {
            return "-";
          }
          return (
            <Text.numeral prefix="$" rule="price" dp={2}>
              {value}
            </Text.numeral>
          );
        },
        width: 105,
      },
      {
        title: t("common.pnl"),
        dataIndex: "pnl",
        onSort: enableSort,
        align: isMobile ? "right" : "left",
        render: (value: string) => {
          if (!value) {
            return "-";
          }
          return (
            <Text.pnl prefix="$" rule="price" dp={2} coloring>
              {value}
            </Text.pnl>
          );
        },
        width: 90,
      },
      {
        title: t("tradingLeaderboard.estimatedRewards"),
        dataIndex: "rewards",
        align: isMobile ? "right" : "left",
        render: (value: { amount: number; currency: string }) => {
          if (!value) {
            return "-";
          }
          return (
            <Text.numeral
              suffix={` ${value?.currency || ""}`}
              rule="price"
              dp={0}
            >
              {value?.amount}
            </Text.numeral>
          );
        },
        width: 90,
      },
      {
        title: t("common.points", "Total Points"),
        dataIndex: "totalPoints",
        onSort: enableSort,
        align: isMobile ? "right" : "left",
        render: (value: number) => {
          if (value === undefined || value === null) {
            return "-";
          }
          return (
            <Text className="oui-font-semibold">
              {value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </Text>
          );
        },
        width: 100,
      },
    ] as Column[];

    return columns.filter((column) =>
      fields?.includes(column.dataIndex as RankingColumnFields),
    );
  }, [t, isMobile, address, fields, enableSort, brokerId]);
};
