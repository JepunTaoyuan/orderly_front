import { FC, SVGProps, forwardRef, useEffect, useRef } from "react";
import { qrcode as qr } from "@akamfoad/qr";
import { Trans, useTranslation } from "@orderly.network/i18n";
import {
  cn,
  CopyIcon,
  Flex,
  SimpleDialog,
  SimpleDialogFooter,
  SimpleDialogFooterProps,
  Text,
  Tooltip,
} from "@orderly.network/ui";
import { MainLogo } from "../mainLogo";
import { UseLinkDeviceScriptReturn } from "./linkDevice.script";

export type LinkDeviceProps = UseLinkDeviceScriptReturn;

export const LinkDevice: FC<LinkDeviceProps> = (props) => {
  const { t } = useTranslation();
  const isLandingPage =
    location.pathname === "/" || location.pathname.includes("landing");
  return (
    <>
      <Tooltip content={t("linkDevice.tooltip")}>
        <LinkDeviceIcon
          className="oui-cursor-pointer oui-transition-colors"
          style={{
            color: isLandingPage ? "rgba(0, 0, 0, 0.8)" : "white",
          }}
          onClick={props.showDialog}
        />
      </Tooltip>

      <SimpleDialog
        classNames={{
          content: "oui-bg-base-10",
        }}
        title={<Text weight="semibold">{t("common.confirm")}</Text>}
        open={props.open}
        onOpenChange={props.onOpenChange}
        size="sm"
        contentProps={{
          onInteractOutside: (e) => {
            const el = document.querySelector("#privy-dialog");
            if (el) {
              e.preventDefault();
            }
          },
        }}
      >
        <LinkDeviceContent {...props} />
      </SimpleDialog>
    </>
  );
};

export const LinkDeviceContent: FC<LinkDeviceProps> = (props) => {
  if (props.loading) {
    return <Loading />;
  }

  if (props.confirm) {
    return (
      <QRCode
        hideDialog={props.hideDialog}
        seconds={props.seconds}
        url={props.url}
        copyUrl={props.copyUrl}
      />
    );
  }

  return (
    <LinkDeviceConfirm
      hideDialog={props.hideDialog}
      onConfirm={props.onConfirm}
    />
  );
};

type QRCodeProps = Pick<
  LinkDeviceProps,
  "seconds" | "hideDialog" | "copyUrl"
> & {
  url?: string;
};

const QRCode: FC<QRCodeProps> = (props) => {
  const { t } = useTranslation();
  const actions: SimpleDialogFooterProps["actions"] = {
    primary: {
      label: t("common.ok"),
      onClick: props.hideDialog,
      size: "md",
    },
  };

  return (
    <Flex direction="column" gapY={3}>
      <Text size="base" intensity={98}>
        {t("linkDevice.scanQRCode")}
      </Text>
      <Text
        size="2xs"
        intensity={54}
        weight="regular"
        className="oui-text-center"
      >
        {/* @ts-ignore */}
        <Trans i18nKey="linkDevice.createQRCode.success.description" />
      </Text>

      <Text size="sm" intensity={54}>
        {`${t("common.countdown")}: `}
        <Text.gradient color="brand" className="oui-tabular-nums">
          {props.seconds}s
        </Text.gradient>
      </Text>

      <Flex
        className={cn(
          "oui-w-[240px] oui-h-[240px] ",
          "oui-border oui-border-base-contrast-20 oui-rounded-2xl",
        )}
        justify="center"
        itemAlign="center"
      >
        <Flex
          className="oui-w-[220px] oui-h-[220px] oui-rounded-lg oui-bg-white"
          justify="center"
          itemAlign="center"
        >
          <QRCodeCanvas width={196} height={196} content={props.url} />
        </Flex>
      </Flex>

      <Flex
        direction="row"
        gap={1}
        className={cn(
          "oui-cursor-pointer",
          "oui-group oui-text-base-contrast-54 hover:oui-text-base-contrast",
        )}
        onClick={props.copyUrl}
      >
        <CopyIcon
          size={16}
          opacity={1}
          className="oui-text-base-contrast-54 group-hover:oui-text-base-contrast"
        />
        <Text size="2xs" weight="regular">
          {t("linkDevice.createQRCode.success.copyUrl")}
        </Text>
      </Flex>

      <SimpleDialogFooter
        actions={actions}
        className="oui-w-full oui-p-0 !oui-pt-8"
      />
    </Flex>
  );
};

type QRCodeCanvasProps = {
  width: number;
  height: number;
  content?: string;
};

