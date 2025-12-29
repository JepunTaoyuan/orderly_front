import { FC, useState, useEffect, useCallback } from "react";
import { useTranslation } from "@orderly.network/i18n";
import {
  Dialog,
  DialogContent,
  Button,
  Flex,
  Text,
  Input,
  cn,
  Tabs,
  TabPanel,
} from "@orderly.network/ui";
import { ReferralDetailItem } from "@/services/api-refer-client";
import { userApi } from "@/services/user.client";
import { useReferralContext } from "../provider/context";

interface EditReferralModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  referral: ReferralDetailItem | null;
  onSuccess?: () => void;
  maxCommissionRate?: number; // 當前用戶的 max_referral_rate (頂級 50%, sub-agent 為其上層設定)
}

export const EditReferralModal: FC<EditReferralModalProps> = ({
  open,
  onOpenChange,
  referral,
  onSuccess,
  maxCommissionRate,
}) => {
  const { t } = useTranslation();
  const { userId, isTopLevelAgent, userInfo } = useReferralContext();

  // 使用 userInfo 的 max_referral_rate 或 props 傳入的值，頂級代理預設 50%
  const totalRate = maxCommissionRate ?? userInfo?.max_referral_rate ?? 0.5;
  const totalRatePercent = totalRate * 100;

  // Tab state
  const [activeTab, setActiveTab] = useState<string>("edit");

  // Edit Invitee state
  const [editRateYou, setEditRateYou] = useState<string>("");
  const [editRateInvitee, setEditRateInvitee] = useState<string>("");
  const [editNote, setEditNote] = useState<string>("");

  // Upgrade Sub-Agent state
  const [upgradeRateYou, setUpgradeRateYou] = useState<string>("");
  const [upgradeRateSubAgent, setUpgradeRateSubAgent] = useState<string>("");
  const [upgradeNote, setUpgradeNote] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 當 referral 變化時重置表單
  useEffect(() => {
    if (referral) {
      // Edit Invitee 初始值
      setEditRateYou(String((referral.commission_rate_you * 100).toFixed(1)));
      setEditRateInvitee(
        String((referral.commission_rate_invitee * 100).toFixed(1)),
      );
      setEditNote(referral.note || "");

      // Upgrade Sub-Agent 初始值 - 預設分配
      const currentInviteeRate = referral.commission_rate_invitee * 100;
      setUpgradeRateYou(
        String((totalRatePercent - currentInviteeRate).toFixed(1)),
      );
      setUpgradeRateSubAgent(String(currentInviteeRate.toFixed(1)));
      setUpgradeNote(referral.note || "");

      setError(null);
      setActiveTab("edit");
    }
  }, [referral, totalRatePercent]);

  // 處理 Edit Invitee 的 rate 變更
  const handleEditRateYouChange = useCallback(
    (value: string) => {
      const numValue = parseFloat(value) || 0;
      const maxForYou = totalRatePercent;
      const clampedValue = Math.min(Math.max(0, numValue), maxForYou);
      setEditRateYou(String(clampedValue));

      // 自動調整 invitee rate 以確保總和不超過 total
      const currentInvitee = parseFloat(editRateInvitee) || 0;
      if (clampedValue + currentInvitee > totalRatePercent) {
        setEditRateInvitee(
          String((totalRatePercent - clampedValue).toFixed(1)),
        );
      }
    },
    [totalRatePercent, editRateInvitee],
  );

  const handleEditRateInviteeChange = useCallback(
    (value: string) => {
      const numValue = parseFloat(value) || 0;
      const maxForInvitee = totalRatePercent;
      const clampedValue = Math.min(Math.max(0, numValue), maxForInvitee);
      setEditRateInvitee(String(clampedValue));

      // 自動調整 you rate 以確保總和不超過 total
      const currentYou = parseFloat(editRateYou) || 0;
      if (currentYou + clampedValue > totalRatePercent) {
        setEditRateYou(String((totalRatePercent - clampedValue).toFixed(1)));
      }
    },
    [totalRatePercent, editRateYou],
  );

  // 處理 Upgrade Sub-Agent 的 rate 變更
  const handleUpgradeRateYouChange = useCallback(
    (value: string) => {
      const numValue = parseFloat(value) || 0;
      const maxForYou = totalRatePercent;
      const clampedValue = Math.min(Math.max(0, numValue), maxForYou);
      setUpgradeRateYou(String(clampedValue));

      // 自動調整 sub-agent rate
      const currentSubAgent = parseFloat(upgradeRateSubAgent) || 0;
      if (clampedValue + currentSubAgent > totalRatePercent) {
        setUpgradeRateSubAgent(
          String((totalRatePercent - clampedValue).toFixed(1)),
        );
      }
    },
    [totalRatePercent, upgradeRateSubAgent],
  );

  const handleUpgradeRateSubAgentChange = useCallback(
    (value: string) => {
      const numValue = parseFloat(value) || 0;
      const maxForSubAgent = totalRatePercent;
      const clampedValue = Math.min(Math.max(0, numValue), maxForSubAgent);
      setUpgradeRateSubAgent(String(clampedValue));

      // 自動調整 you rate
      const currentYou = parseFloat(upgradeRateYou) || 0;
      if (currentYou + clampedValue > totalRatePercent) {
        setUpgradeRateYou(String((totalRatePercent - clampedValue).toFixed(1)));
      }
    },
    [totalRatePercent, upgradeRateYou],
  );

  // 計算總和
  const editTotal =
    (parseFloat(editRateYou) || 0) + (parseFloat(editRateInvitee) || 0);
  const upgradeTotal =
    (parseFloat(upgradeRateYou) || 0) + (parseFloat(upgradeRateSubAgent) || 0);

  // Edit Invitee - Confirm
  const handleEditConfirm = async () => {
    if (!userId || !referral) return;

    setIsLoading(true);
    setError(null);

    try {
      // 更新 note (如有變更)
      if (editNote !== (referral.note || "")) {
        await userApi.updateReferralNote(userId, referral.user_id, {
          note: editNote,
        });
      }

      // 更新 commission rate (fee discount)
      const newRate = parseFloat(editRateInvitee) / 100;
      if (newRate !== referral.commission_rate_invitee) {
        await userApi.updateFeeDiscount(userId, referral.user_id, {
          new_fee_discount_rate: newRate,
        });
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to update referral:", err);
      setError(
        t("affiliate.editModal.error", "Failed to update. Please try again."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Upgrade Sub-Agent - Upgrade
  const handleUpgrade = async () => {
    if (!userId || !referral) return;

    setIsLoading(true);
    setError(null);

    try {
      // 升級為 sub-affiliate，設定 max_referral_rate
      await userApi.upgradeToSubAffiliate(userId, referral.user_id, {
        max_referral_rate: parseFloat(upgradeRateSubAgent) / 100,
      });

      // 更新 note (如有)
      if (upgradeNote) {
        await userApi.updateReferralNote(userId, referral.user_id, {
          note: upgradeNote,
        });
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to upgrade to sub-agent:", err);
      setError(
        t(
          "affiliate.editModal.upgradeError",
          "Failed to upgrade. Please try again.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!referral) return null;

  // 是否顯示 Upgrade Tab
  const showUpgradeTab = isTopLevelAgent && !referral.is_affiliate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="oui-max-w-[480px] oui-p-0">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="oui-w-full"
          variant="text"
          size="md"
        >
          <TabPanel
            value="edit"
            title={t("affiliate.editModal.editInvitee", "Edit Invitee")}
          >
            <Flex direction="column" gap={4} p={4}>
              {/* Total commission rate */}
              <Flex justify="between" itemAlign="center">
                <Text className="oui-text-base-contrast-80 oui-text-sm oui-font-semibold">
                  {t(
                    "affiliate.editModal.totalCommissionRate",
                    "Total commission rate",
                  )}
                </Text>
                <Text className="oui-text-primary oui-text-lg oui-font-semibold">
                  {totalRatePercent.toFixed(0)}%
                </Text>
              </Flex>

              {/* Note */}
              <Flex direction="column" gap={1}>
                <Text className="oui-text-base-contrast-54 oui-text-xs">
                  {t("affiliate.editModal.noteOptional", "Note (Optional)")}
                </Text>
                <textarea
                  value={editNote}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setEditNote(e.target.value)
                  }
                  placeholder={t(
                    "affiliate.editModal.notePlaceholder",
                    "Note (Optional)",
                  )}
                  rows={2}
                  className={cn(
                    "oui-w-full oui-rounded-md oui-p-3 oui-text-sm oui-text-base-contrast-80",
                    "oui-border oui-border-line-6 oui-outline-none",
                    "oui-placeholder-base-contrast-36",
                    "oui-bg-base-8",
                  )}
                  style={{ resize: "none" }}
                />
              </Flex>

              {/* Commission Rate Inputs */}
              <Flex itemAlign="center" gap={2}>
                <Flex direction="column" gap={1} className="oui-flex-1">
                  <Text className="oui-text-base-contrast-54 oui-text-xs">
                    {t("affiliate.editModal.forYou", "For you")}
                  </Text>
                  <Flex
                    itemAlign="center"
                    className="oui-bg-base-8 oui-rounded-md oui-border oui-border-line-6"
                  >
                    <Input
                      type="number"
                      value={editRateYou}
                      onChange={(e) => handleEditRateYouChange(e.target.value)}
                      min={0}
                      max={totalRatePercent}
                      step={0.1}
                      className="oui-border-0 oui-bg-transparent oui-text-right oui-pr-1"
                    />
                    <Text className="oui-text-base-contrast-54 oui-pr-3">
                      %
                    </Text>
                  </Flex>
                </Flex>

                <Text className="oui-text-base-contrast-54 oui-mt-5">+</Text>

                <Flex direction="column" gap={1} className="oui-flex-1">
                  <Text className="oui-text-base-contrast-54 oui-text-xs">
                    {t("affiliate.editModal.forInvitee", "For invitee")}
                  </Text>
                  <Flex
                    itemAlign="center"
                    className="oui-bg-base-8 oui-rounded-md oui-border oui-border-line-6"
                  >
                    <Input
                      type="number"
                      value={editRateInvitee}
                      onChange={(e) =>
                        handleEditRateInviteeChange(e.target.value)
                      }
                      min={0}
                      max={totalRatePercent}
                      step={0.1}
                      className="oui-border-0 oui-bg-transparent oui-text-right oui-pr-1"
                    />
                    <Text className="oui-text-base-contrast-54 oui-pr-3">
                      %
                    </Text>
                  </Flex>
                </Flex>

                <Text className="oui-text-base-contrast-54 oui-mt-5">=</Text>

                <Text className="oui-text-primary oui-text-lg oui-font-semibold oui-mt-5 oui-min-w-[50px] oui-text-right">
                  {editTotal.toFixed(0)}%
                </Text>
              </Flex>

              {/* 錯誤訊息 */}
              {error && activeTab === "edit" && (
                <Text className="oui-text-danger oui-text-sm">{error}</Text>
              )}

              {/* Buttons */}
              <Flex gap={3} className="oui-mt-2">
                <Button
                  variant="outlined"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                  className="oui-flex-1"
                >
                  {t("common.cancel", "Cancel")}
                </Button>
                <Button
                  onClick={handleEditConfirm}
                  disabled={isLoading || editTotal > totalRatePercent}
                  loading={isLoading}
                  className="oui-flex-1"
                >
                  {t("common.confirm", "Confirm")}
                </Button>
              </Flex>
            </Flex>
          </TabPanel>

          {showUpgradeTab && (
            <TabPanel
              value="upgrade"
              title={t(
                "affiliate.editModal.upgradeSubAgent",
                "Upgrade Sub-Agent",
              )}
            >
              <Flex direction="column" gap={4} p={4}>
                {/* Total commission rate */}
                <Flex justify="between" itemAlign="center">
                  <Text className="oui-text-base-contrast-80 oui-text-sm oui-font-semibold">
                    {t(
                      "affiliate.editModal.totalCommissionRate",
                      "Total commission rate",
                    )}
                  </Text>
                  <Text className="oui-text-primary oui-text-lg oui-font-semibold">
                    {totalRatePercent.toFixed(0)}%
                  </Text>
                </Flex>

                {/* Note */}
                <Flex direction="column" gap={1}>
                  <Text className="oui-text-base-contrast-54 oui-text-xs">
                    {t("affiliate.editModal.noteOptional", "Note (Optional)")}
                  </Text>
                  <textarea
                    value={upgradeNote}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setUpgradeNote(e.target.value)
                    }
                    placeholder={t(
                      "affiliate.editModal.notePlaceholder",
                      "Note (Optional)",
                    )}
                    rows={2}
                    className={cn(
                      "oui-w-full oui-rounded-md oui-p-3 oui-text-sm oui-text-base-contrast-80",
                      "oui-border oui-border-line-6 oui-outline-none",
                      "oui-placeholder-base-contrast-36",
                      "oui-bg-base-8",
                    )}
                    style={{ resize: "none" }}
                  />
                </Flex>

                {/* Commission Rate Inputs */}
                <Flex itemAlign="center" gap={2}>
                  <Flex direction="column" gap={1} className="oui-flex-1">
                    <Text className="oui-text-base-contrast-54 oui-text-xs">
                      {t("affiliate.editModal.forYou", "For you")}
                    </Text>
                    <Flex
                      itemAlign="center"
                      className="oui-bg-base-8 oui-rounded-md oui-border oui-border-line-6"
                    >
                      <Input
                        type="number"
                        value={upgradeRateYou}
                        onChange={(e) =>
                          handleUpgradeRateYouChange(e.target.value)
                        }
                        min={0}
                        max={totalRatePercent}
                        step={0.1}
                        className="oui-border-0 oui-bg-transparent oui-text-right oui-pr-1"
                      />
                      <Text className="oui-text-base-contrast-54 oui-pr-3">
                        %
                      </Text>
                    </Flex>
                  </Flex>

                  <Text className="oui-text-base-contrast-54 oui-mt-5">+</Text>

                  <Flex direction="column" gap={1} className="oui-flex-1">
                    <Text className="oui-text-base-contrast-54 oui-text-xs">
                      {t("affiliate.editModal.forSubAgent", "For Sub-Agent")}
                    </Text>
                    <Flex
                      itemAlign="center"
                      className="oui-bg-base-8 oui-rounded-md oui-border oui-border-line-6"
                    >
                      <Input
                        type="number"
                        value={upgradeRateSubAgent}
                        onChange={(e) =>
                          handleUpgradeRateSubAgentChange(e.target.value)
                        }
                        min={0}
                        max={totalRatePercent}
                        step={0.1}
                        className="oui-border-0 oui-bg-transparent oui-text-right oui-pr-1"
                      />
                      <Text className="oui-text-base-contrast-54 oui-pr-3">
                        %
                      </Text>
                    </Flex>
                  </Flex>

                  <Text className="oui-text-base-contrast-54 oui-mt-5">=</Text>

                  <Text className="oui-text-primary oui-text-lg oui-font-semibold oui-mt-5 oui-min-w-[50px] oui-text-right">
                    {upgradeTotal.toFixed(0)}%
                  </Text>
                </Flex>

                {/* 錯誤訊息 */}
                {error && activeTab === "upgrade" && (
                  <Text className="oui-text-danger oui-text-sm">{error}</Text>
                )}

                {/* Buttons */}
                <Flex gap={3} className="oui-mt-2">
                  <Button
                    variant="outlined"
                    onClick={() => onOpenChange(false)}
                    disabled={isLoading}
                    className="oui-flex-1"
                  >
                    {t("common.cancel", "Cancel")}
                  </Button>
                  <Button
                    onClick={handleUpgrade}
                    disabled={isLoading || upgradeTotal > totalRatePercent}
                    loading={isLoading}
                    className="oui-flex-1"
                  >
                    {t("affiliate.editModal.upgrade", "Upgrade")}
                  </Button>
                </Flex>
              </Flex>
            </TabPanel>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
