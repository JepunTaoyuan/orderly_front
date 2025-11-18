import { withTV } from "tailwind-variants/transformer";
import uiPreset from "../js-sdk/packages/ui/tailwind.config.js";

export default withTV({
  darkMode: ["class"],
  prefix: "oui-",
  presets: [uiPreset as any],
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./node_modules/@orderly.network/**/*.{js,jsx,ts,tsx}",
  ],
});
