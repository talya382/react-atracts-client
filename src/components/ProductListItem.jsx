const ProductListItem=({product})=>{
    const imagePath = `/img/${product.imgUrl}`;
    return (
        <div className="product-card" style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
        {/* פנייה ישירה לנתיב שמתחיל בלוכסן / שמייצג את public */}
        <img 
            src={imagePath} 
            alt={product.name} 
            style={{ width: '100%', height: '150px', objectFit: 'cover' }} 
        />
        <h3>{product.name}</h3>
        <p>מחיר: {product.price} ₪</p>
    </div>
);
};

// חשוב מאוד: ייצוא כברירת מחדל כדי למנוע שגיאות Import
export default ProductListItem;