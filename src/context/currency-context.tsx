
'use client';

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

type Currency = 'usd' | 'aed' | 'eur' | 'gbp';

interface CurrencyInfo {
  value: Currency;
  label: string;
  symbol: string;
}

export const currencies: CurrencyInfo[] = [
  { value: 'usd', label: 'USD (US Dollar)', symbol: '$' },
  { value: 'aed', label: 'AED (UAE Dirham)', symbol: 'AED ' },
  { value: 'eur', label: 'EUR (Euro)', symbol: '€' },
  { value: 'gbp', label: 'GBP (Pound Sterling)', symbol: '£' },
];

interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  rates: ExchangeRates;
  formatPrice: (usdPrice: number, useSymbol?: boolean) => string;
  convertFromUSD: (usdPrice: number) => number;
}

export const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'usd',
  setCurrency: () => {},
  rates: { usd: 1 },
  formatPrice: (usdPrice) => `$${usdPrice.toLocaleString()}`,
  convertFromUSD: (usdPrice) => usdPrice,
});

// Mock exchange rate fetch
const fetchExchangeRates = async (): Promise<ExchangeRates> => {
  console.log('Fetching exchange rates...');
  // In a real app, this would be an API call to e.g. exchangerate-api.com
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        'usd': 1,
        'aed': 3.67,
        'eur': 0.92,
        'gbp': 0.79,
      });
    }, 500);
  });
};

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>('usd');
  const [rates, setRates] = useState<ExchangeRates>({ usd: 1 });

  useEffect(() => {
    const storedCurrency = localStorage.getItem('userCurrency') as Currency;
    if (storedCurrency && currencies.some(c => c.value === storedCurrency)) {
      setCurrencyState(storedCurrency);
    }
    
    const getRates = async () => {
      const fetchedRates = await fetchExchangeRates();
      setRates(fetchedRates);
    };
    getRates();
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('userCurrency', newCurrency);
  };
  
  const convertFromUSD = useCallback((usdPrice: number): number => {
    const rate = rates[currency] || 1;
    return usdPrice * rate;
  }, [currency, rates]);

  const formatPrice = useCallback((usdPrice: number, useSymbol: boolean = true) => {
    const convertedPrice = convertFromUSD(usdPrice);
    const currentCurrencyInfo = currencies.find(c => c.value === currency);
    const symbol = useSymbol ? currentCurrencyInfo?.symbol || '$' : '';
    
    return `${symbol}${Math.round(convertedPrice).toLocaleString()}`;
  }, [currency, convertFromUSD]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, formatPrice, convertFromUSD }}>
      {children}
    </CurrencyContext.Provider>
  );
};
