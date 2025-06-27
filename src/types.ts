export interface Account {
  id: string;
  name: string;
  currency: 'KES' | 'USD' | 'NGN';
  balance: number;
  type: 'Mpesa' | 'Bank' | 'Wallet';
}

export interface Transaction {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  sourceCurrency: 'KES' | 'USD' | 'NGN';
  targetCurrency: 'KES' | 'USD' | 'NGN';
  convertedAmount: number;
  exchangeRate: number;
  note?: string;
  timestamp: Date;
  futureDate?: Date;
  status: 'completed' | 'scheduled';
}

export interface FXRate {
  from: 'KES' | 'USD' | 'NGN';
  to: 'KES' | 'USD' | 'NGN';
  rate: number;
}