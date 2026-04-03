import { createSlice } from '@reduxjs/toolkit';

// Mock data for transactions
const mockTransactions = [
  { id: 1, date: '2023-10-01', amount: 2500, category: 'Salary', type: 'income', description: 'Monthly salary' },
  { id: 2, date: '2023-10-02', amount: -150, category: 'Groceries', type: 'expense', description: 'Weekly groceries' },
  { id: 3, date: '2023-10-03', amount: -200, category: 'Utilities', type: 'expense', description: 'Electricity bill' },
  { id: 4, date: '2023-10-04', amount: 300, category: 'Freelance', type: 'income', description: 'Side project payment' },
  { id: 5, date: '2023-10-05', amount: -50, category: 'Entertainment', type: 'expense', description: 'Movie tickets' },
  { id: 6, date: '2023-10-06', amount: -100, category: 'Transportation', type: 'expense', description: 'Gas refill' },
  { id: 7, date: '2023-10-07', amount: 400, category: 'Bonus', type: 'income', description: 'Performance bonus' },
  { id: 8, date: '2023-10-08', amount: -75, category: 'Dining', type: 'expense', description: 'Dinner out' },
  { id: 9, date: '2023-10-09', amount: -300, category: 'Rent', type: 'expense', description: 'Monthly rent' },
  { id: 10, date: '2023-10-10', amount: -25, category: 'Groceries', type: 'expense', description: 'Snacks' },
  { id: 11, date: '2023-10-11', amount: 150, category: 'Investment', type: 'income', description: 'Dividend payout' },
  { id: 12, date: '2023-10-12', amount: -120, category: 'Healthcare', type: 'expense', description: 'Doctor visit' },
  { id: 13, date: '2023-10-13', amount: -60, category: 'Entertainment', type: 'expense', description: 'Concert tickets' },
  { id: 14, date: '2023-10-14', amount: 200, category: 'Refund', type: 'income', description: 'Product return' },
  { id: 15, date: '2023-10-15', amount: -80, category: 'Transportation', type: 'expense', description: 'Taxi fare' },
  { id: 16, date: '2023-10-16', amount: -250, category: 'Shopping', type: 'expense', description: 'Clothes' },
  { id: 17, date: '2023-10-17', amount: 350, category: 'Salary', type: 'income', description: 'Overtime pay' },
  { id: 18, date: '2023-10-18', amount: -40, category: 'Dining', type: 'expense', description: 'Coffee' },
  { id: 19, date: '2023-10-19', amount: -180, category: 'Utilities', type: 'expense', description: 'Internet bill' },
  { id: 20, date: '2023-10-20', amount: 100, category: 'Gift', type: 'income', description: 'Birthday gift' },
];

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    list: mockTransactions,
  },
  reducers: {
    addTransaction: (state, action) => {
      const newId = Math.max(...state.list.map(t => t.id)) + 1;
      state.list.push({ ...action.payload, id: newId });
    },
    updateTransaction: (state, action) => {
      const index = state.list.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteTransaction: (state, action) => {
      state.list = state.list.filter(t => t.id !== action.payload);
    },
  },
});

export const { addTransaction, updateTransaction, deleteTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;