import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateUser3 = createAsyncThunk("", async (history) => {
  //   const response = await axios.post(
  //     `https://speech.googleapis.com/v1/speech:recognize?key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
  //     {
  //       config: {
  //         encoding: "WEBM_OPUS",
  //         sampleRateHertz: 48000,
  //         languageCode: "en-US",
  //       },
  //       audio: {
  //         content: base64Audio,
  //       },
  //     }
  //   );
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
