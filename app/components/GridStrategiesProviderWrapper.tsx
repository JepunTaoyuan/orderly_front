import React, { useEffect } from "react";
import { GridStrategiesProvider } from "@/contexts/GridStrategiesContext";
import { useGridStrategiesGlobal } from "@/contexts/GridStrategiesContext";

interface GridStrategiesProviderWrapperProps {
  children: React.ReactNode;
  currentTab?: string;
}

export const GridStrategiesProviderWrapper: React.FC<
  GridStrategiesProviderWrapperProps
> = ({ children, currentTab }) => {
  const { setStrategyPageVisible } = useGridStrategiesGlobal();

  // Detect when user switches to strategy tab
  useEffect(() => {
    const isStrategyTab =
      currentTab === "Strategy" || currentTab === "strategy";
    setStrategyPageVisible(isStrategyTab);
  }, [currentTab, setStrategyPageVisible]);

  return <>{children}</>;
};

export const withGridStrategiesProvider = (
  Component: React.ComponentType<any>,
  currentTab?: string,
) => {
  return (props: any) => (
    <GridStrategiesProvider>
      <GridStrategiesProviderWrapper currentTab={currentTab}>
        <Component {...props} />
      </GridStrategiesProviderWrapper>
    </GridStrategiesProvider>
  );
};
