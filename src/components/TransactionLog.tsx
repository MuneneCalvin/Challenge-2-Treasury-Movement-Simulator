import React, { useState } from 'react';
import { Transaction, Account } from '../types';
import { formatCurrency, getCurrencyColor } from '../utils';
import { ArrowRight, Filter, Calendar, Clock, CheckCircle, ExternalLink } from 'lucide-react';

interface TransactionLogProps {
  transactions: Transaction[];
  accounts: Account[];
}

export const TransactionLog: React.FC<TransactionLogProps> = ({ transactions, accounts }) => {
  const [filterCurrency, setFilterCurrency] = useState<string>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getAccountName = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? account.name : 'Unknown Account';
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filterCurrency !== 'all' && 
        transaction.sourceCurrency !== filterCurrency && 
        transaction.targetCurrency !== filterCurrency) {
      return false;
    }
    
    if (filterAccount !== 'all' && 
        transaction.fromAccountId !== filterAccount && 
        transaction.toAccountId !== filterAccount) {
      return false;
    }
    
    if (filterStatus !== 'all' && transaction.status !== filterStatus) {
      return false;
    }
    
    return true;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Transaction History</h2>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Filters</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select
          value={filterCurrency}
          onChange={(e) => setFilterCurrency(e.target.value)}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All Currencies</option>
          <option value="USD">USD</option>
          <option value="KES">KES</option>
          <option value="NGN">NGN</option>
        </select>

        <select
          value={filterAccount}
          onChange={(e) => setFilterAccount(e.target.value)}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All Accounts</option>
          {accounts.map(account => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="scheduled">Scheduled</option>
        </select>

        <div className="text-sm text-gray-500 dark:text-gray-400 p-2">
          {filteredTransactions.length} transactions
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <ExternalLink className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p>No transactions found matching your filters.</p>
          </div>
        ) : (
          filteredTransactions.map(transaction => (
            <div
              key={transaction.id}
              className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.status === 'completed' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {transaction.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white text-sm">
                      {getAccountName(transaction.fromAccountId)}
                      <ArrowRight className="w-4 h-4 inline mx-2 text-gray-400 dark:text-gray-500" />
                      {getAccountName(transaction.toAccountId)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {transaction.status === 'scheduled' ? 'Scheduled for' : 'Completed on'} {formatDate(transaction.futureDate || transaction.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getCurrencyColor(transaction.sourceCurrency)}`}>
                    {formatCurrency(transaction.amount, transaction.sourceCurrency)}
                  </p>
                  {transaction.sourceCurrency !== transaction.targetCurrency && (
                    <p className={`text-sm ${getCurrencyColor(transaction.targetCurrency)}`}>
                      ≈ {formatCurrency(transaction.convertedAmount, transaction.targetCurrency)}
                    </p>
                  )}
                </div>
              </div>
              
              {transaction.note && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mt-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{transaction.note}</p>
                </div>
              )}
              
              {transaction.sourceCurrency !== transaction.targetCurrency && (
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Exchange Rate</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    1 {transaction.sourceCurrency} = {transaction.exchangeRate} {transaction.targetCurrency}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};