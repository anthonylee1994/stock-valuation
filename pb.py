import numpy as np
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt

ticker = "0066.HK"

nav_by_year = {
    2009: 17.74,
    2010: 19.55,
    2011: 22.02,
    2012: 23.85,
    2013: 25.45,
    2014: 27.25,
    2015: 28.36,
    2016: 24.93,
    2017: 27.70,
    2018: 30.10,
    2019: 31.13,
    2020: 29.50,
    2021: 30.00,
    2022: 29.49,
    2023: 28.85,
    2024: 29.92,
    2025: 30.25,
}


data = yf.download(ticker, period="10y", interval="1d", auto_adjust=True)
prices = data["Close"]

nav = prices.copy()
for dt in nav.index:
    yr = dt.year
    nav.loc[dt] = nav_by_year.get(yr, np.nan)

mask = ~nav.isna()
prices = prices[mask]
nav = nav[mask]

pe_daily = prices / nav
pe_mean = pe_daily.mean()
pe_std = pe_daily.std(ddof=1)

hist = pd.DataFrame(index=prices.index)
hist["P/B + 2STD"] = pe_mean[-1] + 2 * pe_std[-1]
hist["P/B + 1STD"] = pe_mean[-1] + pe_std[-1]
hist["P/B AVG"] = pe_mean[-1]
hist["P/B - 1STD"] = pe_mean[-1] - pe_std[-1]
hist["P/B - 2STD"] = pe_mean[-1] - 2 * pe_std[-1]

# Create the plot
plt.figure(figsize=(14, 8))
plt.plot(prices.index, pe_daily, label="P/B", color="black")
plt.plot(
    hist.index, hist["P/B + 2STD"], label="P/B + 2STD", linestyle="--", color="red"
)
plt.plot(
    hist.index, hist["P/B + 1STD"], label="P/B + 1STD", linestyle="--", color="orange"
)
plt.plot(hist.index, hist["P/B AVG"], label="P/B AVG", linestyle="--", color="green")
plt.plot(
    hist.index, hist["P/B - 1STD"], label="P/B - 1STD", linestyle="--", color="blue"
)
plt.plot(
    hist.index, hist["P/B - 2STD"], label="P/B - 2STD", linestyle="--", color="purple"
)
plt.xlabel("Date")
plt.ylabel("Price (USD)")
plt.title(f"{ticker} Historical P/B")
plt.legend()
plt.grid(True)
plt.show()
