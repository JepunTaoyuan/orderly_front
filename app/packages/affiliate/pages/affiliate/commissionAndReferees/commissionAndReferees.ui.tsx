import { FC, ReactNode, useCallback, useMemo, useState } from "react";
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
} from "@orderly.network/ui";
import { AuthGuardDataTable } from "@orderly.network/ui-connector";
import { commifyOptional } from "@orderly.network/utils";
import {
  SubAffiliateItem,
  ReferralDetailItem,
} from "@/services/api-refer-client";
import { EditReferralModal } from "../../../components/editReferralModal";
import { EditSubAgentModal } from "../../../components/editSubAgentModal";
import { useReferralContext } from "../../../provider/context";
import { DateRange } from "../../../utils/types";
import { formatYMDTime } from "../../../utils/utils";
import { CommissionAndRefereesReturns } from "./commissionAndReferees.script";
import { SubAgentList } from "./subAgentList";

// Helper type for referral code info
type ReferralCodeInfo = {
  referrer_rebate_rate: number;
  referee_rebate_rate: number;
};

export const CommissionAndReferees: FC<CommissionAndRefereesReturns> = (
  props,
) => {
  const { t } = useTranslation();
  const { isTopLevelAgent, mutate, referralInfo } = useReferralContext();

  // Sub-Agent 編輯狀態
  const [editingSubAgent, setEditingSubAgent] =
    useState<SubAffiliateItem | null>(null);
  const [subAgentModalOpen, setSubAgentModalOpen] = useState(false);

  // Referral 編輯狀態 (暫時使用模擬數據類型)
  const [editingReferral, setEditingReferral] =
    useState<ReferralDetailItem | null>(null);
  const [referralModalOpen, setReferralModalOpen] = useState(false);

  // 從 referralInfo 中查找指定 referral code 的佣金比率
  const getRatesByCode = useCallback(
    (code: string): ReferralCodeInfo => {
      const defaultRates: ReferralCodeInfo = {
        referrer_rebate_rate: 0,
        referee_rebate_rate: 0,
      };

      if (!referralInfo?.referrer_info?.referral_codes) {
        return defaultRates;
      }

      const found = referralInfo.referrer_info.referral_codes.find(
        (c) => c.code === code,
      );

      if (found) {
        return {
          referrer_rebate_rate: found.referrer_rebate_rate ?? 0,
          referee_rebate_rate: found.referee_rebate_rate ?? 0,
        };
      }

      return defaultRates;
    },
    [referralInfo],
  );

  const handleEditSubAgent = (item: SubAffiliateItem) => {
    setEditingSubAgent(item);
    setSubAgentModalOpen(true);
  };

  const handleEditReferral = (item: RefferalAPI.RefereeInfoItem) => {
    // 從 referralInfo 中查找該 referral code 的實際佣金比率
    const rates = getRatesByCode(item.referral_code);

    // 將 Orderly 格式轉換為自訂 API 格式
    // 注意：user_address 在此系統中即為 user_id（錢包地址）
    const converted: ReferralDetailItem = {
      user_id: item.user_address,
      wallet_address: item.user_address,
      is_affiliate: false,
      referral_code_str: item.referral_code,
      total_commission: item.referral_rebate || 0,
      total_volume: item.volume || 0,
      // 使用從 referral code 查找到的實際比率
      commission_rate_you: rates.referrer_rebate_rate,
      commission_rate_invitee: rates.referee_rebate_rate,
      note: "",
      created_at: item.code_binding_time,
    };
    setEditingReferral(converted);
    setReferralModalOpen(true);
  };

  const handleModalSuccess = () => {
    mutate();
    props.subAgents.refresh();
  };

  const is5XL = useMediaQuery("(min-width:1920px)");
  return (
    <>
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
            <RefereesList
              {...props}
              onEdit={handleEditReferral}
              getRatesByCode={getRatesByCode}
            />
          </TabPanel>
          {isTopLevelAgent && (
            <TabPanel
              value="subAgents"
              title={t("affiliate.subAgents", "Sub-Agents")}
            >
              <SubAgentList {...props.subAgents} onEdit={handleEditSubAgent} />
            </TabPanel>
          )}
        </Tabs>
      </Flex>

      {/* Edit Modals */}
      <EditSubAgentModal
        open={subAgentModalOpen}
        onOpenChange={setSubAgentModalOpen}
        subAgent={editingSubAgent}
        onSuccess={handleModalSuccess}
      />
      <EditReferralModal
        open={referralModalOpen}
        onOpenChange={setReferralModalOpen}
        referral={editingReferral}
        onSuccess={handleModalSuccess}
      />
    </>
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

// 計算當前週的範圍
const getWeekRange = (): { start: string; end: string } => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return {
    start: formatDate(monday),
    end: formatDate(sunday),
  };
};

const CommissionList: FC<CommissionAndRefereesReturns> = (props) => {
  const { t } = useTranslation();
  const { weeklyCommission, totalCommission } = useReferralContext();
  const weekRange = useMemo(() => getWeekRange(), []);

  return (
    <Flex direction={"column"} width={"100%"} gap={4} p={4}>
      {/* 週範圍顯示 */}
      <Flex direction="row" justify="start" itemAlign="center" gap={2}>
        <Text className="oui-text-base-contrast-54 oui-text-sm">
          {t("affiliate.commission.weekRange", "Week")}:
        </Text>
        <Text className="oui-text-base-contrast-80 oui-text-sm oui-font-semibold">
          {weekRange.start} ~ {weekRange.end}
        </Text>
      </Flex>

      {/* Commission Summary 卡片 */}
      <Flex direction="row" gap={6} width="100%" className="oui-flex-wrap">
        {/* 本週佣金 */}
        <Flex
          direction="column"
          gap={2}
          p={4}
          r="md"
          className="oui-bg-base-8 oui-min-w-[200px] oui-flex-1"
        >
          <Text className="oui-text-base-contrast-54 oui-text-xs">
            {t("affiliate.commission.thisWeek", "This Week Commission")}
          </Text>
          <Text className="oui-text-base-contrast-80 oui-text-2xl oui-font-bold">
            {commifyOptional(weeklyCommission, {
              fix: 6,
              fallback: "0",
              padEnd: true,
              prefix: "$",
            })}
          </Text>
          <Text className="oui-text-base-contrast-36 oui-text-xs">USDC</Text>
        </Flex>

        {/* 總佣金 */}
        <Flex
          direction="column"
          gap={2}
          p={4}
          r="md"
          className="oui-bg-base-8 oui-min-w-[200px] oui-flex-1"
        >
          <Text className="oui-text-base-contrast-54 oui-text-xs">
            {t("affiliate.commission.total", "Total Commission")}
          </Text>
          <Text className="oui-text-base-contrast-80 oui-text-2xl oui-font-bold">
            {commifyOptional(totalCommission, {
              fix: 6,
              fallback: "0",
              padEnd: true,
              prefix: "$",
            })}
          </Text>
          <Text className="oui-text-base-contrast-36 oui-text-xs">USDC</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

// 保留原始的 CommissionListLegacy 以備需要
const CommissionListLegacy: FC<CommissionAndRefereesReturns> = (props) => {
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

// Edit 按鈕組件
const EditButton: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="oui-h-[28px] oui-rounded-full oui-bg-[#6e55df] oui-px-4 oui-text-[11px] oui-text-white oui-font-semibold oui-leading-[18px] hover:oui-opacity-80 oui-transition-opacity"
    >
      Edit
    </button>
  );
};

interface RefereesListProps extends CommissionAndRefereesReturns {
  onEdit?: (item: RefferalAPI.RefereeInfoItem) => void;
  getRatesByCode?: (code: string) => ReferralCodeInfo;
}

const RefereesList: FC<RefereesListProps> = (props) => {
  const { t } = useTranslation();

  const isLG = useMediaQuery("(max-width: 767px)");

  const columns = useMemo(() => {
    const cols: Column<RefferalAPI.RefereeInfoItem>[] = [
      {
        title: t("affiliate.referees.column.refereeAddress"),
        dataIndex: "user_address",
        render: (value) => (
          <Text.formatted rule={"address"}>{value}</Text.formatted>
        ),
        className: "oui-w-[14%]",
      },
      {
        title: t("affiliate.referralCode"),
        dataIndex: "referral_code",
        className: "oui-w-[12%]",
      },
      {
        title: `${t("affiliate.referees.column.totalCommission")} (USDC)`,
        dataIndex: "referral_rebate",
        render: (value) => (
          <Text>
            {commifyOptional(value, { fix: 6, prefix: "$", padEnd: true })}
          </Text>
        ),
        className: "oui-w-[14%]",
      },
      {
        title: `${t("affiliate.referees.column.totalVol")} (USDC)`,
        dataIndex: "volume",
        render: (value) => (
          <Text>
            {commifyOptional(value, { fix: 2, prefix: "$", padEnd: true })}
          </Text>
        ),
        className: "oui-w-[14%]",
      },
      {
        title: t(
          "affiliate.referees.column.commissionRate",
          "Commission Rate (You | Invitee)",
        ),
        dataIndex: "referral_code",
        render: (value: string) => {
          const rates = props.getRatesByCode?.(value) ?? {
            referrer_rebate_rate: 0,
            referee_rebate_rate: 0,
          };
          const youRate = ((rates.referrer_rebate_rate ?? 0) * 100).toFixed(1);
          const inviteeRate = ((rates.referee_rebate_rate ?? 0) * 100).toFixed(
            1,
          );
          return (
            <Text className="oui-text-base-contrast-54">
              {youRate}% | {inviteeRate}%
            </Text>
          );
        },
        className: "oui-w-[12%]",
      },
      {
        title: t("affiliate.referees.column.note", "Note"),
        dataIndex: "user_address",
        render: () => (
          <Text className="oui-truncate oui-max-w-[80px] oui-text-base-contrast-54">
            -
          </Text>
        ),
        className: "oui-w-[10%]",
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
        className: "oui-w-[10%]",
      },
      {
        title: t("affiliate.referees.column.operation", "Operation"),
        dataIndex: "user_address",
        render: (_, record) => (
          <EditButton onClick={() => props.onEdit?.(record)} />
        ),
        className: "oui-w-[8%]",
      },
    ];

    return cols;
  }, [t, props.onEdit]);

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
                <Flex
                  direction={"row"}
                  pt={3}
                  gap={3}
                  width={"100%"}
                  itemAlign="center"
                >
                  <MobileCellItem
                    title={t(
                      "affiliate.referees.column.commissionRate",
                      "Commission Rate",
                    )}
                    value={(() => {
                      const rates = props.getRatesByCode?.(e.referral_code) ?? {
                        referrer_rebate_rate: 0,
                        referee_rebate_rate: 0,
                      };
                      const youRate = (
                        (rates.referrer_rebate_rate ?? 0) * 100
                      ).toFixed(1);
                      const inviteeRate = (
                        (rates.referee_rebate_rate ?? 0) * 100
                      ).toFixed(1);
                      return `${youRate}% | ${inviteeRate}%`;
                    })()}
                  />
                  <EditButton onClick={() => props.onEdit?.(e)} />
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
  }, [isLG, props.referees]);

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
