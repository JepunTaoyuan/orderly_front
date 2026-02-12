import { i18n } from "@orderly.network/i18n";
import { PointsDrawOptions, PointsShareData } from "../types";

export class PointsPainter {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private ratio: number;

  constructor(
    private canvas: HTMLCanvasElement,
    options?: { ratio: number },
  ) {
    this.ctx = this.canvas.getContext("2d")!;

    // Get dimensions from canvas element attributes (set by props) or fallback
    // This allows the painter to respect the size passed from the component
    // FIXED: Force fixed logical dimensions because internal coordinates are hardcoded for 552x690
    this.width = 552;
    this.height = 690;

    this.ratio = Math.max(
      options?.ratio || 1,
      typeof window !== "undefined" ? Math.ceil(window.devicePixelRatio) : 1,
    );

    // Set canvas size for high resolution
    // We need to reset the width/height to account for the ratio
    // The visual size (style.width/height) should match the intended display size
    this.canvas.width = this.width * this.ratio;
    this.canvas.height = this.height * this.ratio;
    this.canvas.style.width = this.width + "px";
    this.canvas.style.height = this.height + "px";
  }

  async draw(options: PointsDrawOptions) {
    if (!this.ctx) return;

    // Scale context by ratio
    this.ctx.save();
    this.ctx.scale(this.ratio, this.ratio);

    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw Background
    await this.drawBackground(options.data.backgroundImage);

    // Draw Character
    await this.drawCharacter(options.data.characterImage);

    // Draw Decorations (Gradient lines)
    // Removed decorations (dots) as requested
    // this.drawDecorations();

    // Draw Message
    this.drawMessage(options.data.message);

    // Draw Text Info
    this.drawInfo(options.data);

    this.ctx.restore();
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      if (!src) {
        reject(new Error("Image source is empty"));
        return;
      }
      const img = new Image();
      // Only set crossOrigin if it's an external URL to avoid issues with local blobs or data URIs
      // Base64 data URIs do not need crossOrigin
      if (src.startsWith("http")) {
        img.crossOrigin = "anonymous";
      }
      img.onload = () => resolve(img);
      img.onerror = (e) => {
        console.error(`[PointsPainter] Failed to load image: ${src}`, e);
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });
  }

  private async drawBackground(src: string) {
    if (!src) {
      console.warn("[PointsPainter] No background image source provided");
      // Fallback
      this.ctx.fillStyle = "#131519";
      this.ctx.fillRect(0, 0, this.width, this.height);
      return;
    }

    try {
      console.log(`[PointsPainter] Loading background image: ${src}`);
      const img = await this.loadImage(src);
      this.ctx.drawImage(img, 0, 0, this.width, this.height);

      // Overlay gradient: linear-gradient(90deg, black 0%, rgba(0, 0, 0, 0.60) 100%)
      /* 
      // Removed overlay to fix "too dark" issue as requested
      const gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
      gradient.addColorStop(0, "black");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.60)");
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.width, this.height);
      */
    } catch (e) {
      console.error("[PointsPainter] Failed to draw background", e);
      // Fallback
      this.ctx.fillStyle = "#131519";
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  private async drawCharacter(src: string) {
    try {
      const img = await this.loadImage(src);
      // JSX: width: 436, height: 654, left: 238, top: 119
      // These are hardcoded for 552x690 layout.
      // If width/height changes, these should be scaled relative to this.width/this.height
      this.ctx.drawImage(img, 238, 119, 436, 654);
    } catch (e) {
      console.error("Failed to load character image", e);
    }
  }

  private drawDecorations() {
    // Left: 31, Top: 38
    const startX = 31;
    const startY = 38;
    const gap = 10;

    const drawRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      color: string | CanvasGradient,
    ) => {
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, w, h);
    };

    const white = "white";
    const lime = "#DBFD5C";

    let currentY = startY;

    // 1. width: 12, height: 13
    drawRect(startX, currentY, 12, 13, white);
    currentY += 13 + gap;

    // 2. width: 9.55, height: 13.33
    drawRect(startX, currentY, 9.55, 13.33, white);
    currentY += 13.33 + gap;

    // 3. width: 9.82, height: 13.33
    drawRect(startX, currentY, 9.82, 13.33, white);
    currentY += 13.33 + gap;

    // 4. width: 8.73, height: 12.98
    drawRect(startX, currentY, 8.73, 12.98, white);
    currentY += 12.98 + gap;

    // 5. width: 8.65, height: 12.98
    drawRect(startX, currentY, 8.65, 12.98, white);
    currentY += 12.98 + gap;

    // 6. width: 12.35, height: 12.98 (LIME)
    drawRect(startX, currentY, 12.35, 12.98, lime);
    currentY += 12.98 + gap;

    // 7. width: 9.53, height: 12.98
    drawRect(startX, currentY, 9.53, 12.98, white);
    currentY += 12.98 + gap;
  }

  private drawMessage(message: string) {
    // JSX: left: 30, top: 73, width: 471
    // Font: Poppins 20px 400 White

    this.ctx.font = "400 20px Poppins, sans-serif";
    this.ctx.fillStyle = "white";
    this.ctx.textBaseline = "top"; // Crucial for matching CSS top positioning

    // " THIS is your message"
    // Only draw quotes if message exists
    const textToDraw = message ? `" ${message}"` : "";
    this.ctx.fillText(textToDraw, 30, 73);
  }

  private drawInfo(data: PointsShareData) {
    const startX = 31;
    let currentY = 162;

    // Common settings
    this.ctx.textBaseline = "top"; // Ensure consistent vertical alignment

    // Season 1
    // Font: Poppins 20px 400 White
    this.ctx.font = "400 20px Poppins, sans-serif";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(data.season, startX, currentY);

    currentY += 20 + 12; // Height + gap

    // Rank 16
    // Font: Poppins 30px 600 #DBFD5C
    this.ctx.font = "600 30px Poppins, sans-serif";
    this.ctx.fillStyle = "#DBFD5C";
    this.ctx.fillText(`Rank ${data.rank}`, startX, currentY);

    currentY += 30 + 13; // Height + gap

    // Stats Block
    // Total Points (Label: Poppins 14px 500 White 50%, Value: Poppins 16px 500 White 90%)
    // Gap 20 between items
    // Item gap 8

    const labelFont = "500 14px Poppins, sans-serif";
    const labelColor = "rgba(255, 255, 255, 0.50)";
    const valueFont = "500 16px Poppins, sans-serif";
    const valueColor = "rgba(255, 255, 255, 0.90)";

    const drawStat = (
      label: string,
      value: string,
      customValueColor?: string,
    ) => {
      // Draw Label
      this.ctx.font = labelFont;
      this.ctx.fillStyle = labelColor;
      this.ctx.fillText(label, startX, currentY);

      currentY += 14 + 8; // Label height + gap

      // Draw Value
      this.ctx.font = valueFont;
      this.ctx.fillStyle = customValueColor || valueColor;
      this.ctx.fillText(value, startX, currentY);

      currentY += 16 + 20; // Value height + item gap
    };

    drawStat(i18n.t("leaderboard.totalPoints"), `${data.totalPoints}`);
    drawStat(i18n.t("leaderboard.tradingVolume"), `$${data.volume}`);
    drawStat(i18n.t("leaderboard.pnl"), `$${data.pnl}`, "#FF41A3");

    // Date
    // Font: Poppins 14px 500 White 90%
    this.ctx.font = "500 14px Poppins, sans-serif";
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.90)";
    this.ctx.fillText(data.date, 31, 641);
  }
}
