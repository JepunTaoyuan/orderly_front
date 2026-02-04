import { FC, useCallback } from "react";
import { useConfig } from "@orderly.network/hooks";
import {
  cn,
  DataTable,
  Flex,
  Spinner,
  TanstackColumn,
  useScreen,
} from "@orderly.network/ui";
import { type CampaignRankingData } from "../campaignRanking/campaignRanking.script";
import {
  type GeneralRankingData,
  GeneralRankingScriptReturn,
} from "../generalRanking/generalRanking.script";
import { type RankingColumnFields, useRankingColumns } from "./column";
import { getCurrentAddressRowKey } from "./util";

type RankingData = GeneralRankingData | CampaignRankingData;

export type RankingProps = {
  style?: React.CSSProperties;
  className?: string;
  fields: RankingColumnFields[];
} & Omit<GeneralRankingScriptReturn, "dataList" | "dataSource"> & {
    dataList: RankingData[];
    dataSource: RankingData[];
  };

export const Ranking: FC<RankingProps> = (props) => {
  const brokerId = useConfig("brokerId");
  const column = useRankingColumns(
    props.fields,
    props.address,
    typeof props.onSort === "function",
    brokerId,
  );
  const { isMobile } = useScreen();

  const onRow = useCallback(
    (record: RankingData, index: number) => {
      const isYou = record.key === getCurrentAddressRowKey(props.address!);

      return {
        className: cn(
          "oui-h-[40px] md:oui-h-[48px]",
          // use oui-relative to let the background image position based on row
          "oui-relative",
          isYou ? "oui-bg-[rgba(39,44,32,1)]" : "oui-bg-[rgba(19,21,25,1)]",
          isYou &&
            // add 4px extra height to make row has 2px space
            "oui-h-[44px] md:oui-h-[52px]",
        ),
      };
    },
    [props.address],
  );

  const onCell = useCallback(
    (
      column: TanstackColumn<RankingData>,
      record: RankingData,
      index: number,
    ) => {
      const isFirstColumn = column.getIsFirstColumn();
      const isLastColumn = column.getIsLastColumn();
      if (record.key === getCurrentAddressRowKey(props.address!)) {
        return {
          className: cn(
            "after:oui-absolute after:oui-h-[40px] after:oui-w-full md:after:oui-h-[48px]",
            "after:oui-border-[rgba(219,253,92,1)]",
            "after:oui-left-0 after:oui-top-[2px] after:oui-z-[-1]",
            "after:oui-border-y",
            "after:oui-bg-[rgba(39,44,32,1)]",
            isFirstColumn && "after:oui-rounded-l-lg after:oui-border-l",
            isLastColumn && "after:oui-rounded-r-lg after:oui-border-r",
          ),
        };
      }
      return {};
    },
    [props.address],
  );

  if (isMobile) {
    return (
      <>
        <DataTable
          classNames={{
            root: "oui-trading-leaderboard-ranking-table",
            body: "oui-text-2xs",
            scroll: "oui-overflow-y-hidden oui-h-full",
          }}
          loading={props.isLoading}
          columns={column}
          bordered
          initialSort={props.initialSort}
          onSort={props.onSort}
          dataSource={props.dataList}
          generatedRowKey={(record: RankingData) =>
            record.key || record.address
          }
          manualPagination
          manualSorting
          onRow={onRow}
          onCell={onCell}
        />
        <div
          ref={props.sentinelRef}
          className="oui-invisible oui-relative oui-top-[-300px] oui-h-px"
        />
        {props.isLoading && props.dataList.length > 0 && (
          <Flex itemAlign="center" justify="center" width="100%" height={40}>
            <Spinner size="sm" />
          </Flex>
        )}
      </>
    );
  }

  return (
    <DataTable
      loading={props.isLoading}
      columns={column}
      initialSort={props.initialSort}
      onSort={props.onSort}
      bordered
      dataSource={props.dataSource}
      generatedRowKey={(record: RankingData) => record.key || record.address}
      manualPagination
      manualSorting
      pagination={props.pagination}
      classNames={{
        root: cn(
          "oui-trading-leaderboard-ranking-table",
          "!oui-h-[calc(100%_-_53px_-_8px)]",
        ),
        scroll: "oui-min-h-[600px] oui-max-h-[1250px]",
      }}
      onRow={onRow}
      onCell={onCell}
    />
  );
};
