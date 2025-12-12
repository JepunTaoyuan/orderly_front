import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "@orderly.network/i18n";
import { EMPTY_LIST } from "@orderly.network/types";
import { Divider, Flex, toast, Text } from "@orderly.network/ui";
import {
  PnLDisplayFormat,
  ReferralType,
  ShareEntity,
  ShareOptions,
  SharePnLOptions,
} from "../../types/types";
import { Poster } from "../poster";
import { PosterRef } from "../poster/poster";
import { getPnlInfo, getPnLPosterData, savePnlInfo } from "../utils/utils";
import { BottomButtons } from "./bottomBtns";
import { CarouselBackgroundImage } from "./carousel";
import { Message } from "./message";
import { ShareOption } from "./options";
import { PnlFormatView } from "./pnlFormat";

export const DesktopSharePnLContent: FC<{
  entity: ShareEntity;
  hide: any;
  baseDp?: number;
  quoteDp?: number;
  referral?: ReferralType;
  shareOptions: SharePnLOptions;
}> = (props) => {
  const { shareOptions } = props;
  const { t } = useTranslation();

  const localPnlConfig = getPnlInfo();
  const hasRoiAndPnl = props.entity.roi != null && props.entity.pnl != null;
  const formats: PnLDisplayFormat[] = hasRoiAndPnl
    ? ["roi_pnl", "roi", "pnl"]
    : props.entity.roi != null
      ? ["roi"]
      : props.entity.pnl != null
        ? ["pnl"]
        : [];

  const [pnlFormat, setPnlFormat] = useState<PnLDisplayFormat>(
    formats.length == 1 ? formats[0] : localPnlConfig.pnlFormat,
  );
  const [shareOption, setShareOption] = useState<Set<ShareOptions>>(
    new Set(localPnlConfig.options),
  );
  const [selectedSnap, setSelectedSnap] = useState(localPnlConfig.bgIndex);
  const [message, setMessage] = useState(localPnlConfig.message);
  const [check, setCheck] = useState(false);
  const { backgroundImages, ...resetOptions } = shareOptions ?? {
    backgroundImages: [],
  };

  const [domain, setDomain] = useState("");

  const posterRef = useRef<PosterRef | null>(null);

  useEffect(() => {
    const currentDomain = window.location.hostname;
    setDomain(currentDomain);
  }, []);

  const curBgImg = useMemo(() => {
    return shareOptions?.backgroundImages?.[selectedSnap];
  }, [shareOptions?.backgroundImages, selectedSnap]);

  const posterData = getPnLPosterData(
    props.entity,
    check ? message : "",
    domain,
    pnlFormat,
    shareOption,
    props.baseDp,
    props.quoteDp,
    props.referral,
  );

  const onCopy = () => {
    posterRef.current
      ?.copy()
      .then(() => {
        props.hide?.();
        toast.success(t("share.pnl.image.copied"));
      })
      .catch((e: any) => {
        toast.error(() => {
          return (
            <div>
              <div>{t("common.copy.failed")}</div>
              <div className="oui-mt-2 oui-max-w-[396px] oui-text-2xs oui-text-base-contrast-54">
                {t("share.pnl.copy.failed.description")}
              </div>
            </div>
          );
        });
      });
  };
  const onDownload = () => {
    posterRef.current?.download("Poster.png");
    props.hide?.();
  };

  // check if the entity has the option, like formats
  const options: ShareOptions[] = useMemo(() => {
    const mapping: ShareOptions[] = [
      "openPrice",
      "closePrice",
      "markPrice",
      "openTime",
      "closeTime",
      "leverage",
      "quantity",
    ];

    return mapping.filter((key) => !!props.entity[key]);
  }, [props.entity]);

  savePnlInfo(pnlFormat, shareOption, selectedSnap, message);

  return (
    <div className="oui-p-4 oui-bg-base-10 oui-rounded oui-flex oui-flex-col oui-gap-4">
      {/* Header Section */}
      <div className="oui-flex oui-flex-col">
        <div className="oui-flex oui-justify-between oui-items-center">
          <Text size="xs" weight="bold" className="oui-text-base-contrast">
            {t("customs.pnlTitle")}
          </Text>
        </div>

        {/* Poster Preview */}
        <div className="oui-flex oui-flex-col oui-gap-2.5 oui-pt-4">
          <Flex itemAlign={"center"} justify={"center"}>
            <Poster
              width={552}
              height={310}
              data={{
                backgroundImg: curBgImg,
                ...resetOptions,
                data: posterData,
              }}
              ratio={3}
              ref={posterRef}
              className="oui-rounded"
            />
          </Flex>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="oui-flex oui-justify-center oui-items-center oui-gap-3">
        <CarouselBackgroundImage
          backgroundImages={shareOptions?.backgroundImages ?? EMPTY_LIST}
          selectedSnap={selectedSnap}
          setSelectedSnap={setSelectedSnap}
        />
      </div>

      {/* Settings Section */}
      <div className="oui-flex oui-flex-col oui-gap-4">
        {/* PnL Display Format */}
        <div className="oui-flex oui-flex-col oui-gap-1">
          <Text size="xs" weight="semibold" intensity={60}>
            {t("share.pnl.displayFormat")}
          </Text>
          <Flex gap={4} itemAlign={"center"}>
            {formats.map((e, index) => (
              <PnlFormatView
                key={index}
                setPnlFormat={setPnlFormat}
                type={e}
                curType={pnlFormat}
              />
            ))}
          </Flex>
        </div>

        <Divider className="custom-apply-to-everything" />

        {/* Optional Information */}
        <div className="oui-flex oui-flex-col oui-gap-1">
          <Text size="xs" weight="semibold" intensity={60}>
            {t("share.pnl.optionalInfo")}
          </Text>
          <Flex gap={4} className="oui-flex-wrap">
            {options.map((item, index) => (
              <ShareOption
                key={index}
                setShareOption={setShareOption}
                type={item}
                curType={shareOption}
              />
            ))}
          </Flex>
        </div>

        {/* Message Input */}
        <Message
          message={message}
          setMessage={setMessage}
          check={check}
          setCheck={setCheck}
        />
      </div>

      {/* Bottom Buttons */}
      <div
        className="oui-flex oui-flex-col oui-gap-4"
        style={{ padding: "0 48px" }}
      >
        <BottomButtons onClickCopy={onCopy} onClickDownload={onDownload} />
      </div>
    </div>
  );
};
