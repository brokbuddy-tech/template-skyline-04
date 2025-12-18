
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

const defaultRates: ExchangeRates = {
  'usd': 1,
  'aed': 3.67,
  'eur': 0.92,
  'gbp': 0.79,
};

export const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'usd',
  setCurrency: () => {},
  rates: defaultRates,
  formatPrice: (usdPrice) => `$${usdPrice.toLocaleString()}`,
  convertFromUSD: (usdPrice) => usdPrice,
});

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  rates: ExchangeRates;
  formatPrice: (usdPrice: number, useSymbol?: boolean) => string;
  convertFromUSD: (usdPrice: number) => number;
}

const fetchExchangeRates = async (): Promise<ExchangeRates> => {
  console.log('Fetching exchange rates...');
  try {
    const response = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=USD,AED,EUR,GBP');
    if (!response.ok) {
      console.warn('Failed to fetch live exchange rates, falling back to default rates.');
      return defaultRates;
    }
    const data = await response.json();
    if (data.success && data.rates) {
      console.log('Successfully fetched live exchange rates.');
      return {
        usd: data.rates.USD,
        aed: data.rates.AED,
        eur: data.rates.EUR,
        gbp: data.rates.GBP,
      };
    }
    console.warn('API response for exchange rates was not successful, falling back to default rates.');
    return defaultRates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return defaultRates;
  }
};

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>('usd');
  const [rates, setRates] = useState<ExchangeRates>(defaultRates);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedCurrency = localStorage.getItem('userCurrency') as Currency;
    if (storedCurrency && currencies.some(c => c.value === storedCurrency)) {
      setCurrencyState(storedCurrency);
    }
    
    const getRates = async () => {
      const fetchedRates = await fetchExchangeRates();
      setRates(fetchedRates);
      setIsLoaded(true);
    };
    getRates();
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('userCurrency', newCurrency);
  };
  
  const convertFromUSD = useCallback((usdPrice: number): number => {
    if (!isLoaded) return usdPrice;
    const rate = rates[currency] || 1;
    return usdPrice * rate;
  }, [currency, rates, isLoaded]);

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
