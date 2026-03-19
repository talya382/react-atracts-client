import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthBackground from "../components/AuthBackground";
import Swal from "sweetalert2";
import axios from "axios";

// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import LockResetIcon from "@mui/icons-material/LockReset";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
const API_URL = "https://active-attractions.onrender.com/auth";
const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff', fontFamily: 'Rubik',
    '& fieldset': { borderColor: 'rgba(52,211,153,0.3)' },
    '&:hover fieldset': { borderColor: '#34d399' },
    '&.Mui-focused fieldset': { borderColor: '#34d399' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)', fontFamily: 'Rubik' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#34d399' },
  '& .MuiStepLabel-label': { color: '#fff', fontFamily: 'Rubik' },
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const steps = ['הזן אימייל', 'קבל סיסמה זמנית', 'צור סיסמה חדשה'];

  const handleSendEmail = async () => {
    if (!email) {
      Swal.fire({ title: 'נא להזין אימייל', icon: 'warning', background: '#04140e', color: '#fff' });
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/forgot`, { email });
      Swal.fire({
        title: '✅ נשלח!',
        text: 'סיסמה זמנית נשלחה למייל שלך',
        icon: 'success', background: '#04140e', color: '#fff',
        confirmButtonColor: '#34d399',
      });
      setStep(2);
    } catch (err) {
      Swal.fire({
        title: 'שגיאה',
        text: err.response?.data?.message || 'המייל לא נמצא במערכת',
        icon: 'error', background: '#04140e', color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Swal.fire({ title: 'נא למלא את כל השדות', icon: 'warning', background: '#04140e', color: '#fff' });
      return;
    }
    if (newPassword !== confirmPassword) {
      Swal.fire({ title: 'הסיסמאות לא תואמות', icon: 'error', background: '#04140e', color: '#fff' });
      return;
    }
    if (newPassword.length < 4) {
      Swal.fire({ title: 'הסיסמה חייבת להכיל לפחות 4 תווים', icon: 'warning', background: '#04140e', color: '#fff' });
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/change`, { email, newPassword });
      Swal.fire({
        title: '🎉 הסיסמה עודכנה!',
        text: 'כעת תוכל להתחבר עם הסיסמה החדשה',
        icon: 'success', background: '#04140e', color: '#fff',
        confirmButtonColor: '#34d399',
      });
      navigate("/login");
    } catch (err) {
      Swal.fire({
        title: 'שגיאה',
        text: err.response?.data?.message || 'שגיאה בעדכון הסיסמה',
        icon: 'error', background: '#04140e', color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthBackground>
      <Box sx={{ width: '100%', maxWidth: 440, background: 'rgba(4,20,14,0.92)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '16px', p: 4, boxShadow: '0 0 60px rgba(0,0,0,0.5)', direction: 'rtl' }}>
        
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <LockResetIcon sx={{ color: '#34d399', fontSize: 48, mb: 1 }} />
          <Typography variant="h5" sx={{ fontFamily: 'Rubik', fontWeight: 900, color: '#fff' }}>
            שכחת סיסמה?
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Rubik', fontSize: '0.9rem' }}>
            נשלח לך סיסמה זמנית למייל
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={step} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{
                '& .MuiStepLabel-label': { color: 'rgba(255,255,255,0.5)', fontFamily: 'Rubik', fontSize: '0.75rem' },
                '& .MuiStepLabel-label.Mui-active': { color: '#34d399' },
                '& .MuiStepLabel-label.Mui-completed': { color: '#34d399' },
                '& .MuiStepIcon-root': { color: 'rgba(255,255,255,0.2)' },
                '& .MuiStepIcon-root.Mui-active': { color: '#34d399' },
                '& .MuiStepIcon-root.Mui-completed': { color: '#34d399' },
              }}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* שלב 1 — הזנת מייל */}
        {step === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField fullWidth type="email" label="כתובת אימייל" placeholder="your@email.com"
              sx={inputSx} value={email} onChange={e => setEmail(e.target.value)}
              InputProps={{ startAdornment: <EmailIcon sx={{ color: 'rgba(52,211,153,0.5)', mr: 1 }} /> }} />
            <Button fullWidth variant="contained" onClick={handleSendEmail} disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <EmailIcon />}
              sx={{ background: 'linear-gradient(135deg, #34d399, #059669)', fontFamily: 'Rubik', fontWeight: 700, py: 1.5, boxShadow: '0 0 20px rgba(52,211,153,0.3)' }}>
              {loading ? 'שולח...' : 'שלח סיסמה זמנית'}
            </Button>
          </Box>
        )}

        {/* שלב 2 — יצירת סיסמה חדשה */}
        {step === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ p: 1.5, background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '8px' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Rubik', fontSize: '0.85rem' }}>
                📧 בדקי את המייל שלך וקבלי את הסיסמה הזמנית ← אחר כך צרי סיסמה חדשה:
              </Typography>
            </Box>
            <TextField fullWidth type="password" label="סיסמה חדשה" sx={inputSx}
              value={newPassword} onChange={e => setNewPassword(e.target.value)}
              InputProps={{ startAdornment: <KeyIcon sx={{ color: 'rgba(52,211,153,0.5)', mr: 1 }} /> }} />
            <TextField fullWidth type="password" label="אימות סיסמה" sx={inputSx}
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              InputProps={{ startAdornment: <KeyIcon sx={{ color: 'rgba(52,211,153,0.5)', mr: 1 }} /> }} />
            <Button fullWidth variant="contained" onClick={handleChangePassword} disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <KeyIcon />}
              sx={{ background: 'linear-gradient(135deg, #34d399, #059669)', fontFamily: 'Rubik', fontWeight: 700, py: 1.5, boxShadow: '0 0 20px rgba(52,211,153,0.3)' }}>
              {loading ? 'מעדכן...' : 'עדכן סיסמה'}
            </Button>
          </Box>
        )}

        <Typography sx={{ textAlign: 'center', mt: 2.5, color: 'rgba(255,255,255,0.5)', fontFamily: 'Rubik', fontSize: '0.88rem' }}>
          <Link to="/login" style={{ color: '#34d399', fontWeight: 600, textDecoration: 'none' }}>חזרה להתחברות</Link>
        </Typography>
      </Box>
    </AuthBackground>
  );
}