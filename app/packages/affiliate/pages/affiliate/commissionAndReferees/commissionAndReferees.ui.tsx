import { FC, ReactNode, useMemo, useState, useCallback } from "react";
import { RefferalAPI, useMediaQuery } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import {
  DatePicker,
  Divider,
  Flex,
  ListView,
  Statistic,
  TabPanel,
  Column,
  Tabs,
  Text,
  cn,
  Button,
} from "@orderly.network/ui";
import { AuthGuardDataTable } from "@orderly.network/ui-connector";
import { commifyOptional } from "@orderly.network/utils";
import { ReferralDetailItem } from "@/services/api-refer-client";
import { EditReferralModal } from "../../../components/editReferralModal";
import { DateRange } from "../../../utils/types";
import { formatYMDTime } from "../../../utils/utils";
import { CommissionAndRefereesReturns } from "./commissionAndReferees.script";
import { SubAgentList } from "./subAgentList";

export const CommissionAndReferees: FC<CommissionAndRefereesReturns> = (
  props,
) => {
  const { t } = useTranslation();

  const is5XL = useMediaQuery("(min-width:1920px)");
  return (
    <Flex
      id="oui-affiliate-affiliate-commissionAndReferees"
      r={"md"}
      p={is5XL ? 6 : 3}
      width={"100%"}
      gap={4}
      direction={"column"}
      className="oui-bg-base-9 oui-tabular-nums"
    >
      <Tabs
        defaultValue="account"
        className="oui-w-full"
        variant="text"
        size="sm"
      >
        <TabPanel value="account" title={t("affiliate.commission")}>
          <CommissionList {...props} />
        </TabPanel>
        <TabPanel value="password" title={t("affiliate.myReferees")}>
          <RefereesList {...props} />
        </TabPanel>
        {/* Sub-Agents Tab - 只在 isTopLevelAgent 時顯示 */}
        {props.isTopLevelAgent && (
          <TabPanel
            value="sub-agents"
            title={t("affiliate.subAgent.title", "My Sub-Agents")}
          >
            <SubAgentList
              data={props.subAgents.data}
              isLoading={props.subAgents.isLoading}
              pagination={props.subAgents.pagination}
              refresh={props.subAgents.refresh}
            />
          </TabPanel>
        )}
      </Tabs>
    </Flex>
  );
};

