import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logOut } from "../features/user/userSlice";
import "./NavBar.css";

const NavBar = () => {
    let user = useSelector(state => state.user.currentUser);
    let dispatch = useDispatch();

    return (
        <nav className="navbar">
            <div className="navbar-logo">
             <Link to="/">🏔️ <span className="logo-highlight">אטרקציות</span> ישראל</Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/">בית</Link></li>
                <li><Link to="/list">כל האטרקציות</Link></li>
                <li><Link to="/basket">🛒 סל קניות</Link></li>
                <li><Link to="/reviews">⭐ ביקורות</Link></li>
                {!user && (
                    <>
                        <li><Link to="/login">התחברות</Link></li>
                        <li><Link to="/signup" className="signup-btn">הרשמה חינם</Link></li>
                    </>
                )}
                {user && (
                    <>
                        <li className="welcome">שלום, {user.userName} 👋</li>
                        <li><button className="logout-btn" onClick={() => dispatch(logOut())}>התנתקות</button></li>
                    </>
                )}
            </ul>
        </nav>
    );
}
export default NavBar;