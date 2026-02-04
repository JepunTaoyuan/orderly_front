import React, { useState } from "react";

/* =========================
   Dialog Component（抽離）
========================= */
type AirdropDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AirdropDialog({ isOpen, onClose }: AirdropDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.7)", // 稍微加深背景
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px", // 確保手機版邊距，避免貼邊
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: "380px",
          padding: "2px",
          borderRadius: "24px",
          background: "linear-gradient(to right, #7053f3, #70c3b6, #d0f473)",
        }}
      >
        <div
          style={{
            background: "#0a0a0a",
            borderRadius: "22px",
            padding: "24px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "hidden", // 確保內部圖片不會溢出
          }}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "1.2 / 1",
              background: "radial-gradient(circle, #1a1a1a 0%, #050505 100%)",
              borderRadius: "70px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid rgba(255,255,255,0.05)",
              overflow: "hidden",
            }}
          >
            <img src="/images/landingpage/rocket.jpg" />
          </div>

          <h2
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              margin: "0 0 10px 0",
              color: "#fff",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Points Challenge Coming Soon!
          </h2>

          <p
            style={{
              fontSize: "14px",
              color: "#888",
              lineHeight: "1.5",
              margin: "0 0 24px 0",
              fontFamily: "Inter, sans-serif",
            }}
          >
            We're bringing you a new way to earn points.
            <br />
            Watch this space!
          </p>

          <button
            onClick={onClose}
            style={{
              width: "100%",
              maxWidth: "200px",
              padding: "12px 0",
              borderRadius: "999px",
              border: "none",
              background: "linear-gradient(90deg, #7053f3, #70c3b6, #d0f473)",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(112, 83, 243, 0.3)",
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Main Component
========================= */
export default function Airdrop() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDialog = () => setIsOpen(!isOpen);

  return (
    <>
      {/* animation 必須留在這 */}
      <style>
        {`
          @keyframes spin {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>

      {/* Airdrop Button（完全不動） */}
      <div
        onClick={toggleDialog}
        style={{
          position: "relative",
          display: "inline-flex",
          padding: "3.5px",
          borderRadius: "999px",
          cursor: "pointer",
          overflow: "hidden",
          background: "rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* 外層旋轉漸層 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "200%",
              aspectRatio: "1 / 1",
              background:
                "conic-gradient(from 0deg, transparent 180deg, #7053f3 220deg, #70c3b6 280deg, #d0f473 360deg)",
              animation: "spin 3s linear infinite",
              filter: "blur(2px)",
            }}
          />
        </div>

        {/* 內容 */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "999px",
            background: "#000",
          }}
        >
          <svg width="14" height="16" viewBox="0 0 14 16">
            <path
              d="M11.0635 1.5127C12.6426 2.78935 13.454 4.85464 13.4541 7.63574C13.4541 12.5885 10.881 15.2725 5.98242 15.2725H0V12.8271L11.0635 1.5127ZM5.98242 0C7.12014 1.54207e-06 8.13186 0.14634 9.01562 0.430664L0 9.65039V0H5.98242Z"
              fill="white"
            />
          </svg>

          <span
            style={{
              color: "#fff",
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            Airdrop
          </span>
        </div>
      </div>

      {/* Dialog */}
      <AirdropDialog isOpen={isOpen} onClose={toggleDialog} />
    </>
  );
}
