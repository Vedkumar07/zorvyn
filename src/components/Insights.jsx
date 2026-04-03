import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const metricCards = [
  { title: 'Total Balance', key: 'balance', prefix: '$', format: (value) => value.toFixed(2) },
  { title: 'Income', key: 'income', prefix: '$', format: (value) => value.toFixed(2) },
  { title: 'Expenses', key: 'expense', prefix: '$', format: (value) => value.toFixed(2) },
  { title: 'Active Categories', key: 'categories', suffix: '' },
];

const Insights = () => {
  const transactions = useSelector((state) => state.transactions.list);

  const summary = useMemo(() => {
    const totals = transactions.reduce(
      (acc, transaction) => {
        const amount = Number(transaction.amount) || 0;
        if (transaction.type === 'income') {
          acc.income += amount;
        } else {
          acc.expense += Math.abs(amount);
        }
        acc.balance += amount;
        acc.categories.add(transaction.category);
        return acc;
      },
      { income: 0, expense: 0, balance: 0, categories: new Set() }
    );

    return {
      balance: totals.balance,
      income: totals.income,
      expense: totals.expense,
      categories: totals.categories.size,
    };
  }, [transactions]);

  const chartData = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((transaction) => ({
        date: new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: Number(transaction.amount),
      }))
      .slice(-10);
  }, [transactions]);

  return (
    <div className="space-y-6 bg-slate-50 dark:bg-slate-950 min-h-full p-6">
      <div className="grid gap-6 lg:grid-cols-4">
        {metricCards.map((card) => (
          <div key={card.key} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{card.title}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
              {card.prefix || ''}{card.format ? card.format(summary[card.key]) : summary[card.key]}{card.suffix || ''}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 pb-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Performance Overview</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Recent transaction trend for the last 10 entries.</p>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '1rem', border: '1px solid #CBD5E1', backgroundColor: '#0F172A', color: '#fff' }} />
              <Line type="monotone" dataKey="amount" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Insights;
