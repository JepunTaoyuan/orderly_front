import { FC } from "react";
import { useLeverageScript } from "./leverage.script";
import { Leverage } from "./leverage.ui";

export type LeverageEditorProps = {
  close?: () => void;
};

export const LeverageEditor: FC<LeverageEditorProps> = (props) => {
  const state = useLeverageScript({ close: props.close });
  return <Leverage {...state} />;
};
