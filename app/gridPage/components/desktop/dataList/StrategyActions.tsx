import React from "react";
import { useTranslation } from "@orderly.network/i18n";
import { Button, Spinner, modal } from "@orderly.network/ui";
import { useStrategyRow } from "@/contexts/StrategyRowProvider";

export const StrategyActions: React.FC = () => {
  const { t } = useTranslation();
  const { strategy, onStop, stopping } = useStrategyRow();

  const handleStopClick = () => {
    modal.confirm({
      title: t("strategy.closeConfirm"),
      content: t("strategy.closeConfirm"),
      onOk: async () => {
        await onStop(strategy.session_id);
      },
    });
  };

  return (
    <Button
      variant="outlined"
      color="danger"
      size="xs"
      onClick={handleStopClick}
      disabled={stopping || !strategy.is_running}
      className="min-w-[60px]"
    >
      {stopping ? <Spinner size="xs" /> : t("strategy.close")}
    </Button>
  );
};
