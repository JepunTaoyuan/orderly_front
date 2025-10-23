import { FC, useMemo } from "react";
import { Box, Select } from "@orderly.network/ui";

interface DesktopDepthSelectProps {
  depths: string[];
  value?: string;
  onChange?: (depth: number) => void;
}

export const DesktopDepthSelect: FC<DesktopDepthSelectProps> = (props) => {
  const options = useMemo(() => {
    return props.depths.map((d) => ({
      value: d,
      label: `${d}`,
    }));
  }, [props.depths]);

  return (
    <Box pl={3} width={97} className="oui-py-[10px]">
      <Select.options
        options={options}
        size={"xs"}
        value={props.value}
        onValueChange={(value: any) => {
          props.onChange?.(value);
        }}
      />
    </Box>
  );
};
