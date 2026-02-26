import { useState, useEffect } from "react";
import { useLang } from "../LanguageContext";
import "./Notifications.css";

export default function Notifications() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);

  const notificationsList = lang === 'he' ? [
    { id: 1, msg: "🔥 מקומות אחרונים לצניחה חופשית באילת!", type: "urgent" },
    { id: 2, msg: "🎉 מבצע מיוחד! 20% הנחה על כדור פורח הסוף שבוע", type: "sale" },
    { id: 3, msg: "⭐ לקוח חדש הצטרף לאחר חוויית רכיבה על סוסים", type: "info" },
    { id: 4, msg: "🏆 צניחה חופשית תל נוף עלתה למקום #1 בטופ 10!", type: "top" },
    { id: 5, msg: "📍 אטרקציה חדשה נוספה באזורך!", type: "new" },
  ] : [
    { id: 1, msg: "🔥 Last spots for skydiving in Eilat!", type: "urgent" },
    { id: 2, msg: "🎉 Special offer! 20% off hot air balloon this weekend", type: "sale" },
    { id: 3, msg: "⭐ New customer joined after a horse riding experience", type: "info" },
    { id: 4, msg: "🏆 Tel Nof skydiving reached #1 in Top 10!", type: "top" },
    { id: 5, msg: "📍 New attraction added in your area!", type: "new" },
  ];

  const active = notificationsList.filter(n => !dismissed.includes(n.id));

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible || active.length === 0) return;
    const interval = setInterval(() => {
      setCurrent(c => (c + 1) % active.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [visible, active.length]);

  const dismiss = (id) => setDismissed(d => [...d, id]);

  if (active.length === 0) return null;

  return (
    <>
      {visible && !panelOpen && (
        <div className={`notif-toast notif-${active[current]?.type}`}>
          <span className="notif-text">{active[current]?.msg}</span>
          <div className="notif-actions">
            <button className="notif-dismiss" onClick={() => dismiss(active[current]?.id)}>✕</button>
          </div>
        </div>
      )}

      <button className="notif-bell" onClick={() => setPanelOpen(p => !p)}>
        🔔
        {active.length > 0 && <span className="notif-count">{active.length}</span>}
      </button>

      {panelOpen && (
        <div className="notif-panel">
          <div className="notif-panel-header">
            <h3>🔔 {lang === 'he' ? 'התראות' : 'Notifications'}</h3>
            <button onClick={() => setPanelOpen(false)}>✕</button>
          </div>
          <div className="notif-panel-list">
            {active.map(n => (
              <div key={n.id} className={`notif-panel-item notif-${n.type}`}>
                <span>{n.msg}</span>
                <button onClick={() => dismiss(n.id)}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}