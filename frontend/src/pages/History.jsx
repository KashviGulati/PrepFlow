import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body { background: #0E0F14; }

.hist-root {
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  color: #F0EDE8;
  background: #0E0F14;
  position: relative;
  overflow-x: hidden;
}

/* ── Background ── */
.hist-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 70% 55% at 75% 5%,  rgba(100, 90, 200, 0.16) 0%, transparent 60%),
    radial-gradient(ellipse 55% 45% at 15% 85%, rgba(210, 160, 90, 0.13) 0%, transparent 55%),
    radial-gradient(ellipse 45% 35% at 85% 70%, rgba(60, 160, 180, 0.09) 0%, transparent 50%),
    linear-gradient(160deg, #0E0F14 0%, #12141C 50%, #0F1018 100%);
}
.hist-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 180px;
  opacity: 0.5;
  pointer-events: none;
}

/* ── Nav ── */
.hist-nav {
  position: relative;
  z-index: 10;
  height: 72px;
  padding: 0 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(14, 15, 20, 0.65);
  backdrop-filter: blur(20px);
}

.hist-logo {
  font-family: 'Playfair Display', serif;
  font-size: 1.7rem;
  color: #E8D4B0;
  letter-spacing: 0.06em;
}

.hist-nav-pill {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 999px;
  padding: 5px 14px;
  font-size: 0.75rem;
  color: #6B6880;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* ── Body ── */
.hist-body {
  position: relative;
  z-index: 2;
  max-width: 780px;
  margin: 0 auto;
  padding: 3.5rem 2rem 6rem;
}

/* ── Back button ── */
.hist-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 999px;
  color: #A09898;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 0.82rem;
  font-family: 'DM Sans', sans-serif;
  margin-bottom: 2.5rem;
  transition: all 0.2s ease;
  letter-spacing: 0.04em;
}
.hist-back:hover {
  background: rgba(255,255,255,0.07);
  color: #D4C8B8;
  transform: translateX(-2px);
}

/* ── Header ── */
.hist-header {
  margin-bottom: 2.8rem;
  animation: fadeUp 0.5s ease both;
}

.hist-eyebrow {
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #C89B5E;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 10px;
}
.hist-eyebrow::after {
  content: '';
  display: block;
  height: 1px;
  width: 40px;
  background: linear-gradient(to right, #C89B5E, transparent);
}

.hist-title {
  font-family: 'Playfair Display', serif;
  font-size: 3.4rem;
  line-height: 1.05;
  color: #F5F1EA;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.hist-title em {
  font-style: italic;
  color: #C89B5E;
}

.hist-sub {
  margin-top: 0.7rem;
  color: #5A5670;
  font-size: 0.9rem;
  line-height: 1.7;
}

/* ── Stats bar ── */
.hist-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 2.4rem;
  animation: fadeUp 0.5s 0.1s ease both;
}

.hist-stat-card {
  background: rgba(18, 18, 28, 0.75);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 18px;
  padding: 1.2rem 1.4rem;
  backdrop-filter: blur(16px);
  position: relative;
  overflow: hidden;
}
.hist-stat-card::after {
  content: '';
  position: absolute;
  top: 0; left: 10%; right: 10%;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(200,155,94,0.18), transparent);
}
.hist-stat-label {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #4A4660;
  margin-bottom: 0.4rem;
}
.hist-stat-value {
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem;
  color: #E8D4B0;
  font-weight: 600;
}

/* ── Section label ── */
.hist-section-label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #8C879E;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: fadeUp 0.5s 0.15s ease both;
}
.hist-section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.05);
}

/* ── List ── */
.hist-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: fadeUp 0.5s 0.2s ease both;
}

/* ── Card ── */
.hist-card {
  background: rgba(18, 18, 28, 0.75);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  padding: 1.4rem 1.8rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  backdrop-filter: blur(20px);
  transition: all 0.22s ease;
  position: relative;
  overflow: hidden;
}
.hist-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(200,155,94,0.04), rgba(120,100,200,0.03));
  opacity: 0;
  transition: opacity 0.22s;
}
.hist-card:hover {
  border-color: rgba(200,155,94,0.22);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.35);
}
.hist-card:hover::before { opacity: 1; }

.hist-card-left {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  position: relative;
  z-index: 1;
  min-width: 0;
}

.hist-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(200,155,94,0.08);
  border: 1px solid rgba(200,155,94,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.1rem;
}

.hist-card-info { min-width: 0; }

