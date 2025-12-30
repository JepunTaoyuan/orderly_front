import { FC, useState, useEffect, useCallback } from "react";
import { useTranslation } from "@orderly.network/i18n";
import {
  Dialog,
  DialogContent,
  Button,
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

  // 使用 userInfo 的 max_referral_rate 或 props 傳入的值，頂級代理預設 40%
  const totalRate = maxCommissionRate ?? userInfo?.max_referral_rate ?? 0.4;
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
      <DialogContent
        size="md"
        className="oui-rounded-sm oui-p-5"
        style={{ backgroundColor: "#0c0d10" }}
      >
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
            <div className="oui-flex oui-flex-col oui-gap-4">
              {/* Total commission rate */}
              <div className="oui-flex oui-justify-between oui-items-center oui-pt-3">
                <span className="oui-text-xs oui-font-semibold oui-text-white/80">
                  {t(
                    "affiliate.editModal.totalCommissionRate",
                    "Total commission rate",
                  )}
                </span>
                <span className="oui-text-xs oui-font-semibold oui-text-primary">
                  {totalRatePercent.toFixed(0)}%
                </span>
              </div>

              {/* Note */}
              <div className="oui-flex oui-flex-col oui-gap-1">
                <label className="oui-text-xs oui-text-white/60">
                  {t("affiliate.editModal.noteOptional", "Note (Optional)")}
                </label>
                <input
                  type="text"
                  value={editNote}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditNote(e.target.value)
                  }
                  placeholder={t(
                    "affiliate.editModal.notePlaceholder",
                    "Note (Optional)",
                  )}
                  className="oui-bg-base-9 oui-w-full oui-h-10 oui-px-3 oui-bg-white/5 oui-text-white oui-rounded-md"
                />
              </div>

              {/* Commission Rate Inputs */}
              <div className="oui-flex oui-items-center oui-gap-3">
                <div className="oui-flex oui-flex-col oui-flex-1">
                  <label className="oui-text-gray-400 oui-text-xs oui-font-semibold oui-mb-1">
                    {t("affiliate.editModal.forYou", "For you")}
                  </label>
                  <div className="oui-bg-base-9 oui-flex oui-items-center oui-bg-base-8 oui-rounded-md oui-px-3 oui-py-2">
                    <input
                      type="number"
                      value={editRateYou}
                      onChange={(e) => handleEditRateYouChange(e.target.value)}
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
                    {t("affiliate.editModal.forInvitee", "For invitee")}
                  </label>
                  <div className="oui-border oui-border-line-12 oui-bg-base-9 oui-flex oui-items-center oui-bg-base-8 oui-rounded-md oui-px-3 oui-py-2">
                    <input
                      type="number"
                      value={editRateInvitee}
                      onChange={(e) =>
                        handleEditRateInviteeChange(e.target.value)
                      }
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
                    editTotal > totalRatePercent
                      ? "oui-text-danger"
                      : "oui-text-primary",
                  )}
                >
                  {editTotal.toFixed(0)}%
                </div>
              </div>

              {/* 錯誤訊息 */}
              {error && activeTab === "edit" && (
                <span className="oui-text-danger oui-text-sm">{error}</span>
              )}
            </div>
            <div className="oui-flex oui-gap-2 oui-justify-end oui-w-full oui-pt-8">
              <Button
                variant="outlined"
                className="oui-rounded-full oui-text-base-contrast-54 oui-flex-1"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                style={{
                  backgroundColor: "rgba(12, 13, 16, 1)",
                  borderRadius: "50px",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "rgba(255, 255, 255, 0.6)",
                }}
              >
                {t("common.cancel", "Cancel")}
              </Button>
              <Button
                className="oui-flex-1 oui-rounded-full oui-text-white"
                onClick={handleEditConfirm}
                disabled={isLoading || editTotal > totalRatePercent}
                loading={isLoading}
                style={{
                  backgroundColor: "rgba(110, 85, 223, 1)",
                  borderRadius: "50px",
                  border: "none",
                }}
              >
                {t("common.confirm", "Confirm")}
              </Button>
            </div>
          </TabPanel>

          {showUpgradeTab && (
            <TabPanel
              value="upgrade"
              title={t(
                "affiliate.editModal.upgradeSubAgent",
                "Upgrade Sub-Agent",
              )}
            >
              <div className="oui-flex oui-flex-col oui-gap-4">
                {/* Total commission rate */}
                <div className="oui-flex oui-justify-between oui-items-center oui-pt-3">
                  <span className="oui-text-xs oui-font-semibold oui-text-white/80">
                    {t(
                      "affiliate.editModal.totalCommissionRate",
                      "Total commission rate",
                    )}
                  </span>
                  <span className="oui-text-xs oui-font-semibold oui-text-primary">
                    {totalRatePercent.toFixed(0)}%
                  </span>
                </div>

                {/* Note */}
                <div className="oui-flex oui-flex-col oui-gap-1">
                  <label className="oui-text-xs oui-text-white/60">
                    {t("affiliate.editModal.noteOptional", "Note (Optional)")}
                  </label>
                  <input
                    type="text"
                    value={upgradeNote}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setUpgradeNote(e.target.value)
                    }
                    placeholder={t(
                      "affiliate.editModal.notePlaceholder",
                      "Note (Optional)",
                    )}
                    className="oui-bg-base-9 oui-w-full oui-h-10 oui-px-3 oui-bg-white/5 oui-text-white oui-rounded-md"
                  />
                </div>

                {/* Commission Rate Inputs */}
                <div className="oui-flex oui-items-center oui-gap-3">
                  <div className="oui-flex oui-flex-col oui-flex-1">
                    <label className="oui-text-gray-400 oui-text-xs oui-font-semibold oui-mb-1">
                      {t("affiliate.editModal.forYou", "For you")}
                    </label>
                    <div className="oui-bg-base-9 oui-flex oui-items-center oui-bg-base-8 oui-rounded-md oui-px-3 oui-py-2">
                      <input
                        type="number"
                        value={upgradeRateYou}
                        onChange={(e) =>
                          handleUpgradeRateYouChange(e.target.value)
                        }
                        min={0}
                        max={totalRatePercent}
                        step={0.1}
                        className="oui-bg-transparent oui-text-white oui-text-lg oui-font-bold oui-w-full oui-outline-none"
                      />
                      <span className="oui-text-gray-400 oui-font-medium">
                        %
                      </span>
                    </div>
                  </div>

                  <div className="oui-font-bold oui-text-xl oui-flex oui-items-end oui-h-11 oui-text-base-contrast-54">
                    +
                  </div>

                  <div className="oui-flex oui-flex-col oui-flex-1">
                    <label className="oui-text-gray-400 oui-text-xs oui-font-semibold oui-mb-1">
                      {t("affiliate.editModal.forSubAgent", "For Sub-Agent")}
                    </label>
                    <div className="oui-border oui-border-line-12 oui-bg-base-9 oui-flex oui-items-center oui-bg-base-8 oui-rounded-md oui-px-3 oui-py-2">
                      <input
                        type="number"
                        value={upgradeRateSubAgent}
                        onChange={(e) =>
                          handleUpgradeRateSubAgentChange(e.target.value)
                        }
                        min={0}
                        max={totalRatePercent}
                        step={0.1}
                        className="oui-bg-transparent oui-text-white oui-text-lg oui-font-bold oui-w-full oui-outline-none"
                      />
                      <span className="oui-text-gray-400 oui-font-medium">
                        %
                      </span>
                    </div>
                  </div>

                  <div className="oui-text-base-contrast-54 oui-font-bold oui-text-xl oui-flex oui-items-end oui-h-11">
                    =
                  </div>

                  <div
                    className={cn(
                      "oui-font-bold oui-text-md oui-flex oui-items-end oui-h-11",
                      upgradeTotal > totalRatePercent
                        ? "oui-text-danger"
                        : "oui-text-primary",
                    )}
                  >
                    {upgradeTotal.toFixed(0)}%
                  </div>
                </div>

                {/* 錯誤訊息 */}
                {error && activeTab === "upgrade" && (
                  <span className="oui-text-danger oui-text-sm">{error}</span>
                )}
              </div>
              <div className="oui-flex oui-gap-2 oui-justify-end oui-w-full oui-pt-8">
                <Button
                  variant="outlined"
                  className="oui-rounded-full oui-text-base-contrast-54 oui-flex-1"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                  style={{
                    backgroundColor: "rgba(12, 13, 16, 1)",
                    borderRadius: "50px",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  {t("common.cancel", "Cancel")}
                </Button>
                <Button
                  className="oui-flex-1 oui-rounded-full oui-text-white"
                  onClick={handleUpgrade}
                  disabled={isLoading || upgradeTotal > totalRatePercent}
                  loading={isLoading}
                  style={{
                    backgroundColor: "rgba(110, 85, 223, 1)",
                    borderRadius: "50px",
                    border: "none",
                  }}
                >
                  {t("affiliate.editModal.upgrade", "Upgrade")}
                </Button>
              </div>
            </TabPanel>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
