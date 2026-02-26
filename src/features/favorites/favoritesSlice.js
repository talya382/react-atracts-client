import { createSlice } from "@reduxjs/toolkit";

const saved = localStorage.getItem('favorites');
const initialState = { arr: saved ? JSON.parse(saved) : [] };

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const index = state.arr.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.arr.splice(index, 1);
      } else {
        state.arr.push(action.payload);
      }
      localStorage.setItem('favorites', JSON.stringify(state.arr));
    },
  }
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;