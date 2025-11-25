import React, { useState, useCallback, useEffect } from "react";
import { useSymbolLeverage, useLeverageBySymbol } from "@orderly.network/hooks";
import { OrderSide } from "@orderly.network/types";
import { type GridType, type Direction } from "../../services/gridBot.client";
import { LeverageBadge } from "./LeverageBadge";

// TypeScript interfaces
interface CustomOrderEntryProps {
  symbol?: string;
  onOrderSubmit?: (orderData: OrderData) => void;
  currentPrice?: number;
  className?: string;
  side?: OrderSide;
  symbolLeverage?: number;
}

interface OrderData {
  direction: Direction;
  upper_bound: number;
  lower_bound: number;
  grid_type: GridType;
  grid_ratio?: number; // 0-1, GEOMETRIC 時必填
  grid_levels: number; // >= 2
  total_margin: number;
  stop_bot_price?: number;
  stop_top_price?: number;
}

export const CustomOrderEntry = ({
  symbol = "ETH",
  onOrderSubmit,
  currentPrice = 0,
  className = "",
  symbolLeverage = 0,
}: CustomOrderEntryProps): React.ReactNode => {
  // State management for order fields
  const [direction, setDirection] = useState<Direction>("LONG");
  const [upperBound, setUpperBound] = useState("");
  const [lowerBound, setLowerBound] = useState("");
  const [gridType, setGridType] = useState<GridType>("ARITHMETIC");
  const [gridRatio, setGridRatio] = useState("");
  const [gridLevels, setGridLevels] = useState("5");
  const [totalMargin, setTotalMargin] = useState("");
  const [tpslEnabled, setTpslEnabled] = useState(false);
  const [stopBotPrice, setStopBotPrice] = useState("");
  const [stopTopPrice, setStopTopPrice] = useState("");
  const [isGridTypeOpen, setIsGridTypeOpen] = useState(false);
  const [priceError, setPriceError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [side, setSide] = useState<OrderSide>(OrderSide.BUY);

  // Input validation function - only allows numbers and decimal points
  const handleNumericInput = useCallback(
    (value: string, allowDecimal: boolean = true): string => {
      if (!value) return "";

      // Allow: numbers, one decimal point, and backspace/delete
      const decimalPattern = allowDecimal ? /^\d*\.?\d*$/ : /^\d*$/;
      const isValid = decimalPattern.test(value);

      if (!isValid) return ""; // Return empty if invalid input

      return value;
    },
    [],
  );

  // Field validation based on OrderData interface constraints
  const validateField = useCallback(
    (fieldName: string, value: string): string => {
      if (!value) return "";

      const numValue = parseFloat(value);

      switch (fieldName) {
        case "gridLevels":
          if (numValue < 2) {
            return "Grid levels must be at least 2";
          }
          if (numValue > 100) {
            return "Grid levels cannot exceed 100";
          }
          break;

        case "gridRatio":
          if (gridType === "GEOMETRIC") {
            if (numValue <= 0 || numValue >= 1) {
              return "Grid ratio must be between 0 and 1 for geometric grids";
            }
          }
          break;

        case "totalMargin":
          if (numValue <= 0) {
            return "Total margin must be greater than 0";
          }
          break;

        case "stopBotPrice":
          if (direction === "LONG" && numValue >= currentPrice) {
            return "Stop loss must be below current price for LONG positions";
          }
          if (direction === "SHORT" && numValue <= currentPrice) {
            return "Stop loss must be above current price for SHORT positions";
          }
          break;

        case "stopTopPrice":
          if (direction === "LONG" && numValue <= currentPrice) {
            return "Take profit must be above current price for LONG positions";
          }
          if (direction === "SHORT" && numValue >= currentPrice) {
            return "Take profit must be below current price for SHORT positions";
          }
          break;
      }

      return "";
    },
    [gridType, direction, currentPrice],
  );

  // Auto-calculation and validation logic
  const validateAndCalculateBounds = useCallback(
    (
      upperValue: string,
      lowerValue: string,
      triggerField: "upper" | "lower",
    ) => {
      if (!currentPrice)
        return { upper: upperValue, lower: lowerValue, error: "" };

      const upperNum = parseFloat(upperValue);
      const lowerNum = parseFloat(lowerValue);

      // Check for invalid inputs
      if (triggerField === "upper" && !isNaN(upperNum)) {
        // Upper bound must be above current price
        if (upperNum <= currentPrice) {
          return {
            upper: upperValue,
            lower: lowerValue,
            error: "Upper bound must be above current price",
          };
        }

        // Calculate lower bound based on equal distance from current price
        const distance = upperNum - currentPrice;
        const calculatedLower = currentPrice - distance;

        if (calculatedLower <= 0) {
          return {
            upper: upperValue,
            lower: lowerValue,
            error: "Calculated lower bound would be negative",
          };
        }

        return {
          upper: upperValue,
          lower: calculatedLower.toFixed(2),
          error: "",
        };
      }

      if (triggerField === "lower" && !isNaN(lowerNum)) {
        // Lower bound must be below current price
        if (lowerNum >= currentPrice) {
          return {
            upper: upperValue,
            lower: lowerValue,
            error: "Lower bound must be below current price",
          };
        }

        // Calculate upper bound based on equal distance from current price
        const distance = currentPrice - lowerNum;
        const calculatedUpper = currentPrice + distance;

        return {
          upper: calculatedUpper.toFixed(2),
          lower: lowerValue,
          error: "",
        };
      }

      return { upper: upperValue, lower: lowerValue, error: "" };
    },
    [currentPrice],
  );

  // Auto-calculate bounds when either field changes
  useEffect(() => {
    if (!upperBound && !lowerBound) return;

    const isUpperEmpty = !upperBound;
    const isLowerEmpty = !lowerBound;

    if (!isUpperEmpty && !isLowerEmpty) {
      // Both fields have values, validate them
      const result = validateAndCalculateBounds(
        upperBound,
        lowerBound,
        "upper",
      );
      setPriceError(result.error);
    }
  }, [upperBound, lowerBound, currentPrice, validateAndCalculateBounds]);

  // Handlers
  const handleDirectionChange = useCallback((newDirection: Direction) => {
    setDirection(newDirection);
    if (newDirection === "LONG") {
      setSide(OrderSide.BUY);
    } else if (newDirection === "SHORT") {
      setSide(OrderSide.SELL);
    }
  }, []);

  const handleUpperBoundChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newUpperValue = handleNumericInput(e.target.value, true);
      setUpperBound(newUpperValue);

      // Auto-calculate lower bound when upper bound changes
      if (newUpperValue && currentPrice) {
        const result = validateAndCalculateBounds(
          newUpperValue,
          lowerBound,
          "upper",
        );
        setLowerBound(result.lower);
        setPriceError(result.error);
      } else {
        setPriceError("");
      }
    },
    [currentPrice, lowerBound, validateAndCalculateBounds, handleNumericInput],
  );

  const handleLowerBoundChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newLowerValue = handleNumericInput(e.target.value, true);
      setLowerBound(newLowerValue);

      // Auto-calculate upper bound when lower bound changes
      if (newLowerValue && currentPrice) {
        const result = validateAndCalculateBounds(
          upperBound,
          newLowerValue,
          "lower",
        );
        setUpperBound(result.upper);
        setPriceError(result.error);
      } else {
        setPriceError("");
      }
    },
    [currentPrice, upperBound, validateAndCalculateBounds, handleNumericInput],
  );

  const handleGridLevelsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newGridLevels = handleNumericInput(e.target.value, false); // No decimal for grid levels
      setGridLevels(newGridLevels);

      // Validate grid levels
      const error = validateField("gridLevels", newGridLevels);
      setFieldErrors((prev) => ({ ...prev, gridLevels: error }));
    },
    [handleNumericInput, validateField],
  );

  const handleGridRatioChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newGridRatio = handleNumericInput(e.target.value, true);
      setGridRatio(newGridRatio);

      // Validate grid ratio
      const error = validateField("gridRatio", newGridRatio);
      setFieldErrors((prev) => ({ ...prev, gridRatio: error }));
    },
    [handleNumericInput, validateField],
  );

  const handleTotalMarginChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTotalMargin = handleNumericInput(e.target.value, true);
      setTotalMargin(newTotalMargin);

      // Validate total margin
      const error = validateField("totalMargin", newTotalMargin);
      setFieldErrors((prev) => ({ ...prev, totalMargin: error }));
    },
    [handleNumericInput, validateField],
  );

  const handleStopBotPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newStopBotPrice = handleNumericInput(e.target.value, true);
      setStopBotPrice(newStopBotPrice);

      // Validate stop bot price
      const error = validateField("stopBotPrice", newStopBotPrice);
      setFieldErrors((prev) => ({ ...prev, stopBotPrice: error }));
    },
    [handleNumericInput, validateField],
  );

  const handleStopTopPriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newStopTopPrice = handleNumericInput(e.target.value, true);
      setStopTopPrice(newStopTopPrice);

      // Validate stop top price
      const error = validateField("stopTopPrice", newStopTopPrice);
      setFieldErrors((prev) => ({ ...prev, stopTopPrice: error }));
    },
    [handleNumericInput, validateField],
  );

  const handleSubmit = useCallback(() => {
    const orderData: OrderData = {
      direction: direction,
      upper_bound: parseFloat(upperBound),
      lower_bound: parseFloat(lowerBound),
      grid_type: gridType,
      grid_ratio: gridType === "GEOMETRIC" ? parseFloat(gridRatio) : undefined,
      grid_levels: parseInt(gridLevels),
      total_margin: parseFloat(totalMargin),
      stop_bot_price:
        tpslEnabled && stopBotPrice ? parseFloat(stopBotPrice) : undefined,
      stop_top_price:
        tpslEnabled && stopTopPrice ? parseFloat(stopTopPrice) : undefined,
    };
    onOrderSubmit?.(orderData);
  }, [
    direction,
    upperBound,
    lowerBound,
    gridType,
    gridRatio,
    gridLevels,
    totalMargin,
    tpslEnabled,
    stopBotPrice,
    stopTopPrice,
    onOrderSubmit,
  ]);

  const isFormValid =
    upperBound &&
    lowerBound &&
    gridLevels &&
    totalMargin &&
    (gridType === "ARITHMETIC" || (gridType === "GEOMETRIC" && gridRatio)) &&
    !priceError &&
    Object.values(fieldErrors).every((error) => !error);

  return (
    <div
      className={`oui-box oui-rounded-2xl oui-bg-base-9 oui-size-width oui-relative ${className}`}
      style={{ width: "100%" }}
    >
      <div className="inner-content oui-transition-transform">
        <div className="oui-space-y-2 oui-text-base-contrast-54 xl:oui-space-y-3">
          {/* LONG/SHORT/BOTH Buttons */}
          <div className="oui-grid oui-w-full oui-flex-1 oui-gap-x-2 lg:oui-flex lg:oui-gap-x-[6px] oui-grid-cols-3">
            <button
              className={`oui-button oui-inline-flex oui-items-center oui-justify-center oui-whitespace-nowrap oui-transition-colors disabled:oui-cursor-not-allowed disabled:oui-bg-base-3 disabled:oui-text-base-contrast-36 disabled:hover:oui-bg-base-3 oui-px-3 oui-rounded-md oui-h-8 oui-text-sm oui-w-full ${
                direction === "LONG"
                  ? "oui-bg-success-darken oui-text-primary-contrast"
                  : "oui-bg-base-7 oui-text-base-contrast-36 hover:oui-bg-base-6 active:oui-bg-base-6"
              }`}
              onClick={() => handleDirectionChange("LONG")}
              data-type="LONG"
            >
              Long
            </button>
            <button
              className={`oui-button oui-inline-flex oui-items-center oui-justify-center oui-whitespace-nowrap oui-transition-colors disabled:oui-cursor-not-allowed disabled:oui-bg-base-3 disabled:oui-text-base-contrast-36 disabled:hover:oui-bg-base-3 oui-px-3 oui-rounded-md oui-h-8 oui-text-sm oui-w-full ${
                direction === "SHORT"
                  ? "oui-bg-danger-darken oui-text-primary-contrast"
                  : "oui-bg-base-7 oui-text-base-contrast-36 hover:oui-bg-base-6 active:oui-bg-base-6"
              }`}
              onClick={() => handleDirectionChange("SHORT")}
              data-type="SHORT"
            >
              Short
            </button>
            <button
              className={`oui-button oui-inline-flex oui-items-center oui-justify-center oui-whitespace-nowrap oui-transition-colors disabled:oui-cursor-not-allowed disabled:oui-bg-base-3 disabled:oui-text-base-contrast-36 disabled:hover:oui-bg-base-3 oui-px-3 oui-rounded-md oui-h-8 oui-text-sm oui-w-full ${
                direction === "BOTH"
                  ? "oui-bg-primary-darken oui-text-primary-contrast"
                  : "oui-bg-base-7 oui-text-base-contrast-36 hover:oui-bg-base-6 active:oui-bg-base-6"
              }`}
              onClick={() => handleDirectionChange("BOTH")}
              data-type="BOTH"
            >
              Both
            </button>
          </div>

          <div className="oui-grid oui-w-full oui-flex-1 oui-gap-x-2 lg:oui-flex lg:oui-gap-x-[6px] oui-grid-cols-2">
            {/* Grid Type Selection */}
            <div className="oui-w-full">
              <div className="oui-relative">
                <button
                  type="button"
                  className="oui-flex oui-group oui-w-full oui-items-center oui-justify-between oui-whitespace-nowrap oui-rounded-md oui-px-2 oui-shadow-sm oui-text-base-contrast-54 placeholder:oui-text-base-contrast-54 data-[state=open]:oui-text-base-contrast-80 focus:oui-outline-none focus:oui-ring-1 disabled:oui-cursor-not-allowed disabled:oui-opacity-50 [&>span]:oui-line-clamp-1 oui-border oui-h-8 oui-text-xs oui-cursor-pointer oui-font-semibold focus:oui-ring-transparent oui-bg-base-6 oui-border-line"
                  onClick={() => setIsGridTypeOpen(!isGridTypeOpen)}
                >
                  <span className="oui-text-xs oui-w-full">{gridType}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="none"
                    viewBox="0 0 24 24"
                    className={`oui-transition-transform ${isGridTypeOpen ? "oui-rotate-180" : "oui-rotate-0"} oui-text-inherit`}
                    aria-hidden="true"
                  >
                    <path
                      fill="currentcolor"
                      fillOpacity="1"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.007 7.996c-.824 0-1.276.935-.781 1.594l6 8a.994.994 0 0 0 1.593 0l6-8c.495-.66.012-1.594-.812-1.594h-12Z"
                    ></path>
                  </svg>
                </button>
                {isGridTypeOpen && (
                  <div className="oui-absolute oui-top-full oui-left-0 oui-w-full oui-mt-1 oui-bg-base-6 oui-border oui-border-line oui-rounded-md oui-shadow-lg oui-z-10">
                    <button
                      className="oui-w-full oui-px-2 oui-py-2 oui-text-center oui-text-xs hover:oui-bg-base-5"
                      onClick={() => {
                        setGridType("ARITHMETIC");
                        setIsGridTypeOpen(false);
                      }}
                    >
                      ARITHMETIC
                    </button>
                    <button
                      className="oui-w-full oui-px-2 oui-py-2 oui-text-center oui-text-xs hover:oui-bg-base-5 disabled:oui-cursor-not-allowed disabled:oui-opacity-50 disabled:hover:oui-bg-transparent disabled:oui-text-base-contrast-20"
                      onClick={() => {
                        setGridType("GEOMETRIC");
                        setIsGridTypeOpen(false);
                      }}
                      disabled
                    >
                      GEOMETRIC
                    </button>
                  </div>
                )}
              </div>
            </div>
            <LeverageBadge
              symbol={symbol}
              side={side}
              symbolLeverage={symbolLeverage}
            />
          </div>

          {/* Upper and Lower Bound Inputs */}
          <div className="oui-box oui-grid oui-grid-cols-2 oui-group oui-space-x-1">
            <div>
              <div
                className={`oui-bg-base-6 oui-flex oui-items-center oui-outline oui-outline-offset-0 oui-outline-1 oui-outline-transparent focus-within:oui-outline-primary-light oui-input-root orderly-order-entry oui-relative oui-h-[54px] oui-rounded oui-border oui-border-solid oui-px-2 oui-py-1 ${
                  priceError && priceError.includes("Upper bound")
                    ? "oui-border-danger"
                    : "oui-border-line"
                }`}
              >
                <label
                  htmlFor="upper_bound_input"
                  className="oui-absolute oui-left-2 oui-top-[7px] oui-text-2xs oui-text-base-contrast-36"
                >
                  Upper Bound
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="0"
                  name="upper_bound_input"
                  className={`oui-w-full oui-bg-transparent oui-flex-1 focus-visible:oui-outline-none oui-flex placeholder:oui-text-base-contrast-20 oui-tabular-nums autofill:oui-bg-transparent oui-input-input disabled:oui-cursor-not-allowed oui-peer oui-text-sm placeholder:oui-text-sm oui-mb-1 oui-mt-5 oui-h-5 ${
                    priceError && priceError.includes("Upper bound")
                      ? "oui-text-danger"
                      : "oui-text-white"
                  }`}
                  id="upper_bound_input"
                  value={upperBound}
                  onChange={handleUpperBoundChange}
                />
                <label
                  htmlFor="upper_bound_input"
                  className="oui-h-full oui-flex oui-flex-col oui-px-2 oui-absolute oui-right-0 oui-top-0 oui-justify-start oui-py-2 oui-text-2xs oui-text-base-contrast-36"
                >
                  USDC
                </label>
              </div>
            </div>
            <div>
              <div
                className={`oui-bg-base-6 oui-flex oui-items-center oui-outline oui-outline-offset-0 oui-outline-1 oui-outline-transparent focus-within:oui-outline-primary-light oui-input-root orderly-order-entry oui-relative oui-h-[54px] oui-rounded oui-border oui-border-solid oui-px-2 oui-py-1 ${
                  priceError && priceError.includes("Lower bound")
                    ? "oui-border-danger"
                    : "oui-border-line"
                }`}
              >
                <label
                  htmlFor="lower_bound_input"
                  className="oui-absolute oui-left-2 oui-top-[7px] oui-text-2xs oui-text-base-contrast-36"
                >
                  Lower Bound
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="0"
                  name="lower_bound_input"
                  className={`oui-w-full oui-bg-transparent oui-flex-1 focus-visible:oui-outline-none oui-flex placeholder:oui-text-base-contrast-20 oui-tabular-nums autofill:oui-bg-transparent oui-input-input disabled:oui-cursor-not-allowed oui-peer oui-text-sm placeholder:oui-text-sm oui-mb-1 oui-mt-5 oui-h-5 ${
                    priceError && priceError.includes("Lower bound")
                      ? "oui-text-danger"
                      : "oui-text-white"
                  }`}
                  id="lower_bound_input"
                  value={lowerBound}
                  onChange={handleLowerBoundChange}
                />
                <label
                  htmlFor="lower_bound_input"
                  className="oui-h-full oui-flex oui-flex-col oui-px-2 oui-absolute oui-right-0 oui-top-0 oui-justify-start oui-py-2 oui-text-2xs oui-text-base-contrast-36"
                >
                  USDC
                </label>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {priceError && (
            <div className="oui-text-danger oui-text-xs oui-mt-1">
              {priceError}
            </div>
          )}

          {/* Grid Levels and Grid Ratio Inputs */}
          <div className="oui-box oui-grid oui-grid-cols-2 oui-group oui-space-x-1">
            <div>
              <div
                className={`oui-bg-base-6 oui-flex oui-items-center oui-outline oui-outline-offset-0 oui-outline-1 oui-outline-transparent focus-within:oui-outline-primary-light oui-input-root orderly-order-entry oui-relative oui-h-[54px] oui-rounded oui-border oui-border-solid oui-px-2 oui-py-1 ${
                  fieldErrors.gridLevels
                    ? "oui-border-danger"
                    : "oui-border-line"
                }`}
              >
                <label
                  htmlFor="grid_levels_input"
                  className="oui-absolute oui-left-2 oui-top-[7px] oui-text-2xs oui-text-base-contrast-36"
                >
                  Grid Levels
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="5"
                  name="grid_levels_input"
                  className={`oui-w-full oui-bg-transparent oui-flex-1 focus-visible:oui-outline-none oui-flex placeholder:oui-text-base-contrast-20 oui-tabular-nums autofill:oui-bg-transparent oui-input-input disabled:oui-cursor-not-allowed oui-peer oui-text-sm placeholder:oui-text-sm oui-mb-1 oui-mt-5 oui-h-5 ${
                    fieldErrors.gridLevels
                      ? "oui-text-danger"
                      : "oui-text-white"
                  }`}
                  id="grid_levels_input"
                  value={gridLevels}
                  onChange={handleGridLevelsChange}
                />
              </div>
              {fieldErrors.gridLevels && (
                <div className="oui-text-danger oui-text-xs oui-mt-1">
                  {fieldErrors.gridLevels}
                </div>
              )}
            </div>
            <div>
              <div
                className={`oui-bg-base-6 oui-flex oui-items-center oui-outline oui-outline-offset-0 oui-outline-1 oui-outline-transparent focus-within:oui-outline-primary-light oui-input-root orderly-order-entry oui-relative oui-h-[54px] oui-rounded oui-border oui-border-solid oui-px-2 oui-py-1 ${
                  gridType === "ARITHMETIC" ? "oui-opacity-50" : ""
                } ${fieldErrors.gridRatio ? "oui-border-danger" : "oui-border-line"}`}
              >
                <label
                  htmlFor="grid_ratio_input"
                  className="oui-absolute oui-left-2 oui-top-[7px] oui-text-2xs oui-text-base-contrast-36"
                >
                  Grid Ratio
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="0.01"
                  name="grid_ratio_input"
                  className={`oui-w-full oui-bg-transparent oui-flex-1 focus-visible:oui-outline-none oui-flex placeholder:oui-text-base-contrast-20 oui-tabular-nums autofill:oui-bg-transparent oui-input-input disabled:oui-cursor-not-allowed oui-peer oui-text-sm placeholder:oui-text-sm oui-mb-1 oui-mt-5 oui-h-5 ${
                    fieldErrors.gridRatio ? "oui-text-danger" : "oui-text-white"
                  }`}
                  id="grid_ratio_input"
                  value={gridRatio}
                  onChange={handleGridRatioChange}
                  disabled={gridType === "ARITHMETIC"}
                />
              </div>
              {fieldErrors.gridRatio && (
                <div className="oui-text-danger oui-text-xs oui-mt-1">
                  {fieldErrors.gridRatio}
                </div>
              )}
            </div>
          </div>

          {/* Total Margin Input */}
          <div className="oui-group oui-relative oui-w-full">
            <div
              className={`oui-bg-base-6 oui-flex oui-items-center oui-outline oui-outline-offset-0 oui-outline-1 oui-outline-transparent focus-within:oui-outline-primary-light oui-input-root orderly-order-entry oui-relative oui-h-[54px] oui-rounded oui-border oui-border-solid oui-px-2 oui-py-1 ${
                fieldErrors.totalMargin
                  ? "oui-border-danger"
                  : "oui-border-line"
              }`}
            >
              <label
                htmlFor="total_margin_input"
                className="oui-absolute oui-left-2 oui-top-[7px] oui-text-2xs oui-text-base-contrast-36"
              >
                Total Margin
              </label>
              <input
                type="text"
                autoComplete="off"
                placeholder="0"
                name="total_margin_input"
                className={`oui-w-full oui-bg-transparent oui-flex-1 focus-visible:oui-outline-none oui-flex placeholder:oui-text-base-contrast-20 oui-tabular-nums autofill:oui-bg-transparent oui-input-input disabled:oui-cursor-not-allowed oui-peer oui-text-sm placeholder:oui-text-sm oui-mb-1 oui-mt-5 oui-h-5 ${
                  fieldErrors.totalMargin ? "oui-text-danger" : "oui-text-white"
                }`}
                id="total_margin_input"
                value={totalMargin}
                onChange={handleTotalMarginChange}
              />
              <div className="oui-box oui-flex oui-flex-col oui-items-end oui-justify-start oui-flex-nowrap oui-order-entry-limit-price-input-suffix oui-text-2xs">
                USDC
              </div>
            </div>
            {fieldErrors.totalMargin && (
              <div className="oui-text-danger oui-text-xs oui-mt-1">
                {fieldErrors.totalMargin}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            className={`oui-button oui-inline-flex oui-items-center oui-justify-center oui-whitespace-nowrap oui-transition-colors disabled:oui-cursor-not-allowed disabled:oui-bg-base-3 disabled:oui-text-base-contrast-36 disabled:hover:oui-bg-base-3 oui-px-3 oui-rounded-md oui-h-10 oui-text-base oui-w-full oui-text-primary-contrast ${
              direction === "LONG"
                ? "oui-bg-success-darken hover:oui-bg-success-darken/80 active:oui-bg-success-darken/80"
                : direction === "SHORT"
                  ? "oui-bg-danger-darken hover:oui-bg-danger-darken/80 active:oui-bg-danger-darken/80"
                  : "oui-bg-primary-darken hover:oui-bg-primary-darken/80 active:oui-bg-primary-darken/80"
            }`}
            disabled={!isFormValid}
            onClick={handleSubmit}
          >
            Start Grid Bot ({direction})
          </button>

          {/* Divider */}
          <div className="oui-pointer-events-none oui-box-content oui-border-line-4 oui-border-b oui-w-full"></div>

          {/* TP/SL Section */}
          <div>
            <div className="oui-box oui-flex oui-flex-row oui-items-center oui-justify-between oui-flex-nowrap">
              <div className="oui-box oui-flex oui-flex-row oui-items-center oui-justify-start oui-flex-nowrap oui-gap-x-1">
                <button
                  type="button"
                  role="button"
                  aria-checked={tpslEnabled}
                  className={`peer oui-inline-flex oui-w-[36px] oui-shrink-0 oui-cursor-pointer oui-items-center oui-rounded-full oui-border-transparent oui-shadow-sm oui-transition-all oui-duration-300 oui-ease-in-out focus-visible:oui-outline-none focus-visible:oui-ring-2 focus-visible:oui-ring-ring focus-visible:oui-ring-offset-2 focus-visible:oui-ring-offset-background disabled:oui-cursor-not-allowed disabled:oui-opacity-50 oui-h-[18px] ${
                    tpslEnabled ? "oui-bg-success-darken" : "oui-bg-base-1"
                  }`}
                  onClick={() => setTpslEnabled(!tpslEnabled)}
                >
                  <span
                    className="oui-pointer-events-none oui-block oui-h-[14px] oui-w-[14px] oui-rounded-full oui-bg-primary-contrast oui-shadow-lg oui-ring-0 oui-transition-all oui-duration-300 oui-ease-in-out"
                    style={{
                      transform: tpslEnabled
                        ? "translateX(20px)"
                        : "translateX(2px)",
                    }}
                  ></span>
                </button>
                <label className="oui-text-xs">Stop Loss / Take Profit</label>
              </div>
            </div>

            {/* TP/SL Inputs */}
            {tpslEnabled && (
              <div className="oui-mt-2 oui-space-y-1">
                <div className="oui-box oui-grid oui-grid-cols-2 oui-gap-x-1">
                  <div>
                    <div
                      className={`oui-rounded oui-bg-base-6 oui-flex oui-items-center oui-outline oui-outline-offset-0 oui-outline-1 oui-outline-transparent focus-within:oui-outline-primary-light oui-input-root oui-h-8 oui-pl-0 oui-pr-2 md:oui-pr-3 ${
                        fieldErrors.stopBotPrice
                          ? "oui-border-danger"
                          : "oui-border-line"
                      }`}
                    >
                      <label
                        htmlFor="stop_bot_price"
                        className="oui-h-full oui-flex oui-flex-col oui-justify-center oui-px-2 oui-text-2xs oui-text-base-contrast-54 oui-pr-1 md:oui-pr-2"
                      >
                        Stop Loss
                      </label>
                      <input
                        type="text"
                        placeholder="USDC"
                        autoComplete="off"
                        className={`oui-w-full oui-bg-transparent oui-flex-1 focus-visible:oui-outline-none oui-flex placeholder:oui-text-base-contrast-20 oui-tabular-nums autofill:oui-bg-transparent oui-input-input disabled:oui-cursor-not-allowed oui-peer oui-text-2xs placeholder:oui-text-2xs oui-h-5 ${
                          fieldErrors.stopBotPrice
                            ? "oui-text-danger"
                            : "oui-text-white"
                        }`}
                        id="stop_bot_price"
                        value={stopBotPrice}
                        onChange={handleStopBotPriceChange}
                      />
                    </div>
                    {fieldErrors.stopBotPrice && (
                      <div className="oui-text-danger oui-text-xs oui-mt-1">
                        {fieldErrors.stopBotPrice}
                      </div>
                    )}
                  </div>
                  <div>
                    <div
                      className={`oui-rounded oui-bg-base-6 oui-flex oui-items-center oui-outline oui-outline-offset-0 oui-outline-1 oui-outline-transparent focus-within:oui-outline-primary-light oui-input-root oui-h-8 oui-pl-0 oui-pr-2 md:oui-pr-3 ${
                        fieldErrors.stopTopPrice
                          ? "oui-border-danger"
                          : "oui-border-line"
                      }`}
                    >
                      <label
                        htmlFor="stop_top_price"
                        className="oui-h-full oui-flex oui-flex-col oui-justify-center oui-px-2 oui-text-2xs oui-text-base-contrast-54 oui-pr-1 md:oui-pr-2"
                      >
                        Take Profit
                      </label>
                      <input
                        type="text"
                        placeholder="USDC"
                        autoComplete="off"
                        className={`oui-w-full oui-bg-transparent oui-flex-1 focus-visible:oui-outline-none oui-flex placeholder:oui-text-base-contrast-20 oui-tabular-nums autofill:oui-bg-transparent oui-input-input disabled:oui-cursor-not-allowed oui-peer oui-text-2xs placeholder:oui-text-2xs oui-h-5 ${
                          fieldErrors.stopTopPrice
                            ? "oui-text-danger"
                            : "oui-text-white"
                        }`}
                        id="stop_top_price"
                        value={stopTopPrice}
                        onChange={handleStopTopPriceChange}
                      />
                    </div>
                    {fieldErrors.stopTopPrice && (
                      <div className="oui-text-danger oui-text-xs oui-mt-1">
                        {fieldErrors.stopTopPrice}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomOrderEntry;
