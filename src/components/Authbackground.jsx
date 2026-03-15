// קומפוננטת עזר - הוסיפי אותה ב-Login.jsx וב-Register.jsx
// במקום <div className="auth-page"> השתמשי ב-<AuthBackground>

const AuthBackground = ({ children }) => (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <video
        src="https://res.cloudinary.com/dwefiwwa0/video/upload/home_ppcs1n.mp4"
        autoPlay muted loop playsInline
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '100vw', height: '100vh',
          objectFit: 'cover', zIndex: 0
        }}
      />
      <div style={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.6)', zIndex: 1
      }} />
      <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        {children}
      </div>
    </div>
  );
  
  export default AuthBackground;