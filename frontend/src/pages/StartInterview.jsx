import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  .si-root {
    min-height: 100vh;
    background: #FAFDD6;
    font-family: 'DM Sans', sans-serif;
  }

  .si-nav {
    background: #647FBC;
    padding: 0 3rem;
    height: 64px;
    display: flex;
    align-items: center;
  }

  .si-logo {
    font-family: 'DM Serif Display', serif;
    font-size: 1.4rem;
    color: #FAFDD6;
  }

  .si-body {
    max-width: 580px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  .si-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    color: #647FBC;
    cursor: pointer;
    margin-bottom: 2.5rem;
    font-weight: 500;
    border: none;
    background: none;
    padding: 0;
  }

  .si-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2.4rem;
    color: #2e3a5c;
    margin: 0 0 0.4rem 0;
  }

  .si-sub {
    color: #8a95ad;
    font-size: 0.9rem;
    font-weight: 300;
    margin: 0 0 2.5rem 0;
  }

  .si-card {
    background: #fff;
    border: 1px solid rgba(100,127,188,0.15);
    border-radius: 20px;
    padding: 2.5rem;
  }

  .si-label {
    font-size: 0.78rem;
    font-weight: 500;
    color: #6b7a9a;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    display: block;
    margin-bottom: 0.6rem;
  }

  .si-select {
    width: 100%;
    border: 1.5px solid rgba(100,127,188,0.25);
    border-radius: 10px;
    padding: 11px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    color: #2e3a5c;
    background: #fff;
    outline: none;
    margin-bottom: 1.8rem;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%23647FBC' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    transition: border-color 0.2s;
  }

  .si-select:focus { border-color: #647FBC; }

  .si-input {
    width: 100%;
    box-sizing: border-box;
    border: 1.5px solid rgba(100,127,188,0.25);
    border-radius: 10px;
    padding: 11px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    color: #2e3a5c;
    background: #fff;
    outline: none;
    margin-bottom: 0.6rem;
    transition: border-color 0.2s;
  }

  .si-input:focus { border-color: #647FBC; }

  .si-hint {
    font-size: 0.8rem;
    color: #b0baca;
    font-weight: 300;
    margin-bottom: 2rem;
    display: block;
  }

  .si-divider {
    height: 1px;
    background: rgba(100,127,188,0.1);
    margin-bottom: 2rem;
  }

  .si-domains {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.8rem;
    margin-bottom: 1.8rem;
  }

  .si-domain-chip {
    border: 1.5px solid rgba(100,127,188,0.2);
    border-radius: 10px;
    padding: 10px 8px;
    text-align: center;
    cursor: pointer;
    font-size: 0.82rem;
    color: #6b7a9a;
    transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
    background: #fff;
  }

  .si-domain-chip.active {
    background: rgba(100,127,188,0.1);
    border-color: #647FBC;
    color: #647FBC;
    font-weight: 500;
  }

  .si-btn {
    width: 100%;
    background: #647FBC;
    color: #FAFDD6;
    border: none;
    border-radius: 10px;
    padding: 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }

  .si-btn:hover { background: #5470a8; }
`;

const DOMAINS = [
  { value: "software_engineer", label: "Software Engineer" },
  { value: "data_analyst", label: "Data Analyst" },
  { value: "machine_learning", label: "Machine Learning" },
];

function StartInterview() {
  const navigate = useNavigate();
  const [domain, setDomain] = useState("software_engineer");
  const [resumeId, setResumeId] = useState("");

  const startInterview = async () => {
    try {
      const payload = { domain };
      if (resumeId) payload.resume_id = resumeId;
      const response = await api.post("/interview/start/", payload);
      navigate(`/interview/${response.data.id}`);
    } catch {
      alert("Failed to start interview");
    }
  };

  return (
    <div className="si-root">
      <style>{styles}</style>

      <nav className="si-nav">
        <span className="si-logo">PrepFlow</span>
      </nav>

      <div className="si-body">
        <button className="si-back" onClick={() => navigate("/dashboard")}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#647FBC" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Dashboard
        </button>

        <h1 className="si-title">New Interview</h1>
        <p className="si-sub">Configure your session and jump right in.</p>

        <div className="si-card">
          <label className="si-label">Domain</label>
          <div className="si-domains">
            {DOMAINS.map((d) => (
              <button
                key={d.value}
                className={`si-domain-chip${domain === d.value ? " active" : ""}`}
                onClick={() => setDomain(d.value)}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="si-divider" />

          <label className="si-label">Resume ID</label>
          <input
            type="text"
            className="si-input"
            placeholder="Optional — paste your resume ID"
            value={resumeId}
            onChange={(e) => setResumeId(e.target.value)}
          />
          <span className="si-hint">
            Attach a resume to get domain-specific questions tailored to your background.
          </span>

          <button onClick={startInterview} className="si-btn">
            Start interview →
          </button>
        </div>
      </div>
    </div>
  );
}

export default StartInterview;