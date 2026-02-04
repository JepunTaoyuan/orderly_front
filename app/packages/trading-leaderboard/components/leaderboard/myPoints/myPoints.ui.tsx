import { FC } from "react";
import { useTranslation } from "@orderly.network/i18n";
import {
  cn,
  DataTable,
  Column,
  Flex,
  Text,
  Box,
  useScreen,
} from "@orderly.network/ui";
import { UseMyPointsScriptReturn, MyPointsData } from "./myPoints.script";

export type MyPointsUIProps = {
  style?: React.CSSProperties;
  className?: string;
} & UseMyPointsScriptReturn;

export const MyPointsUI: FC<MyPointsUIProps> = (props) => {
  const { t } = useTranslation();
  const { isMobile } = useScreen();

  const columns: Column<MyPointsData>[] = [
    {
      title: t("common.time", "Time"),
      dataIndex: "time",
      width: isMobile ? 100 : 160,
      render: (_: string, record: MyPointsData) => (
        <Text.formatted
          rule="date"
          formatString="MMM DD, YYYY"
          className="oui-text-base-contrast-80 oui-font-mono oui-text-sm"
        >
          {record.weekStart}
        </Text.formatted>
      ),
    },
    {
      title: t("tradingLeaderboard.tradingVolume", "Trading Volume"),
      dataIndex: "volume",
      align: "right" as const,
      onSort: true,
      render: (value: number) => (
        <Text.numeral prefix="$" rule="price" dp={2}>
          {value}
        </Text.numeral>
      ),
    },
    {
      title: t("common.pnl", "PnL"),
      dataIndex: "pnl",
      align: "right" as const,
      onSort: true,
      render: (value: number) => (
        <Text.numeral prefix="$" rule="price" dp={2} coloring>
          {value}
        </Text.numeral>
      ),
    },
    {
      title: t("common.points", "Points"),
      dataIndex: "points",
      align: "right" as const,
      onSort: true,
      width: isMobile ? 80 : 100,
      render: (value: number) => (
        <Text className="oui-font-semibold">
          {value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </Text>
      ),
    },
  ];

  const dataSource = props.isConnected ? props.data : [];

  return (
    <Box
      className={cn("oui-trading-leaderboard-my-points", props.className)}
      style={props.style}
    >
      <div className="oui-relative oui-h-full">
        <DataTable
          loading={props.isLoading}
          columns={columns}
          bordered
          dataSource={dataSource}
          generatedRowKey={(record: MyPointsData) => String(record.weekStart)}
          classNames={{
            root: cn(
              "oui-trading-leaderboard-my-points-table",
              !isMobile && "!oui-h-[calc(100%_-_53px_-_8px)]",
            ),
            scroll: isMobile
              ? "oui-overflow-y-hidden oui-h-full"
              : "oui-min-h-[300px] oui-max-h-[1250px]",
            body: isMobile ? "oui-text-2xs" : undefined,
          }}
          manualPagination
          pagination={props.pagination}
        />
        {!props.isConnected && (
          <Flex
            className="oui-absolute oui-inset-0 oui-z-10 oui-bg-base-9/50 oui-backdrop-blur-[2px]"
            justify="center"
            itemAlign="center"
            direction="column"
            gap={4}
          >
            <Text className="oui-text-base-contrast-54 oui-text-lg">
              {t(
                "tradingLeaderboard.connectWalletToViewPoints",
                "Please connect your wallet to view your points",
              )}
            </Text>
          </Flex>
        )}
      </div>
    </Box>
  );
};
