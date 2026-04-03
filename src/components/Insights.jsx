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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Highest Spending Category</h3>
          <p className="text-2xl font-bold text-fourth">{highestCategory.category}</p>
          <p className="text-sm text-tertiary">${highestCategory.amount.toFixed(2)} spent</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Monthly Income Comparison</h3>
          <p className="text-2xl font-bold text-secondary">${currentIncome.toFixed(2)}</p>
          <p className={`text-sm ${incomeChange >= 0 ? 'text-secondary' : 'text-fourth'}`}>
            {incomeChange}% vs last month
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Monthly Expense Comparison</h3>
          <p className="text-2xl font-bold text-fourth">${currentExpenses.toFixed(2)}</p>
          <p className={`text-sm ${expenseChange <= 0 ? 'text-secondary' : 'text-fourth'}`}>
            {expenseChange}% vs last month
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Average Transaction</h3>
          <p className="text-2xl font-bold text-primary">${avgTransaction.toFixed(2)}</p>
          <p className="text-sm text-tertiary">Across all transactions</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Total Transactions</h3>
          <p className="text-2xl font-bold text-primary">{transactions.length}</p>
          <p className="text-sm text-tertiary">In your history</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Net Savings Rate</h3>
          <p className="text-2xl font-bold text-primary">
            {currentIncome > 0 ? ((currentIncome - currentExpenses) / currentIncome * 100).toFixed(1) : 0}%
          </p>
          <p className="text-sm text-tertiary">This month</p>
        </div>
      </div>
    </div>
  );
};

export default Insights;