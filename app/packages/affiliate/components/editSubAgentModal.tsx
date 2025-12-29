import { FC, useState, useEffect } from "react";
import { useTranslation } from "@orderly.network/i18n";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Flex,
  Text,
  Input,
  cn,
} from "@orderly.network/ui";
import { SubAffiliateItem } from "@/services/api-refer-client";
import { userApi } from "@/services/user.client";
import { useReferralContext } from "../provider/context";

interface EditSubAgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subAgent: SubAffiliateItem | null;
  onSuccess?: () => void;
}

export const EditSubAgentModal: FC<EditSubAgentModalProps> = ({
  open,
  onOpenChange,
  subAgent,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { userId } = useReferralContext();

  const [commissionRateYou, setCommissionRateYou] = useState<string>("");
  const [commissionRateSub, setCommissionRateSub] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 當 subAgent 變化時重置表單
  useEffect(() => {
    if (subAgent) {
      setCommissionRateYou(
        String((subAgent.commission_rate_you * 100).toFixed(1)),
      );
      setCommissionRateSub(
        String((subAgent.commission_rate_sub * 100).toFixed(1)),
      );
      setNote(subAgent.note || "");
      setError(null);
    }
  }, [subAgent]);

  const handleSave = async () => {
    if (!userId || !subAgent) return;

    setIsLoading(true);
    setError(null);

    try {
      // 更新 note
      if (note !== (subAgent.note || "")) {
        await userApi.updateSubAffiliateNote(userId, subAgent.user_id, {
          note,
        });
      }

      // 更新 commission rate
      const newRate = parseFloat(commissionRateSub) / 100;
      if (newRate !== subAgent.commission_rate_sub) {
        await userApi.updateFeeDiscount(userId, subAgent.user_id, {
          new_fee_discount_rate: newRate,
        });
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to update sub-agent:", err);
      setError(
        t("affiliate.editModal.error", "Failed to update. Please try again."),
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!subAgent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="oui-max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {t("affiliate.editSubAgentModal.title", "Edit Sub-Agent")}
          </DialogTitle>
        </DialogHeader>

        <Flex direction="column" gap={4} p={4}>
          {/* 錢包地址 (只讀) */}
          <Flex direction="column" gap={1}>
            <Text className="oui-text-base-contrast-54 oui-text-xs">
              {t("affiliate.editModal.walletAddress", "Wallet Address")}
            </Text>
            <Text className="oui-text-base-contrast-80 oui-text-sm oui-font-mono">
              {subAgent.wallet_address}
            </Text>
          </Flex>

          {/* 邀請人數 (只讀) */}
          <Flex direction="column" gap={1}>
            <Text className="oui-text-base-contrast-54 oui-text-xs">
              {t("affiliate.editSubAgentModal.invitedUsers", "Invited Users")}
            </Text>
            <Text className="oui-text-base-contrast-80 oui-text-sm">
              {subAgent.invited_users || 0}
            </Text>
          </Flex>

          {/* Commission Rate (You) - 只讀 */}
          <Flex direction="column" gap={1}>
            <Text className="oui-text-base-contrast-54 oui-text-xs">
              {t(
                "affiliate.editSubAgentModal.commissionRateYou",
                "Your Commission Rate (%)",
              )}
            </Text>
            <Input
              value={commissionRateYou}
              disabled
              className="oui-bg-base-7"
            />
          </Flex>

          {/* Commission Rate (Sub-Agent) - 可編輯 */}
          <Flex direction="column" gap={1}>
            <Text className="oui-text-base-contrast-54 oui-text-xs">
              {t(
                "affiliate.editSubAgentModal.commissionRateSub",
                "Sub-Agent Commission Rate (%)",
              )}
            </Text>
            <Input
              type="number"
              value={commissionRateSub}
              onChange={(e) => setCommissionRateSub(e.target.value)}
              min={0}
              max={subAgent.max_referral_rate * 100}
              step={0.1}
            />
            <Text className="oui-text-base-contrast-36 oui-text-xs">
              {t("affiliate.editSubAgentModal.maxRate", "Max: {{rate}}%", {
                rate: (subAgent.max_referral_rate * 100).toFixed(1),
              })}
            </Text>
          </Flex>

          {/* Note */}
          <Flex direction="column" gap={1}>
            <Text className="oui-text-base-contrast-54 oui-text-xs">
              {t("affiliate.editModal.note", "Note")}
            </Text>
            <textarea
              value={note}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNote(e.target.value)
              }
              placeholder={t(
                "affiliate.editModal.notePlaceholder",
                "Add a note...",
              )}
              rows={3}
              className={cn(
                "oui-w-full oui-rounded-sm oui-p-3 oui-text-sm oui-text-base-contrast-80",
                "oui-border-0 oui-outline-none",
                "oui-placeholder-base-contrast-20",
              )}
              style={{
                resize: "none",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              }}
            />
          </Flex>

          {/* 錯誤訊息 */}
          {error && (
            <Text className="oui-text-danger oui-text-sm">{error}</Text>
          )}
        </Flex>

        <DialogFooter>
          <Flex gap={3}>
            <Button
              variant="outlined"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t("common.cancel", "Cancel")}
            </Button>

            <Button
              onClick={handleSave}
              disabled={isLoading}
              loading={isLoading}
            >
              {t("common.save", "Save")}
            </Button>
          </Flex>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
