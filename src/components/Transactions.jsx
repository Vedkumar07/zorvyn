import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTransaction, updateTransaction, deleteTransaction } from '../store/slices/transactionsSlice';
import { setSearch, setSortBy, setSortOrder, setCategoryFilter, setTypeFilter } from '../store/slices/filtersSlice';
import { format } from 'date-fns';

const Transactions = () => {
  const transactions = useSelector((state) => state.transactions.list);
  const filters = useSelector((state) => state.filters);
  const role = useSelector((state) => state.role.currentRole);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    category: '',
    type: 'expense',
    description: '',
  });

  // Filter and sort transactions
  let filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                          t.category.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = !filters.categoryFilter || t.category === filters.categoryFilter;
    const matchesType = !filters.typeFilter || t.type === filters.typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  filteredTransactions.sort((a, b) => {
    let aVal, bVal;
    switch (filters.sortBy) {
      case 'amount':
        aVal = a.amount;
        bVal = b.amount;
        break;
      case 'category':
        aVal = a.category;
        bVal = b.category;
        break;
      default:
        aVal = new Date(a.date);
        bVal = new Date(b.date);
    }
    if (filters.sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const handleAdd = () => {
    setEditingTransaction(null);
    setFormData({ date: '', amount: '', category: '', type: 'expense', description: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({ ...transaction });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteTransaction(id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const transaction = { ...formData, amount: parseFloat(formData.amount) };
    if (editingTransaction) {
      dispatch(updateTransaction({ ...transaction, id: editingTransaction.id }));
    } else {
      dispatch(addTransaction(transaction));
    }
    setIsModalOpen(false);
  };

  const categories = [...new Set(transactions.map(t => t.category))];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Transactions</h2>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <select
          value={filters.categoryFilter}
          onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select
          value={filters.typeFilter}
          onChange={(e) => dispatch(setTypeFilter(e.target.value))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          value={filters.sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
          <option value="category">Sort by Category</option>
        </select>
        <select
          value={filters.sortOrder}
          onChange={(e) => dispatch(setSortOrder(e.target.value))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
        {role === 'admin' && (
          <button onClick={handleAdd} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600">
            Add Transaction
          </button>
        )}
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">Date</th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">Amount</th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">Category</th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">Type</th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">Description</th>
              {role === 'admin' && <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(t => (
              <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">{format(new Date(t.date), 'MMM dd, yyyy')}</td>
                <td className={`px-4 py-2 border border-gray-300 dark:border-gray-600 ${t.amount >= 0 ? 'text-secondary' : 'text-fourth'}`}>
                  ${Math.abs(t.amount).toFixed(2)}
                </td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">{t.category}</td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white capitalize">{t.type}</td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">{t.description}</td>
                {role === 'admin' && (
                  <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
                    <button onClick={() => handleEdit(t)} className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded text-sm">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(t.id)} className="px-2 py-1 bg-red-500 text-white rounded text-sm">
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{editingTransaction ? 'Edit' : 'Add'} Transaction</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-500 text-white rounded-md">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">
                  {editingTransaction ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;