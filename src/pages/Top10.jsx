import { useState, useEffect } from "react";
import { getTop10 } from "../api/atractionService";
import OrderModal from "./OrderModal";
import { useLang } from "../LanguageContext";
import { addToCart } from "../features/cart/cartSlice";
import { useDispatch } from "react-redux";

// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export default function Top10() {
  const [top10, setTop10] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const { lang } = useLang();
  const dispatch = useDispatch();

  const tr = {
    he: { title: "טופ 10 האטרקציות", subtitle: "האטרקציות הכי פופולריות לפי מספר הזמנות", noData: "עדיין אין נתוני הזמנות", orders: "הזמנות", bookNow: "הזמן עכשיו" },
    en: { title: "Top 10 Attractions", subtitle: "Most popular attractions by number of orders", noData: "No order data yet", orders: "orders", bookNow: "Book Now" }
  }[lang];

  const medals = ['🥇', '🥈', '🥉'];

  useEffect(() => {
    getTop10().then(res => setTop10(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CircularProgress sx={{ color: '#34d399' }} />
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', p: { xs: 2, md: 4 }, direction: 'rtl', maxWidth: 900, mx: 'auto' }}>
    
      {/* כותרת */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 1 }}>
          <EmojiEventsIcon sx={{ color: '#fbbf24', fontSize: 40 }} />
          <Typography variant="h3" sx={{ fontFamily: 'Rubik', fontWeight: 900, color: '#fff' }}>{tr.title}</Typography>
        </Box>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Rubik' }}>{tr.subtitle}</Typography>
      </Box>

      {/* רשימה */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {top10.length === 0 ? (
          <Typography sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontFamily: 'Rubik', mt: 4 }}>{tr.noData}</Typography>
        ) : top10.map((item, index) => (
          <Box key={item._id} sx={{
            display: 'flex', gap: 2, alignItems: 'center',
            background: index < 3 ? 'rgba(251,191,36,0.05)' : 'rgba(4,20,14,0.85)',
            border: index < 3 ? '1px solid rgba(251,191,36,0.3)' : '1px solid rgba(52,211,153,0.15)',
            borderRadius: '14px', overflow: 'hidden',
            transition: 'all 0.2s',
            '&:hover': { border: '1px solid rgba(52,211,153,0.4)', transform: 'translateY(-2px)' }
          }}>

            {/* מדליה */}
            <Box sx={{ width: 60, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
              <Typography sx={{ fontSize: index < 3 ? '2rem' : '1.2rem', fontWeight: 700, color: index < 3 ? '#fbbf24' : 'rgba(255,255,255,0.4)', fontFamily: 'Rubik' }}>
                {index < 3 ? medals[index] : `#${index + 1}`}
              </Typography>
            </Box>

            {/* תמונה */}
            <Box sx={{ width: 110, height: 90, flexShrink: 0 }}>
              <img src={item.imgUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>

            {/* מידע */}
            <Box sx={{ flex: 1, py: 1.5 }}>
              <Typography sx={{ fontFamily: 'Rubik', fontWeight: 700, color: '#fff', fontSize: '1rem', mb: 0.5 }}>{item.name}</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip icon={<LocationOnIcon sx={{ fontSize: 14, color: '#34d399 !important' }} />}
                  label={item.address?.split(",")[0]} size="small"
                  sx={{ background: 'rgba(52,211,153,0.1)', color: 'rgba(255,255,255,0.7)', fontFamily: 'Rubik', fontSize: '0.75rem', border: '1px solid rgba(52,211,153,0.2)' }} />
                <Chip icon={<AttachMoneyIcon sx={{ fontSize: 14, color: '#34d399 !important' }} />}
                  label={`${item.price} ₪`} size="small"
                  sx={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', fontFamily: 'Rubik', fontWeight: 700, fontSize: '0.75rem', border: '1px solid rgba(52,211,153,0.2)' }} />
                <Chip label={`🛒 ${item.orderCount} ${tr.orders}`} size="small"
                  sx={{ background: index < 3 ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.05)', color: index < 3 ? '#fbbf24' : 'rgba(255,255,255,0.5)', fontFamily: 'Rubik', fontSize: '0.75rem' }} />
              </Box>
            </Box>

            {/* כפתורים */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1.5, flexShrink: 0 }}>
              <Button variant="contained" size="small" onClick={() => setSelectedAttraction(item)}
                sx={{ background: 'linear-gradient(135deg, #34d399, #059669)', fontFamily: 'Rubik', fontWeight: 700, fontSize: '0.8rem', whiteSpace: 'nowrap', boxShadow: '0 0 15px rgba(52,211,153,0.2)', '&:hover': { boxShadow: '0 0 25px rgba(52,211,153,0.4)' } }}>
                {tr.bookNow}
              </Button>
              <Button variant="outlined" size="small" startIcon={<ShoppingCartIcon sx={{ fontSize: 16 }} />}
                onClick={() => dispatch(addToCart(item))}
                sx={{ color: '#34d399', borderColor: 'rgba(52,211,153,0.3)', fontFamily: 'Rubik', fontWeight: 600, fontSize: '0.8rem', '&:hover': { borderColor: '#34d399', background: 'rgba(52,211,153,0.05)' } }}>
                סל
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

      <OrderModal attraction={selectedAttraction} onClose={() => setSelectedAttraction(null)} />
    </Box>
  );
}