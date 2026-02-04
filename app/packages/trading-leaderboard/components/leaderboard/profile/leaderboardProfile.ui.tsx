import { FC, useState } from "react";
import { Box, Flex, Text, Button } from "@orderly.network/ui";
import { commify } from "@orderly.network/utils";
import { useOrderlyConfig } from "../../../../../hooks/useOrderlyConfig";
import { SharePointDialog } from "./share/SharePointsDialog";
import { useLeaderboardProfile } from "./useLeaderboardProfile";

export const LeaderboardProfile: FC<{ className?: string }> = ({
  className,
}) => {
  const { data } = useLeaderboardProfile();
  const [showShare, setShowShare] = useState(false);
  const config = useOrderlyConfig();
  const sharePnLConfig = config?.tradingPage?.sharePnLConfig;

  const shortAddress = (address?: string) => {
    if (!address) return "--";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().slice(0, 16).replace("T", " ");
  };

  const shareData = {
    season: "Season 1", // Hardcoded as per design
    rank: data.overall.rank,
    totalPoints: data.overall.points,
    volume: commify(data.lastWeek.volume || 0),
    pnl: commify(data.lastWeek.pnl || 0),
    message: "THIS is your message",
    date: formatDate(new Date()),
    // These will be overridden by the selected image in the dialog
    backgroundImage: "",
    characterImage: "",
  };

  return (
    <div
      className={className}
      style={{
        width: "fit-content",
        height: "100%",
        padding: 24,
        background: "#131519",
        borderRadius: 4,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 20,
        display: "inline-flex",
      }}
    >
      <div
        style={{
          width: 317,
          justifyContent: "space-between",
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        <div
          style={{
            width: 175,
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: 12,
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
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
                color: "white",
                fontSize: 20,
                fontFamily: "Manrope",
                fontWeight: "700",
                lineHeight: "36px",
                wordWrap: "break-word",
              }}
            >
              Points You Earned
            </div>
          </div>
        </div>
        {sharePnLConfig && (
          <div
            onClick={() => setShowShare(true)}
            data-color="neutral"
            data-left-icon="false"
            data-right-icon="false"
            data-size="md"
            data-state="default"
            data-style="tertiary"
            data-variant="outline"
            style={{
              width: 104,
              height: 32,
              minHeight: 32,
              paddingLeft: 16,
              paddingRight: 16,
              borderRadius: 999,
              outline: "1px rgba(255, 255, 255, 0.90) solid",
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
                  color: "rgba(255, 255, 255, 0.90)",
                  fontSize: 11,
                  fontFamily: "Manrope",
                  fontWeight: "600",
                  lineHeight: "20px",
                  wordWrap: "break-word",
                }}
              >
                Share
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          background: "#131519",
          borderRadius: 4,
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          gap: 50,
          display: "flex",
        }}
      >
        <div
          style={{
            alignSelf: "stretch",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 3,
            display: "flex",
          }}
        >
          <div
            style={{
              width: 317,
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 3,
              display: "inline-flex",
            }}
          >
            <div
              style={{
                flex: "1 1 0",
                alignSelf: "stretch",
                padding: 20,
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: 4,
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 20,
                display: "flex",
              }}
            >
              <img
                style={{
                  width: 76,
                  height: 94,
                  padding: 1,
                  borderRadius: 4,
                  outline: "1px rgba(112, 83, 243, 0.80) solid",
                  objectFit: "cover",
                }}
                src="/images/fe8b32d6e954177f4cb7627fd7a03b58faaecd46.png"
                alt="Avatar"
              />
              <div
                style={{
                  height: 90,
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: 10,
                  display: "inline-flex",
                }}
              >
                <div
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 16,
                    display: "inline-flex",
                  }}
                >
                  <div
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      gap: 4,
                      display: "inline-flex",
                    }}
                  >
                    <div
                      style={{
                        justifyContent: "center",
                        display: "flex",
                        flexDirection: "column",
                        color: "rgba(255, 255, 255, 0.50)",
                        fontSize: 13,
                        fontFamily: "Manrope",
                        fontWeight: "700",
                        lineHeight: "24px",
                        wordWrap: "break-word",
                      }}
                    >
                      Name
                    </div>
                    <div
                      style={{
                        color: "rgba(255, 255, 255, 0.90)",
                        fontSize: 12,
                        fontFamily: "Manrope",
                        fontWeight: "700",
                        lineHeight: "12px",
                        wordWrap: "break-word",
                      }}
                    >
                      {data.name}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 16,
                    display: "inline-flex",
                  }}
                >
                  <div
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      gap: 4,
                      display: "inline-flex",
                    }}
                  >
                    <div
                      style={{
                        justifyContent: "center",
                        display: "flex",
                        flexDirection: "column",
                        color: "rgba(255, 255, 255, 0.50)",
                        fontSize: 13,
                        fontFamily: "Manrope",
                        fontWeight: "700",
                        lineHeight: "24px",
                        wordWrap: "break-word",
                      }}
                    >
                      ID
                    </div>
                    <div
                      style={{
                        color: "white",
                        fontSize: 12,
                        fontFamily: "Manrope",
                        fontWeight: "700",
                        lineHeight: "12px",
                        wordWrap: "break-word",
                      }}
                    >
                      {shortAddress(data.address)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              width: 317,
              padding: 20,
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: 4,
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: 10,
              display: "flex",
            }}
          >
            <div
              style={{
                alignSelf: "stretch",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
                color: "rgba(255, 255, 255, 0.90)",
                fontSize: 13,
                fontFamily: "Manrope",
                fontWeight: "700",
                lineHeight: "24px",
                wordWrap: "break-word",
              }}
            >
              Overall
            </div>
            <div
              style={{
                alignSelf: "stretch",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 16,
                display: "inline-flex",
              }}
            >
              <div
                style={{
                  width: 125,
                  height: 68,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  gap: 8,
                  display: "inline-flex",
                }}
              >
                <div
                  style={{
                    alignSelf: "stretch",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    color: "rgba(255, 255, 255, 0.50)",
                    fontSize: 13,
                    fontFamily: "Manrope",
                    fontWeight: "700",
                    lineHeight: "24px",
                    wordWrap: "break-word",
                  }}
                >
                  Total Points
                </div>
                <div
                  style={{
                    alignSelf: "stretch",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    color: "#C9BDFF",
                    fontSize: 28,
                    fontFamily: "Manrope",
                    fontWeight: "600",
                    lineHeight: "28px",
                    wordWrap: "break-word",
                  }}
                >
                  {data.overall.points}
                </div>
              </div>
              <div
                style={{
                  width: 125,
                  height: 68,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  gap: 8,
                  display: "inline-flex",
                }}
              >
                <div
                  style={{
                    alignSelf: "stretch",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    color: "rgba(255, 255, 255, 0.50)",
                    fontSize: 13,
                    fontFamily: "Manrope",
                    fontWeight: "700",
                    lineHeight: "24px",
                    wordWrap: "break-word",
                  }}
                >
                  Rank
                </div>
                <div
                  style={{
                    alignSelf: "stretch",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    color: "#C9BDFF",
                    fontSize: 28,
                    fontFamily: "Manrope",
                    fontWeight: "600",
                    lineHeight: "28px",
                    wordWrap: "break-word",
                  }}
                >
                  {data.overall.rank}
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              width: 317,
              padding: 20,
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: 4,
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: 10,
              display: "flex",
            }}
          >
            <div
              style={{
                alignSelf: "stretch",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
                color: "rgba(255, 255, 255, 0.90)",
                fontSize: 13,
                fontFamily: "Manrope",
                fontWeight: "700",
                lineHeight: "24px",
                wordWrap: "break-word",
              }}
            >
              Last Week’s Performance
            </div>
            <div
              style={{
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 16,
                display: "inline-flex",
              }}
            >
              <div
                style={{
                  width: 125,
                  height: 68,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  gap: 8,
                  display: "inline-flex",
                }}
              >
                <div
                  style={{
                    alignSelf: "stretch",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    color: "rgba(255, 255, 255, 0.50)",
                    fontSize: 13,
                    fontFamily: "Manrope",
                    fontWeight: "700",
                    lineHeight: "24px",
                    wordWrap: "break-word",
                  }}
                >
                  Points
                </div>
                <div
                  style={{
                    alignSelf: "stretch",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    color: "#C9BDFF",
                    fontSize: 28,
                    fontFamily: "Manrope",
                    fontWeight: "600",
                    lineHeight: "28px",
                    wordWrap: "break-word",
                  }}
                >
                  {data.lastWeek.points}
                </div>
              </div>
              <div
                style={{
                  width: 125,
                  height: 68,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  gap: 8,
                  display: "inline-flex",
                }}
              >
                <div
                  style={{
                    alignSelf: "stretch",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    color: "rgba(255, 255, 255, 0.50)",
                    fontSize: 13,
                    fontFamily: "Manrope",
                    fontWeight: "700",
                    lineHeight: "24px",
                    wordWrap: "break-word",
                  }}
                >
                  Rank
                </div>
                <div
                  style={{
                    alignSelf: "stretch",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    color: "#C9BDFF",
                    fontSize: 28,
                    fontFamily: "Manrope",
                    fontWeight: "600",
                    lineHeight: "28px",
                    wordWrap: "break-word",
                  }}
                >
                  {data.lastWeek.rank}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {sharePnLConfig && (
        <SharePointDialog
          open={showShare}
          onOpenChange={setShowShare}
          data={shareData}
          config={sharePnLConfig}
        />
      )}
    </div>
  );
};
