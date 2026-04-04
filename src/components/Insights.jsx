import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const metricCards = [
  { title: 'Total Balance', key: 'balance', prefix: '$', format: (value) => value.toFixed(2) },
  { title: 'Income', key: 'income', prefix: '$', format: (value) => value.toFixed(2) },
  { title: 'Expenses', key: 'expense', prefix: '$', format: (value) => value.toFixed(2) },
  { title: 'Active Categories', key: 'categories', suffix: '' },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];

const Insights = () => {
  const transactions = useSelector((state) => state.transactions.list);

  const insights = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        summary: { balance: 0, income: 0, expense: 0, categories: 0 },
        highestSpendingCategory: null,
        monthlyComparison: [],
        spendingByCategory: [],
        chartData: [],
      };
    }

    // Basic summary
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

    const summary = {
      balance: totals.balance,
      income: totals.income,
      expense: totals.expense,
      categories: totals.categories.size,
    };

    // Highest spending category
    const categorySpending = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        return acc;
      }, {});

    const highestSpendingCategory = Object.entries(categorySpending)
      .sort(([,a], [,b]) => b - a)[0] || null;

    // Monthly comparison - get the last two months with data
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Find the most recent month with data
    const mostRecentDate = sortedTransactions.length > 0 ? new Date(sortedTransactions[0].date) : new Date();
    const currentMonth = {
      start: startOfMonth(mostRecentDate),
      end: endOfMonth(mostRecentDate),
    };

    // Find the previous month (month before the most recent month with data)
    const previousMonth = {
      start: startOfMonth(new Date(mostRecentDate.getFullYear(), mostRecentDate.getMonth() - 1, 1)),
      end: endOfMonth(new Date(mostRecentDate.getFullYear(), mostRecentDate.getMonth() - 1, 1)),
    };

    const currentMonthData = transactions.filter(t =>
      isWithinInterval(new Date(t.date), currentMonth)
    ).reduce((acc, t) => {
      if (t.type === 'income') acc.income += t.amount;
      else acc.expense += Math.abs(t.amount);
      return acc;
    }, { income: 0, expense: 0 });

    const previousMonthData = transactions.filter(t =>
      isWithinInterval(new Date(t.date), previousMonth)
    ).reduce((acc, t) => {
      if (t.type === 'income') acc.income += t.amount;
      else acc.expense += Math.abs(t.amount);
      return acc;
    }, { income: 0, expense: 0 });

    const currentMonthName = mostRecentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    const previousMonthDate = new Date(mostRecentDate.getFullYear(), mostRecentDate.getMonth() - 1, 1);
    const previousMonthName = previousMonthDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

    const monthlyComparison = [
      {
        month: previousMonthName,
        income: previousMonthData.income,
        expense: previousMonthData.expense,
        net: previousMonthData.income - previousMonthData.expense,
      },
      {
        month: currentMonthName,
        income: currentMonthData.income,
        expense: currentMonthData.expense,
        net: currentMonthData.income - currentMonthData.expense,
      },
    ];

    // Spending by category for pie chart
    const spendingByCategory = Object.entries(categorySpending)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7); // Top 7 categories

    // Chart data for line chart
    const chartData = [...transactions]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((transaction) => ({
        date: new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: Number(transaction.amount),
      }))
      .slice(-10);

    return {
      summary,
      highestSpendingCategory,
      monthlyComparison,
      spendingByCategory,
      chartData,
    };
  }, [transactions]);

  const hasData = transactions && transactions.length > 0;

  if (!hasData) {
    return (
      <div className="space-y-6 bg-slate-900 min-h-full p-6">
        <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-sm">
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-slate-600">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-slate-100">No insights available</h3>
            <p className="mt-2 text-sm text-slate-400">Add some transactions to see your financial insights and analytics.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-slate-900 min-h-full p-6">
      <div className="grid gap-6 lg:grid-cols-4">
        {metricCards.map((card) => (
          <div key={card.key} className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-sm hover:border-cyan-500/50 transition-colors">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-400">{card.title}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-100">
              {card.prefix || ''}{card.format ? card.format(insights.summary[card.key]) : insights.summary[card.key]}{card.suffix || ''}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 pb-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-100">Highest Spending Category</h2>
              <p className="text-sm text-slate-400">Your biggest expense category this period.</p>
            </div>
          </div>
          <div className="text-center py-8">
            {insights.highestSpendingCategory ? (
              <div>
                <div className="text-4xl font-bold text-slate-100">{insights.highestSpendingCategory[0]}</div>
                <div className="mt-2 text-lg text-slate-300">${insights.highestSpendingCategory[1].toFixed(2)}</div>
                <div className="mt-1 text-sm text-slate-400">Total spent</div>
              </div>
            ) : (
              <div className="text-slate-400">No expense data available</div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 pb-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-100">Monthly Comparison</h2>
              <p className="text-sm text-slate-400">Compare current vs previous month performance.</p>
            </div>
          </div>
          <div className="space-y-4">
            {insights.monthlyComparison.map((month) => (
              <div key={month.month} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                <div>
                  <div className="font-medium text-slate-100">{month.month}</div>
                  <div className="text-sm text-slate-400">
                    Income: ${month.income.toFixed(2)} | Expense: ${month.expense.toFixed(2)}
                  </div>
                </div>
                <div className={`text-lg font-semibold ${month.net >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${month.net.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 pb-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-100">Performance Overview</h2>
            <p className="text-sm text-slate-400">Recent transaction trend for the last 10 entries.</p>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={insights.chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '1rem', border: '1px solid #475569', backgroundColor: '#1e293b', color: '#f1f5f9' }} />
              <Line type="monotone" dataKey="amount" stroke="#60A5FA" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Insights;
