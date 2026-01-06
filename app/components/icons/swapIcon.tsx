import React, { FC, SVGProps } from "react";

export const SwapIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14.1667 2.5L17.5 5.83333L14.1667 9.16667"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 5.83333H17.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.83333 17.5L2.5 14.1667L5.83333 10.8333"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5 14.1667H2.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SwapActiveIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14.1667 2.5L17.5 5.83333L14.1667 9.16667"
      stroke="url(#swap_active_gradient)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 5.83333H17.5"
      stroke="url(#swap_active_gradient)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.83333 17.5L2.5 14.1667L5.83333 10.8333"
      stroke="url(#swap_active_gradient)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5 14.1667H2.5"
      stroke="url(#swap_active_gradient)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="swap_active_gradient"
        x1="2.5"
        y1="2.5"
        x2="17.5"
        y2="17.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#59B0FC" />
        <stop offset="1" stopColor="#26FEFE" />
      </linearGradient>
    </defs>
  </svg>
);
