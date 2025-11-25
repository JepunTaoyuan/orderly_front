import React from "react";
import { FeeTierWidget, FeeTierWidgetProps } from "./feeTier.widget";

export type FeeTierPageProps = FeeTierWidgetProps;

export const FeeTierPage: React.FC<FeeTierPageProps> = (props) => {
  return (
    <FeeTierWidget
      {...props}
      dataAdapter={(columns, dataSource) => {
        const modifiedColumns = columns.map((col) => {
          if (col.dataIndex === "maker_fee" || col.dataIndex === "taker_fee") {
            return {
              ...col,
              render: (val: any) => {
                if (!val) return val;
                const parts = val.split("/");
                return (
                  <span>
                    <span style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                      {parts[0]?.trim()}
                    </span>
                    <span style={{ color: "rgba(227, 231, 234, 0.1)" }}>
                      {" | "}
                    </span>
                    <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                      {parts[1]?.trim()}
                    </span>
                  </span>
                );
              },
            };
          }
          return col;
        });
        return { columns: modifiedColumns, dataSource };
      }}
    />
  );
};
