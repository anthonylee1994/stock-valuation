# Stock Valuation Dashboard

一個現代化、即時嘅股票估值追蹤應用程式，用 React、TypeScript 同 HeroUI 起嘅。可以監察股票同自訂估值範圍嘅對比，搵出美股同港股市場入面被低估或者高估嘅機會。

🔗 **線上 Demo**: [https://valuation.on99.app](https://valuation.on99.app)

## 功能

- 📊 **即時股票報價** - 每 10 秒更新一次即時價格
- 🎯 **估值範圍** - 為每隻股票設定自訂估值範圍
- 📈 **視覺指標** - 用顏色區分嘅卡片顯示低估、合理估值同高估嘅股票
- 🌍 **多市場支援** - 同時追蹤美股同港股
- 🔄 **自動更新** - 自動輪詢加上視覺脈衝指示
- 📱 **響應式設計** - 靚仔嘅 UI，喺所有裝置都用得
- 🎨 **現代化 UI** - 用 HeroUI React v3 同 Tailwind CSS 起嘅
- 💾 **持久化設定** - 排序同市場篩選偏好會儲存喺本地

## 技術棧

- **前端框架**: React 19
- **語言**: TypeScript
- **UI 庫**: HeroUI React v3
- **樣式**: Tailwind CSS 4
- **狀態管理**: Zustand
- **建置工具**: Vite
- **路由**: React Router v7
- **部署**: GitHub Pages

## 開始使用

### 前置條件

- Node.js 22+
- pnpm 10+

### 安裝

1. Clone 個 repo：
```bash
git clone https://github.com/yourusername/stock-valuation.git
cd stock-valuation
```

2. 安裝依賴：
```bash
pnpm install
```

3. 喺根目錄建立一個 `.env` 檔案：
```env
VITE_QUOTES_API_URL=your_quotes_api_url
```

4. 啟動開發伺服器：
```bash
pnpm dev
```

個應用程式會喺 `http://localhost:5173` 用得到

## 可用嘅指令

- `pnpm dev` - 啟動開發伺服器
- `pnpm build` - 建置生產版本
- `pnpm preview` - 預覽生產版本
- `pnpm lint` - 跑 ESLint
- `pnpm format` - 用 Prettier 格式化程式碼

## 專案結構

```
stock-valuation/
├── src/
│   ├── components/          # React 元件
│   │   ├── Header.tsx       # App 標題同更新資訊
│   │   ├── LoadingSpinner.tsx
│   │   ├── SortButtonGroup.tsx
│   │   ├── StockCard/       # 股票卡片元件同子元件
│   │   │   ├── index.tsx
│   │   │   ├── PriceCard/
│   │   │   ├── ValuationBar.tsx
│   │   │   ├── ValuationRangeDisplay.tsx
│   │   │   └── PotentialDisplay.tsx
│   │   └── StockGrid.tsx
│   ├── store/              # Zustand store
│   │   └── useStockStore.ts
│   ├── utils/              # 工具函式
│   │   └── sortStocks.ts
│   ├── types.ts            # TypeScript 型別定義
│   ├── valuation.ts        # 估值邏輯
│   ├── app.tsx             # 主 App 元件
│   └── main.tsx            # App 入口
├── public/                 # 靜態資源
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages 部署
└── package.json
```

## 點樣運作

1. **估值資料**: 定義股票同自訂估值範圍（低同高目標價）
2. **即時報價**: 從報價 API 攞當前價格同指標
3. **狀態計算**: 判斷股票係被低估、合理估值定係被高估
4. **視覺回饋**: 用顏色區分嘅卡片加上視覺指示：
   - 🟢 綠色：低估（低過估值下限）
   - 🟡 黃色：合理估值（喺範圍之內）
   - 🔴 紅色：高估（高過估值上限）
5. **上升潛力**: 顯示到估值上限嘅百分比上升空間

## 設定

### 加入股票

喺源碼入面編輯估值資料嚟加入或修改股票：

```typescript
{
  symbol: "AAPL",
  market: "US",
  valuationLow: 150,
  valuationHigh: 180
}
```

### 市場代碼

- **美股**: 標準股票代號（例如 `AAPL`、`MSFT`）
- **港股**: 用 `.HK` 後綴（例如 `0700.HK`、`9988.HK`）

## 部署

個 App 會喺每次 push 去 `main` branch 嗰陣透過 GitHub Actions 自動部署去 GitHub Pages。

### 手動部署

```bash
pnpm run build
```

Build 完嘅檔案會放喺 `dist/` 目錄入面。

### 環境變數

喺你 GitHub repo 嘅設定入面 **Settings > Secrets and variables > Actions > Variables** 設定以下變數：

- `VITE_QUOTES_API_URL`: 你嘅報價 API 端點

## 功能詳情

### 即時更新
- 每 10 秒輪詢報價 API
- 更新時有視覺脈衝動畫
- 顯示上次更新嘅時間

### 排序
- 按上升潛力排序（升序／降序）
- 偏好設定會儲存喺 localStorage

### 市場篩選
- 喺美股同港股之間切換
- 篩選偏好會儲存喺本地

### 股票指標
- 當前價格同升跌指示
- 盤前／盤後價格（有嘅話）
- 預期市盈率（Forward P/E）
- 市帳率（Price-to-Book）
- 股息率

## 瀏覽器支援

- Chrome（最新版）
- Firefox（最新版）
- Safari（最新版）
- Edge（最新版）

## 貢獻

歡迎貢獻！隨時提交 Pull Request 啦。

## 授權

呢個專案係開源嘅，採用 [MIT License](LICENSE)。

## 鳴謝

- 用 [HeroUI React](https://heroui.com/) 起嘅
- 由 [Vite](https://vitejs.dev/) 驅動
- 用 [Tailwind CSS](https://tailwindcss.com/) 做樣式

---

用 ❤️ 整嘅，為咗更聰明嘅投資
