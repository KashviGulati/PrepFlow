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
    font-size: 0.85rem;
    cursor: pointer;
  }

  .sum-body {
    max-width: 760px;
    margin: 0 auto;
    padding: 3.5rem 2rem 5rem;
  }

  .sum-header {
    margin-bottom: 2.5rem;
  }

  .sum-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2.4rem;
    color: #2e3a5c;
  }

  .sum-meta {
    color: #8a95ad;
    font-size: 0.88rem;
  }

  .sum-overview {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .sum-overview-card {
    background: #647FBC;
    border-radius: 16px;
    padding: 1.6rem;
    color: white;
  }

  .sum-report {
    background: white;
    border-radius: 16px;
    padding: 1.8rem;
    border: 1px solid rgba(100,127,188,0.15);
    line-height: 1.6;
    font-size: 0.92rem;
    color: #2e3a5c;
    white-space: pre-wrap;
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
    cursor: pointer;
  }

  .sum-btn-secondary {
    flex: 1;
    border: 1.5px solid rgba(100,127,188,0.3);
    color: #647FBC;
    border-radius: 10px;
    padding: 13px;
    cursor: pointer;
  }

  .sum-loading {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const DOMAIN_LABELS = {
  software_engineer: "Software Engineer",
  data_analyst: "Data Analyst",
  machine_learning: "Machine Learning",
};

function Summary() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await api.get(`/interview/summary/${sessionId}/`);
      setSummary(res.data);
    } catch {
      alert("Failed to load summary");
    }
  };

  if (!summary) {
    return (
      <div className="sum-loading">
        <style>{styles}</style>
        Generating your interview report...
      </div>
    );
  }

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
        <div className="sum-header">
          <h1 className="sum-title">
            {DOMAIN_LABELS[summary.domain] || summary.domain}
          </h1>
          <p className="sum-meta">
            {summary.questions_answered} question{summary.questions_answered !== 1 ? "s" : ""} answered
          </p>
        </div>

        <div className="sum-overview">
          <div className="sum-overview-card">
            <div>Domain</div>
            <strong>{DOMAIN_LABELS[summary.domain] || summary.domain}</strong>
          </div>

          <div className="sum-overview-card">
            <div>Questions</div>
            <strong>{summary.questions_answered}</strong>
          </div>
        </div>

        {/* 🔥 NEW: AI REPORT */}
        <h2 style={{ marginBottom: "1rem" }}>Interview Report</h2>

        <div className="sum-report">
          {summary.final_feedback || "No feedback available."}
        </div>

        <div className="sum-actions">
          <button className="sum-btn-primary" onClick={() => navigate("/start")}>
            Start new session →
          </button>

          <button className="sum-btn-secondary" onClick={() => navigate("/history")}>
            View history
          </button>
        </div>
      </div>
    </div>
  );
}

export default Summary;