import { FXRate } from './types';

export const fxRates: FXRate[] = [
  // USD to others
  { from: 'USD', to: 'KES', rate: 129.50 },
  { from: 'USD', to: 'NGN', rate: 460.25 },
  
  // KES to others
  { from: 'KES', to: 'USD', rate: 0.0077 },
  { from: 'KES', to: 'NGN', rate: 3.55 },
  
  // NGN to others
  { from: 'NGN', to: 'USD', rate: 0.0022 },
  { from: 'NGN', to: 'KES', rate: 0.28 },
];

export const getFXRate = (from: string, to: string): number => {
  if (from === to) return 1;
  
  const rate = fxRates.find(r => r.from === from && r.to === to);
  return rate ? rate.rate : 1;
};

export const convertAmount = (amount: number, from: string, to: string): number => {
  const rate = getFXRate(from, to);
  return amount * rate;
};

export const formatCurrency = (amount: number, currency: string): string => {
  const symbols = {
    USD: '$',
    KES: 'KSh',
    NGN: '₦'
  };
  
  return `${symbols[currency as keyof typeof symbols]}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export const getCurrencyColor = (currency: string): string => {
  const colors = {
    USD: 'text-blue-600 dark:text-blue-400',
    KES: 'text-green-600 dark:text-green-400',
    NGN: 'text-orange-600 dark:text-orange-400'
  };
  return colors[currency as keyof typeof colors] || 'text-gray-600 dark:text-gray-400';
};

export const getCurrencyBgColor = (currency: string): string => {
  const colors = {
    USD: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700',
    KES: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700',
    NGN: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700'
  };
  return colors[currency as keyof typeof colors] || 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
};

export const generateAccountId = (): string => {
  return `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateTransactionId = (): string => {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};