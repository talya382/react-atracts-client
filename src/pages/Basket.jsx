import { useSelector, useDispatch } from "react-redux";
import { removeFromBasket, clearBasket, decreaseQty, addToBasket } from "../features/basket/basketSlice";
import { Link } from "react-router-dom";
import { useLang } from "../LanguageContext";
import "./Basket.css";

const Basket = () => {
  const dispatch = useDispatch();
  const items = useSelector(state => state.basket.arr);
  const { lang } = useLang();

  const totalQuantity = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  const tr = {
    he: {
      title: "🛒 סל הקניות שלי",
      empty: "הסל שלך ריק",
      backToAttractions: "חזרה לאטרקציות",
      perPerson: "לאדם",
      total: "סה\"כ פריטים:",
      totalPrice: "סה\"כ לתשלום:",
      clearCart: "🗑️ רוקן סל",
      checkout: "💳 המשך לתשלום",
      items: "פריטים",
    },
    en: {
      title: "🛒 My Cart",
      empty: "Your cart is empty",
      backToAttractions: "Back to Attractions",
      perPerson: "per person",
      total: "Total items:",
      totalPrice: "Total payment:",
      clearCart: "🗑️ Clear Cart",
      checkout: "💳 Checkout",
      items: "items",
    }
  }[lang];

  if (items.length === 0) {
    return (
      <div className="basket-empty">
        <span>🛒</span>
        <h2>{tr.empty}</h2>
        <Link to="/list" className="back-link">{tr.backToAttractions}</Link>
      </div>
    );
  }

  return (
    <div className="basket-page">
      <div className="basket-container">
        <h1 className="basket-title">{tr.title}</h1>

        <div className="basket-items">
          {items.map(item => (
            <div key={item._id} className="basket-card">
              <div className="basket-img">
                <img src={item.imgUrl} alt={item.name} />
              </div>
              <div className="basket-info">
                <h3>{item.name}</h3>
                <p className="basket-address">📍 {item.address?.split(",")[0]}</p>
                <p className="basket-price">💰 {item.price} ₪ {tr.perPerson}</p>
              </div>
              <div className="basket-controls">
                <div className="qty-controls">
                  <button onClick={() => dispatch(decreaseQty(item._id))}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => dispatch(addToBasket(item))}>+</button>
                </div>
                <p className="item-total">{item.price * item.qty} ₪</p>
                <button className="remove-btn" onClick={() => dispatch(removeFromBasket(item._id))}>🗑️</button>
              </div>
            </div>
          ))}
        </div>

        <div className="basket-summary">
          <div className="summary-row">
            <span>{tr.total}</span>
            <span>{totalQuantity} {tr.items}</span>
          </div>
          <div className="summary-row total">
            <span>{tr.totalPrice}</span>
            <span>{totalPrice} ₪</span>
          </div>
          <div className="basket-actions">
            <button className="clear-btn" onClick={() => dispatch(clearBasket())}>{tr.clearCart}</button>
            <button className="checkout-btn">{tr.checkout}</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Basket;