const QRCodeCanvas: FC<QRCodeCanvasProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !props.content) return;

    const qrcode = qr(props.content);
    const width = props.width;
    const height = props.height;

    const ctx = canvasRef.current.getContext("2d")!;

    const cells = qrcode.modules!;

    const tileW = width / cells.length;
    const tileH = height / cells.length;

    for (let r = 0; r < cells.length; ++r) {
      const row = cells[r];
      for (let c = 0; c < row.length; ++c) {
        ctx.fillStyle = row[c] ? "#000" : "#fff";
        const w = Math.ceil((c + 1) * tileW) - Math.floor(c * tileW);
        const h = Math.ceil((r + 1) * tileH) - Math.floor(r * tileH);
        ctx.fillRect(Math.round(c * tileW), Math.round(r * tileH), w, h);
      }
    }
  }, [canvasRef, props.content]);

  return <canvas width={props.width} height={props.height} ref={canvasRef} />;
};

type LinkDeviceConfirmProps = Pick<LinkDeviceProps, "hideDialog" | "onConfirm">;

const LinkDeviceConfirm: FC<LinkDeviceConfirmProps> = (props) => {
  const { t } = useTranslation();

  const actions: SimpleDialogFooterProps["actions"] = {
    secondary: {
      label: t("common.cancel"),
      onClick: props.hideDialog,
      className: "oui-flex-1",
      size: "md",
    },
    primary: {
      label: t("common.confirm"),
      onClick: props.onConfirm,
      className: "oui-flex-1",
      size: "md",
    },
  };

  return (
    <Flex direction="column">
      <svg
        height="16"
        viewBox="0 0 105 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ cursor: "pointer" }}
      >
        <path
          d="M9.80078 1.38672C11.2002 2.55701 11.9199 4.45012 11.9199 7C11.9199 11.54 9.63981 14 5.2998 14H0V11.7578L9.80078 1.38672ZM77.5977 0.824219C80.1398 0.824377 81.6689 2.07877 81.6689 3.86523H80.6553C80.5694 2.62839 79.5212 1.7344 77.5801 1.73438C75.6389 1.73438 74.6943 2.6456 74.6943 3.95117C74.6945 5.13624 75.5016 5.8924 77.1162 6.21875L78.6455 6.52734C80.827 6.99119 82.0469 7.86787 82.0469 9.74023C82.0467 11.8702 80.4488 13.1757 77.752 13.1758C74.8489 13.1758 73.2511 11.6641 73.251 9.6543H74.2988C74.3848 11.2173 75.5185 12.2655 77.7686 12.2656C79.8471 12.2656 80.9638 11.2861 80.9639 9.77441C80.9639 8.34871 80.0196 7.69556 78.3535 7.36914L76.8242 7.06055C74.6771 6.63112 73.6115 5.58289 73.6113 3.95117C73.6113 2.0787 75.0037 0.824219 77.5977 0.824219ZM88.6885 0.824219C91.2822 0.824232 92.6218 2.09522 92.6221 3.74414H91.918C91.8319 2.54183 90.9386 1.49415 88.6885 1.49414C86.4896 1.49414 85.5449 2.49094 85.5449 3.86523C85.5451 5.0847 86.301 5.90922 88.1904 6.28711L89.7363 6.59668C91.5572 6.95744 93 7.7644 93 9.80859C93 11.8184 91.5746 13.1756 88.792 13.1758C85.8373 13.1758 84.4453 11.6293 84.4453 9.75684H85.1494C85.2353 11.3029 86.3693 12.5058 88.8086 12.5059C91.1619 12.5059 92.2616 11.4064 92.2617 9.82617C92.2617 8.17718 91.0593 7.5241 89.4619 7.21484L87.9326 6.90527C85.6996 6.44149 84.8058 5.3424 84.8057 3.86523C84.8057 2.11301 86.043 0.824219 88.6885 0.824219ZM21.8672 0.978516C25.5606 0.978516 27.5537 3.12602 27.5537 6.99121C27.5537 10.8563 25.5605 13.0039 21.8672 13.0039H16.9199V0.978516H21.8672ZM38.2236 3.48633H32.7266V5.82324H37.708V8.05566H32.7266V10.4951H38.3955V13.0039H29.8574V0.978516H38.2236V3.48633ZM54.9385 11.4404H60.9004V13.0039H53.1523V0.978516H54.9385V11.4404ZM70.917 2.23242H64.6807V6.25195H70.4014V7.40332H64.6807V11.75H71.0889V13.0039H63.2725V0.978516H70.917V2.23242ZM20.167 10.1865H21.5234C23.6364 10.1865 24.2207 9.32738 24.2207 6.99121C24.2207 4.63774 23.6364 3.7959 21.5234 3.7959H20.167V10.1865ZM5.2998 0C6.30736 0 7.20358 0.134116 7.98633 0.394531L0 8.8457V0H5.2998Z"
          fill="white"
        />
        <path
          d="M46.9348 6.81143L51 13H48.1304L45.5 9.00571L42.8696 13H40L44.0652 6.81143L40.2391 1H43.1087L45.5 4.63429L47.8913 1H50.7609L46.9348 6.81143Z"
          fill="#AAD704"
        />
      </svg>
      <Text size="base" intensity={98} className="oui-mt-5">
        {t("linkDevice.createQRCode.linkMobileDevice")}
      </Text>
      <Text
        size="2xs"
        intensity={54}
        weight="regular"
        className="oui-text-center oui-mt-3"
      >
        {/* @ts-ignore */}
        <Trans
          i18nKey="linkDevice.createQRCode.linkMobileDevice.description"
          values={{
            hostname: window.location.hostname,
          }}
        />
      </Text>
      <SimpleDialogFooter
        actions={actions}
        className="oui-w-full oui-p-0 !oui-pt-8"
      />
    </Flex>
  );
};

