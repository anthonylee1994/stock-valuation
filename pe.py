import numpy as np
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt

ticker = 'META'

eps_by_year = {
    2009: 0.00,
    2010: 0.00,
    2011: 0.01,
    2012: 0.02,
    2013: 0.02,
    2014: 0.02,
    2015: 0.03,
    2016: 0.03,
    2017: 0.06,
    2018: 0.12,
    2019: 0.17,
    2020: 0.11,
    2021: 0.17,
    2022: 0.39,
    2023: 0.17,
    2024: 1.19,
    2025: 2.94
}


data = yf.download(ticker, period='10y', interval='1d', auto_adjust=True)
prices = data['Close']

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
hist['P/E + 2STD'] = (pe_mean[-1] + 2 * pe_std[-1])
hist['P/E + 1STD'] = (pe_mean[-1] + pe_std[-1])
hist['P/E AVG'] = pe_mean[-1]
hist['P/E - 1STD'] = (pe_mean[-1] - pe_std[-1])
hist['P/E - 2STD'] = (pe_mean[-1] - 2 * pe_std[-1])

# Create the plot
plt.figure(figsize=(14, 8))
plt.plot(prices.index, pe_daily, label='P/E', color='black')
plt.plot(hist.index, hist['P/E + 2STD'], label='P/E + 2STD', linestyle='--', color='red')
plt.plot(hist.index, hist['P/E + 1STD'], label='P/E + 1STD', linestyle='--', color='orange')
plt.plot(hist.index, hist['P/E AVG'], label='P/E AVG', linestyle='--', color='green')
plt.plot(hist.index, hist['P/E - 1STD'], label='P/E - 1STD', linestyle='--', color='blue')
plt.plot(hist.index, hist['P/E - 2STD'], label='P/E - 2STD', linestyle='--', color='purple')
plt.xlabel('Date')
plt.ylabel('Price (USD)')
plt.title(f'{ticker} Historical P/E')
plt.legend()
plt.grid(True)
plt.show()
