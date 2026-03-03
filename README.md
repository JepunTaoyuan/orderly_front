# Dexless 去中心化交易所前端

## 專案簡介

Dexless 是一個基於 [Orderly Network SDK v2](https://orderly.network) 構建的現代化去中心化交易所 (DEX) 前端應用。採用 Remix 全棧框架開發，提供完整的數字資產交易、投資組合管理、網格策略交易等功能。

### 主要特色

- 🔐 **多錢包支援** - 整合 Privy 錢包連接器，支援多種主流錢包
- 📊 **專業交易介面** - 整合 TradingView 圖表，提供專業級交易體驗
- 🌐 **多語言支援** - 支援英文、簡體中文、繁體中文等多種語言
- 🤖 **網格策略交易** - 內建自動化網格交易策略功能
- 💰 **Swap 功能** - 整合 WooFi Swap Widget 提供快速代幣兌換
- 🏆 **排行榜與獎勵** - 交易競賽排行榜及推薦獎勵系統
- 🔒 **Vaults 保管庫** - 資產管理與收益功能
- 📱 **響應式設計** - 完整支援桌面與移動裝置

## 技術棧

### 核心框架
- **[Remix](https://remix.run)** - 全棧 React 框架，支援 SSR
- **[React 18](https://react.dev)** - 使用者介面函式庫
- **[TypeScript](https://www.typescriptlang.org)** - 型別安全的 JavaScript 超集
- **[Vite](https://vitejs.dev)** - 新世代前端建構工具

### UI 與樣式
- **[Tailwind CSS](https://tailwindcss.com)** - 實用優先的 CSS 框架
- **[Framer Motion](https://www.framer.com/motion)** - React 動畫函式庫
- **[Tailwind Variants](https://www.tailwind-variants.org)** - 型別安全的變體設計

### Orderly Network SDK
專案整合了完整的 Orderly Network SDK 套件：
- `@orderly.network/core` - 核心功能
- `@orderly.network/hooks` - React Hooks
- `@orderly.network/trading` - 交易功能
- `@orderly.network/portfolio` - 投資組合管理
- `@orderly.network/markets` - 市場資料
- `@orderly.network/wallet-connector-privy` - Privy 錢包連接
- `@orderly.network/trading-leaderboard` - 交易排行榜
- `@orderly.network/trading-rewards` - 交易獎勵
- `@orderly.network/affiliate` - 推薦聯盟計畫

### 開發工具
- **ESLint** - 程式碼品質檢查
- **Prettier** - 程式碼格式化
- **Husky** - Git hooks 管理
- **lint-staged** - 提交前程式碼檢查

## 專案結構

```
Dexless_front/
├── app/                          # 應用程式主目錄
│   ├── components/               # React 元件
│   │   ├── baseLayout/          # 基礎版面配置
│   │   ├── custom/              # 自定義元件
│   │   ├── icons/               # 圖示元件
│   │   ├── landingPageLayout/   # 首頁版面元件
│   │   └── orderlyProvider/     # Orderly SDK Provider
│   ├── contexts/                 # React Context 管理
│   ├── gridPage/                 # 網格交易頁面
│   │   ├── components/          # 網格交易相關元件
│   │   ├── hooks/               # 網格交易 Hooks
│   │   ├── pages/               # 網格交易頁面
│   │   ├── provider/            # 網格交易 Provider
│   │   ├── types/               # 類型定義
│   │   └── utils/               # 工具函式
│   ├── hooks/                    # 全域 React Hooks
│   ├── packages/                 # 功能模組套件
│   │   ├── affiliate/           # 推薦聯盟
│   │   ├── chart/               # 圖表元件
│   │   ├── markets/             # 市場資訊
│   │   ├── portfolio/           # 投資組合
│   │   ├── trading/             # 交易功能
│   │   ├── trading-leaderboard/ # 交易排行榜
│   │   ├── ui-connector/        # 錢包連接 UI
│   │   ├── ui-leverage/         # 槓桿設定 UI
│   │   ├── ui-order-entry/      # 訂單輸入 UI
│   │   ├── ui-orders/           # 訂單管理 UI
│   │   ├── ui-positions/        # 持倉管理 UI
│   │   ├── ui-scaffold/         # 基礎腳手架 UI
│   │   ├── ui-share/            # 共用 UI 元件
│   │   ├── ui-tpsl/             # 止盈止損 UI
│   │   ├── ui-transfer/         # 轉帳 UI
│   │   └── vaults/              # 保管庫功能
│   ├── routes/                   # Remix 路由
│   ├── services/                 # 業務邏輯服務
│   ├── styles/                   # 全域樣式
│   ├── utils/                    # 工具函式
│   ├── constant.ts               # 常數定義
│   ├── root.tsx                  # 應用程式根元件
│   ├── storage.ts                # 儲存管理
│   └── utils.ts                  # 通用工具
├── public/                       # 靜態資源
│   ├── fonts/                   # 字體檔案
│   ├── images/                  # 圖片資源
│   ├── locales/                 # 多語言翻譯檔案
│   └── tradingview/             # TradingView 函式庫
├── scripts/                      # 建構腳本
├── .husky/                       # Git hooks
├── Dockerfile                    # Docker 映像檔配置
├── package.json                  # 依賴套件管理
├── tsconfig.json                 # TypeScript 配置
├── vite.config.ts                # Vite 建構配置
├── .eslintrc.cjs                 # ESLint 配置
└── README.md                     # 專案說明文件
```

## 功能模組

### 1. 永續合約交易 (Perp Trading)
- 永續合約市場交易
- 即時價格與深度圖表
- 訂單簿與最近成交
- 限價單、市價單、止損單
- 槓桿調整（最高可調整槓桿倍數）

### 2. 網格策略交易 (Grid Strategy)
- 自動化網格交易策略
- 策略參數配置
- 策略執行監控
- 歷史收益追蹤

### 3. 投資組合管理 (Portfolio)
- **持倉 (Positions)** - 查看和管理當前持倉
- **訂單 (Orders)** - 訂單管理與歷史記錄
- **資產 (Assets)** - 資金概覽與充值/提現
- **歷史 (History)** - 完整交易歷史
- **費用等級 (Fee Tier)** - 交易費用折扣等級
- **API 金鑰 (API Key)** - API 金鑰管理（用於程式化交易）
- **設定 (Setting)** - 帳戶設定與偏好

### 4. Swap 代幣兌換
- 整合 WooFi Swap Widget
- 快速代幣兌換
- 最佳路徑選擇

### 5. 市場資訊 (Markets)
- 所有交易對市場資訊
- 24小時價格變化
- 成交量排行
- 市場搜尋與篩選

### 6. 交易獎勵 (Rewards)
- **交易獎勵** - 交易挖礦獎勵計畫
- **推薦聯盟** - 推薦好友獲得佣金

### 7. 排行榜 (Leaderboard)
- 交易競賽排名
- 收益率排行
- 獎勵分配

### 8. Vaults 保管庫
- 資產保管
- 收益管理
- 風險分散

## 快速開始

### 環境需求

- **Node.js** >= 20.0.0
- **npm** 或 **yarn**

### 安裝步驟

1. **克隆專案**

```bash
cd C:\Users\jerome\Desktop\DexlessEx\Dexless_front
```

2. **安裝依賴套件**

```bash
npm install
```

專案會自動執行以下後置安裝腳本：
- 複製多語言檔案
- 修補 abstract-esm 相容性
- 修補 ramda-es 相容性

3. **開發模式運行**

```bash
npm run dev
```

應用程式將在 `http://localhost:3000` 啟動（預設埠號）

4. **建構生產版本**

```bash
npm run build
```

建構完成後的檔案將輸出到 `build/` 目錄

5. **啟動生產伺服器**

```bash
npm start
```

## 可用指令

| 指令 | 說明 |
|------|------|
| `npm run dev` | 啟動開發伺服器（含熱重載） |
| `npm run build` | 建構生產版本 |
| `npm start` | 運行生產伺服器 |
| `npm run lint` | 執行 ESLint 程式碼檢查 |
| `npm run format` | 使用 Prettier 格式化程式碼 |
| `npm run typecheck` | 執行 TypeScript 類型檢查 |
| `npm run copyLocales` | 複製多語言檔案到 build 目錄 |

## Docker 部署

### 建立 Docker 映像檔

```bash
docker build -t dexless-frontend .
```

### 運行容器

```bash
docker run -p 3000:3000 dexless-frontend
```

容器將在埠號 3000 上運行，可透過 `http://localhost:3000` 訪問。

### Docker 映像特性

- 基於 Node.js 24 slim 版本
- 多階段建構優化映像大小
- 內建健康檢查支援（已安裝 curl）
- 生產環境優化配置

## 配置說明

### Broker 配置

專案配置為 Dexless broker：

```typescript
brokerId: "dexless"
brokerName: "dexless"
networkId: "mainnet"
```

### 錢包連接配置

使用 Privy 作為錢包連接提供者：
- 支援郵件登入
- 支援 Google、Twitter、Telegram 社交登入
- 支援 WalletConnect
- 支援注入式錢包（如 MetaMask）

### 網路環境

- **主網 (Mainnet)** - 生產環境
- 可根據需求切換至測試網路

## 開發指南

### 程式碼風格

專案使用 ESLint 和 Prettier 來確保程式碼品質：

- 儲存時自動格式化（需配置編輯器）
- Git commit 前自動執行 lint-staged
- 使用 `@trivago/prettier-plugin-sort-imports` 自動排序 import

### 檔案組織原則

- **元件** - 可重用的 UI 元件放在 `components/`
- **頁面** - 路由頁面放在 `routes/`，遵循 Remix 檔案路由規範
- **邏輯** - 業務邏輯封裝在 `services/` 或 `hooks/`
- **類型** - TypeScript 類型定義放在對應模組的 `types/` 目錄
- **樣式** - 全域樣式放在 `styles/`，元件樣式使用 Tailwind CSS

### 路由結構

專案使用 Remix 的檔案路由系統，並支援多語言路徑：

```
/$lang/landingPage      - 首頁
/$lang/perp/$symbol     - 永續合約交易頁面
/$lang/strategy/$symbol - 網格策略交易頁面
/$lang/portfolio        - 投資組合
/$lang/markets          - 市場資訊
/$lang/swap             - 代幣兌換
/$lang/leaderboard      - 排行榜
/$lang/rewards          - 獎勵中心
/$lang/vaults           - 保管庫
```

### 新增功能模組

1. 在 `app/packages/` 下建立新模組資料夾
2. 建立元件、hooks、類型定義
3. 在 `app/routes/` 下建立對應路由
4. 在 `app/constant.ts` 中新增路徑定義
5. 更新導航選單（如需要）

## API 代理配置

專案包含 API 代理路由用於後端通訊：

- `api.proxy.grid.$` - 網格交易 API 代理
- `api.proxy.referral.$` - 推薦系統 API 代理

## 國際化 (i18n)

### 支援語言

專案支援以下語言：
- 🇬🇧 English (en)
- 🇨🇳 简体中文 (zh)
- 🇹🇼 繁體中文 (tc)
- 🇯🇵 日本語 (ja)
- 🇰🇷 한국어 (ko)
- 🇪🇸 Español (es)
- 🇫🇷 Français (fr)
- 🇩🇪 Deutsch (de)
- 🇮🇹 Italiano (it)
- 🇵🇹 Português (pt)
- 🇷🇺 Русский (ru)
- 更多語言...

### 翻譯檔案位置

- 基礎翻譯：`public/locales/{lang}.json`
- 擴充翻譯：`public/locales/extend/{lang}.json`

### 新增翻譯

1. 在 `public/locales/` 中新增語言檔案
2. 在 `public/locales/extend/` 中新增擴充翻譯
3. 在 `orderlyProvider/index.tsx` 中註冊新語言

## 效能優化

### 建構優化

- **記憶體配置** - 使用 8GB 記憶體限制進行建構
- **程式碼分割** - Remix 自動進行路由層級的程式碼分割
- **Tree Shaking** - 移除未使用的程式碼
- **Polyfills** - 僅在需要時加載 Node.js polyfills

### SSR 配置

專案配置了 Server-Side Rendering，部分套件排除在外：
- Orderly Network SDK 套件在伺服器端渲染
- Solana、WooFi 等套件僅在客戶端載入

## 常見問題

### 建構記憶體不足

如遇到建構時記憶體不足，可調整 Node.js 記憶體限制：

```bash
cross-env NODE_OPTIONS=--max-old-space-size=8192 npm run build
```

### 模組解析問題

專案使用了 ESM 與 CJS 混合模組，已透過 `vite-plugin-cjs-interop` 處理相容性。
如遇到模組解析問題，請檢查 `vite.config.ts` 中的配置。

### Stream Polyfill 問題

專案為瀏覽器環境提供了自定義的 stream polyfill，解決 Node.js stream 模組在瀏覽器中的相容性問題。

## 參考文件

- [Orderly Network 官方網站](https://orderly.network)
- [Orderly JS SDK](https://github.com/OrderlyNetwork/js-sdk)
- [SDK 文件](https://orderly.network/docs/sdks)
- [Remix 文件](https://remix.run/docs)
- [Vite 文件](https://vitejs.dev/guide/)

## 授權

本專案為私有專案 (Private)

## 技術支援

如有技術問題或需要協助，請聯繫開發團隊。

---

**最後更新：2026年3月**
