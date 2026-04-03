import { useSelector } from 'react-redux';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const Insights = () => {
  const transactions = useSelector((state) => state.transactions.list);

  // Highest spending category
  const expenseCategories = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    expenseCategories[t.category] = (expenseCategories[t.category] || 0) + Math.abs(t.amount);
  });
  const highestCategory = Object.entries(expenseCategories).reduce((max, [cat, amt]) =>
    amt > max.amount ? { category: cat, amount: amt } : max,
    { category: 'None', amount: 0 }
  );

  // Monthly comparison (current vs previous month)
  const now = new Date();
  const currentMonth = {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
  const prevMonth = {
    start: startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
    end: endOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
  };

  const currentIncome = transactions.filter(t =>
    t.type === 'income' && isWithinInterval(new Date(t.date), currentMonth)
  ).reduce((sum, t) => sum + t.amount, 0);

  const currentExpenses = transactions.filter(t =>
    t.type === 'expense' && isWithinInterval(new Date(t.date), currentMonth)
  ).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const prevIncome = transactions.filter(t =>
    t.type === 'income' && isWithinInterval(new Date(t.date), prevMonth)
  ).reduce((sum, t) => sum + t.amount, 0);

  const prevExpenses = transactions.filter(t =>
    t.type === 'expense' && isWithinInterval(new Date(t.date), prevMonth)
  ).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const incomeChange = prevIncome ? ((currentIncome - prevIncome) / prevIncome * 100).toFixed(1) : 0;
  const expenseChange = prevExpenses ? ((currentExpenses - prevExpenses) / prevExpenses * 100).toFixed(1) : 0;

  // Average transaction amount
  const avgTransaction = transactions.length > 0 ?
    transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / transactions.length : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Financial Insights</h2>
        <p className="text-gray-600 dark:text-gray-400">Key metrics and observations from your data</p>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Highest Spending</h3>
            <div className="w-10 h-10 bg-fourth bg-opacity-10 rounded-lg flex items-center justify-center">
              <span className="text-fourth text-xl">💸</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-fourth mb-1">{highestCategory.category}</p>
          <p className="text-sm text-tertiary">${highestCategory.amount.toFixed(2)} spent</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Income Trend</h3>
            <div className="w-10 h-10 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
              <span className="text-secondary text-xl">📈</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-secondary mb-1">${currentIncome.toFixed(2)}</p>
          <p className={`text-sm ${incomeChange >= 0 ? 'text-secondary' : 'text-fourth'}`}>
            {incomeChange}% vs last month
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Expense Trend</h3>
            <div className="w-10 h-10 bg-fourth bg-opacity-10 rounded-lg flex items-center justify-center">
              <span className="text-fourth text-xl">📉</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-fourth mb-1">${currentExpenses.toFixed(2)}</p>
          <p className={`text-sm ${expenseChange <= 0 ? 'text-secondary' : 'text-fourth'}`}>
            {expenseChange}% vs last month
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Avg Transaction</h3>
            <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <span className="text-primary text-xl">💵</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-primary mb-1">${avgTransaction.toFixed(2)}</p>
          <p className="text-sm text-tertiary">Across all transactions</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Transactions</h3>
            <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <span className="text-primary text-xl">📊</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-primary mb-1">{transactions.length}</p>
          <p className="text-sm text-tertiary">In your history</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Savings Rate</h3>
            <div className="w-10 h-10 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
              <span className="text-secondary text-xl">🎯</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-secondary mb-1">
            {currentIncome > 0 ? ((currentIncome - currentExpenses) / currentIncome * 100).toFixed(1) : 0}%
          </p>
          <p className="text-sm text-tertiary">This month</p>
        </div>
      </div>
    </div>
  );
};

export default Insights;