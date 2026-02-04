import { useCallback, useEffect, useRef, useState } from "react";
import { PointsDrawOptions } from "../types";
import { PointsPainter } from "./pointsPainter";

export const usePointsPoster = (
  data: PointsDrawOptions,
  options?: { ratio?: number },
) => {
  const [error, setError] = useState<Error | null>(null);
  const [canCopy, setCanCopy] = useState<boolean>(
    () =>
      typeof navigator !== "undefined" &&
      typeof navigator.clipboard !== "undefined",
  );

  const painterRef = useRef<PointsPainter | null>(null);
  const [target, setTarget] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (target) {
      // Always recreate painter when target or ratio changes to handle resizing properly
      painterRef.current = new PointsPainter(target, {
        ratio: options?.ratio || 1,
      });

      // Draw immediately
      painterRef.current.draw(data);
    }
  }, [target, options?.ratio]);

  // Re-draw when data changes
  useEffect(() => {
    if (painterRef.current) {
      painterRef.current.draw(data);
    }
  }, [data]);

  const toBlob = useCallback(
    (type?: string, encoderOptions?: number): Promise<Blob | null> => {
      return new Promise<Blob | null>((resolve) => {
        if (!target) {
          resolve(null);
          return;
        }
        target.toBlob(resolve, type, encoderOptions);
      });
    },
    [target],
  );

  const ref = (ref: HTMLCanvasElement | null) => {
    if (!ref) return;
    setTarget(ref);
  };

  const download = useCallback(
    (filename: string, type: string = "image/png", encoderOptions?: number) => {
      if (!target) {
        return;
      }
      const img = new Image();
      img.src = target.toDataURL(type, encoderOptions);
      const link = document.createElement("a");
      link.href = img.src;
      link.download = filename;
      link.click();
    },
    [target],
  );

  const copy = useCallback(() => {
    if (!target) {
      return Promise.reject(new Error("No canvas target"));
    }
    return new Promise<void>((resolve, reject) => {
      if (!navigator.clipboard) {
        reject(new Error("Clipboard API is not supported"));
        return;
      }
      target.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to create blob"));
          return;
        }
        navigator.clipboard
          .write([new ClipboardItem({ [blob.type]: blob })])
          .then(resolve, reject);
      });
    });
  }, [target]);

  return {
    error,
    ref,
    toBlob,
    download,
    canCopy,
    copy,
  } as const;
};
