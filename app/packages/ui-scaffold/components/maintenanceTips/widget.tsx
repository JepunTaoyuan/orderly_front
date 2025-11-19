import { useMaintenanceScript } from "./script";
import { MaintenanceTipsUI } from "./ui";

export const MaintenanceTipsWidget = () => {
  const props = useMaintenanceScript();
  return <MaintenanceTipsUI {...props} />;
};
