import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body { background: #0E0F14; }

.sum-root {
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  color: #F0EDE8;
  background: #0E0F14;
  position: relative;
  overflow-x: hidden;
}

/* ── Background ── */
.sum-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 70% 55% at 75% 5%,  rgba(100, 90, 200, 0.16) 0%, transparent 60%),
    radial-gradient(ellipse 55% 45% at 15% 85%, rgba(210, 160, 90, 0.13) 0%, transparent 55%),
    radial-gradient(ellipse 45% 35% at 85% 70%, rgba(60, 160, 180, 0.09) 0%, transparent 50%),
    linear-gradient(160deg, #0E0F14 0%, #12141C 50%, #0F1018 100%);
}
.sum-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 180px;
  opacity: 0.5;
  pointer-events: none;
}

/* ── Nav ── */
.sum-nav {
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

.sum-logo {
  font-family: 'Playfair Display', serif;
  font-size: 1.7rem;
  color: #E8D4B0;
  letter-spacing: 0.06em;
}

.sum-nav-btn {
  background: rgba(200,155,94,0.08);
  border: 1px solid rgba(200,155,94,0.22);
  color: #C89B5E;
  padding: 8px 18px;
  border-radius: 999px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.04em;
}
.sum-nav-btn:hover {
  background: rgba(200,155,94,0.14);
  border-color: rgba(200,155,94,0.4);
  color: #E0B97B;
}

/* ── Body ── */
.sum-body {
  position: relative;
  z-index: 2;
  max-width: 780px;
  margin: 0 auto;
  padding: 3.5rem 2rem 6rem;
}

/* ── Header ── */
.sum-header {
  margin-bottom: 2.8rem;
  animation: fadeUp 0.5s ease both;
}

.sum-eyebrow {
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #C89B5E;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 10px;
}
.sum-eyebrow::after {
  content: '';
  display: block;
  height: 1px;
  width: 40px;
  background: linear-gradient(to right, #C89B5E, transparent);
}

.sum-title {
  font-family: 'Playfair Display', serif;
  font-size: 3.4rem;
  line-height: 1.05;
  color: #F5F1EA;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.sum-title em {
  font-style: italic;
  color: #C89B5E;
}

.sum-meta {
  margin-top: 0.7rem;
  color: #5A5670;
  font-size: 0.88rem;
  display: flex;
  align-items: center;
  gap: 8px;
}
.sum-meta-dot {
  width: 3px; height: 3px;
  border-radius: 50%;
  background: #3A384A;
}

/* ── Overview cards ── */
.sum-overview {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 2rem;
  animation: fadeUp 0.5s 0.1s ease both;
}

.sum-overview-card {
  background: rgba(18, 18, 28, 0.75);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  padding: 1.6rem 1.8rem;
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s;
}
.sum-overview-card::after {
  content: '';
  position: absolute;
  top: 0; left: 10%; right: 10%;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(200,155,94,0.2), transparent);
}
.sum-ov-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #5A5670;
  margin-bottom: 0.5rem;
}
.sum-ov-value {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: #E8D4B0;
  font-weight: 600;
}
.sum-ov-icon {
  position: absolute;
  top: 1.4rem; right: 1.4rem;
  font-size: 1.4rem;
  opacity: 0.25;
}

/* ── Score card ── */
.sum-score-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 2rem;
  animation: fadeUp 0.5s 0.15s ease both;
}

.sum-score-card {
  background: rgba(18, 18, 28, 0.75);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 18px;
  padding: 1.2rem 1.4rem;
  backdrop-filter: blur(16px);
  text-align: center;
}
.sum-score-label {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #4A4660;
  margin-bottom: 0.4rem;
}
.sum-score-value {
  font-size: 1.6rem;
  font-weight: 600;
  font-family: 'Playfair Display', serif;
}
.sum-score-value.good  { color: #8ECEBB; }
.sum-score-value.mid   { color: #E8C88A; }
.sum-score-value.low   { color: #E8988A; }

/* ── Report section ── */
.sum-report-wrap {
  animation: fadeUp 0.5s 0.2s ease both;
}

.sum-section-label {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #8C879E;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
}
.sum-section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.05);
}

.sum-report-card {
  background: rgba(18, 18, 28, 0.8);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 24px;
  padding: 2.2rem 2.4rem;
  backdrop-filter: blur(24px);
  box-shadow:
    0 1px 0 rgba(255,255,255,0.05) inset,
    0 20px 50px rgba(0,0,0,0.45);
  line-height: 1.8;
  font-size: 0.93rem;
  color: #B8B2C8;
}

/* ── Clean the markdown bold/stars from AI output ── */
.sum-report-card p {
  margin-bottom: 1rem;
  color: #B8B2C8;
}
.sum-report-card p:last-child { margin-bottom: 0; }

.sum-report-card .report-heading {
  font-family: 'Playfair Display', serif;
  font-size: 1.05rem;
  color: #E8D4B0;
  font-weight: 600;
  margin: 1.4rem 0 0.5rem;
}
.sum-report-card .report-heading:first-child { margin-top: 0; }

.sum-report-card .report-highlight {
  color: #C89B5E;
  font-weight: 500;
}

.sum-report-card .report-good { color: #8ECEBB; font-weight: 500; }
.sum-report-card .report-warn { color: #E8C88A; font-weight: 500; }

/* ── Actions ── */
.sum-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 2rem;
  animation: fadeUp 0.5s 0.3s ease both;
}

.sum-btn {
  border: none;
  padding: 15px 18px;
  border-radius: 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.22s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 0.02em;
}

.sum-btn-primary {
  background: linear-gradient(135deg, #C89B5E, #E0B97B);
  color: #1A1408;
  box-shadow: 0 4px 20px rgba(200,155,94,0.25);
}
.sum-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(200,155,94,0.38);
}

.sum-btn-secondary {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  color: #8C879E;
}
.sum-btn-secondary:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.14);
  color: #C0BAD0;
  transform: translateY(-2px);
}

