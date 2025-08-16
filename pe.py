import numpy as np
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt

ticker = "GOOG"

eps_by_year = {
    2016: 1.39,
    2017: 0.90,
    2018: 2.19,
    2019: 2.46,
    2020: 2.94,
    2021: 5.61,
    2022: 4.55,
    2023: 5.80,
    2024: 8.05,
    2025: 9.93,
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
hist["P/E + 2STD"] = (pe_mean.iloc[-1] + 2 * pe_std.iloc[-1]) * eps
hist["P/E + 1STD"] = (pe_mean.iloc[-1] + pe_std.iloc[-1]) * eps
hist["P/E AVG"] = pe_mean.iloc[-1] * eps
hist["P/E - 1STD"] = (pe_mean.iloc[-1] - pe_std.iloc[-1]) * eps
hist["P/E - 2STD"] = (pe_mean.iloc[-1] - 2 * pe_std.iloc[-1]) * eps

# Create the plot
plt.figure(figsize=(14, 8))
plt.plot(prices.index, prices, label="Price", color="black")
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
plt.ylabel("Price")
plt.title(f"{ticker} Historical P/E")
plt.legend()
plt.grid(True)
plt.show()
