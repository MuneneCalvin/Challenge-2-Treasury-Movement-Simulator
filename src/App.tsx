import React, { useState } from 'react';
import { Account, Transaction } from './types';
import { AccountCard } from './components/AccountCard';
import { TransferModal } from './components/TransferModal';
import { TransactionLog } from './components/TransactionLog';
import { ThemeToggle } from './components/ThemeToggle';
import { formatCurrency, generateAccountId } from './utils';
import { Plus, ArrowLeftRight, TrendingUp, Wallet } from 'lucide-react';

const initialAccounts: Account[] = [
  { id: generateAccountId(), name: 'Mpesa_KES_1', currency: 'KES', balance: 125000.50, type: 'Mpesa' },
  { id: generateAccountId(), name: 'Mpesa_KES_2', currency: 'KES', balance: 87300.25, type: 'Mpesa' },
  { id: generateAccountId(), name: 'Bank_USD_1', currency: 'USD', balance: 15750.80, type: 'Bank' },
  { id: generateAccountId(), name: 'Bank_USD_2', currency: 'USD', balance: 32400.15, type: 'Bank' },
  { id: generateAccountId(), name: 'Bank_USD_3', currency: 'USD', balance: 8920.45, type: 'Bank' },
  { id: generateAccountId(), name: 'Wallet_NGN_1', currency: 'NGN', balance: 2850000.30, type: 'Wallet' },
  { id: generateAccountId(), name: 'Wallet_NGN_2', currency: 'NGN', balance: 1950000.75, type: 'Wallet' },
  { id: generateAccountId(), name: 'Bank_KES_1', currency: 'KES', balance: 890000.20, type: 'Bank' },
  { id: generateAccountId(), name: 'Bank_NGN_1', currency: 'NGN', balance: 5670000.45, type: 'Bank' },
  { id: generateAccountId(), name: 'Wallet_USD_1', currency: 'USD', balance: 25600.90, type: 'Wallet' },
];

function App() {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedFromAccount, setSelectedFromAccount] = useState<Account | undefined>();
  const [selectedToAccount, setSelectedToAccount] = useState<Account | undefined>();

  const handleTransfer = (transaction: Transaction) => {
    if (transaction.status === 'completed') {
      // Update account balances
      setAccounts(prevAccounts => 
        prevAccounts.map(account => {
          if (account.id === transaction.fromAccountId) {
            return { ...account, balance: account.balance - transaction.amount };
          }
          if (account.id === transaction.toAccountId) {
            return { ...account, balance: account.balance + transaction.convertedAmount };
          }
          return account;
        })
      );
    }
    
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleTransferFrom = (account: Account) => {
    setSelectedFromAccount(account);
    setSelectedToAccount(undefined);
    setIsTransferModalOpen(true);
  };

  const handleTransferTo = (account: Account) => {
    setSelectedFromAccount(undefined);
    setSelectedToAccount(account);
    setIsTransferModalOpen(true);
  };

  const handleNewTransfer = () => {
    setSelectedFromAccount(undefined);
    setSelectedToAccount(undefined);
    setIsTransferModalOpen(true);
  };

  const getTotalBalance = (currency: string) => {
    return accounts
      .filter(account => account.currency === currency)
      .reduce((total, account) => total + account.balance, 0);
  };

  const getTransactionCount = () => {
    return {
      completed: transactions.filter(t => t.status === 'completed').length,
      scheduled: transactions.filter(t => t.status === 'scheduled').length
    };
  };

  const transactionCounts = getTransactionCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Theme Toggle */}
        <div className="text-center mb-8 relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-blue-600 dark:bg-blue-500 p-3 rounded-2xl shadow-lg">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Treasury Management</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Manage your multi-currency accounts and transfers</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total USD</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(getTotalBalance('USD'), 'USD')}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total KES</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(getTotalBalance('KES'), 'KES')}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total NGN</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {formatCurrency(getTotalBalance('NGN'), 'NGN')}
                </p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Transactions</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {transactionCounts.completed + transactionCounts.scheduled}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {transactionCounts.scheduled} scheduled
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <ArrowLeftRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </div>
            </div>
          </div>
        </div>

        {/* New Transfer Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleNewTransfer}
            className="bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto"
          >
            <Plus className="w-6 h-6" />
            <span>New Transfer</span>
          </button>
        </div>

        {/* Accounts Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Accounts</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">10 accounts across 3 currencies</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {accounts.map(account => (
              <AccountCard
                key={account.id}
                account={account}
                onTransferFrom={handleTransferFrom}
                onTransferTo={handleTransferTo}
              />
            ))}
          </div>
        </div>

        {/* Transaction Log */}
        <TransactionLog transactions={transactions} accounts={accounts} />

        {/* Transfer Modal */}
        <TransferModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          accounts={accounts}
          onTransfer={handleTransfer}
          preSelectedFrom={selectedFromAccount}
          preSelectedTo={selectedToAccount}
        />
      </div>
    </div>
  );
}

export default App;