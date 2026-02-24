import { useSelector, useDispatch } from "react-redux";
import { removeFromBasket, clearBasket, decreaseQty, addToBasket } from "../features/basket/basketSlice";
import { Link } from "react-router-dom";

const Basket = () => {
  const dispatch = useDispatch();
  // תיקון: גישה ל-arr כפי שמוגדר בסלייס
  const items = useSelector(state => state.basket.arr); 

  // תיקון: שימוש ב-qty
  const totalQuantity = items.reduce((sum, item) => sum + item.qty, 0); // תיקון ל-qty
const totalPrice = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2>הסל שלך ריק</h2>
        <Link to="/list">חזרה לאטרקציות</Link>
      </div>
    );
  }

  return (
    <div>
      <h2>Shopping cart</h2>
      {items.map(item => (
        <div key={item._id} style={{ marginBottom: "15px", borderBottom: "1px solid #eee" }}>
          <h4>{item.title}</h4>
          <p>Price: ₪{item.price}</p>
          <button onClick={() => dispatch(decreaseQty(item._id))}>-</button>
          <span style={{ margin: "0 10px" }}>{item.qty}</span>
          <button onClick={() => dispatch(addToBasket(item))}>+</button>
          <button style={{ color: "red", marginLeft: "20px" }} onClick={() => dispatch(removeFromBasket(item._id))}>
            Remove
          </button>
        </div>
      ))}
      <h3>Total items: {totalQuantity}</h3>
      <h3>Total payment: ₪{totalPrice}</h3>
      <button onClick={() => dispatch(clearBasket())}>Empty cart</button>
    </div>
  );
};

export default Basket;