import { FC, useMemo } from "react";
import { useTranslation } from "@orderly.network/i18n";
import {
  Text,
  cn,
  Button,
  ArrowRightUpSquareFillIcon,
  useScreen,
} from "@orderly.network/ui";
import { AuthGuard } from "@orderly.network/ui-connector";
import { VaultCardScript } from "./vaultCard.script";

export const VaultCard: FC<VaultCardScript> = (props) => {
  const {
    title,
    vaultInfo,
    lpInfo,
    description,
    isEVMConnected,
    isSOLConnected,
    openDepositAndWithdraw,
    availableBalance,
    openVaultWebsite,
  } = props;

  const { t } = useTranslation();
  const { isMobile } = useScreen();

  const supportVaultsList = useMemo(() => {
    return <div className="oui-flex oui-items-center"></div>;
  }, [vaultInfo.supported_chains]);
  console.log("supportVaultsList", supportVaultsList);

  return (
    <div className="oui-relative oui-h-full oui-overflow-hidden oui-rounded-md oui-bg-base-9">
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100%",
          height: "180px",
          backdropFilter: "blur(2px)",
          zIndex: 1,
          background: "rgba(19, 21, 25, 1)",
        }}
      ></div>

      <div className="oui-relative oui-z-20 oui-flex oui-flex-col oui-gap-4 oui-p-6">
        <div className="oui-flex oui-items-center oui-gap-2">
          <div className="oui-text-[18px] oui-font-semibold oui-text-white">
            {title}
          </div>
          {supportVaultsList}
          <div
            className="oui-z-50 oui-ml-auto oui-cursor-pointer"
            onClick={openVaultWebsite}
          >
            <ArrowRightUpSquareFillIcon
              color="white"
              width={18}
              height={18}
              viewBox="0 0 18 18"
            />
          </div>
        </div>

        <div
          style={{
            color: "rgba(255, 255, 255, 0.4)",
            fontSize: 12,
            fontFamily: "Poppins",
            fontWeight: "500",
            wordWrap: "break-word",
          }}
        >
          {description}
        </div>

        <div className="oui-flex oui-items-center oui-gap-2">
          <VaultInfoItem
            label={t("vaults.card.tvl")}
            value={vaultInfo.tvl}
            textProps={{
              currency: "$",
              dp: 0,
              type: "numeral",
            }}
          />
          <VaultInfoItem
            label={t("vaults.card.apy")}
            value={(vaultInfo["30d_apy"] * 100).toFixed(2) + "%"}
            textProps={{
              color: "brand",
              type: "gradient",
            }}
          />
        </div>

        <div className="oui-mt-3 oui-flex oui-flex-col oui-items-center oui-gap-2 oui-rounded-lg oui-bg-white/[0.06] oui-p-3">
          <LpInfoItem
            label={t("vaults.card.myDeposits")}
            value={lpInfo.deposits}
          />
          <LpInfoItem
            label={t("vaults.card.myEarnings")}
            value={lpInfo.earnings}
          />
        </div>

        <LpInfoItem
          label={t("vaults.card.accountBalance")}
          value={availableBalance}
        />

        <VaultCardOperation
          isEVMConnected={isEVMConnected}
          isSOLConnected={isSOLConnected}
          openDepositAndWithdraw={openDepositAndWithdraw}
        />
      </div>
    </div>
  );
};

const VaultInfoItem: FC<{
  label: string;
  value: string | number;
  textProps?: any;
}> = (props) => {
  const { label, value, textProps } = props;

  return (
    <div
      className={cn(
        "oui-flex oui-flex-1 oui-flex-col oui-items-center oui-justify-center oui-px-3 oui-py-2",
        "oui-rounded-sm",
      )}
      style={{
        borderRadius: 4,
        outline: "1px rgba(255, 255, 255, 0.05) solid",
        outlineOffset: "-1px",
        flexDirection: "column",
      }}
    >
      <div className="oui-text-2xs oui-font-normal oui-leading-[18px] oui-text-base-contrast-54">
        {label}
      </div>
      {textProps.type === "gradient" ? (
        <Text
          className="oui-text-base oui-font-semibold"
          style={{
            color: "rgba(201, 189, 255, 1)",
          }}
        >
          {value}
        </Text>
      ) : (
        <Text.numeral
          className="oui-text-base oui-font-semibold"
          {...textProps}
        >
          {value}
        </Text.numeral>
      )}
    </div>
  );
};

const LpInfoItem: FC<{
  label: string;
  value: string | number;
  textProps?: any;
}> = (props) => {
  const { label, value, textProps } = props;

  return (
    <div className="oui-flex oui-w-full oui-items-center oui-justify-between oui-text-2xs oui-font-normal">
      <div className="oui-text-base-contrast-54">{label}</div>
      <Text.numeral
        className="oui-text-base-contrast-80"
        {...textProps}
        dp={2}
        suffix={
          <span className="oui-ml-1 oui-text-base-contrast-36">USDC</span>
        }
      >
        {value}
      </Text.numeral>
    </div>
  );
};

type VaultCardOperationProps = {
  isEVMConnected: boolean;
  isSOLConnected: boolean;
  openDepositAndWithdraw: (activeTab: "deposit" | "withdraw") => void;
};

const VaultCardOperation: FC<VaultCardOperationProps> = (props) => {
  const { isEVMConnected, isSOLConnected, openDepositAndWithdraw } = props;
  const { t } = useTranslation();

  return (
    <AuthGuard buttonProps={{ size: "md", fullWidth: true }}>
      {isEVMConnected || isSOLConnected ? (
        <div className="oui-flex oui-items-center oui-gap-2">
          <Button
            className="oui-flex-1 oui-rounded-full oui-text-xs oui-px-4 oui-font-semibold oui-leading-5"
            size="xs"
            onClick={() => openDepositAndWithdraw("deposit")}
            style={{
              fontSize: 11,
              background:
                "linear-gradient(90deg, #7053F3 0%, #78CBC1 45%, #CDEB78 96%)",
              color: "rgba(255, 255, 255, 0.9)",
            }}
          >
            {t("common.deposit")}
          </Button>
          <Button
            className="oui-flex-1 oui-rounded-full oui-border-white/[0.36] oui-text-xs oui-px-4 oui-font-semibold oui-leading-5"
            variant="outlined"
            size="xs"
            onClick={() => openDepositAndWithdraw("withdraw")}
            style={{
              border: "1px solid rgba(255, 255, 255, 0.12)",
              fontSize: 11,
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            {t("common.withdraw")}
          </Button>
        </div>
      ) : (
        <Button size="md" color="warning">
          {t("connector.wrongNetwork")}
        </Button>
      )}
    </AuthGuard>
  );
};
