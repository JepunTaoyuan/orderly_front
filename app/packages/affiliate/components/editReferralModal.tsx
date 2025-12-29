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
import { ReferralDetailItem } from "@/services/api-refer-client";
import { userApi } from "@/services/user.client";
import { useReferralContext } from "../provider/context";

interface EditReferralModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  referral: ReferralDetailItem | null;
  onSuccess?: () => void;
}

export const EditReferralModal: FC<EditReferralModalProps> = ({
  open,
  onOpenChange,
  referral,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { userId, isTopLevelAgent } = useReferralContext();

  const [commissionRateYou, setCommissionRateYou] = useState<string>("");
  const [commissionRateInvitee, setCommissionRateInvitee] =
    useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 當 referral 變化時重置表單
  useEffect(() => {
    if (referral) {
      setCommissionRateYou(
        String((referral.commission_rate_you * 100).toFixed(1)),
      );
      setCommissionRateInvitee(
        String((referral.commission_rate_invitee * 100).toFixed(1)),
      );
      setNote(referral.note || "");
      setError(null);
    }
  }, [referral]);

  const handleSave = async () => {
    if (!userId || !referral) return;

    setIsLoading(true);
    setError(null);

    try {
      // 更新 note
      if (note !== (referral.note || "")) {
        await userApi.updateReferralNote(userId, referral.user_id, { note });
      }

      // 更新 commission rate (fee discount)
      const newRate = parseFloat(commissionRateInvitee) / 100;
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

  const handleUpgradeToSubAgent = async () => {
    if (!userId || !referral) return;

    setIsLoading(true);
    setError(null);

    try {
      await userApi.upgradeToSubAffiliate(userId, referral.user_id, {
        max_referral_rate: parseFloat(commissionRateInvitee) / 100,
      });

      // 同時更新 note
      if (note) {
        await userApi.updateReferralNote(userId, referral.user_id, { note });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="oui-max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {t("affiliate.editModal.title", "Edit Referral")}
          </DialogTitle>
        </DialogHeader>

        <Flex direction="column" gap={4} p={4}>
          {/* 錢包地址 (只讀) */}
          <Flex direction="column" gap={1}>
            <Text className="oui-text-base-contrast-54 oui-text-xs">
              {t("affiliate.editModal.walletAddress", "Wallet Address")}
            </Text>
            <Text className="oui-text-base-contrast-80 oui-text-sm oui-font-mono">
              {referral.wallet_address}
            </Text>
          </Flex>

          {/* Commission Rate (You) - 只讀 */}
          <Flex direction="column" gap={1}>
            <Text className="oui-text-base-contrast-54 oui-text-xs">
              {t(
                "affiliate.editModal.commissionRateYou",
                "Your Commission Rate (%)",
              )}
            </Text>
            <Input
              value={commissionRateYou}
              disabled
              className="oui-bg-base-7"
            />
          </Flex>

          {/* Commission Rate (Invitee) - 可編輯 */}
          <Flex direction="column" gap={1}>
            <Text className="oui-text-base-contrast-54 oui-text-xs">
              {t(
                "affiliate.editModal.commissionRateInvitee",
                "Invitee Commission Rate (%)",
              )}
            </Text>
            <Input
              type="number"
              value={commissionRateInvitee}
              onChange={(e) => setCommissionRateInvitee(e.target.value)}
              min={0}
              max={100}
              step={0.1}
            />
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
          <Flex gap={3} width="100%">
            {/* 升級至子代理按鈕 (僅頂級代理且該用戶非子代理時顯示) */}
            {isTopLevelAgent && !referral.is_affiliate && (
              <Button
                variant="outlined"
                onClick={handleUpgradeToSubAgent}
                disabled={isLoading}
                className="oui-flex-1"
              >
                {t(
                  "affiliate.editModal.upgradeToSubAgent",
                  "Upgrade to Sub-Agent",
                )}
              </Button>
            )}

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
