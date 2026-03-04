import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "../features/basket/basketSlice";
import userReducer from "../features/user/userSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";
import cartReducer from "../features/cart/cartSlice"; // ← חדש

export const store = configureStore({
  reducer: {
    basket: basketReducer,
    user: userReducer,
    favorites: favoritesReducer,
    cart: cartReducer, // ← חדש
  }
});