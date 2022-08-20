import { createSlice } from "@reduxjs/toolkit";

export const tokenSlice = createSlice({
  name: "token",
  initialState: {
    value: undefined,
  },
  reducers: {
    setToken: (state: any, action: { payload: any }) => {
      state.value = action.payload;
    },
  },
});

export const { setToken } = tokenSlice.actions;

export const selectToken = (state: any) => state.token.value;

export default tokenSlice.reducer;
