import { FC, useRef, useState, useMemo, ChangeEvent, useEffect } from "react";
import { useMediaQuery } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import {
  Dialog,
  DialogContent,
  Button,
  Flex,
  Text,
  toast,
} from "@orderly.network/ui";
import { CarouselBackgroundImage } from "../../../../../ui-share/sharePnL/desktop/carousel";
import { PointsPoster, PointsPosterRef } from "./poster/PointsPoster";
import { PointsShareData } from "./types";

interface SharePointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: PointsShareData;
  config: any; // Using any for sharePnLConfig structure for simplicity, can be typed strictly
}

export const SharePointDialog: FC<SharePointDialogProps> = ({
  open,
  onOpenChange,
  data,
  config,
}) => {
  const posterRef = useRef<any>(null);
  const [message, setMessage] = useState(data.message);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const { t } = useTranslation();

  // Carousel state
  const backgroundImages = useMemo(
    () => config.backgroundImages || [],
    [config],
  );
  const [selectedSnap, setSelectedSnap] = useState(0);
  const [bgImageBase64, setBgImageBase64] = useState<string>("");

  // Get current background image URL
  const currentBgImage = backgroundImages[selectedSnap] || "";

  // Preload image to Base64 to avoid Canvas taint/CORS issues
  useEffect(() => {
    if (!currentBgImage) {
      setBgImageBase64("");
      return;
    }

    let isMounted = true;

    const convertToBase64 = async () => {
      try {
        console.log(`[SharePointDialog] Fetching image: ${currentBgImage}`);
        const response = await fetch(currentBgImage);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (isMounted && typeof reader.result === "string") {
            console.log(`[SharePointDialog] Image converted to Base64`);
            setBgImageBase64(reader.result);
          }
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error(
          "[SharePointDialog] Failed to convert image to Base64:",
          error,
        );
        // Fallback to original URL if fetch fails (might work if it's already cached or local)
        if (isMounted) setBgImageBase64(currentBgImage);
      }
    };

    convertToBase64();

    return () => {
      isMounted = false;
    };
  }, [currentBgImage]);

  // Update data with current message and selected background (Base64)
  const posterData = {
    data: {
      ...data,
      message: message,
      backgroundImage: bgImageBase64 || currentBgImage, // Prefer Base64, fallback to URL
      characterImage: "",
    },
  };

  const handleDownload = () => {
    posterRef.current?.download(`Orderly_Points_Season_${data.season}.png`);
  };

  const handleCopy = () => {
    posterRef.current
      ?.copy()
      .then(() => {
        toast.success(t("leaderboard.copiedToClipboard"));
      })
      .catch((e: Error) => {
        console.error("[SharePointDialog] Failed to copy:", e);
        toast.error(t("leaderboard.failedToCopy"));
      });
  };

  const posterWidth = 552;
  const posterHeight = 690;
  const posterContainerRef = useRef<HTMLDivElement | null>(null);
  const [posterScale, setPosterScale] = useState(1);

  // Dynamic poster scaling based on container width
  useEffect(() => {
    if (!open || !posterContainerRef.current) return;
    const measure = () => {
      if (posterContainerRef.current) {
        const containerWidth = posterContainerRef.current.offsetWidth;
        if (containerWidth > 0 && containerWidth < posterWidth) {
          setPosterScale(Math.min(containerWidth / posterWidth, 1));
        } else {
          setPosterScale(1);
        }
      }
    };
    // Delay measurement to allow dialog to render
    const timer = setTimeout(measure, 50);
    const observer = new ResizeObserver(() => measure());
    observer.observe(posterContainerRef.current);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [open, isTablet, isMobile]);

  if (isTablet) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          style={{
            background: "#0C0D10",
            padding: 0,
            border: "none",
            maxWidth: "100vw",
            maxHeight: "100vh",
            width: "100%",
            height: "100%",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              width: "100%",
              minHeight: "100%",
              padding: 16,
              background: "#0C0D10",
              borderRadius: 4,
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: 16,
              display: "flex",
            }}
          >
            {/* Header */}
            <div
              style={{
                alignSelf: "stretch",
                height: 40,
                borderBottom: "1px rgba(255, 255, 255, 0.05) solid",
                justifyContent: "space-between",
                alignItems: "flex-start",
                display: "inline-flex",
              }}
            >
              <div
                style={{
                  flex: "1 1 0",
                  height: 24,
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: 10,
                  display: "flex",
                }}
              >
                <div
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    color: "white",
                    fontSize: 13,
                    fontFamily: "Poppins",
                    fontWeight: "700",
                    lineHeight: "20px",
                    wordWrap: "break-word",
                  }}
                >
                  {t("leaderboard.share")}
                </div>
              </div>
              <div
                onClick={() => onOpenChange(false)}
                style={{
                  height: 24,
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: 10,
                  display: "flex",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: 9.35,
                      height: 9.34,
                      left: 2.32,
                      top: 2.28,
                      position: "absolute",
                      background: "rgba(255, 255, 255, 0.90)",
                      transform: "rotate(45deg)", // Making it look more like an X if it's a square
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Poster Area */}
            <div
              ref={posterContainerRef}
              style={{
                alignSelf: "stretch",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                display: "flex",
              }}
            >
              <div
                style={{
                  width: posterWidth * posterScale,
                  height: posterHeight * posterScale,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    transform: `scale(${posterScale})`,
                    transformOrigin: "top left",
                    width: posterWidth,
                    height: posterHeight,
                  }}
                >
                  <PointsPoster
                    ref={posterRef as any}
                    data={posterData}
                    width={posterWidth}
                    height={posterHeight}
                    ratio={2}
                  />
                </div>
              </div>
            </div>

            {/* Carousel */}
            <div
              style={{
                alignSelf: "stretch",
                justifyContent: "center",
                alignItems: "center",
                gap: 12,
                display: "inline-flex",
              }}
            >
              <CarouselBackgroundImage
                backgroundImages={backgroundImages}
                selectedSnap={selectedSnap}
                setSelectedSnap={setSelectedSnap}
              />
            </div>

            {/* Message Input */}
            <div
              style={{
                alignSelf: "stretch",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 16,
                display: "inline-flex",
              }}
            >
              <div
                style={{
                  flex: "1 1 0",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: 16,
                  display: "inline-flex",
                }}
              >
                <div
                  style={{
                    alignSelf: "stretch",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 12,
                    display: "inline-flex",
                  }}
                >
                  <div
                    style={{
                      color: "rgba(255, 255, 255, 0.60)",
                      fontSize: 12,
                      fontFamily: "Poppins",
                      fontWeight: "600",
                      lineHeight: "18px",
                      wordWrap: "break-word",
                    }}
                  >
                    Your message
                  </div>
                  <div
                    style={{
                      flex: "1 1 0",
                      height: 28,
                      paddingLeft: 12,
                      paddingRight: 12,
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: 6,
                      justifyContent: "space-between",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={25}
                      placeholder="Enter your message"
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "white",
                        width: "100%",
                        outline: "none",
                        fontSize: 12,
                        fontFamily: "Poppins",
                        fontWeight: 600,
                      }}
                    />
                    <div
                      style={{
                        justifyContent: "center",
                        display: "flex",
                        flexDirection: "column",
                        color: "rgba(255, 255, 255, 0.30)",
                        fontSize: 12,
                        fontFamily: "Poppins",
                        fontWeight: "600",
                        lineHeight: "18px",
                        wordWrap: "break-word",
                      }}
                    >
                      Max 25 characters
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div
              style={{
                alignSelf: "stretch",
                padding: "0 clamp(16px, 5vw, 48px)",
                background: "#0C0D10",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 16,
                display: "flex",
              }}
            >
              <div
                style={{
                  alignSelf: "stretch",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: 8,
                  display: "inline-flex",
                }}
              >
                <div
                  onClick={handleDownload}
                  data-color="neutral"
                  data-left-icon="false"
                  data-right-icon="false"
                  data-size="lg"
                  data-state="default"
                  data-style="tertiary"
                  data-variant="outline"
                  style={{
                    flex: "1 1 0",
                    height: 40,
                    minHeight: 32,
                    paddingLeft: 16,
                    paddingRight: 16,
                    borderRadius: 999,
                    outline: "1px rgba(255, 255, 255, 0.30) solid",
                    outlineOffset: "-1px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 4,
                    display: "flex",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 4,
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        justifyContent: "center",
                        display: "flex",
                        flexDirection: "column",
                        color: "rgba(255, 255, 255, 0.60)",
                        fontSize: 13,
                        fontFamily: "Poppins",
                        fontWeight: "600",
                        lineHeight: "20px",
                        wordWrap: "break-word",
                      }}
                    >
                      Download
                    </div>
                  </div>
                </div>
                <div
                  onClick={handleCopy}
                  data-color="purple"
                  data-left-icon="false"
                  data-right-icon="false"
                  data-size="lg"
                  data-state="default"
                  data-style="secondary"
                  data-variant="fill"
                  style={{
                    flex: "1 1 0",
                    height: 40,
                    minHeight: 32,
                    paddingLeft: 16,
                    paddingRight: 16,
                    background: "#6E55DF",
                    borderRadius: 999,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 4,
                    display: "flex",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 4,
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        justifyContent: "center",
                        display: "flex",
                        flexDirection: "column",
                        color: "white",
                        fontSize: 13,
                        fontFamily: "Poppins",
                        fontWeight: "600",
                        lineHeight: "20px",
                        wordWrap: "break-word",
                      }}
                    >
                      Copy
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          background: "#0C0D10",
          padding: 16,
          maxWidth: "min(920px, calc(100vw - 32px))",
          border: "none",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: 16,
            display: "flex",
          }}
        >
          {/* Header */}
          <div
            style={{
              alignSelf: "stretch",
              height: 40,
              borderBottom: "1px rgba(255, 255, 255, 0.05) solid",
              justifyContent: "space-between",
              alignItems: "flex-start",
              display: "inline-flex",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                flex: "1 1 0",
                height: 24,
                justifyContent: "space-between",
                alignItems: "center",
                display: "flex",
              }}
            >
              <div
                style={{
                  flex: "1 1 0",
                  height: 20,
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: 10,
                  display: "flex",
                }}
              >
                <div
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    color: "white",
                    fontSize: 13,
                    fontFamily: "Poppins",
                    fontWeight: "700",
                    lineHeight: "20px",
                    wordWrap: "break-word",
                  }}
                >
                  Share
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area: Poster Preview + Carousel + Controls */}
          <div
            style={{
              display: "flex",
              gap: 24,
              flexDirection: "row",
              alignItems: "flex-start",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {/* Left: Poster Preview */}
            <div
              ref={!isTablet ? posterContainerRef : undefined}
              style={{
                flex: "0 1 552px",
                minWidth: 0,
                maxWidth: "100%",
              }}
            >
              <div
                style={{
                  width: posterWidth * posterScale,
                  height: posterHeight * posterScale,
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 4,
                }}
              >
                <div
                  style={{
                    transform: `scale(${posterScale})`,
                    transformOrigin: "top left",
                    width: posterWidth,
                    height: posterHeight,
                  }}
                >
                  <PointsPoster
                    ref={posterRef as any}
                    data={posterData}
                    width={posterWidth}
                    height={posterHeight}
                    ratio={2}
                  />
                </div>
              </div>
            </div>

            {/* Right: Controls (Carousel, Message, Buttons) */}
            <div
              style={{
                width: 320,
                minWidth: 280,
                maxWidth: "100%",
                flex: "1 1 280px",
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              {/* Background Selection (Carousel) */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <Text size="xs" intensity={60} style={{ fontWeight: 600 }}>
                  Background
                </Text>
                <CarouselBackgroundImage
                  backgroundImages={backgroundImages}
                  selectedSnap={selectedSnap}
                  setSelectedSnap={setSelectedSnap}
                />
              </div>

              {/* Message Input */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Text size="xs" intensity={60} style={{ fontWeight: 600 }}>
                    Your message
                  </Text>
                  <Text size="xs" intensity={30} style={{ fontWeight: 600 }}>
                    Max 25 characters
                  </Text>
                </div>
                <div
                  style={{
                    height: 40,
                    padding: "0 12px",
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    value={message}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setMessage(e.target.value)
                    }
                    maxLength={25}
                    placeholder="Enter your message"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "white",
                      width: "100%",
                      outline: "none",
                      fontSize: 14,
                      fontFamily: "Poppins",
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: "auto", display: "flex", gap: 12 }}>
                <div
                  onClick={handleDownload}
                  style={{
                    flex: 1,
                    height: 40,
                    borderRadius: 999,
                    border: "1px solid rgba(255, 255, 255, 0.30)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    color: "rgba(255, 255, 255, 0.60)",
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "Poppins",
                  }}
                >
                  Download
                </div>
                <div
                  onClick={handleCopy}
                  style={{
                    flex: 1,
                    height: 40,
                    borderRadius: 999,
                    background: "#6E55DF",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    color: "white",
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "Poppins",
                  }}
                >
                  Copy
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