const MobileCellItem: FC<{
  title: string;
  value: string | ReactNode;
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

const CommissionList: FC<CommissionAndRefereesReturns> = (props) => {
  const { t } = useTranslation();
  const isLG = useMediaQuery("(max-width: 767px)");

  const columns = useMemo(() => {
    const cols: Column[] = [
      {
        title: `${t("affiliate.commission")} (USDC)`,
        dataIndex: "referral_rebate",
        render: (value) => (
          <Text>
            {commifyOptional(value, {
              fix: 6,
              fallback: "0",
              padEnd: true,
              prefix: "$",
            })}
          </Text>
        ),
        width: 216,
      },
      {
        title: `${t("affiliate.referralVol")} (USDC)`,
        dataIndex: "volume",
        render: (value) => (
          <Text>
            {commifyOptional(value, {
              fix: 2,
              fallback: "0",
              padEnd: true,
              prefix: "$",
            })}
          </Text>
        ),
        width: 216,
      },
      {
        title: t("affiliate.commission.column.activeUsers"),
        dataIndex: "daily_traded_referral",
        render: (value) => <Text>{value}</Text>,
        width: 216,
      },
      {
        title: t("common.date"),
        dataIndex: "date",
        render: (value) => formatYMDTime(value),
        width: 216,
      },
    ];

    return cols;
  }, [t]);

  const body = useMemo(() => {
    if (isLG) {
      return (
        <ListView<
          RefferalAPI.ReferralRebateSummary,
          RefferalAPI.ReferralRebateSummary[]
        >
          className="oui-max-h-[200px] oui-w-full"
          dataSource={props.commission.data}
          loadMore={props.commission.loadMore}
          isLoading={props.commission.isLoading}
          renderItem={(e) => {
            return (
              <div>
                <Flex direction={"row"} width={"100%"}>
                  <MobileCellItem
                    title={t("affiliate.commission")}
                    value={commifyOptional(e.referral_rebate, {
                      fix: 6,
                      fallback: "0",
                      padEnd: true,
                    })}
                    prefix="$"
                  />
                  <MobileCellItem
                    title={t("affiliate.referralVol")}
                    value={commifyOptional(e.volume, {
                      fix: 2,
                      fallback: "0",
                      padEnd: true,
                    })}
                    prefix="$"
                  />
                  <MobileCellItem
                    title={t("affiliate.commission.column.activeUsers")}
                    value={e.daily_traded_referral}
                  />
                  <MobileCellItem
                    title={t("common.date")}
                    value={e.date}
                    rule="date"
                    formatString="yyyy-MM-dd"
                    align="end"
                  />
                </Flex>
                <Divider className="oui-mt-3 oui-w-full" />
              </div>
            );
          }}
        />
      );
    }

    return (
      <AuthGuardDataTable
        bordered
        columns={columns}
        loading={props.commission.isLoading}
        ignoreLoadingCheck={true}
        dataSource={props.commission.data}
        pagination={props.commission.pagination}
        onRow={(record) => {
          return {
            className: "oui-h-[41px]",
          };
        }}
      />
    );
  }, [isLG, props.commission]);

  return (
    <Flex
      direction={"column"}
      width={"100%"}
      justify={"start"}
      itemAlign={"start"}
    >
      <DateFiler
        value={props.commission.dateRange}
        setValue={props.commission.setDateRange}
      />
      {body}
    </Flex>
  );
};

const RefereesList: FC<CommissionAndRefereesReturns> = (props) => {
  const { t } = useTranslation();

  const isLG = useMediaQuery("(max-width: 767px)");

  // Edit Modal state
  const [editingReferral, setEditingReferral] =
    useState<ReferralDetailItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = useCallback(
    (index: number) => {
      const rawItem = props.referees.rawData?.[index];
      if (rawItem) {
        setEditingReferral(rawItem);
        setIsEditModalOpen(true);
      }
    },
    [props.referees.rawData],
  );

  const columns = useMemo(() => {
    const cols: Column[] = [
      {
        title: t("affiliate.referees.column.refereeAddress"),
        dataIndex: "user_address",
        render: (value) => (
          <Text.formatted rule={"address"}>{value}</Text.formatted>
        ),
        className: "oui-w-[18%]",
      },
      {
        title: t("affiliate.referralCode"),
        dataIndex: "referral_code",
        // render: (value) => value,
        className: "oui-w-[15%]",
      },
      {
        title: `${t("affiliate.referees.column.totalCommission")} (USDC)`,
        dataIndex: "referral_rebate",
        render: (value) => (
          <Text>
            {commifyOptional(value, { fix: 6, prefix: "$", padEnd: true })}
          </Text>
        ),
        className: "oui-w-[18%]",
      },
      {
        title: `${t("affiliate.referees.column.totalVol")} (USDC)`,
        dataIndex: "volume",
        render: (value) => (
          <Text>
            {commifyOptional(value, { fix: 2, prefix: "$", padEnd: true })}
          </Text>
        ),
        className: "oui-w-[18%]",
      },
      {
        title: t("affiliate.referees.column.invitationTime"),
        dataIndex: "code_binding_time",
        render: (value) => (
          <Text.formatted
            rule={"date"}
            formatString="yyyy-MM-dd"
            children={value}
          />
        ),
        className: "oui-w-[15%]",
      },
      {
        title: t("common.operation", "Operation"),
        dataIndex: "operation",
        render: (_, _record, index) => (
          <Button
            variant="text"
            size="sm"
            onClick={() => handleEditClick(index)}
            className="oui-text-primary"
          >
            {t("common.edit", "Edit")}
          </Button>
        ),
        className: "oui-w-[10%]",
      },
    ];

    return cols;
  }, [t, props.referees.rawData]);

  const body = useMemo(() => {
    if (isLG) {
      return (
        <ListView<RefferalAPI.RefereeInfoItem, RefferalAPI.RefereeInfoItem[]>
          className="oui-w-full oui-max-h-[200px]"
          dataSource={props.referees.data}
          loadMore={props.referees.loadMore}
          isLoading={props.referees.isLoading}
          renderItem={(e, index) => {
            return (
              <Flex
                key={index}
                direction={"column"}
                gap={3}
                className="oui-border-b-2 oui-border-line-6 oui-pb-3"
              >
                <Flex direction={"row"} width={"100%"}>
                  <MobileCellItem
                    title={t("affiliate.referralCode")}
                    value={e.referral_code}
                  />
                  <MobileCellItem
                    title={`${t(
                      "affiliate.referees.column.totalCommission",
                    )} (USDC)`}
                    value={commifyOptional(e.referral_rebate, {
                      fix: 6,
                      prefix: "$",
                      padEnd: true,
                    })}
                    className="oui-min-w-[102px]"
                  />
                  <MobileCellItem
                    title={t("affiliate.referees.column.totalVol")}
                    value={commifyOptional(e.volume, {
                      fix: 2,
                      prefix: "$",
                      padEnd: true,
                    })}
                    align="end"
                  />
                </Flex>
                <Flex direction={"row"} pt={3} gap={3} width={"100%"}>
                  <MobileCellItem
                    title={t("affiliate.referees.column.refereeAddress")}
                    value={e.user_address}
                    rule="address"
                  />
                  <MobileCellItem
                    title={t("affiliate.referees.column.invitationTime")}
                    value={e.code_binding_time}
                    align="end"
                    rule="date"
                    formatString="yyyy-MM-dd"
                  />
                </Flex>
                {/* Edit button */}
                <Flex justify="end" width={"100%"} pt={2}>
                  <Button
                    variant="text"
                    size="sm"
                    onClick={() => handleEditClick(index)}
                    className="oui-text-primary"
                  >
                    {t("common.edit", "Edit")}
                  </Button>
                </Flex>
              </Flex>
            );
          }}
        />
      );
    }

    return (
      <AuthGuardDataTable
        bordered
        loading={props.referees.isLoading}
        ignoreLoadingCheck={true}
        columns={columns}
        dataSource={props.referees.data}
        pagination={props.referees.pagination}
        onRow={(record) => {
          return {
            className: "oui-h-[41px]",
          };
        }}
      />
    );
  }, [isLG, props.referees, columns, handleEditClick, t]);

  return (
    <Flex
      direction={"column"}
      width={"100%"}
      justify={"start"}
      itemAlign={"start"}
    >
      {/* <DateFiler
        value={props.referees.dateRange}
        setValue={props.referees.setDateRange}
      /> */}
      {body}

      {/* Edit Referral Modal */}
      <EditReferralModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        referral={editingReferral}
        onSuccess={() => props.referees.refresh?.()}
      />
    </Flex>
  );
};

const DateFiler: FC<{
  value?: DateRange;
  setValue: any;
}> = (props) => {
  return (
    <Flex width={"100%"} height={49} className="oui-border-b oui-border-line-6">
      <div>
        <DatePicker.range
          size="xs"
          value={props.value}
          onChange={(range) => {
            props.setValue(range);
          }}
          max={90}
          disabled={{
            after: new Date(),
          }}
        />
      </div>
    </Flex>
  );
};
