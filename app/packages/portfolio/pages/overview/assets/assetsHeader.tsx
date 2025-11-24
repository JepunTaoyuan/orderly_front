import { FC } from "react";
import { useTranslation } from "@orderly.network/i18n";
import {
  ArrowDownSquareFillIcon,
  ArrowLeftRightIcon,
  ArrowUpSquareFillIcon,
  Button,
  CardTitle,
  Flex,
} from "@orderly.network/ui";

type Props = {
  disabled: boolean;
  onWithdraw?: () => void;
  onDeposit?: () => void;
  onTransfer?: () => void;
  isMainAccount?: boolean;
  hasSubAccount?: boolean;
};

export const AssetsHeader: FC<Props> = (props) => {
  const { t } = useTranslation();

  return (
    <Flex justify={"between"}>
      <CardTitle>{t("common.overview")}</CardTitle>
      <Flex gap={3}>
        {props.isMainAccount && (
          <Button
            disabled={props.disabled}
            size="md"
            onClick={() => props.onDeposit?.()}
            // icon={
            //   <ArrowDownSquareFillIcon className="oui-text-primary-contrast" />
            // }
            className="oui-py-4 oui-px-5 oui-text-xs oui-font-semibold oui-rounded-2xl"
            style={{
              background: "linear-gradient(90deg, #463c96 0%, #66e6ff 100%)",
              fontSize: "11px",
              lineHeight: "20px",
              fontWeight: 600,
              fontFamily: "Manrope",
              color: "rgba(255, 255, 255, 0.9)",
            }}
            data-testid="oui-testid-portfolio-assets-deposit-btn"
          >
            {t("common.deposit")}
          </Button>
        )}
        {props.hasSubAccount && (
          <Button
            disabled={props.disabled}
            size="md"
            color="secondary"
            onClick={() => props.onTransfer?.()}
            // icon={<ArrowLeftRightIcon className="oui-text-base-contrast" />}
            className="oui-py-4 oui-px-5 oui-text-xs oui-rounded-2xl"
            style={{
              background: "none",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              fontSize: "11px",
              lineHeight: "20px",
              fontWeight: 600,
              fontFamily: "Manrope",
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            {t("common.transfer")}
          </Button>
        )}
        {props.isMainAccount && (
          <Button
            disabled={props.disabled}
            size="md"
            // color="secondary"
            onClick={() => props.onWithdraw?.()}
            // icon={<ArrowUpSquareFillIcon className="oui-text-base-contrast" />}
            className="oui-py-4 oui-px-5 oui-text-xs oui-rounded-2xl"
            style={{
              background: "none",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              fontSize: "11px",
              lineHeight: "20px",
              fontWeight: 600,
              fontFamily: "Manrope",
              color: "rgba(255, 255, 255, 0.6)",
            }}
            data-testid="oui-testid-portfolio-assets-withdraw-btn"
          >
            {t("common.withdraw")}
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
