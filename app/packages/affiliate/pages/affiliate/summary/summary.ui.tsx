import { FC } from "react";
import { useTranslation } from "@orderly.network/i18n";
import {
  Divider,
  Flex,
  Select,
  Text,
  useMediaQuery,
} from "@orderly.network/ui";
import { commifyOptional } from "@orderly.network/utils";
import { USDCIcon } from "../../../components/usdcIcon";
import { SummaryReturns } from "./summary.script";

export const Summary: FC<SummaryReturns> = (props) => {
  const { t } = useTranslation();
  const is5XL = useMediaQuery("(min-width:1920px)");
  return (
    <Flex
      id="oui-affiliate-affiliate-summary"
      r={"md"}
      p={is5XL ? 6 : 3}
      width={"100%"}
      height={"100%"}
      gap={6}
      direction={"column"}
      className="oui-bg-base-9"
    >
      <Title {...props} />
      <CommissionData {...props} />
      <Divider intensity={8} className="oui-w-full" />
      <Flex direction={"row"} width={"100%"} gap={4}>
        <Row
          title={`${t("affiliate.referralVol")} (USDC)`}
          value={props.referralVol}
          dp={2}
          {...props}
        />
        <Divider
          intensity={8}
          direction="vertical"
          className="oui-h-12 oui-py-2"
        />
        <Row
          title={t("affiliate.referees")}
          value={props.referees}
          dp={0}
          {...props}
        />
        <Divider
          intensity={8}
          direction="vertical"
          className="oui-h-12 oui-py-2"
        />
        <Row
          title={t("affiliate.summary.refereesTraded")}
          value={props.refereesTades}
          dp={0}
          {...props}
        />
      </Flex>
    </Flex>
  );
};

const Title: FC<SummaryReturns> = (props) => {
  const { t } = useTranslation();

  return (
    <Flex direction={"row"} width={"100%"} gapX={3}>
      <Text className="oui-text-lg">{t("affiliate.summary")}</Text>
      <div className={"oui-min-w-14"}>
        <Select.options
          size={"xs"}
          value={props.period}
          onValueChange={props.onPeriodChange}
          options={props.periodTypes}
        />
      </div>
    </Flex>
  );
};

const CommissionData: FC<SummaryReturns> = (props) => {
  const { t } = useTranslation();

  return (
    <Flex
      // gradient="primary"
      // angle={180}
      r="xl"
      py={2}
      // px={6}
      width={"100%"}
      direction={"column"}
      gap={3}
      height={"100%"}
      className="oui-max-h-[104px]"
      itemAlign={"start"}
    >
      <Text intensity={54} className="oui-text-base 2xl:oui-text-lg">
        {/* {`${t("affiliate.commission")} (USDC)`} */}
        {`${t("affiliate.commission")}`}
      </Text>
      <Flex
        direction={"row"}
        gap={3}
        className="oui-text-xl md:oui-text-2xl xl:oui-text-3xl"
        itemAlign="center"
      >
        <USDCIcon className="md:oui-w-[24px] md:oui-h-[23px] lg:oui-w-[28px] lg:oui-h-[28px] " />
        <Text>
          {commifyOptional(props.commission, { fix: 2, fallback: "0" })}
          <Text size={"sm"} className="oui-text-base-contrast-36 oui-px-2">
            USDC
          </Text>
        </Text>
      </Flex>
    </Flex>
  );
};

const Row: FC<
  SummaryReturns & {
    title: string;
    value: number;
    dp: number;
  }
> = (props) => {
  console.log(props);

  return (
    <Flex
      direction={"column"}
      width={"100%"}
      itemAlign={"start"}
      className="oui-py-2"
    >
      <Text
        intensity={54}
        className="oui-text-2xs md:oui-text-xs xl:oui-text-sm"
      >
        {props.title.replace(/\.?\(USDC\)/, "")}
      </Text>
      <Text className="oui-text-xs md:oui-text-sm xl:oui-text-base">
        {commifyOptional(props.value, { fix: props.dp, fallback: "0" })}
        {props.title === "Referral vol. (USDC)" && (
          <Text size={"sm"} className="oui-text-base-contrast-36 oui-px-2">
            USDC
          </Text>
        )}
      </Text>
    </Flex>
  );
};
