import { useCallback, useEffect, useState } from "react";
import { MetaFunction } from "@remix-run/node";
import { useNavigate, useParams } from "@remix-run/react";
import { useAccount } from "@orderly.network/hooks";
import { i18n, parseI18nLang } from "@orderly.network/i18n";
import { TradingPage } from "@orderly.network/trading";
import { API } from "@orderly.network/types";
import { SimpleDialog, Text } from "@orderly.network/ui";
import { PathEnum } from "@/constant";
import { useSaveApiKeyToBackend } from "@/hooks/custom/useSaveApiKeyToBackend";
import { useStrategyTabGuard } from "@/hooks/custom/useStrategyTabGuard";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { updateSymbol } from "@/storage";
import { formatSymbol, generatePageTitle } from "@/utils";

export const meta: MetaFunction = ({ params }) => {
  return [{ title: generatePageTitle(formatSymbol(params.symbol!)) }];
};

export default function StrategyPage() {
  const config = useOrderlyConfig();
  const params = useParams();
  const [symbol, setSymbol] = useState(params.symbol!);
  const navigate = useNavigate();

  const [isBlurred, setIsBlurred] = useState(false);
  const { account, state, isSubAccount } = useAccount();

  const { hasApiKey, showDialog, setShowDialog, checkBackendApiKey } =
    useStrategyTabGuard();

  const { saveToBackend, isSaving } = useSaveApiKeyToBackend({
    onSuccess: () => {
      setShowDialog(false);
      setIsBlurred(false);
    },
  });

  useEffect(() => {
    updateSymbol(symbol);
  }, [symbol]);

  // 等待 accountId 就緒後再進行後端檢查，避免傳遞 undefined
  useEffect(() => {
    if (state?.accountId) {
      checkBackendApiKey();
    }
  }, [state?.accountId]);

  useEffect(() => {
    if (hasApiKey === false) {
      setIsBlurred(true);
    } else if (hasApiKey === true) {
      setIsBlurred(false);
    }
  }, [hasApiKey]);

  const onSymbolChange = useCallback(
    (data: API.Symbol) => {
      const symbol = data.symbol;
      setSymbol(symbol);
      navigate(
        `/${parseI18nLang(i18n.language)}${PathEnum.Strategy}/${symbol}`,
      );
    },
    [navigate],
  );

  const handleCreateApiKey = async () => {
    try {
      // 創建 API key
      const generateKeyRes = await account.createApiKey(365, {
        tag: "strategyAutoCreated",
        scope: "read,trading",
      });

      if (!generateKeyRes) {
        throw new Error("API key generation returned empty result");
      }

      // 保存到後端
      if (generateKeyRes) {
        await saveToBackend(
          generateKeyRes.key,
          generateKeyRes.secretKey,
          state.accountId,
        );
      }
    } catch (error) {
      console.error("Failed to create API key:", error);
    }
  };

  return (
    <div className={isBlurred ? "oui-blur-sm" : ""}>
      {showDialog && (
        <SimpleDialog
          open={showDialog}
          onOpenChange={() => {}}
          title="Create API Key for Strategy"
          actions={{
            primary: {
              label: "Create API Key",
              onClick: handleCreateApiKey,
              disabled: isSaving,
            },
          }}
        >
          <Text>
            To use automated trading strategies, you need to create an API key.
          </Text>
          <Text>The following settings will be applied:</Text>
          <ul>
            <li>Scope: read, trading</li>
            <li>IP Restriction: None</li>
            <li>Duration: 365 days</li>
          </ul>
        </SimpleDialog>
      )}

      <TradingPage
        symbol={symbol}
        onSymbolChange={onSymbolChange}
        tradingViewConfig={config.tradingPage.tradingViewConfig}
        sharePnLConfig={config.tradingPage.sharePnLConfig}
      />
    </div>
  );
}
