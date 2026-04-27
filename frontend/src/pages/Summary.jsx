import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  .sum-root {
    min-height: 100vh;
    background: #FAFDD6;
    font-family: 'DM Sans', sans-serif;
  }

  .sum-nav {
    background: #647FBC;
    padding: 0 3rem;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .sum-logo {
    font-family: 'DM Serif Display', serif;
    font-size: 1.4rem;
    color: #FAFDD6;
  }

  .sum-nav-links {
    display: flex;
    gap: 0.8rem;
  }

  .sum-nav-btn {
    background: rgba(250,253,214,0.12);
    border: 1.5px solid rgba(250,253,214,0.35);
    color: #FAFDD6;
    padding: 7px 18px;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .sum-nav-btn:hover { background: rgba(250,253,214,0.22); }

  .sum-body {
    max-width: 760px;
    margin: 0 auto;
    padding: 3.5rem 2rem 5rem;
  }

  .sum-back {
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

  .sum-header {
    margin-bottom: 2.5rem;
  }

  .sum-eyebrow {
    font-size: 0.78rem;
    font-weight: 500;
    color: #647FBC;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.4rem;
  }

  .sum-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2.4rem;
    color: #2e3a5c;
    margin: 0 0 0.3rem 0;
  }

  .sum-meta {
    color: #8a95ad;
    font-size: 0.88rem;
    font-weight: 300;
  }

  .sum-overview {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .sum-overview-card {
    background: #647FBC;
    border-radius: 16px;
    padding: 1.6rem 1.8rem;
  }

  .sum-overview-card.light {
    background: #91ADC8;
  }

  .sum-ov-label {
    font-size: 0.78rem;
    font-weight: 500;
    color: rgba(250,253,214,0.7);
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 0.5rem;
  }

  .sum-ov-value {
    font-family: 'DM Serif Display', serif;
    font-size: 2rem;
    color: #FAFDD6;
    line-height: 1;
  }

  .sum-scores-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.3rem;
    color: #2e3a5c;
    margin: 0 0 1rem 0;
  }

  .sum-scores {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-bottom: 2rem;
  }

  .sum-score-row {
    background: #fff;
    border: 1px solid rgba(100,127,188,0.15);
    border-radius: 14px;
    padding: 1.2rem 1.5rem;
  }

  .sum-score-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.7rem;
  }

  .sum-score-name {
    font-size: 0.9rem;
    font-weight: 500;
    color: #2e3a5c;
  }

  .sum-score-val {
    font-family: 'DM Serif Display', serif;
    font-size: 1.3rem;
    color: #647FBC;
  }

  .sum-bar-track {
    height: 6px;
    background: rgba(100,127,188,0.12);
    border-radius: 100px;
    overflow: hidden;
  }

  .sum-bar-fill {
    height: 100%;
    border-radius: 100px;
    background: linear-gradient(90deg, #91ADC8, #647FBC);
    transition: width 0.6s ease;
  }

  .sum-actions {
    display: flex;
    gap: 0.8rem;
    margin-top: 2rem;
  }

  .sum-btn-primary {
    flex: 1;
    background: #647FBC;
    color: #FAFDD6;
    border: none;
    border-radius: 10px;
    padding: 13px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }

  .sum-btn-primary:hover { background: #5470a8; }

  .sum-btn-secondary {
    flex: 1;
    background: transparent;
    border: 1.5px solid rgba(100,127,188,0.3);
    color: #647FBC;
    border-radius: 10px;
    padding: 13px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .sum-btn-secondary:hover {
    background: #647FBC;
    color: #FAFDD6;
    border-color: #647FBC;
  }

  .sum-loading {
    min-height: 100vh;
    background: #FAFDD6;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-family: 'DM Sans', sans-serif;
    color: #6b7a9a;
    font-weight: 300;
  }

  .sum-spinner {
    width: 28px;
    height: 28px;
    border: 2.5px solid rgba(100,127,188,0.2);
    border-top-color: #647FBC;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .sum-callout {
    background: rgba(174,214,207,0.2);
    border: 1px solid rgba(174,214,207,0.5);
    border-radius: 14px;
    padding: 1.2rem 1.5rem;
    margin-top: 1.5rem;
    font-size: 0.88rem;
    color: #3d7a72;
    font-weight: 300;
    line-height: 1.6;
  }

  @media (max-width: 600px) {
    .sum-overview { grid-template-columns: 1fr; }
    .sum-actions { flex-direction: column; }
    .sum-nav { padding: 0 1.5rem; }
    .sum-body { padding: 2rem 1.2rem 4rem; }
  }
`;

const DOMAIN_LABELS = {
  software_engineer: "Software Engineer",
  data_analyst: "Data Analyst",
  machine_learning: "Machine Learning",
};

function ScoreRow({ label, value }) {
  const num = parseFloat(value) || 0;
  const pct = Math.min(100, Math.round(num * 100));
  return (
    <div className="sum-score-row">
      <div className="sum-score-header">
        <span className="sum-score-name">{label}</span>
        <span className="sum-score-val">{num.toFixed(2)}</span>
      </div>
      <div className="sum-bar-track">
        <div className="sum-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Summary() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);

  useEffect(() => { fetchSummary(); }, []);

  const fetchSummary = async () => {
    try {
      const response = await api.get(`/interview/summary/${sessionId}/`);
      setSummary(response.data);
    } catch {
      alert("Failed to load summary");
    }
  };

  if (!summary) {
    return (
      <div className="sum-loading">
        <style>{styles}</style>
        <div className="sum-spinner" />
        Generating your report...
      </div>
    );
  }

  const scores = [
    { label: "Semantic Score", key: "average_semantic_score" },
    { label: "Confidence Score", key: "average_confidence_score" },
    { label: "Vocabulary Score", key: "average_vocabulary_score" },
    { label: "Technical Score", key: "average_technical_score" },
  ];

  return (
    <div className="sum-root">
      <style>{styles}</style>

      <nav className="sum-nav">
        <span className="sum-logo">PrepFlow</span>
        <div className="sum-nav-links">
          <button className="sum-nav-btn" onClick={() => navigate("/start")}>
            New session
          </button>
        </div>
      </nav>

      <div className="sum-body">
        <button className="sum-back" onClick={() => navigate("/history")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#647FBC" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          All interviews
        </button>

        <div className="sum-header">
          <p className="sum-eyebrow">Interview Report</p>
          <h1 className="sum-title">
            {DOMAIN_LABELS[summary.domain] || summary.domain}
          </h1>
          <p className="sum-meta">
            {summary.questions_answered} question{summary.questions_answered !== 1 ? "s" : ""} answered
          </p>
        </div>

        <div className="sum-overview">
          <div className="sum-overview-card">
            <div className="sum-ov-label">Domain</div>
            <div className="sum-ov-value">
              {DOMAIN_LABELS[summary.domain] || summary.domain}
            </div>
          </div>
          <div className="sum-overview-card light">
            <div className="sum-ov-label">Questions Answered</div>
            <div className="sum-ov-value">{summary.questions_answered}</div>
          </div>
        </div>

        <h2 className="sum-scores-title">Performance Breakdown</h2>

        <div className="sum-scores">
          {scores.map((s) => (
            <ScoreRow key={s.key} label={s.label} value={summary[s.key]} />
          ))}
        </div>

        <div className="sum-callout">
          Keep practising regularly to improve your scores. Consistency is key — even one session a day makes a measurable difference over time.
        </div>

        <div className="sum-actions">
          <button className="sum-btn-primary" onClick={() => navigate("/start")}>
            Start new session →
          </button>
          <button className="sum-btn-secondary" onClick={() => navigate("/history")}>
            View all sessions
          </button>
        </div>
      </div>
    </div>
  );
}

export default Summary;