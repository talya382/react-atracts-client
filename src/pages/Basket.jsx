import { useSelector, useDispatch } from "react-redux";
import { removeFromBasket, clearBasket, decreaseQty, addToBasket } from "../features/basket/basketSlice";
import { Link } from "react-router-dom";
import { useLang } from "../LanguageContext";
import Swal from "sweetalert2";

// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PaymentIcon from "@mui/icons-material/Payment";

const Basket = () => {
  const dispatch = useDispatch();
  const items = useSelector(state => state.basket.arr);
  const { lang } = useLang();

  const totalQuantity = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  const tr = {
    he: { title: "סל הקניות שלי", empty: "הסל שלך ריק", backToAttractions: "חזרה לאטרקציות", perPerson: "לאדם", total: "סה\"כ פריטים:", totalPrice: "סה\"כ לתשלום:", clearCart: "רוקן סל", checkout: "המשך לתשלום", items: "פריטים" },
    en: { title: "My Cart", empty: "Your cart is empty", backToAttractions: "Back to Attractions", perPerson: "per person", total: "Total items:", totalPrice: "Total payment:", clearCart: "Clear Cart", checkout: "Checkout", items: "items" }
  }[lang];

  const handleClear = () => {
    Swal.fire({
      title: lang === 'he' ? 'לרוקן את הסל?' : 'Clear cart?',
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#ef4444', cancelButtonColor: '#34d399',
      confirmButtonText: lang === 'he' ? 'כן, רוקן!' : 'Yes, clear!',
      cancelButtonText: lang === 'he' ? 'ביטול' : 'Cancel',
      background: '#04140e', color: '#fff',
    }).then(result => { if (result.isConfirmed) dispatch(clearBasket()); });
  };

  if (items.length === 0) return (
    <Box sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, direction: 'rtl' }}>
      <ShoppingCartIcon sx={{ fontSize: 80, color: 'rgba(52,211,153,0.3)' }} />
      <Typography variant="h5" sx={{ fontFamily: 'Rubik', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{tr.empty}</Typography>
      <Button component={Link} to="/list" variant="outlined"
        sx={{ color: '#34d399', borderColor: 'rgba(52,211,153,0.4)', fontFamily: 'Rubik', fontWeight: 600, '&:hover': { borderColor: '#34d399', background: 'rgba(52,211,153,0.05)' } }}>
        {tr.backToAttractions}
      </Button>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', p: { xs: 2, md: 4 }, direction: 'rtl', maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontFamily: 'Rubik', fontWeight: 900, color: '#fff', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ShoppingCartIcon sx={{ color: '#34d399' }} /> {tr.title}
      </Typography>

      {/* פריטים */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        {items.map(item => (
          <Card key={item._id} sx={{ background: 'rgba(4,20,14,0.85)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: '12px', display: 'flex', overflow: 'hidden', color: '#fff' }}>
            <CardMedia component="img" sx={{ width: 120, height: 100, objectFit: 'cover' }} image={item.imgUrl} alt={item.name} />
            <Box sx={{ flex: 1, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography sx={{ fontFamily: 'Rubik', fontWeight: 700, fontSize: '1rem' }}>{item.name}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>📍 {item.address?.split(",")[0]}</Typography>
                <Typography sx={{ color: '#34d399', fontWeight: 600, fontSize: '0.88rem', mt: 0.5 }}>{item.price} ₪ {tr.perPerson}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton size="small" onClick={() => dispatch(decreaseQty(item._id))}
                  sx={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', '&:hover': { background: 'rgba(52,211,153,0.2)' } }}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.qty}</Typography>
                <IconButton size="small" onClick={() => dispatch(addToBasket(item))}
                  sx={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', '&:hover': { background: 'rgba(52,211,153,0.2)' } }}>
                  <AddIcon fontSize="small" />
                </IconButton>
                <Chip label={`${item.price * item.qty} ₪`} sx={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', fontWeight: 700, fontFamily: 'Rubik', mx: 1 }} />
                <IconButton size="small" onClick={() => dispatch(removeFromBasket(item._id))}
                  sx={{ color: 'rgba(239,68,68,0.7)', '&:hover': { color: '#ef4444', background: 'rgba(239,68,68,0.1)' } }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

      {/* סיכום */}
      <Card sx={{ background: 'rgba(4,20,14,0.92)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '12px', p: 3, color: '#fff' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ fontFamily: 'Rubik', color: 'rgba(255,255,255,0.7)' }}>{tr.total}</Typography>
          <Typography sx={{ fontFamily: 'Rubik', fontWeight: 600 }}>{totalQuantity} {tr.items}</Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(52,211,153,0.15)', my: 1.5 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography sx={{ fontFamily: 'Rubik', fontWeight: 700, fontSize: '1.1rem' }}>{tr.totalPrice}</Typography>
          <Typography sx={{ fontFamily: 'Rubik', fontWeight: 900, fontSize: '1.3rem', color: '#34d399' }}>{totalPrice} ₪</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button fullWidth variant="outlined" startIcon={<DeleteOutlineIcon />} onClick={handleClear}
            sx={{ color: 'rgba(239,68,68,0.7)', borderColor: 'rgba(239,68,68,0.3)', fontFamily: 'Rubik', fontWeight: 600, '&:hover': { borderColor: '#ef4444', background: 'rgba(239,68,68,0.05)', color: '#ef4444' } }}>
            {tr.clearCart}
          </Button>
          <Button fullWidth variant="contained" startIcon={<PaymentIcon />}
            sx={{ background: 'linear-gradient(135deg, #34d399, #059669)', fontFamily: 'Rubik', fontWeight: 700, boxShadow: '0 0 20px rgba(52,211,153,0.3)', '&:hover': { boxShadow: '0 0 30px rgba(52,211,153,0.5)' } }}>
            {tr.checkout}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default Basket;