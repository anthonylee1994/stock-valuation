import numpy as np
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt

ticker = 'NVDA'

sps_by_year = {
    2009: 0.13,
    2010: 0.15,
    2011: 0.15,
    2012: 0.16,
    2013: 0.17,
    2014: 0.17,
    2015: 0.21,
    2016: 0.22,
    2017: 0.27,
    2018: 0.38,
    2019: 0.47,
    2020: 0.44,
    2021: 0.67,
    2022: 1.06,
    2023: 1.07,
    2024: 2.44,
    2025: 5.26
}


data = yf.download(ticker, period='10y', interval='1d', auto_adjust=True)
prices = data['Close']

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
hist['P/S + 2STD'] = (ps_mean[-1] + 2 * ps_std[-1])
hist['P/S + 1STD'] = (ps_mean[-1] + ps_std[-1])
hist['P/S AVG'] = ps_mean[-1]
hist['P/S - 1STD'] = (ps_mean[-1] - ps_std[-1])
hist['P/S - 2STD'] = (ps_mean[-1] - 2 * ps_std[-1])

# Create the plot
plt.figure(figsize=(14, 8))
plt.plot(prices.index, ps_daily, label='P/S', color='black')
plt.plot(hist.index, hist['P/S + 2STD'], label='P/S + 2STD', linestyle='--', color='red')
plt.plot(hist.index, hist['P/S + 1STD'], label='P/S + 1STD', linestyle='--', color='orange')
plt.plot(hist.index, hist['P/S AVG'], label='P/S AVG', linestyle='--', color='green')
plt.plot(hist.index, hist['P/S - 1STD'], label='P/S - 1STD', linestyle='--', color='blue')
plt.plot(hist.index, hist['P/S - 2STD'], label='P/S - 2STD', linestyle='--', color='purple')
plt.xlabel('Date')
plt.ylabel('Price (USD)')
plt.title(f'{ticker} Historical P/S')
plt.legend()
plt.grid(True)
plt.show()
