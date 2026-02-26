import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const translations = {
  he: {
    // NavBar
    home: "בית",
    allAttractions: "כל האטרקציות",
    basket: "סל קניות",
    reviews: "ביקורות",
    top10: "טופ 10",
    login: "התחברות",
    register: "הרשמה חינם",

    // Home
    heroTitle: "גלו את עולם האטרקציות",
    heroSubtitle: "בחרו את האלמנט שלכם והתחילו את ההרפתקה",
    land: "יבשה",
    sea: "ים",
    air: "אוויר",
    landDesc: "טיולי ג'יפים ומסלולי טבע",
    seaDesc: "צלילה, גלישה ושייט חופי",
    airDesc: "כדורים פורחים וצניחה חופשית",
    viewAttractions: "צפה באטרקציות",

    // Stats
    happyCustomers: "לקוחות מרוצים",
    attractions: "אטרקציות",
    orders: "הזמנות בוצעו",
    experience: "שנות ניסיון",

    // ProductsList
    search: "חפש אטרקציה, מיקום...",
    filters: "פילטרים",
    clearFilters: "נקה פילטרים",
    results: "תוצאות",
    priceRange: "טווח מחירים",
    minPrice: "מינימום ₪",
    maxPrice: "מקסימום ₪",
    sortBy: "מיון לפי",
    sortDefault: "ברירת מחדל",
    sortPriceAsc: "מחיר: נמוך לגבוה",
    sortPriceDesc: "מחיר: גבוה לנמוך",
    sortPopular: "הכי פופולרי",
    findNearest: "מצא אטרקציה קרובה אלי",
    nearestTitle: "הכי קרוב אליך:",
    bookNow: "הזמן עכשיו",
    purchaseTickets: "רכוש כרטיסים",
    popular: "פופולרי",
    noResults: "לא נמצאו תוצאות עבור",
    tryOther: "נסי מילות חיפוש אחרות",
    noAttractions: "לא נמצאו אטרקציות בקטגוריה זו",

    // SubCategory
    landTitle: "הרפתקה ביבשה",
    seaTitle: "חוויות בים",
    airTitle: "ריגושים באוויר",
    enterCategory: "כניסה לקטגוריה",
    chooseSubCategory: "בחרו תת-קטגוריה כדי לראות את כל האטרקציות",

    // OrderModal
    ticketCount: "כמות כרטיסים:",
    total: 'סה"כ:',
    addToCart: "הוסף לסל",

    // Footer
    footerDesc:
      "הפלטפורמה המובילה לחוויות אדרנלין ופנאי בישראל. מהים ועד השמיים — אנחנו כאן בשבילכם.",
    contact: "יצירת קשר",
    findUs: "מצאו אותנו",
    followUs: "עקבו אחרינו",
    rights: "כל הזכויות שמורות",

    // הוסיפי בחלק he:
    horses: "רכיבה על סוסים",
    tractors: "טרקטורנים",
    rangers: "רנג'רים",
    surfing: "גלישה",
    diving: "צלילה",
    sailing: "שייט",
    balloon: "כדור פורח",
    parachute: "צניחה חופשית",
    gliding: "טיסה בשמי הארץ",
  },
  en: {
    // NavBar
    home: "Home",
    allAttractions: "All Attractions",
    basket: "Cart",
    reviews: "Reviews",
    top10: "Top 10",
    login: "Login",
    register: "Sign Up Free",

    // Home
    heroTitle: "Discover the World of Attractions",
    heroSubtitle: "Choose your element and start the adventure",
    land: "Land",
    sea: "Sea",
    air: "Air",
    landDesc: "Jeep tours and nature trails",
    seaDesc: "Diving, surfing and coastal sailing",
    airDesc: "Hot air balloons and skydiving",
    viewAttractions: "View Attractions",

    // Stats
    happyCustomers: "Happy Customers",
    attractions: "Attractions",
    orders: "Orders Completed",
    experience: "Years of Experience",

    // ProductsList
    search: "Search attraction, location...",
    filters: "Filters",
    clearFilters: "Clear Filters",
    results: "results",
    priceRange: "Price Range",
    minPrice: "Min ₪",
    maxPrice: "Max ₪",
    sortBy: "Sort By",
    sortDefault: "Default",
    sortPriceAsc: "Price: Low to High",
    sortPriceDesc: "Price: High to Low",
    sortPopular: "Most Popular",
    findNearest: "Find Nearest Attraction",
    nearestTitle: "Nearest to you:",
    bookNow: "Book Now",
    purchaseTickets: "Purchase Tickets",
    popular: "Popular",
    noResults: "No results found for",
    tryOther: "Try different search terms",
    noAttractions: "No attractions found in this category",

    // SubCategory
    landTitle: "Land Adventure",
    seaTitle: "Sea Experiences",
    airTitle: "Air Thrills",
    enterCategory: "Enter Category",
    chooseSubCategory: "Choose a subcategory to see all attractions",

    // OrderModal
    ticketCount: "Number of tickets:",
    total: "Total:",
    addToCart: "Add to Cart",

    // Footer
    footerDesc:
      "Israel's leading platform for adrenaline and leisure experiences. From the sea to the sky — we're here for you.",
    contact: "Contact Us",
    findUs: "Find Us",
    followUs: "Follow Us",
    rights: "All rights reserved",

    

    // הוסיפי בחלק en:
    horses: "Horse Riding",
    tractors: "ATVs",
    rangers: "Rangers",
    surfing: "Surfing",
    diving: "Diving",
    sailing: "Sailing",
    balloon: "Hot Air Balloon",
    parachute: "Skydiving",
    gliding: "Gliding",
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("he");
  const t = translations[lang];
  const toggleLang = () => setLang((l) => (l === "he" ? "en" : "he"));
  const isRTL = lang === "he";

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
