# Service Worker Background Notifications

## 功能說明

此應用已整合 Service Worker，可在應用程式關閉或在背景運行時持續監控股票價格。

## Service Worker 功能

### 1. 背景價格監控
- Service Worker 每 60 秒檢查一次股票價格
- 即使關閉瀏覽器標籤頁，監控仍會繼續
- 使用 Periodic Background Sync API（如瀏覽器支持）

### 2. 自動通知
- 當股票價格跌至殘值（valuationLow）時自動發送通知
- 通知會顯示股票名稱、代碼、當前價格和殘值
- 點擊通知會打開或聚焦應用

### 3. 智能追蹤
- 每隻股票只通知一次，直到價格恢復到殘值以上
- 通知狀態在應用和 Service Worker 之間同步
- 關閉通知功能會清除所有追蹤狀態

## 瀏覽器支持

### 完整支持（包括 Periodic Background Sync）
- Chrome/Edge 80+
- Opera 67+

### 部分支持（使用 setInterval 作為後備）
- Firefox（Service Worker + 通知）
- Safari 16.4+（Service Worker + 通知）

## 使用方法

1. **啟用通知**
   - 點擊頁面頂部的「殘值通知」開關
   - 授予瀏覽器通知權限

2. **背景監控**
   - 啟用通知後，Service Worker 會自動開始監控
   - 可以關閉標籤頁或最小化瀏覽器
   - Service Worker 會繼續在背景運行

3. **接收通知**
   - 當股票達到殘值時，會收到系統通知
   - 點擊通知可回到應用查看詳情

4. **停止監控**
   - 關閉「殘值通知」開關即可停止監控

## 技術細節

### Service Worker 架構
```
Main App (main.tsx)
    ↓ 註冊
Service Worker (sw.js)
    ↓ 配置
API 監控 (每 60 秒)
    ↓ 檢測
價格 ≤ 殘值？
    ↓ 是
發送通知 + 更新追蹤
    ↓ 同步
Main App 更新狀態
```

### 通訊機制
- **Main App → Service Worker**: `postMessage()` 發送配置和更新
- **Service Worker → Main App**: `postMessage()` 回傳通知事件
- **同步機制**: localStorage + CustomEvent 確保狀態一致

### 緩存策略
- Service Worker 不緩存 API 請求
- 僅用於背景監控和通知
- 靜態資源由 Vite PWA 插件管理

## 調試

### 查看 Service Worker 狀態
1. 打開開發者工具
2. 前往 Application > Service Workers
3. 查看 sw.js 的狀態和日誌

### 測試通知
1. 在開發者工具中設置較短的檢查間隔
2. 修改股票的 valuationLow 使其高於當前價格
3. 等待 Service Worker 檢查並發送通知

### 常見問題

**Q: 通知沒有出現？**
- 檢查瀏覽器通知權限是否已授予
- 確認 Service Worker 已成功註冊
- 查看控制台是否有錯誤訊息

**Q: 背景監控不工作？**
- 某些瀏覽器在省電模式下會限制 Service Worker
- 確保瀏覽器保持在背景運行（未完全關閉）
- Periodic Background Sync 需要用戶經常使用應用才會被授予

**Q: 如何完全停止 Service Worker？**
- 在 Application > Service Workers 中點擊 Unregister
- 或在代碼中調用 `unregisterServiceWorker()`

## 隱私說明

- Service Worker 僅在本地運行
- 所有股票價格檢查都是直接向 API 發送請求
- 不會收集或存儲任何個人數據
- 通知設置和追蹤狀態僅保存在本地瀏覽器中
