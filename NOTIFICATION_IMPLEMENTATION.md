# 通知功能實現摘要

## 已完成的功能

### 1. 基本通知功能
- ✅ 瀏覽器推送通知
- ✅ 當股票跌至殘值時通知
- ✅ 通知開關（在 Header 中）
- ✅ 權限請求處理
- ✅ 智能通知追蹤（避免重複通知）

### 2. Service Worker 背景監控
- ✅ Service Worker 註冊和配置
- ✅ 背景價格檢查（每 60 秒）
- ✅ 即使應用關閉也能繼續監控
- ✅ Periodic Background Sync API 支持
- ✅ 備用方案（setInterval）
- ✅ 通知點擊處理（打開/聚焦應用）

### 3. 狀態同步
- ✅ 主應用和 Service Worker 之間的配置同步
- ✅ 通知狀態的持久化存儲
- ✅ 自動更新已通知股票列表
- ✅ 股票恢復到殘值以上時自動重置

## 新增文件

1. **src/utils/notificationHelper.ts**
   - 通知權限請求
   - 顯示通知
   - 檢查股票是否達到殘值
   - 貨幣格式化

2. **src/utils/serviceWorkerHelper.ts**
   - Service Worker 註冊
   - 配置發送到 Service Worker
   - 消息處理
   - Periodic Sync 請求

3. **src/components/NotificationToggle.tsx**
   - 通知開關 UI 組件
   - 使用 HeroUI Switch 組件
   - 鈴鐺圖標（開/關狀態）

4. **public/sw.js**
   - Service Worker 主文件
   - 背景價格檢查邏輯
   - 通知發送
   - 與主應用的消息通訊

5. **SERVICE_WORKER.md**
   - Service Worker 功能文檔
   - 使用說明
   - 技術細節
   - 調試指南

## 修改的文件

1. **src/store/useStockStore.ts**
   - 添加 notificationsEnabled 狀態
   - 添加 notifiedStocks 集合
   - 實現通知邏輯
   - Service Worker 集成

2. **src/components/Header.tsx**
   - 添加 NotificationToggle 組件
   - 更新布局以容納通知開關

3. **src/main.tsx**
   - Service Worker 註冊
   - 初始配置發送
   - 事件監聽器設置

4. **vite.config.ts**
   - 添加 vite-plugin-pwa
   - PWA 配置
   - Manifest 設置

5. **README.md**
   - 更新功能列表
   - 添加 Service Worker 說明
   - 更新瀏覽器支持信息

6. **package.json** (通過安裝)
   - vite-plugin-pwa
   - workbox-window

## 功能流程

### 啟用通知時
1. 用戶點擊「殘值通知」開關
2. 請求通知權限
3. 如果授予，啟用通知並發送配置到 Service Worker
4. Service Worker 開始背景監控

### 檢測到股票達到殘值時
1. Service Worker 每 60 秒檢查價格
2. 發現股票價格 ≤ valuationLow
3. 檢查是否已通知過
4. 如果未通知，發送系統通知
5. 更新已通知列表
6. 同步狀態到主應用

### 用戶點擊通知時
1. 關閉通知
2. 尋找已開啟的應用視窗
3. 如果找到，聚焦該視窗
4. 如果沒有，開啟新視窗

## 技術亮點

1. **離線功能**: 使用 Service Worker 實現真正的背景監控
2. **狀態同步**: 主應用和 SW 之間的雙向通訊
3. **漸進增強**: 支持 Periodic Sync 的瀏覽器獲得更好體驗
4. **優雅降級**: 不支持的瀏覽器仍可使用基本通知功能
5. **智能追蹤**: 避免通知轟炸，每隻股票只通知一次

## 測試建議

1. **基本通知測試**
   ```
   - 啟用通知
   - 修改 valuationLow 使其高於當前價格
   - 等待下次輪詢（10秒）
   - 應收到通知
   ```

2. **背景監控測試**
   ```
   - 啟用通知
   - 關閉瀏覽器標籤
   - 等待 60 秒
   - 打開開發者工具 > Application > Service Workers
   - 查看日誌確認檢查正在進行
   ```

3. **狀態同步測試**
   ```
   - 啟用通知並收到一個通知
   - 關閉並重新打開應用
   - 確認已通知狀態保持
   - 不應收到重複通知
   ```

## 未來改進建議

1. **通知設置**
   - 允許用戶自定義檢查間隔
   - 選擇性啟用/禁用特定股票的通知

2. **通知內容**
   - 添加更多股票信息
   - 顯示潛在上漲空間

3. **性能優化**
   - 批量檢查 API 請求
   - 智能調整檢查頻率（市場開盤時更頻繁）

4. **用戶體驗**
   - 添加通知歷史記錄
   - 提供通知測試功能
   - Service Worker 狀態指示器
