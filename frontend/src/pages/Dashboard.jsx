import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  .pf-root {
    min-height: 100vh;
    background: #FAFDD6;
    font-family: 'DM Sans', sans-serif;
    padding: 0;
  }

  .pf-nav {
    background: #647FBC;
    padding: 0 3rem;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pf-logo {
    font-family: 'DM Serif Display', serif;
    font-size: 1.4rem;
    color: #FAFDD6;
    letter-spacing: 0.01em;
  }

  .pf-logout {
    background: transparent;
    border: 1.5px solid rgba(250,253,214,0.45);
    color: #FAFDD6;
    padding: 7px 20px;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 400;
    cursor: pointer;
    letter-spacing: 0.03em;
    transition: background 0.2s, border-color 0.2s;
  }

  .pf-logout:hover {
    background: rgba(250,253,214,0.12);
    border-color: rgba(250,253,214,0.7);
  }

  .pf-body {
    max-width: 960px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  .pf-greeting {
    margin-bottom: 0.4rem;
    font-size: 0.9rem;
    color: #647FBC;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .pf-headline {
    font-family: 'DM Serif Display', serif;
    font-size: 2.8rem;
    color: #2e3a5c;
    line-height: 1.15;
    margin: 0 0 0.4rem 0;
  }

  .pf-subline {
    color: #6b7a9a;
    font-size: 1rem;
    font-weight: 300;
    margin: 0 0 3rem 0;
  }

  .pf-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .pf-card {
    background: #fff;
    border: 1px solid rgba(100,127,188,0.15);
    border-radius: 20px;
    padding: 2.5rem;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
  }

  .pf-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    border-radius: 20px 20px 0 0;
  }

  .pf-card--start::before { background: #647FBC; }
  .pf-card--history::before { background: #AED6CF; }

  .pf-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(100,127,188,0.15);
  }

  .pf-card-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.4rem;
  }

  .pf-card--start .pf-card-icon { background: rgba(100,127,188,0.1); }
  .pf-card--history .pf-card-icon { background: rgba(174,214,207,0.25); }

  .pf-card-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.5rem;
    color: #2e3a5c;
    margin: 0 0 0.5rem 0;
  }

  .pf-card-desc {
    color: #8a95ad;
    font-size: 0.9rem;
    font-weight: 300;
    line-height: 1.6;
    margin: 0;
  }

  .pf-card-arrow {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .pf-card--start .pf-card-arrow { background: #647FBC; }
  .pf-card--history .pf-card-arrow { background: #AED6CF; }

  .pf-card:hover .pf-card-arrow { opacity: 1; }

  .pf-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .pf-stat {
    background: rgba(145,173,200,0.1);
    border-radius: 14px;
    padding: 1.2rem 1.4rem;
  }

  .pf-stat-label {
    font-size: 0.78rem;
    color: #8a95ad;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 0.3rem;
  }

  .pf-stat-val {
    font-family: 'DM Serif Display', serif;
    font-size: 1.6rem;
    color: #2e3a5c;
  }

  @media (max-width: 600px) {
    .pf-cards { grid-template-columns: 1fr; }
    .pf-stats { grid-template-columns: 1fr 1fr; }
    .pf-nav { padding: 0 1.5rem; }
    .pf-body { padding: 2rem 1.2rem; }
    .pf-headline { font-size: 2rem; }
  }
`;

function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  return (
    <div className="pf-root">
      <style>{styles}</style>

      <nav className="pf-nav">
        <span className="pf-logo">PrepFlow</span>
        <button onClick={logout} className="pf-logout">
          Sign out
        </button>
      </nav>

      <div className="pf-body">
        <p className="pf-greeting">Welcome back</p>
        <h1 className="pf-headline">Ready to practice?</h1>
        <p className="pf-subline">Choose an action to get started with your interview prep.</p>

        <div className="pf-cards">
          <div className="pf-card pf-card--start" onClick={() => navigate("/start")}>
            <div className="pf-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#647FBC" strokeWidth="1.5"/>
                <path d="M10 8l6 4-6 4V8z" fill="#647FBC"/>
              </svg>
            </div>
            <h2 className="pf-card-title">Start Interview</h2>
            <p className="pf-card-desc">Begin a new AI-powered mock interview session tailored to your domain.</p>
            <div className="pf-card-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          <div className="pf-card pf-card--history" onClick={() => navigate("/history")}>
            <div className="pf-card-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 8v4l3 3" stroke="#4a9e95" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="9" stroke="#4a9e95" strokeWidth="1.5"/>
              </svg>
            </div>
            <h2 className="pf-card-title">Past Interviews</h2>
            <p className="pf-card-desc">Review your completed sessions, scores, and detailed feedback reports.</p>
            <div className="pf-card-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="#2e3a5c" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="pf-stats">
          <div className="pf-stat">
            <div className="pf-stat-label">Sessions</div>
            <div className="pf-stat-val">—</div>
          </div>
          <div className="pf-stat">
            <div className="pf-stat-label">Avg Score</div>
            <div className="pf-stat-val">—</div>
          </div>
          <div className="pf-stat">
            <div className="pf-stat-label">Streak</div>
            <div className="pf-stat-val">—</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;