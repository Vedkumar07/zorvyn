import { createSlice } from '@reduxjs/toolkit';

const roleSlice = createSlice({
  name: 'role',
  initialState: {
    currentRole: 'viewer', // 'viewer' or 'admin'
  },
  reducers: {
    setRole: (state, action) => {
      state.currentRole = action.payload;
    },
  },
});

export const { setRole } = roleSlice.actions;
export default roleSlice.reducer;