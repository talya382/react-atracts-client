import { useNavigate, useParams } from "react-router-dom";
import './SubCategories.css';

const subCategoriesData = {
  land: [
    { id: 'horses', title: 'רכיבה על סוסים 🐴', images: ['/img/רכיבה על סובים/horse3.jpg.png', '/img/רכיבה על סובים/horse4.jpg.png', '/img/רכיבה על סובים/horse5.jpg.png'] },
    { id: 'tractors', title: 'טרקטורנים 🚜', images: ['/img/טרקטרונים/tractor1.jpg.png', '/img/טרקטרונים/tractor2.jpg.png', '/img/טרקטרונים/tractor3.jpg.png'] },
    { id: 'rangers', title: "רנג'רים 🏎️", images: ["/img/רנג'רים/ranger1.jpg.webp", "/img/רנג'רים/ranger2.jpg.jpg", "/img/רנג'רים/ranger3.jpg.webp"] },
  ],
  air: [],
  sea: [],
};
export default function SubCategories() {
  const { category } = useParams();
  const navigate = useNavigate();
  const subs = subCategoriesData[category] || [];

  return (
    <div className="sub-wrapper">
      <h1>בחר תת-קטגוריה</h1>
      <div className="sub-grid">
        {subs.map(sub => (
          <div key={sub.id} className="sub-card" onClick={() => navigate(`/list/${category}/${sub.id}`)}>
            <div className="sub-images">
              {sub.images.map((img, i) => (
                <img key={i} src={img} alt={sub.title} />
              ))}
            </div>
            <h3>{sub.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}