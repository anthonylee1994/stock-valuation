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
    """股票估值模型類，封裝財務比率獲取、股價獲取和估值分析功能"""

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.key_metrics_df = None
        self.price_df = None
        self.merged_df = None

    def fetch_key_metrics(
        self,
        symbol: str,
        pages: int = 2,
        period: str = "FY",
        limit: int = 10,
        min_year: int = 2016,
    ) -> pd.DataFrame:
        """
        從Financial Modeling Prep獲取多頁財務比率數據，並獲取最新的TTM數據

        Args:
            symbol: 股票代碼
            pages: 要獲取的頁數
            period: 期間類型 (annual/quarter)
            limit: 每頁限制
            min_year: 最小年份

        Returns:
            EPS、NAV、SPS、OCF數據的DataFrame
        """
        dfs = []
        for page in range(pages):
            try:
                url = (
                    f"https://financialmodelingprep.com/stable/ratios"
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
                logger.info(
                    f"成功獲取第 {page+1} 頁財務比率數據，共 {len(data)} 條記錄"
                )

            except requests.exceptions.RequestException as e:
                logger.error(f"獲取第 {page+1} 頁財務比率數據時發生錯誤: {e}")
                break

        if not dfs:
            logger.error("未能獲取任何財務比率數據")
            return pd.DataFrame(columns=["Year", "EPS", "NAV", "SPS", "OCF"])

        # 合併所有頁的數據
        key_metrics_df = pd.concat(dfs, ignore_index=True)

        # 數據清洗和轉換
        key_metrics_df = key_metrics_df[
            [
                "fiscalYear",
                "netIncomePerShare",
                "revenuePerShare",
                "bookValuePerShare",
                "operatingCashFlowPerShare",
            ]
        ].rename(
            columns={
                "fiscalYear": "Year",
                "netIncomePerShare": "EPS",
                "revenuePerShare": "SPS",
                "bookValuePerShare": "NAV",
                "operatingCashFlowPerShare": "OCF",
            }
        )
        key_metrics_df["Year"] = (
            pd.to_datetime(key_metrics_df["Year"]).dt.to_period("Y").dt.to_timestamp()
        )
        key_metrics_df = key_metrics_df.sort_values("Year").reset_index(drop=True)

        # 過濾年份
        if min_year:
            key_metrics_df = key_metrics_df[key_metrics_df["Year"].dt.year >= min_year]

        # 獲取最新的TTM數據
        try:
            ttm_url = f"https://financialmodelingprep.com/stable/ratios-ttm?symbol={symbol}&apikey={self.api_key}"
            ttm_resp = requests.get(ttm_url, timeout=10)
            ttm_resp.raise_for_status()
            ttm_data = ttm_resp.json()

            if ttm_data and len(ttm_data) > 0:
                ttm_row = ttm_data[0]  # 取第一條TTM數據

                # 創建TTM數據行
                current_date = pd.Timestamp.now()
                ttm_df = pd.DataFrame(
                    [
                        {
                            "Year": current_date,
                            "EPS": ttm_row.get("netIncomePerShareTTM"),
                            "SPS": ttm_row.get("revenuePerShareTTM"),
                            "NAV": ttm_row.get("bookValuePerShareTTM"),
                            "OCF": ttm_row.get("operatingCashFlowPerShareTTM"),
                        }
                    ]
                )

                # 將TTM數據添加到現有數據中
                key_metrics_df = pd.concat([key_metrics_df, ttm_df], ignore_index=True)
                key_metrics_df = key_metrics_df.sort_values("Year").reset_index(
                    drop=True
                )

                logger.info("成功獲取TTM數據並添加到財務比率數據中")
                logger.info(f"TTM EPS: {ttm_row.get('netIncomePerShareTTM'):.4f}")
                logger.info(f"TTM SPS: {ttm_row.get('revenuePerShareTTM'):.4f}")
                logger.info(f"TTM NAV: {ttm_row.get('bookValuePerShareTTM'):.4f}")
                logger.info(
                    f"TTM OCF: {ttm_row.get('operatingCashFlowPerShareTTM'):.4f}"
                )
            else:
                logger.warning("未能獲取TTM數據")

        except requests.exceptions.RequestException as e:
            logger.error(f"獲取TTM數據時發生錯誤: {e}")
        except Exception as e:
            logger.error(f"處理TTM數據時發生錯誤: {e}")

        self.key_metrics_df = key_metrics_df
        return key_metrics_df

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
            # 如果沒有提供日期，使用財務比率數據的日期範圍
            if start_date is None and self.key_metrics_df is not None:
                start_date = self.key_metrics_df["Year"].min().strftime("%Y-%m-%d")

            if end_date is None and self.key_metrics_df is not None:
                end_year = self.key_metrics_df["Year"].max().year + 1
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

    def merge_key_metrics(self) -> pd.DataFrame:
        """
        合併股價和財務比率數據

        Returns:
            合併後的DataFrame
        """
        if self.key_metrics_df is None or self.price_df is None:
            logger.error("需要先獲取財務比率數據和股價數據")
            return pd.DataFrame()

        # 創建股價數據的副本
        result_df = self.price_df.copy()

        # 為每個交易日找到對應年度的財務數據
        # 使用字典提高查找性能
        eps_by_year = {
            year: eps
            for year, eps in zip(
                self.key_metrics_df["Year"].dt.year, self.key_metrics_df["EPS"]
            )
        }
        nav_by_year = {
            year: nav
            for year, nav in zip(
                self.key_metrics_df["Year"].dt.year, self.key_metrics_df["NAV"]
            )
        }
        sps_by_year = {
            year: sps
            for year, sps in zip(
                self.key_metrics_df["Year"].dt.year, self.key_metrics_df["SPS"]
            )
        }
        ocf_by_year = {
            year: ocf
            for year, ocf in zip(
                self.key_metrics_df["Year"].dt.year, self.key_metrics_df["OCF"]
            )
        }

        # 為每個交易日分配對應的年度財務數據
        # 使用更智能的數據分配，優先使用TTM數據（如果可用）
        for idx, date in enumerate(result_df.index):
            # 檢查是否有TTM數據（使用當前日期作為標識）
            current_year = pd.Timestamp.now().year
            current_month = pd.Timestamp.now().month

            # 如果是最近幾個月的交易，優先使用TTM數據
            if date.year == current_year and date.month >= current_month - 3:
                # 嘗試使用TTM數據
                ttm_data = self.key_metrics_df[
                    self.key_metrics_df["Year"].dt.year == current_year
                ]
                if not ttm_data.empty and len(ttm_data) > 1:  # 有TTM數據
                    ttm_row = ttm_data.iloc[-1]  # 取最新的TTM數據
                    result_df.loc[date, "EPS"] = ttm_row["EPS"]
                    result_df.loc[date, "NAV"] = ttm_row["NAV"]
                    result_df.loc[date, "SPS"] = ttm_row["SPS"]
                    result_df.loc[date, "OCF"] = ttm_row["OCF"]
                else:
                    # 回退到年度數據
                    result_df.loc[date, "EPS"] = eps_by_year.get(date.year, None)
                    result_df.loc[date, "NAV"] = nav_by_year.get(date.year, None)
                    result_df.loc[date, "SPS"] = sps_by_year.get(date.year, None)
                    result_df.loc[date, "OCF"] = ocf_by_year.get(date.year, None)
            else:
                # 使用年度數據
                result_df.loc[date, "EPS"] = eps_by_year.get(date.year, None)
                result_df.loc[date, "NAV"] = nav_by_year.get(date.year, None)
                result_df.loc[date, "SPS"] = sps_by_year.get(date.year, None)
                result_df.loc[date, "OCF"] = ocf_by_year.get(date.year, None)

        self.merged_df = result_df
        return result_df

    def calculate_pe_ratios(self) -> pd.DataFrame:
        """
        計算市盈率及其統計指標

        Returns:
            包含PE比率和統計指標的DataFrame
        """
        if self.merged_df is None:
            logger.error("需要先合併財務比率數據和股價數據")
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

    def calculate_pb_ratios(self) -> pd.DataFrame:
        """
        計算市淨率及其統計指標

        Returns:
            包含P/B比率和統計指標的DataFrame
        """
        if self.merged_df is None:
            logger.error("需要先合併EPS和股價數據")
            return pd.DataFrame()

        # 計算市淨率
        merged_df = self.merged_df.copy()
        merged_df["P/B"] = merged_df["Price"] / merged_df["NAV"]

        # 計算統計指標
        pb_series = merged_df["P/B"].dropna()
        if len(pb_series) == 0:
            logger.error("沒有有效的P/B數據可供計算")
            return merged_df

        pb_mean = pb_series.mean()
        pb_std = pb_series.std(ddof=1)

        # 添加統計線
        merged_df["P/B + 2STD"] = pb_mean + 2 * pb_std
        merged_df["P/B + 1STD"] = pb_mean + pb_std
        merged_df["P/B AVG"] = pb_mean
        merged_df["P/B - 1STD"] = pb_mean - pb_std
        merged_df["P/B - 2STD"] = pb_mean - 2 * pb_std

        self.merged_df = merged_df
        return merged_df

    def calculate_ps_ratios(self) -> pd.DataFrame:
        """
        計算市銷率及其統計指標

        Returns:
            包含P/S比率和統計指標的DataFrame
        """
        if self.merged_df is None:
            logger.error("需要先合併EPS和股價數據")
            return pd.DataFrame()

        # 計算市銷率
        merged_df = self.merged_df.copy()
        merged_df["P/S"] = merged_df["Price"] / merged_df["SPS"]

        # 計算統計指標
        ps_series = merged_df["P/S"].dropna()
        if len(ps_series) == 0:
            logger.error("沒有有效的P/S數據可供計算")
            return merged_df

        ps_mean = ps_series.mean()
        ps_std = ps_series.std(ddof=1)

        # 添加統計線
        merged_df["P/S + 2STD"] = ps_mean + 2 * ps_std
        merged_df["P/S + 1STD"] = ps_mean + ps_std
        merged_df["P/S AVG"] = ps_mean
        merged_df["P/S - 1STD"] = ps_mean - ps_std
        merged_df["P/S - 2STD"] = ps_mean - 2 * ps_std

        self.merged_df = merged_df
        return merged_df

    def calculate_pocf_ratios(self) -> pd.DataFrame:
        """
        計算P/OCF比率及其統計指標

        Returns:
            包含P/OCF比率和統計指標的DataFrame
        """
        if self.merged_df is None:
            logger.error("需要先合併EPS和股價數據")
            return pd.DataFrame()

        # 計算P/OCF比率
        merged_df = self.merged_df.copy()
        merged_df["P/OCF"] = merged_df["Price"] / merged_df["OCF"]

        # 計算統計指標
        pocf_series = merged_df["P/OCF"].dropna()
        if len(pocf_series) == 0:
            logger.error("沒有有效的P/OCF數據可供計算")
            return merged_df

        pocf_mean = pocf_series.mean()
        pocf_std = pocf_series.std(ddof=1)

        # 添加統計線
        merged_df["P/OCF + 2STD"] = pocf_mean + 2 * pocf_std
        merged_df["P/OCF + 1STD"] = pocf_mean + pocf_std
        merged_df["P/OCF AVG"] = pocf_mean
        merged_df["P/OCF - 1STD"] = pocf_mean - pocf_std
        merged_df["P/OCF - 2STD"] = pocf_mean - 2 * pocf_std

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
        if self.merged_df is None:
            logger.error("需要先計算估值比率")
            return None

        df = self.merged_df

        # 檢查有哪些比率可用
        available_ratios = []
        if "P/E" in df.columns:
            available_ratios.append("P/E")
        if "P/OCF" in df.columns:
            available_ratios.append("P/OCF")
        if "P/B" in df.columns:
            available_ratios.append("P/B")
        if "P/S" in df.columns:
            available_ratios.append("P/S")

        if not available_ratios:
            logger.error("沒有可用的估值比率數據")
            return None

        # 根據可用的比率數量決定子圖佈局
        num_ratios = len(available_ratios)
        if num_ratios == 4:
            # 2x2 grid for 4 ratios
            fig, axes = plt.subplots(2, 2, figsize=(16, 10))
            axes = axes.flatten()  # Flatten to 1D array for easier iteration
        else:
            # Fallback to vertical layout for other numbers
            fig, axes = plt.subplots(num_ratios, 1, figsize=(14, 3 * num_ratios))
            # 如果只有一個子圖，確保axes是列表
            if num_ratios == 1:
                axes = [axes]

        # 繪製各種比率圖表
        for i, ratio in enumerate(available_ratios):
            ax = axes[i]

            # 繪製比率線
            ax.plot(
                df.index,
                df[ratio],
                label=f"{ratio} Ratio",
                color="black",
                linewidth=1.5,
            )

            # 繪製統計線
            if f"{ratio} + 2STD" in df.columns:
                ax.plot(
                    df.index,
                    df[f"{ratio} + 2STD"],
                    label=f"{ratio} + 2STD",
                    linestyle="--",
                    color="red",
                    alpha=0.7,
                )
            if f"{ratio} + 1STD" in df.columns:
                ax.plot(
                    df.index,
                    df[f"{ratio} + 1STD"],
                    label=f"{ratio} + 1STD",
                    linestyle="--",
                    color="orange",
                    alpha=0.7,
                )
            if f"{ratio} AVG" in df.columns:
                ax.plot(
                    df.index,
                    df[f"{ratio} AVG"],
                    label=f"{ratio} AVG",
                    linestyle="--",
                    color="green",
                    alpha=0.7,
                )
            if f"{ratio} - 1STD" in df.columns:
                ax.plot(
                    df.index,
                    df[f"{ratio} - 1STD"],
                    label=f"{ratio} - 1STD",
                    linestyle="--",
                    color="blue",
                    alpha=0.7,
                )
            if f"{ratio} - 2STD" in df.columns:
                ax.plot(
                    df.index,
                    df[f"{ratio} - 2STD"],
                    label=f"{ratio} - 2STD",
                    linestyle="--",
                    color="purple",
                    alpha=0.7,
                )

            ax.set_xlabel("Date")
            ax.set_ylabel(f"{ratio} Ratio")
            ax.set_title(
                f"{symbol} Historical {ratio} Ratio with Standard Deviation Bands"
            )
            ax.legend()
            ax.grid(True, alpha=0.3)

            # 填充標準差區域
            if f"{ratio} - 2STD" in df.columns and f"{ratio} + 2STD" in df.columns:
                ax.fill_between(
                    df.index,
                    df[f"{ratio} - 2STD"],
                    df[f"{ratio} + 2STD"],
                    color="gray",
                    alpha=0.1,
                )
            if f"{ratio} - 1STD" in df.columns and f"{ratio} + 1STD" in df.columns:
                ax.fill_between(
                    df.index,
                    df[f"{ratio} - 1STD"],
                    df[f"{ratio} + 1STD"],
                    color="gray",
                    alpha=0.2,
                )

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
        if self.merged_df is None:
            logger.error("需要先計算估值比率")
            return {}

        df = self.merged_df
        current_price = df["Price"].iloc[-1] if not df.empty else None

        # 初始化報告
        report = {
            "symbol": symbol,
            "current_price": current_price,
        }

        # 添加P/E比率信息
        if "P/E" in df.columns:
            current_pe = df["P/E"].iloc[-1] if not df.empty else None
            current_eps = df["EPS"].iloc[-1] if not df.empty else None

            report.update(
                {
                    "current_eps": current_eps,
                    "current_pe": current_pe,
                }
            )

            # 計算P/E統計指標
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

                report.update(
                    {
                        "historical_pe_mean": pe_mean,
                        "historical_pe_std": pe_std,
                        "pe_zscore": pe_zscore,
                        "pe_percentile": pe_percentile,
                    }
                )

        # 添加P/B比率信息
        if "P/B" in df.columns:
            current_pb = df["P/B"].iloc[-1] if not df.empty else None
            current_nav = df["NAV"].iloc[-1] if not df.empty else None

            report.update(
                {
                    "current_nav": current_nav,
                    "current_pb": current_pb,
                }
            )

            # 計算P/B統計指標
            pb_series = df["P/B"].dropna()
            if len(pb_series) > 0:
                pb_mean = pb_series.mean()
                pb_std = pb_series.std()
                pb_zscore = (current_pb - pb_mean) / pb_std if pb_std > 0 else 0
                pb_percentile = (
                    stats.percentileofscore(pb_series, current_pb)
                    if len(pb_series) > 0
                    else 0
                )

                report.update(
                    {
                        "historical_pb_mean": pb_mean,
                        "historical_pb_std": pb_std,
                        "pb_zscore": pb_zscore,
                        "pb_percentile": pb_percentile,
                    }
                )

        # 添加P/S比率信息
        if "P/S" in df.columns:
            current_ps = df["P/S"].iloc[-1] if not df.empty else None
            current_sps = df["SPS"].iloc[-1] if not df.empty else None

            report.update(
                {
                    "current_sps": current_sps,
                    "current_ps": current_ps,
                }
            )

            # 計算P/S統計指標
            ps_series = df["P/S"].dropna()
            if len(ps_series) > 0:
                ps_mean = ps_series.mean()
                ps_std = ps_series.std()
                ps_zscore = (current_ps - ps_mean) / ps_std if ps_std > 0 else 0
                ps_percentile = (
                    stats.percentileofscore(ps_series, current_ps)
                    if len(ps_series) > 0
                    else 0
                )

                report.update(
                    {
                        "historical_ps_mean": ps_mean,
                        "historical_ps_std": ps_std,
                        "ps_zscore": ps_zscore,
                        "ps_percentile": ps_percentile,
                    }
                )

        # 添加P/OCF比率信息
        if "P/OCF" in df.columns:
            current_pocf = df["P/OCF"].iloc[-1] if not df.empty else None
            current_ocf = df["OCF"].iloc[-1] if not df.empty else None

            report.update(
                {
                    "current_ocf": current_ocf,
                    "current_pocf": current_pocf,
                }
            )

            # 計算P/OCF統計指標
            pocf_series = df["P/OCF"].dropna()
            if len(pocf_series) > 0:
                pocf_mean = pocf_series.mean()
                pocf_std = pocf_series.std()
                pocf_zscore = (
                    (current_pocf - pocf_mean) / pocf_std if pocf_std > 0 else 0
                )
                pocf_percentile = (
                    stats.percentileofscore(pocf_series, current_pocf)
                    if len(pocf_series) > 0
                    else 0
                )

                report.update(
                    {
                        "historical_pocf_mean": pocf_mean,
                        "historical_pocf_std": pocf_std,
                        "pocf_zscore": pocf_zscore,
                        "pocf_percentile": pocf_percentile,
                    }
                )

        # 計算綜合估值狀態
        zscores = []
        if "pe_zscore" in report:
            zscores.append(report["pe_zscore"])
        if "pb_zscore" in report:
            zscores.append(report["pb_zscore"])
        if "ps_zscore" in report:
            zscores.append(report["ps_zscore"])
        if "pocf_zscore" in report:
            zscores.append(report["pocf_zscore"])

        if zscores:
            avg_zscore = sum(zscores) / len(zscores)
            report["average_zscore"] = avg_zscore

            # 根據平均Z分數評估估值狀態
            if avg_zscore > 2:
                report["valuation_status"] = "顯著高估"
            elif avg_zscore > 1:
                report["valuation_status"] = "高估"
            elif avg_zscore < -2:
                report["valuation_status"] = "顯著低估"
            elif avg_zscore < -1:
                report["valuation_status"] = "低估"
            else:
                report["valuation_status"] = "合理估值"
        else:
            report["valuation_status"] = "數據不足"

        return report


def main():
    """主函數"""
    SYMBOL = "NVDA"
    API_KEY = "e4033a3a64146ef3745733670bf6e0ae"

    # 創建估值模型實例
    model = StockValuationModel(API_KEY)

    # 1. 獲取財務比率數據
    logger.info(f"獲取 {SYMBOL} 的財務比率數據...")
    key_metrics_df = model.fetch_key_metrics(SYMBOL, pages=2, min_year=2016)
    if key_metrics_df.empty:
        logger.error("無法獲取財務比率數據，程序終止")
        return

    print("財務比率數據:")
    print(key_metrics_df)

    # 2. 獲取股價數據
    logger.info(f"獲取 {SYMBOL} 的股價數據...")
    price_df = model.fetch_stock_prices(SYMBOL)
    if price_df.empty:
        logger.error("無法獲取股價數據，程序終止")
        return

    print("\n股價數據摘要:")
    print(price_df.describe())

    # 3. 合併數據並計算估值比率
    logger.info("合併數據並計算估值比率...")
    merged_df = model.merge_key_metrics()

    # 計算各種估值比率
    merged_df = model.calculate_pe_ratios()
    merged_df = model.calculate_pocf_ratios()
    merged_df = model.calculate_pb_ratios()
    merged_df = model.calculate_ps_ratios()

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
