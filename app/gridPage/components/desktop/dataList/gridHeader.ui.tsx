import React from "react";
import { useTranslation } from "@orderly.network/i18n";
import {
  Button,
  Divider,
  Flex,
  Statistic,
  Text,
  useScreen,
  RefreshIcon,
} from "@orderly.network/ui";
import { Decimal } from "@orderly.network/utils";
import type { GridHeaderState } from "./gridHeader.script";

export const GridHeader: React.FC<GridHeaderState> = (props) => {
  const { isMobile } = useScreen();
  return isMobile ? <MobileLayout {...props} /> : <DesktopLayout {...props} />;
};

const MobileLayout: React.FC<GridHeaderState> = (props) => {
  const { t } = useTranslation();

  return (
    <Flex
      direction={"column"}
      gap={2}
      width={"100%"}
      itemAlign={"start"}
      p={2}
      className="oui-rounded-b-xl oui-bg-base-9"
    >
      <Flex width={"100%"} justify={"between"}>
        <TotalStrategies
          classNames={{
            label: "oui-text-2xs oui-text-base-contrast-54",
            root: "oui-text-sm",
          }}
          {...props}
        />
        <TotalGridProfit
          classNames={{
            label: "oui-text-2xs oui-text-base-contrast-54",
            root: "oui-text-sm",
          }}
          {...props}
        />
      </Flex>
      <Divider className="oui-w-full" />
      <Flex width={"100%"} justify={"end"}>
        <Button
          variant="text"
          size="xs"
          onClick={() => props.refetch()}
          disabled={props.loading}
        >
          <RefreshIcon
            className={`w-3 h-3 ${props.loading ? "animate-spin" : ""}`}
          />
          {t("common.refresh")}
        </Button>
      </Flex>
    </Flex>
  );
};

const DesktopLayout: React.FC<GridHeaderState> = (props) => {
  const { t } = useTranslation();

  return (
    <Flex py={2} px={3} gap={6} width={"100%"} justify={"between"}>
      <Flex gap={6}>
        <TotalStrategies
          {...props}
          classNames={{ label: "oui-text-base-contrast-54" }}
        />
        <TotalGridProfit
          {...props}
          classNames={{ label: "oui-text-base-contrast-54" }}
        />
      </Flex>
      <Button
        variant="text"
        size="xs"
        onClick={() => props.refetch()}
        disabled={props.loading}
      >
        <RefreshIcon
          className={`w-3 h-3 ${props.loading ? "animate-spin" : ""}`}
        />
        {t("common.refresh")}
      </Button>
    </Flex>
  );
};

const TotalStrategies: React.FC<
  GridHeaderState & {
    classNames?: { root?: string; label?: string; value?: string };
  }
> = (props) => {
  const { t } = useTranslation();

  return (
    <Statistic
      label={t("strategy.totalStrategies")}
      classNames={props.classNames}
    >
      <Text intensity={80} className="oui-text-base-contrast-80">
        {props.loading ? "--" : props.totalStrategies}
      </Text>
    </Statistic>
  );
};

const TotalGridProfit: React.FC<
  GridHeaderState & {
    classNames?: { root?: string; label?: string; value?: string };
  }
> = (props) => {
  const { t } = useTranslation();

  const profitClassName =
    props.totalGridProfit >= 0
      ? "oui-text-trade-profit"
      : "oui-text-trade-loss";

  return (
    <Statistic
      label={t("strategy.totalGridProfit")}
      classNames={props.classNames}
    >
      <Text.numeral
        dp={2}
        rm={Decimal.ROUND_DOWN}
        intensity={80}
        className={
          props.loading ? "oui-text-base-contrast-80" : profitClassName
        }
      >
        {props.loading ? "--" : props.totalGridProfit}
      </Text.numeral>
    </Statistic>
  );
};
