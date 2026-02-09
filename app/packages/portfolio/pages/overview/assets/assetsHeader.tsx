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
      <CardTitle className="oui-text-sm">{t("common.overview")}</CardTitle>
      <Flex gap={3}>
        {props.isMainAccount && (
          <Button
            disabled={props.disabled}
            size="md"
            onClick={() => props.onDeposit?.()}
            icon={
              <ArrowDownSquareFillIcon className="oui-text-primary-contrast" />
            }
            data-testid="oui-testid-portfolio-assets-deposit-btn"
            className="oui-rounded-full oui-text-white oui-text-xs oui-px-4 oui-font-semibold oui-leading-5"
            style={{
              background:
                "linear-gradient(90deg, #7053F3 0%, #78CBC1 45%, #CDEB78 96%)",
            }}
          >
            {t("common.deposit")}
          </Button>
        )}
        {props.hasSubAccount && (
          <Button
            disabled={props.disabled}
            size="md"
            // color="secondary"
            variant="outlined"
            onClick={() => props.onTransfer?.()}
            icon={<ArrowLeftRightIcon className="oui-text-base-contrast" />}
            className="oui-rounded-full oui-border-white/[0.36] oui-text-white/[0.5] oui-text-xs oui-px-4 oui-font-semibold oui-leading-5"
          >
            {t("common.transfer")}
          </Button>
        )}
        {props.isMainAccount && (
          <Button
            disabled={props.disabled}
            size="md"
            // color="secondary"
            variant="outlined"
            onClick={() => props.onWithdraw?.()}
            icon={<ArrowUpSquareFillIcon className="oui-text-base-contrast" />}
            data-testid="oui-testid-portfolio-assets-withdraw-btn"
            className="oui-rounded-full oui-border-white/[0.36] oui-text-white/[0.5] oui-text-xs oui-px-4 oui-font-semibold oui-leading-5"
          >
            {t("common.withdraw")}
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
