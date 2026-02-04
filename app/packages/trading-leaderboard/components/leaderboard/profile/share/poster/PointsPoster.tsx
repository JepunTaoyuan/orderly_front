import { forwardRef, useImperativeHandle } from "react";
import { PointsDrawOptions } from "../types";
import { usePointsPoster } from "./usePointsPoster";

export type PointsPosterProps = {
  width?: number;
  height?: number;
  className?: string;
  ratio?: number;
  data: PointsDrawOptions;
  style?: React.CSSProperties;
};

export type PointsPosterRef = {
  download: (filename: string, type?: string, encoderOptions?: number) => void;
  toBlob: (type?: string, encoderOptions?: number) => Promise<Blob | null>;
  copy: () => Promise<void>;
};

export const PointsPoster = forwardRef<PointsPosterRef, PointsPosterProps>(
  (props, parentRef) => {
    const { width = 552, height = 690, className, data, style } = props;

    const { ref, download, copy, toBlob } = usePointsPoster(data, {
      ratio: props.ratio,
    });

    useImperativeHandle(parentRef, () => ({
      download,
      toBlob,
      copy,
    }));

    return (
      <canvas
        ref={ref}
        width={width}
        height={height}
        className={className}
        style={style}
      />
    );
  },
);
