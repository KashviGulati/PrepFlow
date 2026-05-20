import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body { background: #0E0F14; }

.si-root {
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  color: #F0EDE8;
  background: #0E0F14;
  position: relative;
  overflow-x: hidden;
}

/* ─── Layered mesh background ─── */
.si-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 80% 60% at 70% 10%, rgba(100, 90, 200, 0.18) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 20% 80%, rgba(210, 160, 90, 0.14) 0%, transparent 55%),
    radial-gradient(ellipse 50% 40% at 90% 75%, rgba(80, 160, 180, 0.10) 0%, transparent 50%),
    linear-gradient(160deg, #0E0F14 0%, #12141C 50%, #0F1018 100%);
}

/* subtle noise grain */
.si-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 180px;
  opacity: 0.5;
  pointer-events: none;
}

/* floating orbs */
.si-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0;
  pointer-events: none;
  z-index: 0;
  animation: orbFloat 0.8s ease forwards;
}
.si-orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(120, 100, 220, 0.22), transparent 70%);
  top: -100px; right: -80px;
  animation-delay: 0.1s;
}
.si-orb-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(200, 155, 80, 0.18), transparent 70%);
  bottom: -80px; left: -60px;
  animation-delay: 0.3s;
}
.si-orb-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(60, 160, 190, 0.12), transparent 70%);
  top: 50%; right: 10%;
  animation-delay: 0.5s;
}

@keyframes orbFloat {
  to { opacity: 1; }
}

/* ─── Nav ─── */
.si-nav {
  position: relative;
  z-index: 10;
  height: 72px;
  padding: 0 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: rgba(14, 15, 20, 0.6);
  backdrop-filter: blur(20px);
}

.si-logo {
  font-family: 'Playfair Display', serif;
  font-size: 1.7rem;
  color: #E8D4B0;
  letter-spacing: 0.06em;
}

