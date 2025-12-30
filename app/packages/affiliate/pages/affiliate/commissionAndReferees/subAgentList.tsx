import { FC, useMemo } from "react";
import { useMediaQuery } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import {
  Flex,
  ListView,
  Statistic,
  Column,
  Text,
  cn,
} from "@orderly.network/ui";
import { AuthGuardDataTable } from "@orderly.network/ui-connector";
import { commifyOptional } from "@orderly.network/utils";
import { SubAffiliateItem } from "@/services/api-refer-client";
import { SubAgentReturns } from "./commissionAndReferees.script";

type SubAgentListProps = SubAgentReturns;

const MobileCellItem: FC<{
  title: string;
  value: string | React.ReactNode;
  align?: "start" | "end" | undefined;
  className?: string;
  rule?: "address" | "date";
  formatString?: string;
  prefix?: string;
}> = (props) => {
  const { title, value, align, className, rule, formatString, prefix } = props;
  return (
    <Statistic
      className={cn("oui-flex-1", className)}
      label={
        <Text className="oui-text-base-contrast-36 oui-text-2xs">{title}</Text>
      }
      align={align}
      children={
        <Text.formatted
          rule={rule || ""}
          // @ts-ignore
          formatString={formatString}
          prefix={prefix}
          className="oui-text-base-contrast-80 oui-text-sm oui-mt-[6px]"
        >
          {value}
        </Text.formatted>
      }
    />
  );
};

export const SubAgentList: FC<SubAgentListProps> = (props) => {
  const { t } = useTranslation();
  const isLG = useMediaQuery("(max-width: 767px)");

  const columns = useMemo(() => {
    const cols: Column<SubAffiliateItem>[] = [
      {
        title: t("affiliate.subAgent.address", "Sub-agent address"),
        dataIndex: "wallet_address",
        render: (value) => (
          <Text.formatted rule={"address"}>{value}</Text.formatted>
        ),
        className: "oui-w-[15%]",
      },
      {
        title: t("affiliate.subAgent.invitedUsers", "Invited users (total)"),
        dataIndex: "invited_users",
        render: (value) => <Text>{value || 0}</Text>,
        className: "oui-w-[12%]",
      },
      {
        title: `${t("affiliate.subAgent.totalCommission", "Total commission")} (USDC)`,
        dataIndex: "total_commission",
        render: (value) => (
          <Text>
            {commifyOptional(value, { fix: 6, prefix: "$", padEnd: true })}
          </Text>
        ),
        className: "oui-w-[15%]",
      },
      {
        title: `${t("affiliate.subAgent.totalVol", "Total vol.")} (USDC)`,
        dataIndex: "total_volume",
        render: (value) => (
          <Text>
            {commifyOptional(value, { fix: 2, prefix: "$", padEnd: true })}
          </Text>
        ),
        className: "oui-w-[15%]",
      },
      {
        title: t(
          "affiliate.subAgent.commissionRate",
          "Commission (You | Sub-Agent)",
        ),
        dataIndex: "commission_rate_you",
        render: (_, record) => (
          <Text>
            {(record.commission_rate_you * 100).toFixed(1)}% |{" "}
            {(record.commission_rate_sub * 100).toFixed(1)}%
          </Text>
        ),
        className: "oui-w-[15%]",
      },
      {
        title: t("affiliate.subAgent.note", "Note"),
        dataIndex: "note",
        render: (value) => (
          <Text className="oui-truncate oui-max-w-[100px]">{value || "-"}</Text>
        ),
        className: "oui-w-[13%]",
      },
    ];

    return cols;
  }, [t]);

  const body = useMemo(() => {
    if (isLG) {
      return (
        <ListView<SubAffiliateItem, SubAffiliateItem[]>
          className="oui-w-full oui-max-h-[300px]"
          dataSource={props.data}
          isLoading={props.isLoading}
          renderItem={(e, index) => {
            return (
              <Flex
                key={index}
                direction={"column"}
                gap={3}
                className="oui-border-b-2 oui-border-line-6 oui-pb-3"
              >
                <Flex direction={"row"} width={"100%"} gap={2}>
                  <MobileCellItem
                    title={t("affiliate.subAgent.address", "Sub-agent address")}
                    value={e.wallet_address}
                    rule="address"
                  />
                  <MobileCellItem
                    title={t(
                      "affiliate.subAgent.invitedUsers",
                      "Invited users",
                    )}
                    value={String(e.invited_users || 0)}
                    align="end"
                  />
                </Flex>
                <Flex direction={"row"} width={"100%"} gap={2}>
                  <MobileCellItem
                    title={`${t("affiliate.subAgent.totalCommission", "Total commission")} (USDC)`}
                    value={commifyOptional(e.total_commission, {
                      fix: 6,
                      prefix: "$",
                      padEnd: true,
                    })}
                  />
                  <MobileCellItem
                    title={`${t("affiliate.subAgent.totalVol", "Total vol.")} (USDC)`}
                    value={commifyOptional(e.total_volume, {
                      fix: 2,
                      prefix: "$",
                      padEnd: true,
                    })}
                    align="end"
                  />
                </Flex>
                <Flex direction={"row"} width={"100%"} gap={2}>
                  <MobileCellItem
                    title={t(
                      "affiliate.subAgent.commissionRate",
                      "Commission (You | Sub-Agent)",
                    )}
                    value={`${(e.commission_rate_you * 100).toFixed(1)}% | ${(e.commission_rate_sub * 100).toFixed(1)}%`}
                  />
                </Flex>
                {e.note && (
                  <MobileCellItem
                    title={t("affiliate.subAgent.note", "Note")}
                    value={e.note}
                  />
                )}
              </Flex>
            );
          }}
        />
      );
    }

    return (
      <AuthGuardDataTable
        bordered
        loading={props.isLoading}
        ignoreLoadingCheck={true}
        columns={columns}
        dataSource={props.data}
        pagination={props.pagination}
        onRow={(record) => {
          return {
            className: "oui-h-[41px]",
          };
        }}
      />
    );
  }, [isLG, props.data, props.isLoading, props.pagination, columns, t]);

  return (
    <Flex
      direction={"column"}
      width={"100%"}
      justify={"start"}
      itemAlign={"start"}
    >
      {body}
    </Flex>
  );
};
