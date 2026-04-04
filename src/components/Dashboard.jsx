import { useSelector } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';

const summaryCards = [
  { label: 'Total Balance', valueKey: 'balance', accent: 'text-secondary' },
  { label: 'Total Income', valueKey: 'income', accent: 'text-secondary' },
  { label: 'Total Expenses', valueKey: 'expenses', accent: 'text-fourth' },
];

const StatCard = ({ label, value, accent, hint }) => (
  <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-sm hover:shadow-lg hover:border-cyan-500/50 transition hover:bg-slate-800/80">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-slate-100">{label}</h2>
      <div className="w-10 h-10 rounded-2xl bg-slate-700 flex items-center justify-center text-slate-400">•</div>
    </div>
    <p className={`text-3xl font-semibold ${accent}`}>{value}</p>
    <p className="text-sm text-slate-400 mt-1">{hint}</p>
  </div>
);

const Dashboard = () => {
  const transactions = useSelector((state) => state.transactions.list);

  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balanceTrend = [...transactions]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .reduce((acc, t) => {
      const lastBalance = acc.length ? acc[acc.length - 1].balance : 0;
      acc.push({ date: format(new Date(t.date), 'MMM dd'), balance: lastBalance + t.amount });
      return acc;
    }, []);

  const spendingData = Object.entries(
    transactions.reduce((acc, t) => {
      if (t.type === 'expense') {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      }
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const stats = {
    balance: `$${totalBalance.toFixed(2)}`,
    income: `$${totalIncome.toFixed(2)}`,
    expenses: `$${totalExpenses.toFixed(2)}`,
  };

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-6 bg-slate-900 min-h-full p-6">
      <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-100">Dashboard Overview</h1>
        <p className="text-slate-400 mt-2">Track your financial health with a clean summary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card) => (
          <StatCard
            key={card.label}
            label={card.label}
            value={stats[card.valueKey]}
            accent={card.accent}
            hint={card.label === 'Total Expenses' ? 'This month' : 'Current period'}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">Balance Trend</h2>
              <p className="text-sm text-slate-400">Monthly balance movement</p>
            </div>
            <span className="text-sm text-slate-400">Line Chart</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={balanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 16, backgroundColor: '#1e293b', border: '1px solid #475569', color: '#f1f5f9' }} formatter={(value) => [`$${value.toFixed(2)}`, 'Balance']} />
              <Line type="monotone" dataKey="balance" stroke="#60A5FA" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">Spending Breakdown</h2>
              <p className="text-sm text-slate-400">Expense categories at a glance</p>
            </div>
            <span className="text-sm text-slate-400">Pie Chart</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={spendingData} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3}>
                {spendingData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 16, backgroundColor: '#1e293b', border: '1px solid #475569', color: '#f1f5f9' }} formatter={(value) => [`$${value.toFixed(2)}`, 'Spent']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-5">
            {spendingData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-3 text-sm text-slate-400">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Recent Transactions</h2>
            <p className="text-sm text-slate-400">Latest activity from your financial history.</p>
          </div>
          <span className="text-sm text-slate-400">Top 5</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left">
            <thead className="bg-slate-700 border-b border-slate-600">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-300">Date</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-300">Category</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-300">Type</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-300">Amount</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-300">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-5 py-4 text-sm text-slate-200">{format(new Date(transaction.date), 'MMM dd, yyyy')}</td>
                  <td className="px-5 py-4 text-sm text-slate-200">{transaction.category}</td>
                  <td className="px-5 py-4 text-sm capitalize text-slate-200">{transaction.type}</td>
                  <td className={`px-5 py-4 text-sm font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-400">{transaction.description}</td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-sm text-slate-400">No recent transactions available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
