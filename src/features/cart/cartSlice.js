import { createSlice } from "@reduxjs/toolkit";

const loadCart = () => {
  try {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : { items: [], isOpen: false };
  } catch {
    return { items: [], isOpen: false };
  }
};

const saveCart = (state) => {
  try {
    localStorage.setItem("cart", JSON.stringify({ items: state.items, isOpen: false }));
  } catch {}
};

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCart(),
  reducers: {
    addToCart: (state, action) => {
      const id = action.payload._id || action.payload.id;
      const existing = state.items.find(item => (item._id || item.id) === id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...action.payload, qty: 1 });
      }
      state.isOpen = true;
      saveCart(state);
    },
    updateQty: (state, action) => {
      const { id, change } = action.payload;
      const item = state.items.find(i => (i._id || i.id) === id);
      if (item) {
        item.qty += change;
        if (item.qty <= 0) {
          state.items = state.items.filter(i => (i._id || i.id) !== id);
        }
      }
      saveCart(state);
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeCart: (state) => {
      state.isOpen = false;
    }
  }
});

export const { addToCart, updateQty, toggleCart, closeCart } = cartSlice.actions;
export default cartSlice.reducer;