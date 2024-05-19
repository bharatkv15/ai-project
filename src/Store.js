import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userquery/UserSlice";
import userReducer2 from "./features/userquery/UserSlice2";
 
export default configureStore({
  reducer: {
    user: userReducer,
    user1: userReducer2,
  },
});