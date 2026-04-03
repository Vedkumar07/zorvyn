import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    search: '',
    sortBy: 'date', // 'date', 'amount', 'category'
    sortOrder: 'desc', // 'asc', 'desc'
    categoryFilter: '', // empty means all
    typeFilter: '', // 'income', 'expense', or empty
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
    },
    setTypeFilter: (state, action) => {
      state.typeFilter = action.payload;
    },
    resetFilters: (state) => {
      state.search = '';
      state.sortBy = 'date';
      state.sortOrder = 'desc';
      state.categoryFilter = '';
      state.typeFilter = '';
    },
  },
});

export const { setSearch, setSortBy, setSortOrder, setCategoryFilter, setTypeFilter, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;