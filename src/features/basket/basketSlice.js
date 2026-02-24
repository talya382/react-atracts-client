import { createSlice } from "@reduxjs/toolkit";

const basketSlice = createSlice({
    name: "basket",
    initialState: { arr: [] },
    reducers: {
        addToBasket: (state, action) => {
            let index = state.arr.findIndex(item => item._id === action.payload._id);
            if (index !== -1) {
                state.arr[index].qty++;
            } else {
                state.arr.push({ ...action.payload, qty: 1 });
            }
        },
        decreaseQty: (state, action) => { // השם שחיפשת ב-Basket.jsx
            let index = state.arr.findIndex(item => item._id === action.payload);
            if (index === -1) return;
            if (state.arr[index].qty === 1) {
                state.arr.splice(index, 1);
            } else {
                state.arr[index].qty--;
            }
        },
        removeFromBasket: (state, action) => {
            state.arr = state.arr.filter(item => item._id !== action.payload);
        },
        clearBasket: (state) => {
            state.arr = [];
        }
    }
});

export const { addToBasket, decreaseQty, removeFromBasket, clearBasket } = basketSlice.actions;
export default basketSlice.reducer;