.hist-domain {
  font-size: 0.95rem;
  font-weight: 500;
  color: #D6CEC2;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.hist-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(107,158,138,0.1);
  border: 1px solid rgba(107,158,138,0.2);
  color: #8ECEBB;
  font-size: 0.65rem;
  font-weight: 500;
  padding: 2px 9px;
  border-radius: 999px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.hist-badge::before {
  content: '';
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #6B9E8A;
}

.hist-date {
  font-size: 0.8rem;
  color: #4A4660;
}

.hist-card-right {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.hist-view-btn {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  color: #8C879E;
  padding: 9px 18px;
  border-radius: 999px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  letter-spacing: 0.04em;
}
.hist-view-btn:hover {
  background: rgba(200,155,94,0.1);
  border-color: rgba(200,155,94,0.3);
  color: #C89B5E;
}

/* ── Empty state ── */
.hist-empty {
  animation: fadeUp 0.5s 0.15s ease both;
  text-align: center;
  padding: 5rem 2rem;
  background: rgba(18, 18, 28, 0.6);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 28px;
  backdrop-filter: blur(20px);
}

.hist-empty-icon {
  width: 64px; height: 64px;
  border-radius: 50%;
  background: rgba(200,155,94,0.07);
  border: 1px solid rgba(200,155,94,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.4rem;
  font-size: 1.6rem;
}

.hist-empty-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: #6A6580;
  margin-bottom: 0.5rem;
}

.hist-empty-text {
  font-size: 0.88rem;
  color: #4A4660;
  line-height: 1.7;
}

.hist-start-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 1.8rem;
  background: linear-gradient(135deg, #C89B5E, #E0B97B);
  color: #1A1408;
  padding: 13px 26px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 0.03em;
  transition: all 0.22s ease;
  box-shadow: 0 4px 20px rgba(200,155,94,0.25);
}
.hist-start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(200,155,94,0.38);
}

/* ── Loading ── */
.hist-loading {
  min-height: 100vh;
  background: #0E0F14;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  font-family: 'DM Sans', sans-serif;
}
.hist-spinner {
  width: 36px; height: 36px;
  border: 2px solid rgba(200,155,94,0.15);
  border-top-color: #C89B5E;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.hist-loading-text { color: #5A5670; font-size: 0.9rem; letter-spacing: 0.08em; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  .hist-nav { padding: 0 1.5rem; }
  .hist-body { padding: 2.5rem 1.2rem 5rem; }
  .hist-title { font-size: 2.4rem; }
  .hist-stats { grid-template-columns: 1fr 1fr; }
  .hist-card { padding: 1.2rem 1.4rem; border-radius: 18px; }
  .hist-nav-pill { display: none; }
}
`;

const DOMAIN_LABELS = {
  software_engineer: "Software Engineer",
  data_analyst: "Data Analyst",
  machine_learning: "Machine Learning",
};

const DOMAIN_ICONS = {
  software_engineer: "💻",
  data_analyst: "📊",
  machine_learning: "🧠",
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function History() {
  const [sessions, setSessions] = useState([]);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get("/interview/history/");
      setSessions(response.data);
    } catch {
      alert("Failed to load history");
    } finally {
      setFetching(false);
    }
  };

  if (fetching) {
    return (
      <div className="hist-loading">
        <style>{styles}</style>
        <div className="hist-spinner" />
        <p className="hist-loading-text">Loading your history...</p>
      </div>
    );
  }

  const uniqueDomains = [...new Set(sessions.map((s) => s.domain))].length;

  return (
    <div className="hist-root">
      <style>{styles}</style>
      <div className="hist-bg" />

      {/* Nav */}
      <nav className="hist-nav">
        <span className="hist-logo">PrepFlow</span>
        <span className="hist-nav-pill">Session History</span>
      </nav>

      <div className="hist-body">

        <button className="hist-back" onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </button>

        {/* Header */}
        <div className="hist-header">
          <div className="hist-eyebrow">Your Progress</div>
          <h1 className="hist-title">
            Past <em>interviews</em>
          </h1>
          <p className="hist-sub">
            {sessions.length > 0
              ? `You've completed ${sessions.length} session${sessions.length !== 1 ? "s" : ""} — keep the momentum going.`
              : "No sessions yet — start one to see it here."}
          </p>
        </div>

        {/* Stats */}
        {sessions.length > 0 && (
          <div className="hist-stats">
            <div className="hist-stat-card">
              <div className="hist-stat-label">Total Sessions</div>
              <div className="hist-stat-value">{sessions.length}</div>
            </div>
            <div className="hist-stat-card">
              <div className="hist-stat-label">Domains Covered</div>
              <div className="hist-stat-value">{uniqueDomains}</div>
            </div>
            <div className="hist-stat-card">
              <div className="hist-stat-label">Latest</div>
              <div className="hist-stat-value" style={{ fontSize: "1rem", paddingTop: "4px" }}>
                {formatDate(sessions[0]?.started_at)}
              </div>
            </div>
          </div>
        )}

        {sessions.length === 0 ? (
          <div className="hist-empty">
            <div className="hist-empty-icon">🎙</div>
            <p className="hist-empty-title">No interviews yet</p>
            <p className="hist-empty-text">
              Complete a session and your report will appear here.<br />
              Each session tracks your growth over time.
            </p>
            <button className="hist-start-btn" onClick={() => navigate("/start")}>
              Start your first interview →
            </button>
          </div>
        ) : (
          <>
            <div className="hist-section-label">All Sessions</div>
            <div className="hist-list">
              {sessions.map((session, i) => (
                <div
                  key={session.id}
                  className="hist-card"
                  style={{ animationDelay: `${0.05 * i}s` }}
                >
                  <div className="hist-card-left">
                    <div className="hist-icon">
                      {DOMAIN_ICONS[session.domain] || "📋"}
                    </div>
                    <div className="hist-card-info">
                      <div className="hist-domain">
                        {DOMAIN_LABELS[session.domain] || session.domain}
                        <span className="hist-badge">Completed</span>
                      </div>
                      <div className="hist-date">{formatDate(session.started_at)}</div>
                    </div>
                  </div>

                  <div className="hist-card-right">
                    <button
                      className="hist-view-btn"
                      onClick={() => navigate(`/summary/${session.id}`)}
                    >
                      View report →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default History;