/* ── Loading ── */
.sum-loading {
  min-height: 100vh;
  background: #0E0F14;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  font-family: 'DM Sans', sans-serif;
}
.sum-spinner {
  width: 36px; height: 36px;
  border: 2px solid rgba(200,155,94,0.15);
  border-top-color: #C89B5E;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.sum-loading-text { color: #5A5670; font-size: 0.9rem; letter-spacing: 0.08em; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  .sum-nav { padding: 0 1.5rem; }
  .sum-body { padding: 2.5rem 1.2rem 5rem; }
  .sum-title { font-size: 2.4rem; }
  .sum-overview, .sum-score-row, .sum-actions { grid-template-columns: 1fr; }
  .sum-report-card { padding: 1.6rem 1.5rem; border-radius: 20px; }
}
`;

const DOMAIN_LABELS = {
  software_engineer: "Software Engineer",
  data_analyst: "Data Analyst",
  machine_learning: "Machine Learning",
};

/* Strip markdown bold (**text**) and return plain text paragraphs */
function cleanMarkdown(text) {
  if (!text) return [];
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")   // remove **bold**
    .replace(/\*(.*?)\*/g, "$1")        // remove *italic*
    .replace(/#+\s*/g, "")              // remove headings hashes
    .split(/\n{2,}/)                    // split on double newlines
    .map((p) => p.trim())
    .filter(Boolean);
}

/* Heuristic: if paragraph starts with a known heading keyword, treat as heading */
const HEADING_PATTERNS = [
  /^(overall|summary|strengths?|weaknesses?|areas? (for|to) improve|technical|communication|vocabulary|clarity|feedback|performance|score|recommendation)/i,
];

function isHeading(paragraph) {
  return HEADING_PATTERNS.some((re) => re.test(paragraph)) && paragraph.length < 80;
}

function ReportContent({ text }) {
  const paragraphs = cleanMarkdown(text);
  return (
    <div className="sum-report-card">
      {paragraphs.map((p, i) =>
        isHeading(p) ? (
          <div key={i} className="report-heading">{p}</div>
        ) : (
          <p key={i}>{p}</p>
        )
      )}
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
        <div className="sum-spinner" />
        <p className="sum-loading-text">Generating your interview report...</p>
      </div>
    );
  }

  const domainLabel = DOMAIN_LABELS[summary.domain] || summary.domain;

  return (
    <div className="sum-root">
      <style>{styles}</style>
      <div className="sum-bg" />

      {/* Nav */}
      <nav className="sum-nav">
        <span className="sum-logo">PrepFlow</span>
        <button className="sum-nav-btn" onClick={() => navigate("/start")}>
          New Session
        </button>
      </nav>

      <div className="sum-body">

        {/* Header */}
        <div className="sum-header">
          <div className="sum-eyebrow">Session Complete</div>
          <h1 className="sum-title">
            Your <em>report</em>
          </h1>
          <p className="sum-meta">
            {domainLabel}
            <span className="sum-meta-dot" />
            {summary.questions_answered} question{summary.questions_answered !== 1 ? "s" : ""} answered
          </p>
        </div>

        {/* Overview cards */}
        <div className="sum-overview">
          <div className="sum-overview-card">
            <span className="sum-ov-icon">🎯</span>
            <div className="sum-ov-label">Domain</div>
            <div className="sum-ov-value">{domainLabel}</div>
          </div>
          <div className="sum-overview-card">
            <span className="sum-ov-icon">💬</span>
            <div className="sum-ov-label">Questions</div>
            <div className="sum-ov-value">{summary.questions_answered}</div>
          </div>
        </div>

        {/* AI Report */}
        <div className="sum-report-wrap">
          <div className="sum-section-label">Interview Report</div>
          <ReportContent text={summary.final_feedback || "No feedback available."} />
        </div>

        {/* Actions */}
        <div className="sum-actions">
          <button className="sum-btn sum-btn-primary" onClick={() => navigate("/start")}>
            Start New Session →
          </button>
          <button className="sum-btn sum-btn-secondary" onClick={() => navigate("/history")}>
            View History
          </button>
        </div>

      </div>
    </div>
  );
}

export default Summary;