import requests
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt
from typing import Optional, Dict, Any
import logging

# 配置日誌
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class StockValuationModel:
    """股票估值模型類，封裝EPS獲取、股價獲取和估值分析功能"""

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.eps_df = None
        self.price_df = None
        self.merged_df = None

    def fetch_eps(
        self,
        symbol: str,
        pages: int = 2,
        period: str = "annual",
        limit: int = 10,
        min_year: int = 2016,
    ) -> pd.DataFrame:
        """
        從Financial Modeling Prep獲取多頁EPS預估數據

        Args:
            symbol: 股票代碼
            pages: 要獲取的頁數
            period: 期間類型 (annual/quarter)
            limit: 每頁限制
            min_year: 最小年份

        Returns:
            EPS數據的DataFrame
        """
        dfs = []
        for page in range(pages):
            try:
                url = (
                    f"https://financialmodelingprep.com/stable/analyst-estimates"
                    f"?symbol={symbol}&period={period}&page={page}&limit={limit}&apikey={self.api_key}"
                )
                resp = requests.get(url, timeout=10)
                resp.raise_for_status()
                data = resp.json()

                if not data:
                    logger.warning(f"第 {page+1} 頁沒有數據")
                    break

                df = pd.DataFrame(data)
                dfs.append(df)
                logger.info(f"成功獲取第 {page+1} 頁EPS數據，共 {len(data)} 條記錄")

            except requests.exceptions.RequestException as e:
                logger.error(f"獲取第 {page+1} 頁EPS數據時發生錯誤: {e}")
                break

        if not dfs:
            logger.error("未能獲取任何EPS數據")
            return pd.DataFrame(columns=["Year", "EPS"])

        # 合併所有頁的數據
        eps_df = pd.concat(dfs, ignore_index=True)

        # 數據清洗和轉換
        eps_df = eps_df[["date", "epsAvg"]].rename(
            columns={"date": "Year", "epsAvg": "EPS"}
        )
        eps_df["Year"] = (
            pd.to_datetime(eps_df["Year"]).dt.to_period("Y").dt.to_timestamp()
        )
        eps_df = eps_df.sort_values("Year").reset_index(drop=True)

        # 過濾年份
        if min_year:
            eps_df = eps_df[eps_df["Year"].dt.year >= min_year]

        self.eps_df = eps_df
        return eps_df

    def fetch_stock_prices(
        self,
        symbol: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> pd.DataFrame:
        """
        從Yahoo Finance獲取股票價格數據

        Args:
            symbol: 股票代碼
            start_date: 開始日期 (YYYY-MM-DD)
            end_date: 結束日期 (YYYY-MM-DD)

        Returns:
            股價數據的DataFrame
        """
        try:
            # 如果沒有提供日期，使用EPS數據的日期範圍
            if start_date is None and self.eps_df is not None:
                start_date = self.eps_df["Year"].min().strftime("%Y-%m-%d")

            if end_date is None and self.eps_df is not None:
                end_year = self.eps_df["Year"].max().year + 1
                end_date = f"{end_year}-01-01"

            ticker = yf.Ticker(symbol)
            hist = ticker.history(start=start_date, end=end_date)

            if hist.empty:
                logger.error("未能獲取股價數據")
                return pd.DataFrame()

            hist = hist[["Close"]].rename(columns={"Close": "Price"})
            hist.index = pd.to_datetime(hist.index).date

            self.price_df = hist
            return hist

        except Exception as e:
            logger.error(f"獲取股價數據時發生錯誤: {e}")
            return pd.DataFrame()

    def merge_eps_price(self) -> pd.DataFrame:
        """
        合併股價和EPS數據

        Returns:
            合併後的DataFrame
        """
        if self.eps_df is None or self.price_df is None:
            logger.error("需要先獲取EPS和股價數據")
            return pd.DataFrame()

        # 創建股價數據的副本
        result_df = self.price_df.copy()

        # 為每個交易日找到對應年度的EPS
        # 使用字典提高查找性能
        eps_by_year = {
            year: eps
            for year, eps in zip(self.eps_df["Year"].dt.year, self.eps_df["EPS"])
        }

        # 為每個交易日分配對應的年度EPS
        result_df["EPS"] = result_df.index.map(lambda x: eps_by_year.get(x.year, None))

        self.merged_df = result_df
        return result_df

    def calculate_pe_ratios(self) -> pd.DataFrame:
        """
        計算市盈率及其統計指標

        Returns:
            包含PE比率和統計指標的DataFrame
        """
        if self.merged_df is None:
            logger.error("需要先合併EPS和股價數據")
            return pd.DataFrame()

        # 計算市盈率
        merged_df = self.merged_df.copy()
        merged_df["P/E"] = merged_df["Price"] / merged_df["EPS"]

        # 計算統計指標
        pe_series = merged_df["P/E"].dropna()
        if len(pe_series) == 0:
            logger.error("沒有有效的P/E數據可供計算")
            return merged_df

        pe_mean = pe_series.mean()
        pe_std = pe_series.std(ddof=1)

        # 添加統計線
        merged_df["P/E + 2STD"] = pe_mean + 2 * pe_std
        merged_df["P/E + 1STD"] = pe_mean + pe_std
        merged_df["P/E AVG"] = pe_mean
        merged_df["P/E - 1STD"] = pe_mean - pe_std
        merged_df["P/E - 2STD"] = pe_mean - 2 * pe_std

        self.merged_df = merged_df
        return merged_df

    def plot_valuation(self, symbol: str) -> plt.Figure:
        """
        繪製估值圖表

        Args:
            symbol: 股票代碼

        Returns:
            matplotlib Figure對象
        """
        if self.merged_df is None or "P/E" not in self.merged_df.columns:
            logger.error("需要先計算P/E比率")
            return None

        df = self.merged_df
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10))

        # 繪製P/E圖表
        ax1.plot(df.index, df["P/E"], label="P/E Ratio", color="black", linewidth=1.5)
        ax1.plot(
            df.index,
            df["P/E + 2STD"],
            label="P/E + 2STD",
            linestyle="--",
            color="red",
            alpha=0.7,
        )
        ax1.plot(
            df.index,
            df["P/E + 1STD"],
            label="P/E + 1STD",
            linestyle="--",
            color="orange",
            alpha=0.7,
        )
        ax1.plot(
            df.index,
            df["P/E AVG"],
            label="P/E AVG",
            linestyle="--",
            color="green",
            alpha=0.7,
        )
        ax1.plot(
            df.index,
            df["P/E - 1STD"],
            label="P/E - 1STD",
            linestyle="--",
            color="blue",
            alpha=0.7,
        )
        ax1.plot(
            df.index,
            df["P/E - 2STD"],
            label="P/E - 2STD",
            linestyle="--",
            color="purple",
            alpha=0.7,
        )

        ax1.set_xlabel("Date")
        ax1.set_ylabel("P/E Ratio")
        ax1.set_title(f"{symbol} Historical P/E Ratio with Standard Deviation Bands")
        ax1.legend()
        ax1.grid(True, alpha=0.3)

        # 填充標準差區域
        ax1.fill_between(
            df.index, df["P/E - 2STD"], df["P/E + 2STD"], color="gray", alpha=0.1
        )
        ax1.fill_between(
            df.index, df["P/E - 1STD"], df["P/E + 1STD"], color="gray", alpha=0.2
        )

        # 繪製價格圖表
        ax2.plot(df.index, df["Price"], label="Price", color="blue", linewidth=1.5)
        ax2.set_xlabel("Date")
        ax2.set_ylabel("Price ($)")
        ax2.set_title(f"{symbol} Stock Price")
        ax2.grid(True, alpha=0.3)

        plt.tight_layout()
        return fig

    def generate_report(self, symbol: str) -> Dict[str, Any]:
        """
        生成估值報告

        Args:
            symbol: 股票代碼

        Returns:
            包含估值指標的字典
        """
        if self.merged_df is None or "P/E" not in self.merged_df.columns:
            logger.error("需要先計算P/E比率")
            return {}

        df = self.merged_df
        current_pe = df["P/E"].iloc[-1] if not df.empty else None
        current_price = df["Price"].iloc[-1] if not df.empty else None
        current_eps = df["EPS"].iloc[-1] if not df.empty else None

        # 計算當前P/E相對於歷史的位置
        pe_series = df["P/E"].dropna()
        if len(pe_series) > 0:
            pe_mean = pe_series.mean()
            pe_std = pe_series.std()
            pe_zscore = (current_pe - pe_mean) / pe_std if pe_std > 0 else 0
            pe_percentile = (
                stats.percentileofscore(pe_series, current_pe)
                if len(pe_series) > 0
                else 0
            )
        else:
            pe_zscore = 0
            pe_percentile = 0

        # 生成報告
        report = {
            "symbol": symbol,
            "current_price": current_price,
            "current_eps": current_eps,
            "current_pe": current_pe,
            "historical_pe_mean": pe_mean,
            "historical_pe_std": pe_std,
            "pe_zscore": pe_zscore,
            "pe_percentile": pe_percentile,
            "valuation_status": "合理估值",
        }

        # 根據Z分數評估估值狀態
        if pe_zscore > 2:
            report["valuation_status"] = "顯著高估"
        elif pe_zscore > 1:
            report["valuation_status"] = "高估"
        elif pe_zscore < -2:
            report["valuation_status"] = "顯著低估"
        elif pe_zscore < -1:
            report["valuation_status"] = "低估"

        return report


