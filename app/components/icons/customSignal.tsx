import React from "react";
import { BaseIconProps } from "@orderly.network/ui";

// import { BaseIcon, BaseIconProps } from "./baseIcon";

export const CustomSignalIcon = React.forwardRef<SVGSVGElement, BaseIconProps>(
  (props, ref) => {
    const { size = 14, ...rest } = props;
    return (
      <svg
        width="13"
        height="11"
        viewBox="0 0 14 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect y="9" width="2" height="3" rx="1" fill="#46CCB9" />
        <rect x="4" y="6" width="2" height="6" rx="1" fill="#46CCB9" />
        <rect x="8" y="3" width="2" height="9" rx="1" fill="#46CCB9" />
        <rect x="12" width="2" height="12" rx="1" fill="#46CCB9" />
      </svg>
    );
  },
);

CustomSignalIcon.displayName = "CustomSignalIcon";
