
'use client';

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

type Currency = 'aed' | 'usd' | 'eur' | 'gbp';

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
  'aed': 1,
  'usd': 0.27,
  'eur': 0.25,
  'gbp': 0.21,
};

export const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'aed',
  setCurrency: () => {},
  rates: defaultRates,
  formatPrice: (basePrice) => `AED ${Math.round(basePrice).toLocaleString()}`,
  convertFromUSD: (basePrice) => basePrice,
});

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  rates: ExchangeRates;
  formatPrice: (basePrice: number, useSymbol?: boolean) => string;
  convertFromUSD: (basePrice: number) => number;
}

const fetchExchangeRates = async (): Promise<ExchangeRates> => {
  console.log('Fetching exchange rates...');
  try {
    const response = await fetch('https://api.exchangerate.host/latest?base=AED&symbols=AED,USD,EUR,GBP');
    if (!response.ok) {
      console.warn('Failed to fetch live exchange rates, falling back to default rates.');
      return defaultRates;
    }
    const data = await response.json();
    if (data.success && data.rates) {
      console.log('Successfully fetched live exchange rates.');
      return {
        aed: data.rates.AED,
        usd: data.rates.USD,
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
  const [currency, setCurrencyState] = useState<Currency>('aed');
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
  
  const convertFromUSD = useCallback((basePrice: number): number => {
    if (!isLoaded) return basePrice;
    const rate = rates[currency] || 1;
    return basePrice * rate;
  }, [currency, rates, isLoaded]);

  const formatPrice = useCallback((basePrice: number, useSymbol: boolean = true) => {
    const convertedPrice = convertFromUSD(basePrice);
    const currentCurrencyInfo = currencies.find(c => c.value === currency);
    const symbol = useSymbol ? currentCurrencyInfo?.symbol || 'AED ' : '';
    
    return `${symbol}${Math.round(convertedPrice).toLocaleString()}`;
  }, [currency, convertFromUSD]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, formatPrice, convertFromUSD }}>
      {children}
    </CurrencyContext.Provider>
  );
};
