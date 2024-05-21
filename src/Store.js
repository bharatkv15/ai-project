import { configureStore } from "@reduxjs/toolkit";
import speechToTextReducer from "./features/userquery/SpeechToTextSlice";
import messageReducer from "./features/userquery/MessageSlice";
 
export default configureStore({
  reducer: {
    speechToText: speechToTextReducer,
    message: messageReducer,
  },
});