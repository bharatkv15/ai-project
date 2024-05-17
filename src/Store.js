import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userquery/UserSlice";

export default configureStore({
  reducer: {
    user: userReducer,
  },
  // reducer: {
  //   user: userReducer,
  //   post: postReducer,
  // },
});
