import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  .hist-root {
    min-height: 100vh;
    background: #FAFDD6;
    font-family: 'DM Sans', sans-serif;
  }

  .hist-nav {
    background: #647FBC;
    padding: 0 3rem;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .hist-logo {
    font-family: 'DM Serif Display', serif;
    font-size: 1.4rem;
    color: #FAFDD6;
  }

  .hist-body {
    max-width: 760px;
    margin: 0 auto;
    padding: 3.5rem 2rem;
  }

  .hist-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    color: #647FBC;
    cursor: pointer;
    margin-bottom: 2rem;
    font-weight: 500;
    border: none;
    background: none;
    padding: 0;
  }

  .hist-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2.4rem;
    color: #2e3a5c;
    margin: 0 0 0.4rem 0;
  }

  .hist-sub {
    color: #8a95ad;
    font-size: 0.9rem;
    font-weight: 300;
    margin: 0 0 2.5rem 0;
  }

  .hist-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .hist-card {
    background: #fff;
    border: 1px solid rgba(100,127,188,0.15);
    border-radius: 16px;
    padding: 1.5rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: box-shadow 0.2s, transform 0.2s;
  }

  .hist-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(100,127,188,0.12);
  }

  .hist-card-left {
    display: flex;
    align-items: center;
    gap: 1.2rem;
  }

  .hist-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(100,127,188,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .hist-domain {
    font-size: 1rem;
    font-weight: 500;
    color: #2e3a5c;
    margin-bottom: 3px;
    text-transform: capitalize;
  }

  .hist-date {
    font-size: 0.82rem;
    color: #b0baca;
    font-weight: 300;
  }

  .hist-view-btn {
    background: transparent;
    border: 1.5px solid rgba(100,127,188,0.3);
    color: #647FBC;
    padding: 8px 18px;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .hist-view-btn:hover {
    background: #647FBC;
    color: #FAFDD6;
    border-color: #647FBC;
  }

  .hist-empty {
    text-align: center;
    padding: 5rem 2rem;
    color: #b0baca;
  }

  .hist-empty-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(100,127,188,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.2rem;
  }

  .hist-empty-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.3rem;
    color: #8a95ad;
    margin-bottom: 0.4rem;
  }

  .hist-empty-text {
    font-size: 0.88rem;
    font-weight: 300;
  }

  .hist-start-link {
    display: inline-block;
    margin-top: 1.4rem;
    background: #647FBC;
    color: #FAFDD6;
    padding: 10px 24px;
    border-radius: 100px;
    font-size: 0.88rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
    font-family: 'DM Sans', sans-serif;
  }

  .hist-badge {
    display: inline-block;
    background: rgba(174,214,207,0.3);
    color: #4a7a74;
    font-size: 0.72rem;
    font-weight: 500;
    padding: 2px 10px;
    border-radius: 100px;
    margin-left: 8px;
    vertical-align: middle;
    letter-spacing: 0.04em;
  }

  .hist-loading {
    min-height: 100vh;
    background: #FAFDD6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    color: #6b7a9a;
    font-weight: 300;
    gap: 12px;
  }

  .hist-spinner {
    width: 28px;
    height: 28px;
    border: 2.5px solid rgba(100,127,188,0.2);
    border-top-color: #647FBC;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
`;

const DOMAIN_LABELS = {
  software_engineer: "Software Engineer",
  data_analyst: "Data Analyst",
  machine_learning: "Machine Learning",
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
        Loading history...
      </div>
    );
  }

  return (
    <div className="hist-root">
      <style>{styles}</style>

      <nav className="hist-nav">
        <span className="hist-logo">PrepFlow</span>
      </nav>

      <div className="hist-body">
        <button className="hist-back" onClick={() => navigate("/dashboard")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#647FBC" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Dashboard
        </button>

        <h1 className="hist-title">Past Interviews</h1>
        <p className="hist-sub">
          {sessions.length > 0
            ? `You have completed ${sessions.length} session${sessions.length !== 1 ? "s" : ""}.`
            : "No sessions yet — start one to see it here."}
        </p>

        {sessions.length === 0 ? (
          <div className="hist-empty">
            <div className="hist-empty-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 8v4l3 3" stroke="#91ADC8" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="9" stroke="#91ADC8" strokeWidth="1.5"/>
              </svg>
            </div>
            <p className="hist-empty-title">No interviews yet</p>
            <p className="hist-empty-text">Complete a session and it will appear here.</p>
            <button className="hist-start-link" onClick={() => navigate("/start")}>
              Start your first interview
            </button>
          </div>
        ) : (
          <div className="hist-list">
            {sessions.map((session) => (
              <div key={session.id} className="hist-card">
                <div className="hist-card-left">
                  <div className="hist-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="4" width="18" height="16" rx="3" stroke="#647FBC" strokeWidth="1.5"/>
                      <path d="M7 9h10M7 13h6" stroke="#647FBC" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="hist-domain">
                      {DOMAIN_LABELS[session.domain] || session.domain}
                      <span className="hist-badge">Completed</span>
                    </div>
                    <div className="hist-date">{formatDate(session.started_at)}</div>
                  </div>
                </div>

                <button
                  className="hist-view-btn"
                  onClick={() => navigate(`/summary/${session.id}`)}
                >
                  View report
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;