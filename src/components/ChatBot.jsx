import { useState, useRef, useEffect } from "react";
import { useLang } from "../LanguageContext";
import "./ChatBot.css";

const faqData = {
  he: [
    { keywords: ["שלום", "היי", "הי", "בוקר", "ערב"], answer: "שלום! ברוכים הבאים לאטרקציות ישראל 🏔️ איך אוכל לעזור?" },
    { keywords: ["סוס", "סוסים", "רכיבה"], answer: "🐴 רכיבה על סוסים זמינה באזור הגליל, הכרמל והנגב. המחירים מתחילים מ-150₪ לאדם." },
    { keywords: ["טרקטור", "טרקטורן", "טרקטורנים"], answer: "🚜 טרקטורנים זמינים בנגב ובגולן. חוויה מושלמת לקבוצות ומשפחות! מחירים מ-200₪." },
    { keywords: ["ריינג'ר", "רנג'ר", "רנג'רים"], answer: "🏎️ רכיבה על רנג'רים זמינה בגולן ובנגב. מתאים לכל הגילאים! מחירים מ-180₪." },
    { keywords: ["גלישה", "גלים", "גלשן"], answer: "🏄 גלישה זמינה בחופי תל אביב, הרצליה ואשקלון. מחירים מ-120₪." },
    { keywords: ["צלילה", "צולל", "אלמוגים"], answer: "🤿 צלילה זמינה באילת ובים התיכון. מחירים מ-250₪ לאדם." },
    { keywords: ["שייט", "סירה", "יאכטה"], answer: "⛵ שייט זמין בכנרת, בים התיכון ובאילת. מחירים מ-200₪." },
    { keywords: ["כדור", "פורח", "בלון"], answer: "🎈 טיסה בכדור פורח זמינה בגליל ובירושלים. מחירים מ-450₪." },
    { keywords: ["צניחה", "פראשוט", "מצנח"], answer: "🪂 צניחה חופשית זמינה בתל נוף ובחצור. מחירים מ-600₪." },
    { keywords: ["טיסה", "גלשון", "אולטרה"], answer: "✈️ טיסה בשמי הארץ זמינה בכרמל ובגולן. מחירים מ-350₪." },
    { keywords: ["מחיר", "עולה", "כמה", "תמחור", "עלות"], answer: "💰 המחירים מתחילים מ-120₪ ועד 600₪ לאדם תלוי באטרקציה." },
    { keywords: ["הזמנה", "להזמין", "קנייה", "כרטיס"], answer: "🛒 בחרו אטרקציה, לחצו על 'הזמן עכשיו', בחרו כמות והוסיפו לסל!" },
    { keywords: ["ביטול", "החזר", "כסף"], answer: "💳 ניתן לבטל עד 48 שעות לפני האירוע. לביטולים: 03-555-1234" },
    { keywords: ["ילדים", "ילד", "גיל", "משפחה"], answer: "👨‍👩‍👧 רוב האטרקציות מתאימות לילדים מגיל 6+." },
    { keywords: ["בטיחות", "בטוח", "סכנה"], answer: "🦺 כל המדריכים מוסמכים, הציוד עובר בדיקות ויש ביטוח מלא." },
    { keywords: ["קשר", "טלפון", "מייל", "פנייה"], answer: "📞 טלפון: 03-555-1234\nמייל: support@attractions-il.co.il\nא׳-ה׳ 09:00-18:00" },
    { keywords: ["תודה", "מעולה", "נהדר"], answer: "😊 בכיף! שיהיה לכם יום נפלא!" },
  ],
  en: [
    { keywords: ["hello", "hi", "hey", "morning", "evening"], answer: "Hello! Welcome to Israel Attractions 🏔️ How can I help?" },
    { keywords: ["horse", "horses", "riding"], answer: "🐴 Horse riding is available in Galilee, Carmel and Negev. Prices from ₪150 per person." },
    { keywords: ["atv", "tractor", "quad"], answer: "🚜 ATVs available in Negev and Golan. Perfect for groups and families! From ₪200." },
    { keywords: ["ranger", "rangers", "jeep"], answer: "🏎️ Ranger rides available in Golan and Negev. Suitable for all ages! From ₪180." },
    { keywords: ["surf", "surfing", "waves"], answer: "🏄 Surfing available in Tel Aviv, Herzliya and Ashkelon. From ₪120." },
    { keywords: ["dive", "diving", "coral"], answer: "🤿 Diving available in Eilat and Mediterranean. From ₪250 per person." },
    { keywords: ["sail", "sailing", "yacht", "boat"], answer: "⛵ Sailing available in Kinneret, Mediterranean and Eilat. From ₪200." },
    { keywords: ["balloon", "hot air"], answer: "🎈 Hot air balloon rides in Galilee and Jerusalem. From ₪450." },
    { keywords: ["skydive", "parachute", "skydiving"], answer: "🪂 Skydiving available at Tel Nof and Hatzor. From ₪600." },
    { keywords: ["glide", "gliding", "ultralight", "fly"], answer: "✈️ Gliding available in Carmel and Golan. From ₪350." },
    { keywords: ["price", "cost", "how much", "pricing"], answer: "💰 Prices range from ₪120 to ₪600 per person depending on the attraction." },
    { keywords: ["book", "booking", "order", "ticket"], answer: "🛒 Choose an attraction, click 'Book Now', select quantity and add to cart!" },
    { keywords: ["cancel", "refund", "money back"], answer: "💳 You can cancel up to 48 hours before the event for a full refund. Call: 03-555-1234" },
    { keywords: ["children", "child", "kids", "family", "age"], answer: "👨‍👩‍👧 Most attractions are suitable for children 6+." },
    { keywords: ["safe", "safety", "danger"], answer: "🦺 All guides are certified, equipment is regularly checked and fully insured." },
    { keywords: ["contact", "phone", "email"], answer: "📞 Phone: 03-555-1234\nEmail: support@attractions-il.co.il\nSun-Thu 09:00-18:00" },
    { keywords: ["thank", "thanks", "great", "awesome"], answer: "😊 You're welcome! Have a wonderful day!" },
  ]
};

