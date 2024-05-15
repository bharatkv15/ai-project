import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateUser2 = createAsyncThunk("", async (base64Audio) => {
  const response = await axios.post(
    `https://speech.googleapis.com/v1/speech:recognize?key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
    {
      config: {
        encoding: "WEBM_OPUS",
        sampleRateHertz: 48000,
        languageCode: "en-US",
      },
      audio: {
        content: base64Audio,
      },
    }
  );
  console.log("RESPONSE:", response);
  return response;
});

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: {
      data: "data",
    },
    pending: true,
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    // debugger;
    builder.addMatcher(updateUser2.pending, (state) => {
      state.pending = true;
      state.error = false;
    });
    builder.addMatcher(updateUser2.fulfilled, (state, action) => {
      state.userInfo = action.payload;
      state.pending = false;
    });
    builder.addMatcher(updateUser2.rejected, (state) => {
      state.pending = false;
      state.error = true;
    });
  },
});

export default userSlice.reducer;
