import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Calendar, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { Account, Transaction } from '../types';
import { formatCurrency, convertAmount, getFXRate, generateTransactionId } from '../utils';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  onTransfer: (transaction: Transaction) => void;
  preSelectedFrom?: Account;
  preSelectedTo?: Account;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onTransfer,
  preSelectedFrom,
  preSelectedTo
}) => {
  const [fromAccount, setFromAccount] = useState<Account | null>(preSelectedFrom || null);
  const [toAccount, setToAccount] = useState<Account | null>(preSelectedTo || null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [futureDate, setFutureDate] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (preSelectedFrom) setFromAccount(preSelectedFrom);
    if (preSelectedTo) setToAccount(preSelectedTo);
  }, [preSelectedFrom, preSelectedTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromAccount || !toAccount || !amount) return;

    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const exchangeRate = getFXRate(fromAccount.currency, toAccount.currency);
    const convertedAmount = convertAmount(parseFloat(amount), fromAccount.currency, toAccount.currency);
    
    const transaction: Transaction = {
      id: generateTransactionId(),
      fromAccountId: fromAccount.id,
      toAccountId: toAccount.id,
      amount: parseFloat(amount),
      sourceCurrency: fromAccount.currency,
      targetCurrency: toAccount.currency,
      convertedAmount,
      exchangeRate,
      note,
      timestamp: new Date(),
      futureDate: futureDate ? new Date(futureDate) : undefined,
      status: futureDate ? 'scheduled' : 'completed'
    };

    onTransfer(transaction);
    setShowConfirmation(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmation(false);
      onClose();
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setFromAccount(null);
    setToAccount(null);
    setAmount('');
    setNote('');
    setFutureDate('');
  };

  const isInsufficientBalance = fromAccount && amount && parseFloat(amount) > fromAccount.balance;
  const needsConversion = fromAccount && toAccount && fromAccount.currency !== toAccount.currency;
  const convertedAmount = needsConversion ? convertAmount(parseFloat(amount) || 0, fromAccount.currency, toAccount.currency) : parseFloat(amount) || 0;
  const exchangeRate = needsConversion ? getFXRate(fromAccount.currency, toAccount.currency) : 1;
  const hasAmount = amount && parseFloat(amount) > 0;

  if (!isOpen) return null;

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Transfer Successful!</h3>
            <p className="text-gray-600 dark:text-gray-300">Your transaction has been processed successfully.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Processing Transfer...</h3>
          <p className="text-gray-600 dark:text-gray-300">Please wait while we process your transaction.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Transfer Funds</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">From Account</label>
              <select
                value={fromAccount?.id || ''}
                onChange={(e) => setFromAccount(accounts.find(acc => acc.id === e.target.value) || null)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select source account</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} - {formatCurrency(account.balance, account.currency)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">To Account</label>
              <select
                value={toAccount?.id || ''}
                onChange={(e) => setToAccount(accounts.find(acc => acc.id === e.target.value) || null)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select destination account</option>
                {accounts.filter(acc => acc.id !== fromAccount?.id).map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} - {formatCurrency(account.balance, account.currency)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  isInsufficientBalance ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter amount"
                required
              />
              {fromAccount && (
                <div className="absolute right-3 top-3 text-sm text-gray-500 dark:text-gray-400">
                  {fromAccount.currency}
                </div>
              )}
            </div>
            {isInsufficientBalance && (
              <div className="flex items-center space-x-1 mt-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Insufficient balance</span>
              </div>
            )}
          </div>

          {/* Live Exchange Rate Conversion Display */}
          {needsConversion && fromAccount && toAccount && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Live Currency Conversion</h3>
                </div>
                <div className="bg-blue-100 dark:bg-blue-800 px-3 py-1 rounded-full">
                  <span className="text-xs font-medium text-blue-800 dark:text-blue-200">LIVE RATE</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">You Send</p>
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {hasAmount ? formatCurrency(parseFloat(amount), fromAccount.currency) : formatCurrency(0, fromAccount.currency)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{fromAccount.currency}</p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="bg-white dark:bg-gray-700 rounded-full p-3 shadow-sm border border-gray-200 dark:border-gray-600">
                    <ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">They Receive</p>
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {hasAmount ? formatCurrency(convertedAmount, toAccount.currency) : formatCurrency(0, toAccount.currency)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{toAccount.currency}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700 dark:text-blue-300">Exchange Rate</span>
                  <span className="font-semibold text-blue-900 dark:text-blue-100">
                    1 {fromAccount.currency} = {exchangeRate.toFixed(4)} {toAccount.currency}
                  </span>
                </div>
                {hasAmount && (
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-blue-700 dark:text-blue-300">Conversion Fee</span>
                    <span className="text-sm text-blue-900 dark:text-blue-100">Included in rate</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Same Currency Transfer Display */}
          {!needsConversion && fromAccount && toAccount && hasAmount && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">Same Currency Transfer</span>
                </div>
                <span className="text-lg font-bold text-green-700 dark:text-green-300">
                  {formatCurrency(parseFloat(amount), fromAccount.currency)}
                </span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">No conversion needed - exact amount will be transferred</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Note (Optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
              placeholder="Add a note for this transfer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Schedule for Future Date (Optional)
            </label>
            <input
              type="datetime-local"
              value={futureDate}
              onChange={(e) => setFutureDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!fromAccount || !toAccount || !amount || isInsufficientBalance}
              className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {futureDate ? 'Schedule Transfer' : 'Transfer Funds'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};