export default function ChatBot() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const isHe = lang === 'he';

  const initialMessage = isHe
    ? "שלום! אני העוזר הדיגיטלי של אטרקציות ישראל 🏔️\nשאל אותי על האטרקציות, מחירים, הזמנות ועוד!"
    : "Hello! I'm the digital assistant of Israel Attractions 🏔️\nAsk me about attractions, prices, bookings and more!";

  const [messages, setMessages] = useState([
    { role: "assistant", content: initialMessage }
  ]);

  useEffect(() => {
    setMessages([{ role: "assistant", content: initialMessage }]);
  }, [lang]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function getAnswer(input) {
    const lower = input.toLowerCase();
    const faq = faqData[lang];
    for (const item of faq) {
      if (item.keywords.some(k => lower.includes(k))) return item.answer;
    }
    return isHe
      ? "מצטער, לא הבנתי 😅 נסה לשאול על: סוסים, גלישה, צלילה, מחירים או יצירת קשר!"
      : "Sorry, I didn't understand 😅 Try asking about: horses, surfing, diving, prices or contact!";
  }

  const sendMessage = () => {
    if (!input.trim()) return;
    const answer = getAnswer(input);
    setMessages(prev => [...prev,
      { role: "user", content: input },
      { role: "assistant", content: answer }
    ]);
    setInput("");
  };

  const quickQuestions = isHe
    ? ["💰 מחירים", "🐴 סוסים", "🪂 צניחה", "📞 יצירת קשר"]
    : ["💰 Prices", "🐴 Horses", "🪂 Skydiving", "📞 Contact"];

  return (
    <>
      <button className="chatbot-toggle" onClick={() => setOpen(o => !o)}>
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-avatar">🏔️</div>
            <div>
              <h3>{isHe ? 'עוזר אטרקציות' : 'Attractions Assistant'}</h3>
              <span className="chatbot-status">● {isHe ? 'מחובר' : 'Online'}</span>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                {msg.role === "assistant" && <span className="msg-avatar">🏔️</span>}
                <div className="msg-bubble">{msg.content}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="quick-questions">
            {quickQuestions.map((q, i) => (
              <button key={i} className="quick-btn" onClick={() => setInput(q)}>{q}</button>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder={isHe ? "שאל אותי משהו..." : "Ask me something..."}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}