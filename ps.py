import numpy as np
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt

ticker = "AMZN"

sps_by_year = {
    2009: 2.78,
    2010: 3.76,
    2011: 5.22,
    2012: 6.71,
    2013: 8.08,
    2014: 9.60,
    2015: 11.28,
    2016: 14.07,
    2017: 18.06,
    2018: 23.30,
    2019: 27.87,
    2020: 37.89,
    2021: 45.67,
    2022: 50.31,
    2023: 54.92,
    2024: 59.57,
    2025: 63.37,
}


data = yf.download(ticker, period="10y", interval="1d", auto_adjust=True)
prices = data["Close"]

sps = prices.copy()
for dt in sps.index:
    yr = dt.year
    sps.loc[dt] = sps_by_year.get(yr, np.nan)

mask = ~sps.isna()
prices = prices[mask]
sps = sps[mask]

ps_daily = prices / sps
ps_mean = ps_daily.mean()
ps_std = ps_daily.std(ddof=1)

hist = pd.DataFrame(index=prices.index)
hist["P/S + 2STD"] = (ps_mean.iloc[-1] + 2 * ps_std.iloc[-1]) * sps
hist["P/S + 1STD"] = (ps_mean.iloc[-1] + ps_std.iloc[-1]) * sps
hist["P/S AVG"] = ps_mean.iloc[-1] * sps
hist["P/S - 1STD"] = (ps_mean.iloc[-1] - ps_std.iloc[-1]) * sps
hist["P/S - 2STD"] = (ps_mean.iloc[-1] - 2 * ps_std.iloc[-1]) * sps

# Create the plot
plt.figure(figsize=(14, 8))
plt.plot(prices.index, prices, label="Price", color="black")
plt.plot(
    hist.index, hist["P/S + 2STD"], label="P/S + 2STD", linestyle="--", color="red"
)
plt.plot(
    hist.index, hist["P/S + 1STD"], label="P/S + 1STD", linestyle="--", color="orange"
)
plt.plot(hist.index, hist["P/S AVG"], label="P/S AVG", linestyle="--", color="green")
plt.plot(
    hist.index, hist["P/S - 1STD"], label="P/S - 1STD", linestyle="--", color="blue"
)
plt.plot(
    hist.index, hist["P/S - 2STD"], label="P/S - 2STD", linestyle="--", color="purple"
)
plt.xlabel("Date")
plt.ylabel("Price")
plt.title(f"{ticker} Historical P/S")
plt.legend()
plt.grid(True)
plt.show()
