import { useApiManagerScript } from "./apiManager.script";
import { APIManager } from "./apiManager.ui";

export const APIManagerWidget = (props?: {
  filterTags?: [string];
  keyStatus?: string;
}) => {
  const state = useApiManagerScript(props);
  return <APIManager {...state} />;
};
