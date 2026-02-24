import { useNavigate } from "react-router-dom";
import './Home.css';

const categories = [
    { id: 'air', title: 'אוויר', desc: 'כדורים פורחים וצניחה חופשית', img: '/img/air.png', icon: '✈️' },
    { id: 'sea', title: 'ים', desc: 'צלילה, גלישה ושייט חופי', img: '/img/surfing/surfing-2.png', icon: '🌊' },
    { id: 'land', title: 'יבשה', desc: "טיולי ג'יפים ומסלולי טבע", img: '/img/land.jpg.png', icon: '🏕️' },
];

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            {/* סרטון ברקע של כל העמוד */}
            <video
                className="home-bg-video"
                src="/img/v.mp4"
                autoPlay
                muted
                loop
                playsInline
            />
            <div className="home-bg-overlay" />

            <header className="home-hero">
                <h1>גלו את עולם האטרקציות</h1>
                <p>בחרו את האלמנט שלכם והתחילו את ההרפתקה</p>
            </header>

            <main className="categories-grid-wrapper">
                <div className="categories-flex">
                    {categories.map(cat => (
                        <div
                            key={cat.id}
                            className="category-card"
                            style={{ backgroundImage: `url(${cat.img})` }}
                            onClick={() => navigate(`/list/${cat.id}`)}
                        >
                            <div className="card-overlay"></div>
                            <div className="card-inner-content">
                                <span className="card-icon">{cat.icon}</span>
                                <h2>{cat.title}</h2>
                                <p className="card-description">{cat.desc}</p>
                                <div className="card-action">צפה באטרקציות</div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}