def main():
    """主函數"""
    SYMBOL = "NUE"
    API_KEY = "e4033a3a64146ef3745733670bf6e0ae"

    # 創建估值模型實例
    model = StockValuationModel(API_KEY)

    # 1. 獲取EPS數據
    logger.info(f"獲取 {SYMBOL} 的EPS數據...")
    eps_df = model.fetch_eps(SYMBOL, pages=2, min_year=2016)
    if eps_df.empty:
        logger.error("無法獲取EPS數據，程序終止")
        return

    print("EPS數據:")
    print(eps_df)

    # 2. 獲取股價數據
    logger.info(f"獲取 {SYMBOL} 的股價數據...")
    price_df = model.fetch_stock_prices(SYMBOL)
    if price_df.empty:
        logger.error("無法獲取股價數據，程序終止")
        return

    print("\n股價數據摘要:")
    print(price_df.describe())

    # 3. 合併數據並計算P/E比率
    logger.info("合併數據並計算P/E比率...")
    merged_df = model.merge_eps_price()
    merged_df = model.calculate_pe_ratios()

    print("\n合併後的數據（最後5行）:")
    print(merged_df.tail())

    # 4. 生成圖表
    logger.info("生成估值圖表...")
    fig = model.plot_valuation(SYMBOL)
    if fig:
        plt.show()

    # 5. 生成估值報告
    logger.info("生成估值報告...")
    report = model.generate_report(SYMBOL)

    print("\n估值報告:")
    for key, value in report.items():
        print(f"{key}: {value}")


if __name__ == "__main__":
    # 添加必要的導入
    try:
        from scipy import stats
    except ImportError:
        logger.warning("未找到scipy庫，部分統計功能將受限")

        # 實現一個簡單的百分位數計算函數作為備選
        def percentileofscore(a, score):
            return sum(i <= score for i in a) / len(a) * 100

        stats.percentileofscore = percentileofscore

    main()
