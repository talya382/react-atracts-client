import { useForm } from 'react-hook-form';
import { loginUser } from '../api/userService';
import { useDispatch } from 'react-redux';
import { userIn } from '../features/user/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import AuthBackground from '../components/AuthBackground';
import './Login.css';

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await loginUser(data);
            const { token, user } = res.data;
            localStorage.setItem("token", token);
            dispatch(userIn(user));
            navigate("/");
        } catch (err) {
            setError("root", { message: "אימייל או סיסמה שגויים" });
        }
    };

    return (
        <AuthBackground>
            <div className="auth-card">
                <div className="auth-header">
                    <h2>🏔️ התחברות</h2>
                    <p>ברוך הבא חזרה!</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <div className="auth-field">
                        <label>אימייל</label>
                        <input type="email" placeholder="your@email.com"
                            {...register("email", { required: "שדה חובה" })} />
                        {errors.email && <span className="auth-error">{errors.email.message}</span>}
                    </div>
                    <div className="auth-field">
                        <label>סיסמה</label>
                        <input type="password" placeholder="••••••••"
                            {...register("password", { required: "שדה חובה", minLength: { value: 4, message: "לפחות 4 תווים" } })} />
                        {errors.password && <span className="auth-error">{errors.password.message}</span>}
                    </div>
                    {errors.root && <p className="auth-error-root">{errors.root.message}</p>}
                    <button type="submit" className="auth-btn" disabled={isSubmitting}>
                        {isSubmitting ? "מתחבר..." : "התחבר"}
                    </button>
                </form>
                <p className="auth-switch">
                    אין לך חשבון? <Link to="/signup">הירשם כאן</Link>
                </p>
            </div>
        </AuthBackground>
    );
}