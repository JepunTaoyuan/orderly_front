import { FC } from "react";
import { useTranslation } from "@orderly.network/i18n";
import {
  Flex,
  Text,
  ArrowDownSquareFillIcon,
  ArrowUpSquareFillIcon,
  CalendarMinusIcon,
  ArrowLeftRightIcon,
} from "@orderly.network/ui";
import { RouterAdapter } from "@/packages/ui-scaffold";
import { PortfolioLeftSidebarPath } from "../../../layout";

type Props = {
  disabled: boolean;
  onWithdraw?: () => void;
  onDeposit?: () => void;
  onTransfer?: () => void;
  isMainAccount?: boolean;
  routerAdapter?: RouterAdapter;
  hasSubAccount?: boolean;
};

export const PortfolioHandleMobile: FC<Props> = (props) => {
  const { t } = useTranslation();

  const onGotoHistory = () => {
    props.routerAdapter?.onRouteChange({
      href: PortfolioLeftSidebarPath.History,
      name: t("trading.history"),
    });
  };

  return (
    <Flex
      direction={"row"}
      width={"100%"}
      height={"71px"}
      className="oui-gap-3 oui-bg-transparent"
    >
      {props.isMainAccount && (
        <Flex
          direction="column"
          itemAlign={"center"}
          className="oui-flex-1 oui-cursor-pointer"
          onClick={props?.onDeposit}
        >
          <div className="oui-flex oui-size-[48px] oui-items-center oui-justify-center oui-rounded-xl">
            {/* <ArrowDownSquareFillIcon size={28} color="white" opacity={1} /> */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.68213 21H20.5912"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16.5 11.5C16.5 11.5 13.1858 16 11.9999 16C10.8141 16 7.5 11.5 7.5 11.5M11.9999 15V3"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <Text className="oui-text-base-80 oui-text-2xs">
            {t("common.deposit")}
          </Text>
        </Flex>
      )}
      {props.hasSubAccount && (
        <Flex
          direction="column"
          itemAlign={"center"}
          className="oui-flex-1 oui-cursor-pointer"
          onClick={props?.onTransfer}
        >
          <div className="oui-flex oui-size-[48px] oui-items-center oui-justify-center oui-rounded-xl">
            {/* <ArrowLeftRightIcon size={28} color="white" opacity={1} /> */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.3179 2.99976L3.40878 2.99975"
                stroke="white"
                stroke-opacity="0.7"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.50021 12.4997C7.50021 12.4997 10.8144 7.99972 12.0003 7.99972C13.1861 7.99972 16.5002 12.4997 16.5002 12.4997M12.0003 8.99972L12.0003 20.9998"
                stroke="white"
                stroke-opacity="0.7"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <Text className="oui-text-base-80 oui-text-2xs">
            {t("common.transfer")}
          </Text>
        </Flex>
      )}
      {props.isMainAccount && (
        <Flex
          direction="column"
          itemAlign={"center"}
          className="oui-flex-1 oui-cursor-pointer"
          onClick={props?.onWithdraw}
        >
          <div className="oui-flex oui-size-[48px] oui-items-center oui-justify-center oui-rounded-xl">
            {/* <ArrowUpSquareFillIcon size={28} color="white" opacity={1} /> */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 9H6.65856C5.65277 9 5.14987 9 5.02472 8.69134C4.89957 8.38268 5.25517 8.01942 5.96637 7.29289L8.21091 5"
                stroke="white"
                stroke-opacity="0.7"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5 15H17.3414C18.3472 15 18.8501 15 18.9753 15.3087C19.1004 15.6173 18.7448 15.9806 18.0336 16.7071L15.7891 19"
                stroke="white"
                stroke-opacity="0.7"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <Text className="oui-text-base-80 oui-text-2xs">
            {t("common.withdraw")}
          </Text>
        </Flex>
      )}
      <Flex
        direction="column"
        itemAlign={"center"}
        className="oui-flex-1 oui-cursor-pointer"
      >
        <div
          className="oui-flex oui-size-[48px] oui-items-center oui-justify-center oui-rounded-xl"
          onClick={onGotoHistory}
        >
          {/* <CalendarMinusIcon
            size={28}
            color="white"
            opacity={1}
            viewBox="0 0 28 28"
            className="oui-w-[28px] oui-h-[28px]"
          /> */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.9999 10.5V9.99995C18.9999 6.22876 18.9998 4.34311 17.8283 3.17154C16.6567 2 14.7711 2 10.9999 2C7.22883 2 5.3432 2.00006 4.17163 3.17159C3.00009 4.34315 3.00007 6.22872 3.00004 9.99988L3 14.5C2.99997 17.7874 2.99996 19.4312 3.90788 20.5375C4.07412 20.7401 4.25986 20.9258 4.46243 21.0921C5.56877 22 7.21249 22 10.4999 22"
              stroke="white"
              stroke-opacity="0.7"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7 7H15M7 11H11"
              stroke="white"
              stroke-opacity="0.7"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M18 18.5L16.5 17.95V15.5M12 17.5C12 19.9853 14.0147 22 16.5 22C18.9853 22 21 19.9853 21 17.5C21 15.0147 18.9853 13 16.5 13C14.0147 13 12 15.0147 12 17.5Z"
              stroke="white"
              stroke-opacity="0.7"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <Text className="oui-text-base-80 oui-text-2xs">
          {t("trading.history")}
        </Text>
      </Flex>
    </Flex>
  );
};
