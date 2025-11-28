import { Box, Flex, Text } from "@orderly.network/ui";

export const OrderlyChartTooltip = (props: {
  label: string;
  value: string | number;
  unit?: string;
  prefix?: React.ReactNode;
  titleClassName?: string;
  coloring?: boolean;
  dp?: number;
  rm?: number;
}) => {
  const {
    label,
    value,
    prefix,
    unit = "USDC",
    coloring = false,
    dp,
    rm,
  } = props;
  return (
    <Box intensity={900} p={3} r="md">
      <Flex direction="column" className="oui-px-2">
        <Flex direction={"row"} className={props.titleClassName}>
          {prefix}
          <Text.numeral
            unit={unit}
            as="div"
            size="xs"
            coloring={coloring}
            showIdentifier={coloring}
            unitClassName="oui-text-base-contrast-54 oui-ml-1"
            weight="semibold"
            rm={rm}
            dp={dp}
          >
            {value}
          </Text.numeral>
        </Flex>
        <Text size="xs" intensity={54}>
          {label}
        </Text>
      </Flex>
    </Box>
  );
};
