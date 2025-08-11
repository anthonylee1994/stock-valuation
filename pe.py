import numpy as np
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt

ticker = "META"

eps_by_year = {
    2009: 0.10,
    2010: 0.28,
    2011: 0.46,
    2012: 0.01,
    2013: 0.60,
    2014: 1.10,
    2015: 1.29,
    2016: 3.49,
    2017: 5.39,
    2018: 7.57,
    2019: 6.43,
    2020: 10.09,
    2021: 13.77,
    2022: 8.59,
    2023: 14.87,
    2024: 23.86,
    2025: 27.56,
}


data = yf.download(ticker, period="10y", interval="1d", auto_adjust=True)
prices = data["Close"]

eps = prices.copy()
for dt in eps.index:
    yr = dt.year
    eps.loc[dt] = eps_by_year.get(yr, np.nan)

mask = ~eps.isna()
prices = prices[mask]
eps = eps[mask]

pe_daily = prices / eps
pe_mean = pe_daily.mean()
pe_std = pe_daily.std(ddof=1)

hist = pd.DataFrame(index=prices.index)
hist["P/E + 2STD"] = pe_mean[-1] + 2 * pe_std[-1]
hist["P/E + 1STD"] = pe_mean[-1] + pe_std[-1]
hist["P/E AVG"] = pe_mean[-1]
hist["P/E - 1STD"] = pe_mean[-1] - pe_std[-1]
hist["P/E - 2STD"] = pe_mean[-1] - 2 * pe_std[-1]

# Create the plot
plt.figure(figsize=(14, 8))
plt.plot(prices.index, pe_daily, label="P/E", color="black")
plt.plot(
    hist.index, hist["P/E + 2STD"], label="P/E + 2STD", linestyle="--", color="red"
)
plt.plot(
    hist.index, hist["P/E + 1STD"], label="P/E + 1STD", linestyle="--", color="orange"
)
plt.plot(hist.index, hist["P/E AVG"], label="P/E AVG", linestyle="--", color="green")
plt.plot(
    hist.index, hist["P/E - 1STD"], label="P/E - 1STD", linestyle="--", color="blue"
)
plt.plot(
    hist.index, hist["P/E - 2STD"], label="P/E - 2STD", linestyle="--", color="purple"
)
plt.xlabel("Date")
plt.ylabel("Price (USD)")
plt.title(f"{ticker} Historical P/E")
plt.legend()
plt.grid(True)
plt.show()
