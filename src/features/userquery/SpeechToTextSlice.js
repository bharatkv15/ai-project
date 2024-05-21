import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
 
export const updateSpeechToText = createAsyncThunk("", async (base64Audio) => {
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
  return response;
});
 
export const speechToTextSlice = createSlice({
  name: "speechToText",
  initialState: {
    speechtoTextInfo: {
      data: "data",
    },
    pending: true,
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(updateSpeechToText.pending, (state) => {
      state.pending = true;
      state.error = false;
    });
    builder.addMatcher(updateSpeechToText.fulfilled, (state, action) => {
      state.speechtoTextInfo = action.payload;
      state.pending = false;
    });
    builder.addMatcher(updateSpeechToText.rejected, (state) => {
      state.pending = false;
      state.error = true;
    });
  },
});
 
export default speechToTextSlice.reducer;
 