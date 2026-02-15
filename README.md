# Stock Valuation Dashboard

A modern, real-time stock valuation tracking application built with React, TypeScript, and HeroUI. Monitor stocks against custom valuation ranges and identify undervalued or overvalued opportunities in US and Hong Kong markets.

🔗 **Live Demo**: [https://valuation.on99.app](https://valuation.on99.app)

## Features

- 📊 **Real-time Stock Quotes** - Live price updates every 10 seconds
- 🎯 **Valuation Ranges** - Set custom valuation ranges for each stock
- 📈 **Visual Indicators** - Color-coded cards showing undervalued, fair value, and overvalued stocks
- 🔔 **Net Net Value Notifications** - Browser push notifications when stocks reach net net value (valuation low)
- 🔄 **Background Monitoring** - Service Worker continues monitoring even when app is closed
- 🌍 **Multi-Market Support** - Track both US and Hong Kong stocks
- 🔄 **Auto-Refresh** - Automatic polling with visual pulse indicators
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🎨 **Modern UI** - Built with HeroUI React v3 and Tailwind CSS
- 💾 **Persistent Settings** - Sort order and market filter preferences saved locally
- 📲 **PWA Support** - Install as a Progressive Web App for native-like experience

## Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **UI Library**: HeroUI React v3
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/stock-valuation.git
cd stock-valuation
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the root directory:

```env
VITE_QUOTES_API_URL=your_quotes_api_url
```

4. Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `pnpm dev` - Start development server with Service Worker enabled
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

**Note**: Service Worker is enabled in development mode for testing. Check browser DevTools > Application > Service Workers to verify registration.

## Project Structure

```
stock-valuation/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx       # App header with title and refresh info
│   │   ├── LoadingSpinner.tsx
│   │   ├── SortButtonGroup.tsx
│   │   ├── StockCard/       # Stock card component and subcomponents
│   │   │   ├── index.tsx
│   │   │   ├── PriceCard/
│   │   │   ├── ValuationBar.tsx
│   │   │   ├── ValuationRangeDisplay.tsx
│   │   │   └── PotentialDisplay.tsx
│   │   └── StockGrid.tsx
│   ├── store/              # Zustand store
│   │   └── useStockStore.ts
│   ├── utils/              # Utility functions
│   │   └── sortStocks.ts
│   ├── types.ts            # TypeScript type definitions
│   ├── valuation.ts        # Valuation logic
│   ├── app.tsx             # Main app component
│   └── main.tsx            # App entry point
├── public/                 # Static assets
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deployment
└── package.json
```

## How It Works

1. **Valuation Data**: Define stocks with custom valuation ranges (low and high targets)
2. **Real-time Quotes**: Fetches current prices and metrics from a quotes API
3. **Status Calculation**: Determines if stocks are undervalued, fairly valued, or overvalued
4. **Visual Feedback**: Color-coded cards with visual indicators:
    - 🟢 Green: Undervalued (below valuation low)
    - 🟡 Yellow: Fair value (within range)
    - 🔴 Red: Overvalued (above valuation high)
5. **Upside Potential**: Shows percentage upside to valuation high

## Configuration

### Adding Stocks

Edit the valuation data in your source code to add or modify stocks:

```typescript
{
  symbol: "AAPL",
  market: "US",
  valuationLow: 150,
  valuationHigh: 180
}
```

### Market Codes

- **US Stocks**: Standard ticker symbols (e.g., `AAPL`, `MSFT`)
- **Hong Kong Stocks**: Use `.HK` suffix (e.g., `0700.HK`, `9988.HK`)

## Deployment

The app automatically deploys to GitHub Pages on every push to the `main` branch via GitHub Actions.

### Manual Deployment

```bash
pnpm run build
```

The built files will be in the `dist/` directory.

### Environment Variables

Set the following in your GitHub repository settings under **Settings > Secrets and variables > Actions > Variables**:

- `VITE_QUOTES_API_URL`: Your quotes API endpoint

## Features in Detail

### Real-time Updates

- Polls quotes API every 10 seconds
- Visual pulse animation on updates
- Displays last update timestamp

### Push Notifications

- Browser notifications when stocks reach net net value (valuation low)
- Toggle on/off in the header
- Automatic permission request
- Smart notification tracking (only notifies once per stock until it recovers above net net value)
- **Background monitoring via Service Worker** - continues checking even when app is closed or in background
- Works with Periodic Background Sync API (where supported) or falls back to interval checking
- Persistent monitoring across browser sessions

### Sorting

- Sort by upside potential (ascending/descending)
- Preference persisted to localStorage

### Market Filtering

- Toggle between US and Hong Kong markets
- Filter preference saved locally

### Stock Metrics

- Current price with change indicator
- Pre/post market prices (when available)
- Forward P/E ratio
- Price-to-Book ratio
- Dividend yield

## Browser Support

- Chrome (latest) - Full support including Periodic Background Sync
- Firefox (latest) - Service Worker + Notifications (no Periodic Background Sync)
- Safari (latest) - Service Worker + Notifications (iOS 16.4+)
- Edge (latest) - Full support including Periodic Background Sync

**Service Worker Features**:
- Background monitoring works best on Chrome/Edge with Periodic Background Sync
- Other browsers use interval-based checking as fallback
- See [SERVICE_WORKER.md](./SERVICE_WORKER.md) for detailed documentation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [HeroUI React](https://heroui.com/)
- Powered by [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ for smarter investing
