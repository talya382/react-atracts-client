import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateQty, closeCart } from '../features/cart/cartSlice';
import './CartDrawer.css';
import { useNavigate } from "react-router-dom";


const CartDrawer = () => {
  const cart = useSelector((state) => state.cart) || { items: [], isOpen: false };
  const { items, isOpen } = cart;
  const navigate = useNavigate();
  console.log("CartDrawer:", { isOpen, items }); // ← הוסיפי שורה זו
  const dispatch = useDispatch();

  // סגירה אוטומטית אחרי 3 שניות
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      dispatch(closeCart());
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="cart-overlay" onClick={() => dispatch(closeCart())}>
      <div className="cart-content" onClick={e => e.stopPropagation()}>
        
        <div className="cart-header">
          <h3>🛒 הסל שלי</h3>
          <button className="cart-close" onClick={() => dispatch(closeCart())}>✕</button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <p className="cart-empty">הסל ריק</p>
          ) : (
            items.map(item => (
              <div key={item._id || item.id} className="cart-item">
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-price">{item.price} ₪</span>
                <div className="qty-controls">
                  <button onClick={() => dispatch(updateQty({ id: item._id || item.id, change: -1 }))}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => dispatch(updateQty({ id: item._id || item.id, change: 1 }))}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>סה"כ:</span>
              <span className="cart-total-price">{total} ₪</span>
            </div>
            <button className="cart-checkout-btn" onClick={() => { dispatch(closeCart()); navigate("/basket"); }}>
               המשך לתשלום
            </button>
          </div>
        )}

        {/* פס טיימר שמראה כמה זמן נשאר */}
        <div className="cart-timer-bar" />
      </div>
    </div>
  );
};

export default CartDrawer;