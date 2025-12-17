import { i18n } from "@orderly.network/i18n";
import { registerSimpleDialog, registerSimpleSheet } from "@orderly.network/ui";
import { LeverageEditor } from "./leverage.widget";

export { LeverageEditor, type LeverageEditorProps } from "./leverage.widget";
export { Leverage, LeverageSlider, LeverageHeader } from "./leverage.ui";
export type {
  LeverageProps,
  LeverageSliderProps,
  LeverageHeaderProps,
} from "./leverage.ui";
export {
  useLeverageScript,
  type LeverageScriptReturns,
} from "./leverage.script";
export * from "./symbolLeverage";

export const LeverageWidgetWithDialogId = "LeverageWidgetWithDialog";
export const LeverageWidgetWithSheetId = "LeverageWidgetWithSheet";

registerSimpleDialog(LeverageWidgetWithDialogId, LeverageEditor, {
  title: () => i18n.t("leverage.maxAccountLeverage"),
  size: "md",
  classNames: {
    content: "!oui-bg-base-10",
  },
  contentProps: {
    className: "!oui-bg-base-10",
  },
});

registerSimpleSheet(LeverageWidgetWithSheetId, LeverageEditor, {
  title: () => i18n.t("leverage.maxAccountLeverage"),
  classNames: {
    content: "!oui-bg-base-10",
  },
  contentProps: {
    className: "!oui-bg-base-10",
  },
});
