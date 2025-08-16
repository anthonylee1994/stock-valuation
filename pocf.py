import numpy as np
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt

ticker = "AMZN"

ocf_by_year = {
    2016: 1.81,
    2017: 1.91,
    2018: 3.15,
    2019: 3.90,
    2020: 6.61,
    2021: 4.58,
    2022: 4.59,
    2023: 8.24,
    2024: 11.06,
    2025: 10.06,
}


data = yf.download(ticker, period="10y", interval="1d", auto_adjust=True)
prices = data["Close"]

ocf = prices.copy()
for dt in ocf.index:
    yr = dt.year
    ocf.loc[dt] = ocf_by_year.get(yr, np.nan)

mask = ~ocf.isna()
prices = prices[mask]
ocf = ocf[mask]

ps_daily = prices / ocf
ps_mean = ps_daily.mean()
ps_std = ps_daily.std(ddof=1)

hist = pd.DataFrame(index=prices.index)
hist["P/OCF + 2STD"] = (ps_mean.iloc[-1] + 2 * ps_std.iloc[-1]) * ocf
hist["P/OCF + 1STD"] = (ps_mean.iloc[-1] + ps_std.iloc[-1]) * ocf
hist["P/OCF AVG"] = ps_mean.iloc[-1] * ocf
hist["P/OCF - 1STD"] = (ps_mean.iloc[-1] - ps_std.iloc[-1]) * ocf
hist["P/OCF - 2STD"] = (ps_mean.iloc[-1] - 2 * ps_std.iloc[-1]) * ocf

# Create the plot
plt.figure(figsize=(14, 8))
plt.plot(prices.index, prices, label="Price", color="black")
plt.plot(
    hist.index, hist["P/OCF + 2STD"], label="P/OCF + 2STD", linestyle="--", color="red"
)
plt.plot(
    hist.index,
    hist["P/OCF + 1STD"],
    label="P/OCF + 1STD",
    linestyle="--",
    color="orange",
)
plt.plot(
    hist.index, hist["P/OCF AVG"], label="P/OCF AVG", linestyle="--", color="green"
)
plt.plot(
    hist.index, hist["P/OCF - 1STD"], label="P/OCF - 1STD", linestyle="--", color="blue"
)
plt.plot(
    hist.index,
    hist["P/OCF - 2STD"],
    label="P/OCF - 2STD",
    linestyle="--",
    color="purple",
)
plt.xlabel("Date")
plt.ylabel("Price")
plt.title(f"{ticker} Historical P/OCF")
plt.legend()
plt.grid(True)
plt.show()
