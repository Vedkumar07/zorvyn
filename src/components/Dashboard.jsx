import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';

const Dashboard = () => {
  const transactions = useSelector((state) => state.transactions.list);

  // Calculate totals
  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Balance trend data
  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  let cumulativeBalance = 0;
  const balanceTrend = sortedTransactions.map(t => {
    cumulativeBalance += t.amount;
    return {
      date: format(new Date(t.date), 'MMM dd'),
      balance: cumulativeBalance,
    };
  });

  // Spending breakdown by category
  const expenseCategories = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    expenseCategories[t.category] = (expenseCategories[t.category] || 0) + Math.abs(t.amount);
  });
  const spendingData = Object.entries(expenseCategories).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your financial health at a glance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Balance</h2>
            <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <span className="text-primary text-xl">💰</span>
            </div>
          </div>
          <p className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-secondary' : 'text-fourth'}`}>
            ${totalBalance.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Current balance</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Income</h2>
            <div className="w-10 h-10 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
              <span className="text-secondary text-xl">📈</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-secondary">${totalIncome.toFixed(2)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This month</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Expenses</h2>
            <div className="w-10 h-10 bg-fourth bg-opacity-10 rounded-lg flex items-center justify-center">
              <span className="text-fourth text-xl">📉</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-fourth">${totalExpenses.toFixed(2)}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Balance Trend</h2>
            <div className="w-8 h-8 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <span className="text-primary text-sm">📊</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={balanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip
                formatter={(value) => [`$${value}`, 'Balance']}
                contentStyle={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  color: '#111827'
                }}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Spending Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Spending Breakdown</h2>
            <div className="w-8 h-8 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <span className="text-primary text-sm">🥧</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={spendingData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {spendingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`$${value}`, 'Amount']}
                contentStyle={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  color: '#111827'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {spendingData.map((entry, index) => (
              <div key={entry.name} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;