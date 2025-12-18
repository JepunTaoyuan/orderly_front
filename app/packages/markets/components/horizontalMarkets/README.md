# HorizontalMarkets Component

A markets component that displays market data with tabs, search, and a data table - similar to ExpandMarketsWidget.

## Features

- **Tabbed Navigation**: Switch between Favorites, All, RWA, New Listings, and Recent markets
- **Search**: Filter markets by symbol using the search input
- **Data Table**: Displays market data with sorting capabilities
- **Interactive**: Click on any market row to select it
- **Responsive**: Adapts to different screen sizes

## Usage

### Basic Usage

```tsx
import { HorizontalMarketsWidget } from "@orderly.network/markets";

<HorizontalMarketsWidget
  symbol={currentSymbol}
  onSymbolChange={handleSymbolChange}
/>;
```

### With Controlled Tab State

```tsx
import { MarketsTabName } from "@orderly.network/markets";

const [activeTab, setActiveTab] = useState(MarketsTabName.All);

<HorizontalMarketsWidget
  symbol={currentSymbol}
  onSymbolChange={handleSymbolChange}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>;
```

### With Custom Styling

```tsx
<HorizontalMarketsWidget
  symbol={currentSymbol}
  onSymbolChange={handleSymbolChange}
  className="oui-h-[300px]"
/>
```

## Props

### HorizontalMarketsWidgetProps

| Prop             | Type                              | Default            | Description                           |
| ---------------- | --------------------------------- | ------------------ | ------------------------------------- |
| `symbol`         | `string`                          | -                  | Current selected symbol               |
| `onSymbolChange` | `(symbol: API.Symbol) => void`    | -                  | Callback when symbol changes          |
| `activeTab`      | `MarketsTabName`                  | `MarketsTabName.All` | Active tab (controlled mode)         |
| `onTabChange`    | `(tab: MarketsTabName) => void`   | -                  | Callback when tab changes             |
| `className`      | `string`                          | `undefined`        | Additional CSS classes                |

### MarketsTabName Options

- `MarketsTabName.Favorites` - User's favorite markets
- `MarketsTabName.All` - All available markets
- `MarketsTabName.Rwa` - RWA markets
- `MarketsTabName.NewListing` - Newly listed markets
- `MarketsTabName.Recent` - Recently viewed markets

## Component Structure

The component follows the established pattern:

- **`horizontalMarkets.script.ts`**: Tab state management and sort state logic
- **`horizontalMarkets.ui.tsx`**: UI component with Tabs, SearchInput, and MarketsListWidget
- **`horizontalMarkets.widget.tsx`**: Widget wrapper with MarketsProvider
- **`index.ts`**: Exports for the component

## Styling

The component uses Orderly's design system classes:

- `oui-bg-base-9`: Background color
- `oui-rounded-[12px]`: Rounded corners
- `oui-overflow-hidden`: Hidden overflow for clean appearance
- `oui-font-semibold`: Semibold font weight
