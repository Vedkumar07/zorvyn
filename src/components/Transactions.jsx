import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTransaction, updateTransaction, deleteTransaction } from '../store/slices/transactionsSlice';
import { setSearch, setSortBy, setSortOrder, setCategoryFilter, setTypeFilter } from '../store/slices/filtersSlice';
import { format } from 'date-fns';

const fieldGroups = [
  { label: 'Search', type: 'text', filter: 'search', placeholder: 'Search description or category' },
  { label: 'Category', type: 'select', filter: 'categoryFilter' },
  { label: 'Type', type: 'select', filter: 'typeFilter', options: ['income', 'expense'] },
  { label: 'Sort By', type: 'select', filter: 'sortBy', options: ['date', 'amount', 'category'] },
  { label: 'Order', type: 'select', filter: 'sortOrder', options: ['asc', 'desc'] },
];

const TextInput = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full px-3 py-2 rounded-2xl border border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
    />
  </div>
);

const SelectInput = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 rounded-2xl border border-slate-600 bg-slate-700 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
    >
      <option value="">All</option>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

const Transactions = () => {
  const transactions = useSelector((state) => state.transactions.list);
  const filters = useSelector((state) => state.filters);
  const role = useSelector((state) => state.role.currentRole);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ date: '', amount: '', category: '', type: 'expense', description: '' });

  const categories = [...new Set(transactions.map((item) => item.category))];
  const typeOptions = ['income', 'expense'];

  const filteredTransactions = transactions
    .filter((transaction) => {
      const query = filters.search.toLowerCase();
      const matchesSearch = transaction.description.toLowerCase().includes(query) || transaction.category.toLowerCase().includes(query);
      const matchesCategory = !filters.categoryFilter || transaction.category === filters.categoryFilter;
      const matchesType = !filters.typeFilter || transaction.type === filters.typeFilter;
      return matchesSearch && matchesCategory && matchesType;
    })
    .sort((a, b) => {
      const keys = {
        amount: [a.amount, b.amount],
        category: [a.category, b.category],
        date: [new Date(a.date), new Date(b.date)],
      };
      const [aValue, bValue] = keys[filters.sortBy] || keys.date;
      if (aValue === bValue) return 0;
      return filters.sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

  const openModal = (transaction = null) => {
    setEditing(transaction);
    setFormData(transaction || { date: '', amount: '', category: '', type: 'expense', description: '' });
    setIsModalOpen(true);
  };

  const saveTransaction = (event) => {
    event.preventDefault();
    const payload = { ...formData, amount: parseFloat(formData.amount) };
    if (editing) {
      dispatch(updateTransaction({ ...payload, id: editing.id }));
    } else {
      dispatch(addTransaction(payload));
    }
    setIsModalOpen(false);
  };

  const removeTransaction = (id) => {
    if (window.confirm('Delete this transaction?')) {
      dispatch(deleteTransaction(id));
    }
  };

  return (
    <div className="space-y-6 bg-slate-900 min-h-full p-6">
      <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-slate-100">Transactions</h2>
            <p className="text-slate-400 mt-1">View and manage your transaction history.</p>
          </div>
          {role === 'admin' && (
            <button
              onClick={() => openModal()}
              className="rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-700 transition"
            >
              Add Transaction
            </button>
          )}
        </div>
      </div>

      <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-5">
          <TextInput
            label="Search"
            value={filters.search}
            placeholder="Search transactions..."
            onChange={(e) => dispatch(setSearch(e.target.value))}
          />
          <SelectInput
            label="Category"
            value={filters.categoryFilter}
            onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
            options={['', ...categories]}
          />
          <SelectInput
            label="Type"
            value={filters.typeFilter}
            onChange={(e) => dispatch(setTypeFilter(e.target.value))}
            options={['', ...typeOptions]}
          />
          <SelectInput
            label="Sort By"
            value={filters.sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            options={['date', 'amount', 'category']}
          />
          <SelectInput
            label="Order"
            value={filters.sortOrder}
            onChange={(e) => dispatch(setSortOrder(e.target.value))}
            options={['desc', 'asc']}
          />
        </div>
      </div>

      <div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-slate-700 border-b border-slate-600">
              <tr>
                {['Date', 'Amount', 'Category', 'Type', 'Description', role === 'admin' ? 'Actions' : null].map((heading) => (
                  heading && (
                    <th key={heading} className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-300">
                      {heading}
                    </th>
                  )
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={role === 'admin' ? 6 : 5} className="px-6 py-12 text-center">
                    <div className="mx-auto h-12 w-12 text-slate-600">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-sm font-medium text-slate-200">
                      {transactions.length === 0 ? 'No transactions yet' : 'No transactions match your filters'}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {transactions.length === 0
                        ? 'Get started by adding your first transaction.'
                        : 'Try adjusting your search or filter criteria.'
                      }
                    </p>
                    {transactions.length === 0 && role === 'admin' && (
                      <div className="mt-4">
                        <button
                          onClick={() => openModal()}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-2xl text-white bg-cyan-600 hover:bg-cyan-700"
                        >
                          Add Transaction
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-200">{format(new Date(transaction.date), 'MMM dd, yyyy')}</td>
                    <td className={`px-6 py-4 text-sm font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-200">{transaction.category}</td>
                    <td className="px-6 py-4 text-sm capitalize text-slate-200">{transaction.type}</td>
                    <td className="px-6 py-4 text-sm text-slate-200">{transaction.description}</td>
                    {role === 'admin' && (
                      <td className="px-6 py-4 text-sm space-x-3">
                        <button onClick={() => openModal(transaction)} className="text-cyan-400 hover:text-cyan-300">Edit</button>
                        <button onClick={() => removeTransaction(transaction.id)} className="text-red-400 hover:text-red-300">Delete</button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg rounded-3xl bg-slate-800 border border-slate-700 shadow-2xl overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-100">{editing ? 'Edit Transaction' : 'Add Transaction'}</h3>
                  <p className="text-sm text-slate-400">Use the form to update your records.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-300">✕</button>
              </div>
              <form onSubmit={saveTransaction} className="grid gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full rounded-2xl border border-slate-600 bg-slate-700 px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full rounded-2xl border border-slate-600 bg-slate-700 px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-2xl border border-slate-600 bg-slate-700 px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full rounded-2xl border border-slate-600 bg-slate-700 px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-2xl border border-slate-600 bg-slate-700 px-3 py-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex gap-3 flex-col sm:flex-row">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="w-full rounded-2xl border border-slate-600 px-4 py-3 text-sm font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 transition">
                    Cancel
                  </button>
                  <button type="submit" className="w-full rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-700 transition">
                    {editing ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
