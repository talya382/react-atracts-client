import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logOut } from "../features/user/userSlice";
import { toggleCart } from "../features/cart/cartSlice";
import "./NavBar.css";
import { useLang } from "../LanguageContext";

const NavBar = () => {
    let user = useSelector(state => state.user.currentUser);
    const cartItems = useSelector(state => state.cart.items);
    const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
    let dispatch = useDispatch();
    const { lang, toggleLang, t } = useLang();

    const isAdmin = user?.role === "ADMIN";

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">🏔️ <span className="logo-highlight">אטרקציות</span> ישראל</Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/">{t.home}</Link></li>
                <li><Link to="/list">{t.allAttractions}</Link></li>
                <li>
                    <button className="cart-nav-btn" onClick={() => dispatch(toggleCart())}>
                        🛒 {t.basket}
                        {totalItems > 0 && (
                            <span className="cart-nav-count">{totalItems}</span>
                        )}
                    </button>
                </li>
                <li><Link to="/reviews">⭐ {t.reviews}</Link></li>
                <li><Link to="/top10">🏆 {t.top10}</Link></li>

                {/* כפתור ניהול - רק למנהל */}
                {isAdmin && (
                    <li>
                        <Link to="/add-product" className="admin-btn">
                            ⚙️ {lang === 'he' ? 'ניהול' : 'Admin'}
                        </Link>
                    </li>
                )}

                {!user && (
                    <>
                        <li><Link to="/login">{t.login}</Link></li>
                        <li><Link to="/signup" className="signup-btn">{t.register}</Link></li>
                    </>
                )}
                {user && (
                    <>
                        <li className="welcome">
                            {lang === "he" ? "שלום" : "Hello"}, {user.userName} 👋
                            {isAdmin && <span className="admin-badge">ADMIN</span>}
                        </li>
                        <li>
                            <button className="logout-btn" onClick={() => dispatch(logOut())}>
                                {lang === "he" ? "התנתקות" : "Logout"}
                            </button>
                        </li>
                    </>
                )}
            </ul>
            <button className="lang-btn" onClick={toggleLang}>
                {lang === "he" ? "🇺🇸 EN" : "🇮🇱 HE"}
            </button>
        </nav>
    );
}

export default NavBar;