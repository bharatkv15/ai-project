import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const updateUser3 = createAsyncThunk("", async (history) => {
  return history;
});

export const userSlice21 = createSlice({
  name: "ChatData",
  initialState: {
    chatInfo: {
      data: "data",
    },
    pending: true,
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(updateUser3.pending, (state) => {
      state.pending = true;
      state.error = false;
    });
    builder.addMatcher(updateUser3.fulfilled, (state, action) => {
      state.chatInfo = action.payload;
      state.pending = false;
    });
    builder.addMatcher(updateUser3.rejected, (state) => {
      state.pending = false;
      state.error = true;
    });
  },
});

export default userSlice21.reducer;
