import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToBasket } from "../features/basket/basketSlice";
import { incrementOrder } from "../api/atractionService";
import { useLang } from "../LanguageContext";
import Swal from "sweetalert2";

// MUI
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const darkSx = { background: '#04140e', color: '#fff' };

export default function OrderModal({ attraction, onClose }) {
  const [qty, setQty] = useState(1);
  const [showTrails, setShowTrails] = useState(false);
  const dispatch = useDispatch();
  const { t, lang } = useLang();

  if (!attraction) return null;

  const lat = attraction.location?.lat;
  const lng = attraction.location?.lng;

  const handleOrder = async () => {
    for (let i = 0; i < qty; i++) dispatch(addToBasket(attraction));
    try { await incrementOrder(attraction._id); } catch (err) { console.error(err); }
    onClose();
    Swal.fire({
      title: lang === 'he' ? '✅ נוסף לסל!' : '✅ Added to cart!',
      text: `${qty} ${lang === 'he' ? 'כרטיסים' : 'tickets'} - ${attraction.name}`,
      icon: 'success', timer: 1800, showConfirmButton: false,
      background: '#04140e', color: '#fff',
    });
  };

  return (
    <Dialog open={!!attraction} onClose={onClose} maxWidth={showTrails ? "lg" : "sm"} fullWidth
      PaperProps={{ sx: { background: '#04140e', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '16px', color: '#fff', direction: 'rtl', overflow: 'hidden' } }}>

      {/* כפתור סגירה */}
      <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, left: 8, color: 'rgba(255,255,255,0.5)', zIndex: 10, '&:hover': { color: '#ef4444' } }}>
        <CloseIcon />
      </IconButton>

      <Box sx={{ display: 'flex', height: '100%' }}>

        {/* תוכן ראשי */}
        <Box sx={{ flex: 1, minWidth: 0 }}>

          {/* תמונה */}
          <Box sx={{
            height: 220, backgroundImage: `url(${attraction.imgUrl})`,
            backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'
          }}>
            <Box sx={{ position: 'absolute', bottom: 12, right: 12 }}>
              <Chip label={`${attraction.price} ₪`} sx={{ background: 'linear-gradient(135deg, #34d399, #059669)', color: '#fff', fontWeight: 700, fontSize: '1rem', fontFamily: 'Rubik' }} />
            </Box>
          </Box>

          <DialogContent sx={{ pt: 2 }}>
            <Typography variant="h5" sx={{ fontFamily: 'Rubik', fontWeight: 900, mb: 1 }}>{attraction.name}</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', mb: 2 }}>{attraction.description}</Typography>

            {/* פרטים */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              {[
                { icon: <LocationOnIcon sx={{ color: '#34d399', fontSize: 18 }} />, text: attraction.address },
                { icon: <PhoneIcon sx={{ color: '#34d399', fontSize: 18 }} />, text: attraction.phone },
                { icon: <AttachMoneyIcon sx={{ color: '#34d399', fontSize: 18 }} />, text: `${attraction.price} ₪ ${lang === 'he' ? 'לאדם' : 'per person'}` },
              ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {item.icon}
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem' }}>{item.text}</Typography>
                </Box>
              ))}
            </Box>

            {/* כמות */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: '10px', p: 1.5, mb: 2 }}>
              <Typography sx={{ fontFamily: 'Rubik', fontWeight: 600 }}>{t.ticketCount}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton size="small" onClick={() => setQty(q => Math.max(1, q - 1))}
                  sx={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', '&:hover': { background: 'rgba(52,211,153,0.2)' } }}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ fontWeight: 700, minWidth: 28, textAlign: 'center', fontSize: '1.1rem' }}>{qty}</Typography>
                <IconButton size="small" onClick={() => setQty(q => q + 1)}
                  sx={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', '&:hover': { background: 'rgba(52,211,153,0.2)' } }}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
              <Typography sx={{ color: '#34d399', fontWeight: 700, fontSize: '1.1rem' }}>{attraction.price * qty} ₪</Typography>
            </Box>

            {/* כפתורים */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button fullWidth variant="contained" startIcon={<ShoppingCartIcon />} onClick={handleOrder}
                sx={{ background: 'linear-gradient(135deg, #34d399, #059669)', fontFamily: 'Rubik', fontWeight: 700, py: 1.2, boxShadow: '0 0 20px rgba(52,211,153,0.3)', '&:hover': { boxShadow: '0 0 30px rgba(52,211,153,0.5)' } }}>
                {t.addToCart} ({qty})
              </Button>
              {attraction.category === 'land' && (
                <Button variant="outlined" startIcon={<DirectionsBikeIcon />}
                  onClick={() => setShowTrails(s => !s)}
                  sx={{ color: '#34d399', borderColor: 'rgba(52,211,153,0.4)', fontFamily: 'Rubik', fontWeight: 600, whiteSpace: 'nowrap', background: showTrails ? 'rgba(52,211,153,0.1)' : 'transparent', '&:hover': { borderColor: '#34d399', background: 'rgba(52,211,153,0.1)' } }}>
                  {lang === 'he' ? 'מסלולים' : 'Trails'}
                </Button>
              )}
            </Box>
          </DialogContent>
        </Box>

        {/* פאנל מסלולים */}
        {showTrails && (
          <Box sx={{ width: 360, borderRight: '1px solid rgba(52,211,153,0.2)', display: 'flex', flexDirection: 'column', animation: 'slideInPanel 0.3s ease-out' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(52,211,153,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontFamily: 'Rubik', fontWeight: 700, fontSize: '0.95rem' }}>
                🚴 {lang === 'he' ? 'מסלולים וטיולים באזור' : 'Trails & Hikes Nearby'}
              </Typography>
              <IconButton size="small" onClick={() => setShowTrails(false)} sx={{ color: 'rgba(255,255,255,0.4)' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ p: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap', borderBottom: '1px solid rgba(52,211,153,0.1)' }}>
              {[
                { label: lang === 'he' ? '🚴 אופניים' : '🚴 Cycling', q: 'cycling trails' },
                { label: lang === 'he' ? '🥾 טיול רגלי' : '🥾 Hiking', q: 'hiking trails' },
                { label: lang === 'he' ? '💧 נחלים' : '💧 Streams', q: 'נחל' },
              ].map(opt => (
                <a key={opt.q}
                  href={`https://www.google.com/maps/search/${encodeURIComponent(opt.q + ' near ' + (attraction.address || attraction.name))}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ padding: '5px 12px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '20px', color: '#34d399', fontSize: '0.8rem', fontFamily: 'Rubik', textDecoration: 'none', fontWeight: 600 }}>
                  {opt.label}
                </a>
              ))}
            </Box>

            <Box sx={{ flex: 1 }}>
              <iframe title="trails-map" width="100%" height="100%"
                style={{ border: 'none', minHeight: '300px' }} loading="lazy" allowFullScreen
                src={`https://maps.google.com/maps?q=מסלולי+טיול+${encodeURIComponent(attraction.address || attraction.name)}&output=embed&z=13`} />
            </Box>

            <Box sx={{ p: 1.5, borderTop: '1px solid rgba(52,211,153,0.1)' }}>
              <a href={`https://www.google.com/maps/search/hiking+trails/@${lat || 32},${lng || 35},13z`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', textAlign: 'center', padding: '10px', background: 'linear-gradient(135deg, #34d399, #059669)', borderRadius: '8px', color: '#fff', fontFamily: 'Rubik', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
                {lang === 'he' ? '🗺️ פתח ב-Google Maps' : '🗺️ Open in Google Maps'}
              </a>
            </Box>
          </Box>
        )}
      </Box>
    </Dialog>
  );
}