const Loading = () => {
  const { t } = useTranslation();

  return (
    <Flex direction="column" gap={5}>
      <Spinner />
      <Text size="sm" intensity={98}>
        {t("linkDevice.createQRCode.loading.description")}
      </Text>
    </Flex>
  );
};

const Spinner = () => {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="oui-animate-spin"
    >
      <path
        d="M11.4858 52.1631C10.4698 52.5965 9.28872 52.1259 8.91766 51.0855C7.68926 47.6412 7.04029 44.0121 7.00182 40.3463C6.95634 36.0129 7.76483 31.713 9.38113 27.6921C10.9974 23.6712 13.3899 20.0079 16.4219 16.9116C18.9868 14.2923 21.967 12.122 25.2375 10.4861C26.2253 9.99202 27.4035 10.4698 27.8369 11.4858L28.8571 13.8773C29.2904 14.8933 28.8139 16.0615 27.8336 16.5706C25.3569 17.8567 23.0959 19.5294 21.1375 21.5293C18.7119 24.0064 16.7979 26.9369 15.5049 30.1537C14.2119 33.3704 13.5651 36.8103 13.6015 40.277C13.6308 43.076 14.1051 45.8482 15.0026 48.4906C15.3579 49.5365 14.8933 50.7096 13.8773 51.143L11.4858 52.1631Z"
        fill="url(#paint0_linear_177_6754)"
      />
      <path
        d="M73 40C73 58.2254 58.2254 73 40 73C21.7746 73 7 58.2254 7 40C7 21.7746 21.7746 7 40 7C58.2254 7 73 21.7746 73 40ZM13.6 40C13.6 54.5803 25.4197 66.4 40 66.4C54.5803 66.4 66.4 54.5803 66.4 40C66.4 25.4197 54.5803 13.6 40 13.6C25.4197 13.6 13.6 25.4197 13.6 40Z"
        fill="white"
        fillOpacity="0.06"
      />
      <defs>
        <linearGradient
          id="paint0_linear_177_6754"
          x1="73"
          y1="40"
          x2="7"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="rgb(91 33 182)" />
          <stop offset="1" stopColor="rgb(91 33 182)" />
          {/* <stop stopColor="rgb(var(--oui-gradient-brand-end))" />
          <stop offset="1" stopColor="rgb(var(--oui-gradient-brand-start))" /> */}
        </linearGradient>
      </defs>
    </svg>
  );
};

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export const LinkDeviceIcon = forwardRef<SVGSVGElement, IconProps>(
  (props, ref) => {
    const { size = 20, viewBox, ...rest } = props;
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
      >
        <path d="M19.167 7.583a1.74 1.74 0 0 0-1.731-1.75h-4.038a1.74 1.74 0 0 0-1.731 1.75v8.167c0 .967.775 1.75 1.73 1.75h4.039a1.74 1.74 0 0 0 1.73-1.75zm-1.154 0v7.584H12.82V7.583A.58.58 0 0 1 13.398 7h4.038a.58.58 0 0 1 .577.583m-2.02 8.75a.58.58 0 0 1-.576.584.58.58 0 0 1-.577-.584.58.58 0 0 1 .577-.583.58.58 0 0 1 .577.583" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.666 5a2.5 2.5 0 0 1 2.5-2.5h10a2.5 2.5 0 0 1 2.5 2.5.08.08 0 0 1-.078.078h-1.51a.08.08 0 0 1-.08-.078.834.834 0 0 0-.833-.833h-10A.834.834 0 0 0 3.333 5v5.633c0 .11.09.2.2.2h7.1c.11 0 .2.09.2.2V12.3a.2.2 0 0 1-.2.2H2.7a.2.2 0 0 0-.2.2v.633c0 .511.308.834.834.834h7.3c.11 0 .2.09.2.2v1.266a.2.2 0 0 1-.2.2h-7.3c-1.465 0-2.5-1.086-2.5-2.5v-1.666c0-.392.27-.72.635-.81.107-.026.198-.113.198-.224z"
        />
      </svg>
    );
  },
);
