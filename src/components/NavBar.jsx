import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logOut } from "../features/user/userSlice";
import { toggleCart } from "../features/cart/cartSlice";
import { useLang } from "../LanguageContext";
import "./NavBar.css";

// MUI
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import StarIcon from "@mui/icons-material/Star";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ExploreIcon from "@mui/icons-material/Explore";

const NavBar = () => {
    const user = useSelector(state => state.user.currentUser);
    const cartItems = useSelector(state => state.cart.items);
    const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { lang, toggleLang, t } = useLang();
    const isAdmin = user?.role === "ADMIN";

    return (
        <AppBar position="sticky" sx={{
            background: 'rgba(4, 20, 14, 0.92)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(52, 211, 153, 0.15)',
            boxShadow: '0 4px 40px rgba(0,0,0,0.4)',
            zIndex: 1000,
        }}>
            <Toolbar sx={{ justifyContent: 'space-between', direction: 'rtl', px: { xs: 2, md: 4 } }}>

                {/* לוגו */}
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', fontFamily: 'Rubik' }}>
                        🏔️ <span style={{ color: '#34d399' }}>אטרקציות</span> ישראל
                    </span>
                </Link>

                {/* כפתורי ניווט */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Tooltip title={t.home}>
                        <IconButton onClick={() => navigate("/")} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#34d399' } }}>
                            <HomeIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={t.allAttractions}>
                        <IconButton onClick={() => navigate("/list")} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#34d399' } }}>
                            <ExploreIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={t.reviews}>
                        <IconButton onClick={() => navigate("/reviews")} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#34d399' } }}>
                            <StarIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={t.top10}>
                        <IconButton onClick={() => navigate("/top10")} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#34d399' } }}>
                            <EmojiEventsIcon />
                        </IconButton>
                    </Tooltip>

                    {/* סל קניות */}
                    <Tooltip title={t.basket}>
                        <IconButton onClick={() => dispatch(toggleCart())} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#34d399' } }}>
                            <Badge badgeContent={totalItems} color="success">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    {/* כפתור הוספה - מנהל בלבד */}
                    {isAdmin && (
                        <Tooltip title={lang === 'he' ? 'הוספת אטרקציה' : 'Add Attraction'}>
                            <Button
                                onClick={() => navigate("/add-product")}
                                startIcon={<AddCircleOutlineIcon />}
                                variant="outlined"
                                size="small"
                                sx={{
                                    color: '#34d399',
                                    borderColor: 'rgba(52,211,153,0.4)',
                                    fontFamily: 'Rubik',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    mr: 1,
                                    '&:hover': {
                                        borderColor: '#34d399',
                                        background: 'rgba(52,211,153,0.1)',
                                    }
                                }}
                            >
                                {lang === 'he' ? 'הוספת אטרקציה' : 'Add Attraction'}
                            </Button>
                        </Tooltip>
                    )}

                    {/* לא מחובר */}
                    {!user && (
                        <>
                            <Button onClick={() => navigate("/login")} sx={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Rubik', '&:hover': { color: '#fff' } }}>
                                {t.login}
                            </Button>
                            <Button
                                onClick={() => navigate("/signup")}
                                variant="contained"
                                size="small"
                                sx={{
                                    background: 'linear-gradient(135deg, #34d399, #059669)',
                                    fontFamily: 'Rubik', fontWeight: 700,
                                    boxShadow: '0 0 20px rgba(52,211,153,0.3)',
                                    '&:hover': { boxShadow: '0 0 30px rgba(52,211,153,0.5)' }
                                }}
                            >
                                {t.register}
                            </Button>
                        </>
                    )}

                    {/* מחובר */}
                    {user && (
                        <>
                            <Tooltip title={user.userName}>
                                <Avatar sx={{
                                    width: 36, height: 36,
                                    background: 'linear-gradient(135deg, #34d399, #059669)',
                                    fontSize: '0.9rem', fontWeight: 700,
                                    cursor: 'pointer', mx: 1,
                                    border: isAdmin ? '2px solid #fbbf24' : 'none',
                                }}>
                                    {user.userName?.charAt(0).toUpperCase()}
                                </Avatar>
                            </Tooltip>

                            {isAdmin && (
                                <span style={{
                                    background: 'rgba(251,191,36,0.15)',
                                    border: '1px solid rgba(251,191,36,0.4)',
                                    color: '#fbbf24', fontSize: '0.7rem',
                                    fontWeight: 700, padding: '2px 8px',
                                    borderRadius: '20px', marginLeft: 4,
                                    fontFamily: 'Rubik',
                                }}>
                                    ADMIN
                                </span>
                            )}

                            <Tooltip title={lang === 'he' ? 'התנתקות' : 'Logout'}>
                                <IconButton
                                    onClick={() => dispatch(logOut())}
                                    sx={{ color: 'rgba(239,68,68,0.7)', '&:hover': { color: '#ef4444' } }}
                                >
                                    <LogoutIcon />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}

                    {/* כפתור שפה */}
                    <Button
                        onClick={toggleLang}
                        size="small"
                        sx={{
                            color: '#34d399', border: '1px solid rgba(52,211,153,0.3)',
                            borderRadius: '20px', minWidth: 0, px: 1.5, fontSize: '0.8rem',
                            fontFamily: 'Rubik', fontWeight: 600,
                            '&:hover': { background: 'rgba(52,211,153,0.1)' }
                        }}
                    >
                        {lang === "he" ? "🇺🇸 EN" : "🇮🇱 HE"}
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;