.si-nav-pill {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 0.78rem;
  color: #9D98B0;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* ─── Main body ─── */
.si-body {
  position: relative;
  z-index: 2;
  max-width: 780px;
  margin: 0 auto;
  padding: 3.5rem 2rem 6rem;
}

/* ─── Back ─── */
.si-back {
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
.si-back:hover {
  background: rgba(255,255,255,0.07);
  color: #D4C8B8;
  transform: translateX(-2px);
}

/* ─── Header ─── */
.si-header {
  margin-bottom: 2.5rem;
  animation: fadeUp 0.6s ease both;
}

.si-eyebrow {
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #C89B5E;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 10px;
}
.si-eyebrow::after {
  content: '';
  display: block;
  height: 1px;
  width: 40px;
  background: linear-gradient(to right, #C89B5E, transparent);
}

.si-title {
  font-family: 'Playfair Display', serif;
  font-size: 3.8rem;
  line-height: 1.05;
  color: #F5F1EA;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.si-title em {
  font-style: italic;
  color: #C89B5E;
}

.si-sub {
  margin-top: 0.9rem;
  color: #7A7590;
  font-size: 0.95rem;
  line-height: 1.75;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ─── Steps indicator ─── */
.si-steps {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 2rem;
  animation: fadeUp 0.6s 0.1s ease both;
}
.si-step-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  color: #504C60;
  letter-spacing: 0.06em;
}
.si-step-item.active { color: #C89B5E; }
.si-step-item.done { color: #6B9E8A; }
.si-step-dot {
  width: 24px; height: 24px;
  border-radius: 50%;
  border: 1.5px solid currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
}
.si-step-item.active .si-step-dot {
  background: linear-gradient(135deg, #C89B5E, #E0B97B);
  border-color: transparent;
  color: #111;
}
.si-step-item.done .si-step-dot {
  background: rgba(107, 158, 138, 0.15);
}
.si-step-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, rgba(200,155,94,0.15), rgba(200,155,94,0.05));
  margin: 0 10px;
  max-width: 60px;
}

/* ─── Card ─── */
.si-card {
  background: rgba(18, 18, 26, 0.75);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 28px;
  padding: 2.4rem 2.4rem 2rem;
  backdrop-filter: blur(24px);
  box-shadow:
    0 1px 0 0 rgba(255,255,255,0.06) inset,
    0 24px 60px rgba(0,0,0,0.5),
    0 0 0 1px rgba(100,90,200,0.06);
  animation: fadeUp 0.6s 0.2s ease both;
}

/* ─── Section label ─── */
.si-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
  color: #8C879E;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.si-label-num {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: rgba(200,155,94,0.12);
  border: 1px solid rgba(200,155,94,0.25);
  color: #C89B5E;
  font-size: 0.68rem;
  display: flex; align-items: center; justify-content: center;
  font-weight: 600;
}

/* ─── Mode toggle ─── */
.si-mode-toggle {
  display: flex;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 5px;
  gap: 4px;
  margin-bottom: 2rem;
}

.si-mode-btn {
  flex: 1;
  border: none;
  background: transparent;
  color: #6E6A80;
  padding: 11px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem;
  font-weight: 500;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.si-mode-btn:hover { color: #C0BAD0; }
.si-mode-btn.active {
  background: linear-gradient(135deg, rgba(200,155,94,0.15), rgba(140,100,200,0.12));
  color: #E8D4B0;
  border: 1px solid rgba(200,155,94,0.2);
  box-shadow: 0 2px 12px rgba(0,0,0,0.3);
}
.si-mode-icon { font-size: 1rem; }

/* ─── Domain grid ─── */
.si-domains {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 2rem;
}

.si-chip {
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  color: #C0BAD0;
  padding: 14px 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.22s ease;
  font-size: 0.88rem;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
}
.si-chip::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(200,155,94,0.08), rgba(120,100,200,0.06));
  opacity: 0;
  transition: opacity 0.22s;
}
.si-chip:hover {
  border-color: rgba(200,155,94,0.3);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}
.si-chip:hover::before { opacity: 1; }
.si-chip.active {
  background: linear-gradient(135deg, rgba(200,155,94,0.18), rgba(140,110,210,0.12));
  border-color: rgba(200,155,94,0.4);
  color: #F0E6D0;
  box-shadow: 0 4px 20px rgba(200,155,94,0.12);
}
.si-chip.active::before { opacity: 1; }
.si-chip-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}
.si-chip-check {
  margin-left: auto;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #C89B5E, #E0B97B);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.6rem;
  color: #111;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.2s ease;
}
.si-chip.active .si-chip-check { opacity: 1; transform: scale(1); }

/* ─── Input ─── */
.si-input-wrap {
  position: relative;
  margin-bottom: 2rem;
}
.si-input-wrap .si-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #5A5570;
  font-size: 1rem;
}
.si-input {
  width: 100%;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  color: #F0EDE8;
  padding: 14px 16px 14px 42px;
  border-radius: 14px;
  outline: none;
  font-size: 0.92rem;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
}
.si-input::placeholder { color: #4A4660; }
.si-input:focus {
  border-color: rgba(200,155,94,0.4);
  background: rgba(200,155,94,0.04);
  box-shadow: 0 0 0 4px rgba(200,155,94,0.06);
}

/* ─── File upload ─── */
.si-file-zone {
  border: 1.5px dashed rgba(200,155,94,0.25);
  border-radius: 18px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.22s;
  margin-bottom: 2rem;
  background: rgba(200,155,94,0.02);
  position: relative;
  overflow: hidden;
}
.si-file-zone:hover {
  border-color: rgba(200,155,94,0.5);
  background: rgba(200,155,94,0.04);
}
.si-file-zone input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.si-file-icon { font-size: 2rem; margin-bottom: 0.5rem; }
.si-file-text { font-size: 0.88rem; color: #8A8498; }
.si-file-text strong { color: #C89B5E; }
.si-file-name {
  margin-top: 8px;
  font-size: 0.8rem;
  color: #6B9E8A;
  font-weight: 500;
}

/* ─── Divider ─── */
.si-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.07), transparent);
  margin: 0 -0.5rem 2rem;
}

/* ─── Difficulty ─── */
.si-difficulty {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 2rem;
}

.si-diff-btn {
  border: 1px solid rgba(255,255,255,0.07);
  background: rgba(255,255,255,0.03);
  color: #8A8498;
  padding: 14px 10px;
  border-radius: 16px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.22s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.si-diff-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(255,255,255,0.14);
  color: #C0BAD0;
}
.si-diff-icon { font-size: 1.2rem; }
.si-diff-badge {
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.6;
}

.si-diff-btn.diff-beginner.active {
  background: rgba(107,158,138,0.12);
  border-color: rgba(107,158,138,0.35);
  color: #8ECEBB;
  box-shadow: 0 0 20px rgba(107,158,138,0.1);
}
.si-diff-btn.diff-intermediate.active {
  background: rgba(200,155,94,0.12);
  border-color: rgba(200,155,94,0.35);
  color: #E8C88A;
  box-shadow: 0 0 20px rgba(200,155,94,0.1);
}
.si-diff-btn.diff-advanced.active {
  background: rgba(200,80,80,0.12);
  border-color: rgba(200,80,80,0.3);
  color: #E8988A;
  box-shadow: 0 0 20px rgba(200,80,80,0.08);
}

/* ─── CTA button ─── */
.si-btn-wrap {
  position: relative;
  margin-top: 0.5rem;
}
.si-btn {
  width: 100%;
  border: none;
  padding: 17px 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, #C89B5E 0%, #E0B97B 50%, #C89B5E 100%);
  background-size: 200% 100%;
  color: #1A1408;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.04em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow:
    0 4px 20px rgba(200,155,94,0.3),
    0 1px 0 rgba(255,255,255,0.15) inset;
}
.si-btn:hover {
  background-position: 100% 0;
  transform: translateY(-2px);
  box-shadow:
    0 8px 30px rgba(200,155,94,0.4),
    0 1px 0 rgba(255,255,255,0.15) inset;
}
.si-btn:active { transform: translateY(0); }
.si-btn-arrow {
  font-size: 1rem;
  transition: transform 0.2s;
}
.si-btn:hover .si-btn-arrow { transform: translateX(4px); }

/* ─── Footer note ─── */
.si-note {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.78rem;
  color: #4A4660;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.si-note-dot {
  width: 4px; height: 4px;
  border-radius: 50%;
  background: #C89B5E;
  opacity: 0.4;
}

/* ─── Responsive ─── */
@media (max-width: 640px) {
  .si-title { font-size: 2.6rem; }
  .si-nav { padding: 0 1.5rem; }
  .si-body { padding: 2.5rem 1.2rem 5rem; }
  .si-card { padding: 1.8rem 1.5rem; border-radius: 22px; }
  .si-domains, .si-difficulty { grid-template-columns: 1fr 1fr; }
  .si-steps { display: none; }
}
`;

const DOMAINS = [
  { value: "software_engineer", label: "Software Engineer", icon: "💻" },
  { value: "data_analyst", label: "Data Analyst", icon: "📊" },
  { value: "machine_learning", label: "Machine Learning", icon: "🧠" },
  { value: "custom", label: "Custom Role", icon: "✦" },
];

const DIFFICULTIES = [
  { value: "beginner", label: "Beginner", icon: "🌱", badge: "Foundational" },
  { value: "intermediate", label: "Intermediate", icon: "⚡", badge: "Challenging" },
  { value: "advanced", label: "Advanced", icon: "🔥", badge: "Expert" },
];

function StartInterview() {
  const navigate = useNavigate();
  const [interviewMode, setInterviewMode] = useState("domain");
  const [domain, setDomain] = useState("software_engineer");
  const [customDomain, setCustomDomain] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [difficulty, setDifficulty] = useState("beginner");

  const currentStep = interviewMode === "resume" && !resumeFile ? 1 : difficulty ? 3 : 2;

  const startInterview = async () => {
    try {
      let uploadedResumeId = null;

      if (interviewMode === "resume") {
        if (!resumeFile) { alert("Please upload a resume"); return; }
        const formData = new FormData();
        formData.append("file", resumeFile);
        const uploadResponse = await api.post("/resume/upload/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedResumeId = uploadResponse.data.id;
      }

      const payload = { difficulty_mode: difficulty };

      if (interviewMode === "domain") {
        payload.domain = domain === "custom" ? customDomain : domain;
        if (!payload.domain) { alert("Please enter a custom role"); return; }
      }

      if (interviewMode === "resume") payload.resume_id = uploadedResumeId;

      const response = await api.post("/interview/start/", payload);
      navigate(`/interview/${response.data.session_id}`);
    } catch (error) {
      console.log(error);
      alert("Failed to start interview");
    }
  };

  return (
    <div className="si-root">
      <style>{styles}</style>

      {/* Background layers */}
      <div className="si-bg" />
      <div className="si-orb si-orb-1" />
      <div className="si-orb si-orb-2" />
      <div className="si-orb si-orb-3" />

      {/* Nav */}
      <nav className="si-nav">
        <span className="si-logo">PrepFlow</span>
        <span className="si-nav-pill">Interview Setup</span>
      </nav>

      <div className="si-body">

        <button className="si-back" onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </button>

        {/* Header */}
        <div className="si-header">
          <div className="si-eyebrow">New Session</div>
          <h1 className="si-title">
            Configure your <em>interview</em>
          </h1>
          <p className="si-sub">
            Tailor the session to your goals — domain-focused or resume-driven,<br />
            at exactly the right difficulty for where you are.
          </p>
        </div>

        {/* Steps */}
        <div className="si-steps">
          {["Interview Type", "Your Focus", "Difficulty"].map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : 0 }}>
              <div className={`si-step-item ${currentStep === i + 1 ? "active" : currentStep > i + 1 ? "done" : ""}`}>
                <div className="si-step-dot">
                  {currentStep > i + 1 ? "✓" : i + 1}
                </div>
                {label}
              </div>
              {i < 2 && <div className="si-step-line" />}
            </div>
          ))}
        </div>

        {/* Main card */}
        <div className="si-card">

          {/* Interview type */}
          <div className="si-label">
            <span className="si-label-num">1</span>
            Interview Type
          </div>
          <div className="si-mode-toggle">
            <button
              className={`si-mode-btn ${interviewMode === "domain" ? "active" : ""}`}
              onClick={() => setInterviewMode("domain")}
            >
              <span className="si-mode-icon">🎯</span> Domain Based
            </button>
            <button
              className={`si-mode-btn ${interviewMode === "resume" ? "active" : ""}`}
              onClick={() => setInterviewMode("resume")}
            >
              <span className="si-mode-icon">📄</span> Resume Based
            </button>
          </div>

          <div className="si-divider" />

          {/* Domain section */}
          {interviewMode === "domain" && (
            <>
              <div className="si-label">
                <span className="si-label-num">2</span>
                Choose Domain
              </div>
              <div className="si-domains">
                {DOMAINS.map((d) => (
                  <button
                    key={d.value}
                    className={`si-chip ${domain === d.value ? "active" : ""}`}
                    onClick={() => setDomain(d.value)}
                  >
                    <span className="si-chip-icon">{d.icon}</span>
                    {d.label}
                    <span className="si-chip-check">✓</span>
                  </button>
                ))}
              </div>

              {domain === "custom" && (
                <div className="si-input-wrap" style={{ marginTop: "-1rem" }}>
                  <span className="si-icon">✦</span>
                  <input
                    type="text"
                    placeholder="e.g. Full Stack Developer"
                    className="si-input"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                  />
                </div>
              )}
            </>
          )}

          {/* Resume section */}
          {interviewMode === "resume" && (
            <>
              <div className="si-label">
                <span className="si-label-num">2</span>
                Upload Your Resume
              </div>
              <div className="si-file-zone">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
                <div className="si-file-icon">📎</div>
                <div className="si-file-text">
                  <strong>Click to upload</strong> or drag your resume here
                </div>
                <div className="si-file-text" style={{ marginTop: "4px" }}>
                  PDF only · Max 10MB
                </div>
                {resumeFile && (
                  <div className="si-file-name">✓ {resumeFile.name}</div>
                )}
              </div>
            </>
          )}

          <div className="si-divider" />

          {/* Difficulty */}
          <div className="si-label">
            <span className="si-label-num">3</span>
            Difficulty Level
          </div>
          <div className="si-difficulty">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                className={`si-diff-btn diff-${d.value} ${difficulty === d.value ? "active" : ""}`}
                onClick={() => setDifficulty(d.value)}
              >
                <span className="si-diff-icon">{d.icon}</span>
                {d.label}
                <span className="si-diff-badge">{d.badge}</span>
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="si-btn-wrap">
            <button onClick={startInterview} className="si-btn">
              Begin Interview
              <span className="si-btn-arrow">→</span>
            </button>
          </div>

          <div className="si-note">
            <span className="si-note-dot" />
            AI-powered · Adaptive feedback · Real-time analysis
            <span className="si-note-dot" />
          </div>
        </div>

      </div>
    </div>
  );
}

export default StartInterview;