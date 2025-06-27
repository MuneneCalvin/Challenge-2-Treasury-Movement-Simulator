import React from 'react';
import { Account } from '../types';
import { formatCurrency, getCurrencyColor, getCurrencyBgColor } from '../utils';
import { ArrowUpRight, ArrowDownLeft, Wallet, Building2, Smartphone } from 'lucide-react';

interface AccountCardProps {
  account: Account;
  onTransferFrom: (account: Account) => void;
  onTransferTo: (account: Account) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onTransferFrom, onTransferTo }) => {
  const getAccountIcon = () => {
    switch (account.type) {
      case 'Mpesa':
        return <Smartphone className="w-5 h-5" />;
      case 'Bank':
        return <Building2 className="w-5 h-5" />;
      case 'Wallet':
        return <Wallet className="w-5 h-5" />;
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };

  return (
    <div className={`rounded-xl border-2 ${getCurrencyBgColor(account.currency)} p-6 transition-all duration-300 hover:shadow-lg hover:scale-105`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getCurrencyColor(account.currency)} bg-white dark:bg-gray-800`}>
            {getAccountIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{account.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{account.type} Account</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-md text-xs font-medium ${getCurrencyColor(account.currency)} bg-white dark:bg-gray-800`}>
          {account.currency}
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Available Balance</p>
        <p className={`text-2xl font-bold ${getCurrencyColor(account.currency)}`}>
          {formatCurrency(account.balance, account.currency)}
        </p>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onTransferFrom(account)}
          className="flex-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center space-x-1 border border-gray-200 dark:border-gray-600"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Send</span>
        </button>
        <button
          onClick={() => onTransferTo(account)}
          className="flex-1 bg-gray-800 dark:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors duration-200 flex items-center justify-center space-x-1"
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>Receive</span>
        </button>
      </div>
    </div>
  );
};