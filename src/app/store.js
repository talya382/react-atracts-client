import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "../features/basket/basketSlice";
import userReducer from "../features/user/userSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";


export const store = configureStore({
  reducer: {
    basket: basketReducer,
    user: userReducer,
    favorites: favoritesReducer, // ← הוסיפי
  }
  
});
