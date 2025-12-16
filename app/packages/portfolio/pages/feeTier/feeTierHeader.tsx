/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { useFeeState, useMediaQuery } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import {
  Box,
  Flex,
  Grid,
  modal,
  Text,
  Tooltip,
  useModal,
  useScreen,
  Divider,
} from "@orderly.network/ui";
import { Decimal } from "@orderly.network/utils";
import { RouterAdapter, useScaffoldContext } from "@/packages/ui-scaffold";
import { useLayoutContext } from "../../layout/context";
import { EffectiveFee } from "./icons";

export type FeeTierHeaderItemProps = {
  label: string;
  value: React.ReactNode;
  interactive?: boolean;
};

export type FeeTierHeaderProps = {
  tier?: number | null;
  vol?: number | null;
  headerDataAdapter?: (original: any[]) => any[];
};

const isEffective = (val?: unknown) =>
  typeof val !== "undefined" && val !== null;

const EffectiveFeeDialog: React.FC<{
  routerAdapter: RouterAdapter | undefined;
}> = (props) => {
  const { routerAdapter } = props;
  const { t } = useTranslation();
  const { hide } = useModal();
  return (
    <Text size="2xs" className="oui-whitespace-normal oui-break-words">
      {t("portfolio.feeTier.effectiveFee.tooltip")}{" "}
      <a
        href="/rewards/affiliate"
        onClick={(e) => {
          e.preventDefault();
          routerAdapter?.onRouteChange({
            href: "/rewards/affiliate",
            name: t("portfolio.feeTier.effectiveFee.tooltipLink"),
          });
          hide();
        }}
        className="oui-cursor-pointer oui-border-none oui-bg-transparent oui-p-0 oui-text-2xs oui-underline hover:oui-text-base-contrast-80"
      >
        {t("portfolio.feeTier.effectiveFee.tooltipLink")}
      </a>
    </Text>
  );
};

