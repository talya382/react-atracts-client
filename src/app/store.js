import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "../features/basket/basketSlice";
import userReducer from "../features/user/userSlice";

export const store = configureStore({
  reducer: {
    basket: basketReducer,
    user: userReducer
  }
});
