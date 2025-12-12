import React, { FC, SVGProps } from "react";

export const TradingIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M7.08203 10C7.77239 10 8.33203 9.44036 8.33203 8.75C8.33203 8.05964 7.77239 7.5 7.08203 7.5C6.39168 7.5 5.83203 8.05964 5.83203 8.75C5.83203 9.44036 6.39168 10 7.08203 10Z"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <path
      d="M12.082 14.1665C12.7724 14.1665 13.332 13.6069 13.332 12.9165C13.332 12.2261 12.7724 11.6665 12.082 11.6665C11.3917 11.6665 10.832 12.2261 10.832 12.9165C10.832 13.6069 11.3917 14.1665 12.082 14.1665Z"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <path
      d="M15.418 7.5C16.1083 7.5 16.668 6.94036 16.668 6.25C16.668 5.55964 16.1083 5 15.418 5C14.7276 5 14.168 5.55964 14.168 6.25C14.168 6.94036 14.7276 7.5 15.418 7.5Z"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <path
      d="M12.8617 11.9136L15 7.5M7.98542 9.64033L11.0032 11.9136M2.5 15.8333L6.32464 9.89933"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <path
      d="M16.668 17.5H7.5013C4.75144 17.5 3.37651 17.5 2.52224 16.6457C1.66797 15.7914 1.66797 14.4165 1.66797 11.6667V2.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

//  Active 版本
export const TradingActiveIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M7.08203 10C7.77239 10 8.33203 9.44036 8.33203 8.75C8.33203 8.05964 7.77239 7.5 7.08203 7.5C6.39168 7.5 5.83203 8.05964 5.83203 8.75C5.83203 9.44036 6.39168 10 7.08203 10Z"
      fill="#C9BDFF"
      stroke="#C9BDFF"
      strokeWidth="0.833333"
    />
    <path
      d="M12.082 14.1665C12.7724 14.1665 13.332 13.6069 13.332 12.9165C13.332 12.2261 12.7724 11.6665 12.082 11.6665C11.3917 11.6665 10.832 12.2261 10.832 12.9165C10.832 13.6069 11.3917 14.1665 12.082 14.1665Z"
      fill="#C9BDFF"
      stroke="#C9BDFF"
      strokeWidth="0.833333"
    />
    <path
      d="M15.418 7.5C16.1083 7.5 16.668 6.94036 16.668 6.25C16.668 5.55964 16.1083 5 15.418 5C14.7276 5 14.168 5.55964 14.168 6.25C14.168 6.94036 14.7276 7.5 15.418 7.5Z"
      fill="#C9BDFF"
      stroke="#C9BDFF"
      strokeWidth="0.833333"
    />
    <path
      d="M12.8617 11.9136L15 7.5M7.98542 9.64033L11.0032 11.9136M2 16L6.32464 9.89933"
      stroke="#C9BDFF"
      strokeWidth="0.833333"
    />
    <path
      d="M16.668 17.5H7.5013C4.75144 17.5 3.37651 17.5 2.52224 16.6457C1.66797 15.7914 1.66797 14.4165 1.66797 11.6667V2.5"
      stroke="#C9BDFF"
      strokeWidth="0.833333"
      strokeLinecap="round"
    />
  </svg>
);