export const MobileHeaderItem: React.FC<FeeTierHeaderItemProps> = (props) => {
  const { label, value, interactive } = props;
  const { t } = useTranslation();
  const { routerAdapter } = useLayoutContext();
  return (
    <Flex justify="between" itemAlign="center" width="100%">
      <Text
        as="div"
        intensity={36}
        size="xs"
        weight="semibold"
        className="oui-leading-[18px]"
      >
        {label}
      </Text>
      <Flex className="oui-gap-1.5" itemAlign="center" justify="between">
        <Text size="xs" intensity={80} className="oui-leading-[24px]">
          {value}
        </Text>
        {interactive && (
          <Flex
            gap={1}
            justify="center"
            itemAlign="center"
            className="oui-cursor-pointer oui-rounded oui-bg-gradient-to-r oui-from-[rgb(var(--oui-gradient-brand-start)_/_0.12)] oui-to-[rgb(var(--oui-gradient-brand-end)_/_0.12)] oui-px-1"
            onClick={() => {
              modal.dialog({
                size: "sm",
                title: t("common.tips"),
                content: <EffectiveFeeDialog routerAdapter={routerAdapter} />,
              });
            }}
          >
            <EffectiveFee />
            <Text.gradient
              className="oui-select-none"
              color={"brand"}
              size="3xs"
              weight="regular"
            >
              {t("common.effectiveFee")}
            </Text.gradient>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export const DesktopHeaderItem: React.FC<FeeTierHeaderItemProps> = (props) => {
  const { label, value, interactive } = props;
  const { t } = useTranslation();
  const { routerAdapter } = useScaffoldContext();
  return (
    <Box
      r="sm"
      p={5}
      angle={184}
      width="300px"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
    >
      <Flex itemAlign="center" justify="between">
        <Text
          as="div"
          intensity={36}
          size="2xs"
          weight="semibold"
          className="oui-leading-[18px]"
        >
          {label}
        </Text>
        {interactive && (
          <Tooltip
            content={
              <Text
                size="2xs"
                className="oui-whitespace-normal oui-break-words"
              >
                {t("portfolio.feeTier.effectiveFee.tooltip")}{" "}
                <a
                  href="/rewards/affiliate"
                  onClick={(e) => {
                    e.preventDefault();
                    routerAdapter?.onRouteChange({
                      href: "/rewards/affiliate",
                      name: t("portfolio.feeTier.effectiveFee.tooltipLink"),
                    });
                  }}
                  className="oui-cursor-pointer oui-border-none oui-bg-transparent oui-p-0 oui-text-2xs oui-underline hover:oui-text-base-contrast-80"
                >
                  {t("portfolio.feeTier.effectiveFee.tooltipLink")}
                </a>
              </Text>
            }
            className="oui-p-1.5 oui-text-base-contrast-54"
          >
            <Flex
              gap={1}
              justify="center"
              itemAlign="center"
              className="oui-cursor-pointer oui-rounded oui-bg-gradient-to-r oui-from-[rgb(var(--oui-gradient-brand-start)_/_0.12)] oui-to-[rgb(var(--oui-gradient-brand-end)_/_0.12)] oui-px-1"
            >
              <EffectiveFee />
              <Text.gradient
                className="oui-select-none"
                color={"brand"}
                size="xs"
                weight="regular"
              >
                {t("common.effectiveFee")}
              </Text.gradient>
            </Flex>
          </Tooltip>
        )}
      </Flex>
      <Flex className="oui-mt-1 oui-w-full">
        <Text size="base" intensity={80} className="oui-leading-[24px]">
          {value}
        </Text>
      </Flex>
    </Box>
  );
};

export const FeeTierHeader: React.FC<FeeTierHeaderProps> = (props) => {
  const { t } = useTranslation();
  const { tier, vol, headerDataAdapter } = props;
  const { isMobile } = useScreen();
  const { refereeRebate, ...others } = useFeeState();
  const isEffectiveFee = isEffective(refereeRebate);
  const isSmallScreen = useMediaQuery("(max-width: 615px)");
  const items: FeeTierHeaderItemProps[] = [
    {
      label: t("portfolio.feeTier.header.yourTier"),
      interactive: false,
      value: <Text size={isMobile ? "xs" : "base"}>{tier || "--"}</Text>,
    },
    {
      label: `${t("portfolio.feeTier.header.30dVolume")} (USDC)`,
      interactive: false,
      value: (
        <Text.numeral
          rule="price"
          dp={2}
          rm={Decimal.ROUND_DOWN}
          size={isMobile ? "xs" : "base"}
        >
          {vol !== undefined && vol !== null ? `${vol}` : "-"}
        </Text.numeral>
      ),
    },
    {
      label: t("portfolio.feeTier.header.takerFeeRate"),
      interactive: isEffectiveFee,
      value: (
        <Flex>
          <Text size={isMobile ? "xs" : "base"}>
            {isEffectiveFee
              ? others.effectiveTakerFee || "--"
              : others.takerFee || "--"}{" "}
          </Text>
          <Divider
            direction="vertical"
            className="oui-h-4"
            mx={2}
            intensity={10}
            style={{ borderColor: "rgba(227, 231, 234, 0.1)" }}
          />
          <Text
            style={{ color: "rgba(201, 189, 255, 1)" }}
            size={isMobile ? "xs" : "base"}
          >
            (RWA:{" "}
            {(isEffectiveFee
              ? others.rwaEffectiveTakerFee
              : others.rwaTakerFee) || "--"}
            )
          </Text>
        </Flex>
      ),
    },
    {
      label: t("portfolio.feeTier.header.makerFeeRate"),
      interactive: isEffectiveFee,
      value: (
        <Flex>
          <Text size={isMobile ? "xs" : "base"}>
            {isEffectiveFee
              ? others.effectiveMakerFee || "--"
              : others.makerFee || "--"}{" "}
          </Text>
          <Divider
            direction="vertical"
            className="oui-h-4"
            mx={2}
            intensity={10}
            style={{ borderColor: "rgba(227, 231, 234, 0.1)" }}
          />
          <Text
            style={{ color: "rgba(201, 189, 255, 1)" }}
            size={isMobile ? "xs" : "base"}
          >
            (RWA:{" "}
            {(isEffectiveFee
              ? others.rwaEffectiveMakerFee
              : others.rwaMakerFee) || "--"}
            )
          </Text>
        </Flex>
      ),
    },
  ];

  const mergedData = useMemo<FeeTierHeaderItemProps[]>(() => {
    if (typeof headerDataAdapter === "function") {
      return headerDataAdapter(items);
    }
    return items;
  }, [headerDataAdapter, items]);

  if (!Array.isArray(mergedData)) {
    return null;
  }

  if (isMobile) {
    return (
      <Grid
        className="oui-auto-rows-fr oui-rounded-sm oui-border oui-border-base-6"
        style={{
          padding: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
        }}
        width={"100%"}
      >
        {mergedData.map((item, index) => (
          <MobileHeaderItem {...item} key={`mobile-item-${index}`} />
        ))}
      </Grid>
    );
  }

  return (
    <Flex
      width="100%"
      direction="column"
      gap={1}
      itemAlign={"stretch"}
      justify="between"
      className="oui-relative"
      style={{ marginTop: "-47px" }}
    >
      {mergedData.map((item, index) => (
        <DesktopHeaderItem {...item} key={`desktop-item-${index}`} />
      ))}
    </Flex>
  );
};
