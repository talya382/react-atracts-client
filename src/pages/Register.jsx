import { useForm } from 'react-hook-form';
import { addUser } from '../api/userService';
import { useDispatch } from 'react-redux';
import { userIn } from '../features/user/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import AuthBackground from '../components/AuthBackground';
import Swal from "sweetalert2";

// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff', fontFamily: 'Rubik',
    '& fieldset': { borderColor: 'rgba(52,211,153,0.3)' },
    '&:hover fieldset': { borderColor: '#34d399' },
    '&.Mui-focused fieldset': { borderColor: '#34d399' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)', fontFamily: 'Rubik' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#34d399' },
  '& .MuiFormHelperText-root': { color: '#ef4444' },
};

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await addUser(data);
      dispatch(userIn(res.data));
      Swal.fire({ title: '🎉 ברוך הבא!', text: 'ההרשמה הצליחה', icon: 'success', timer: 1500, showConfirmButton: false, background: '#04140e', color: '#fff' });
      navigate("/");
    } catch (err) {
      setError("root", { message: "ההרשמה נכשלה, נסה שנית" });
    }
  };

  return (
    <AuthBackground>
      <Box sx={{ width: '100%', maxWidth: 420, background: 'rgba(4,20,14,0.92)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '16px', p: 4, boxShadow: '0 0 60px rgba(0,0,0,0.5)', direction: 'rtl' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontFamily: 'Rubik', fontWeight: 900, color: '#fff', mb: 0.5 }}>🏔️ הרשמה</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Rubik' }}>צור חשבון חדש</Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField fullWidth label="שם משתמש" placeholder="השם שלך" sx={inputSx}
              {...register("userName", { required: "שדה חובה", minLength: { value: 2, message: "לפחות 2 תווים" } })}
              error={!!errors.userName} helperText={errors.userName?.message} />
            <TextField fullWidth type="email" label="אימייל" placeholder="your@email.com" sx={inputSx}
              {...register("email", { required: "שדה חובה" })} error={!!errors.email} helperText={errors.email?.message} />
            <TextField fullWidth type="password" label="סיסמה" placeholder="••••••••" sx={inputSx}
              {...register("password", { required: "שדה חובה", minLength: { value: 4, message: "לפחות 4 תווים" } })}
              error={!!errors.password} helperText={errors.password?.message} />

            {errors.root && (
              <Box sx={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', p: 1.5, textAlign: 'center' }}>
                <Typography sx={{ color: '#ef4444', fontFamily: 'Rubik', fontSize: '0.9rem' }}>{errors.root.message}</Typography>
              </Box>
            )}

            <Button fullWidth type="submit" variant="contained" disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <PersonAddIcon />}
              sx={{ background: 'linear-gradient(135deg, #34d399, #059669)', fontFamily: 'Rubik', fontWeight: 700, py: 1.5, fontSize: '1rem', mt: 1, boxShadow: '0 0 20px rgba(52,211,153,0.3)', '&:hover': { boxShadow: '0 0 30px rgba(52,211,153,0.5)' } }}>
              {isSubmitting ? "נרשם..." : "הירשם"}
            </Button>
          </Box>
        </form>

        <Typography sx={{ textAlign: 'center', mt: 2.5, color: 'rgba(255,255,255,0.5)', fontFamily: 'Rubik', fontSize: '0.88rem' }}>
          יש לך חשבון?{' '}
          <Link to="/login" style={{ color: '#34d399', fontWeight: 600, textDecoration: 'none' }}>התחבר כאן</Link>
        </Typography>
      </Box>
    </AuthBackground>
  );
}