import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';

const Dashboard = () => {
  const transactions = useSelector((state) => state.transactions.list);

  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  let cumulativeBalance = 0;
  const balanceTrend = sortedTransactions.map(t => {
    cumulativeBalance += t.amount;
    return { date: format(new Date(t.date), 'MMM dd'), balance: cumulativeBalance };
  });

  const expenseCategories = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    expenseCategories[t.category] = (expenseCategories[t.category] || 0) + Math.abs(t.amount);
  });
  const spendingData = Object.entries(expenseCategories).map(([category, amount]) => ({ name: category, value: amount }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6 min-h-full bg-gray-50 dark:bg-gray-950">
      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Balance" value={`$${totalBalance.toFixed(2)}`} color={totalBalance >= 0 ? 'text-secondary' : 'text-fourth'} />
        <StatCard label="Income" value={`$${totalIncome.toLocaleString()}`} color="text-secondary" />
        <StatCard label="Expenses" value={`$${totalExpenses.toLocaleString()}`} color="text-fourth" />
        <StatCard label="Transactions" value={transactions.length} color="text-primary" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Balance Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={balanceTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip formatter={(value) => [`$${value}`, 'Balance']} />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="var(--primary)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Spending by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={spendingData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                {spendingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-3 text-sm font-medium text-gray-900 dark:text-white">{t.description}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      t.type === 'income' ? 'bg-secondary/10 text-secondary' : 'bg-fourth/10 text-fourth'
                    }`}>
                      {t.type === 'income' ? '▲' : '▼'} {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs text-gray-600 dark:text-gray-400">{format(new Date(t.date), 'MMM dd')}</td>
                  <td className={`px-6 py-3 text-sm font-bold ${t.type === 'income' ? 'text-secondary' : 'text-fourth'}`}>
                    {t.type === 'income' && '+'}{t.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4 hover:shadow-md transition-shadow">
    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-2">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const StatPill = ({ label, value, color = '' }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{label}</span>
    <span className={`text-lg font-bold ${color || 'text-gray-900 dark:text-white'}`}>{value}</span>
  </div>
);

export default Dashboard;