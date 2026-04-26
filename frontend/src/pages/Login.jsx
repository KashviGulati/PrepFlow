import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  .auth-root {
    min-height: 100vh;
    background: #FAFDD6;
    display: flex;
    font-family: 'DM Sans', sans-serif;
  }

  .auth-panel {
    width: 480px;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 4rem 3.5rem;
    border-right: 1px solid rgba(100,127,188,0.12);
  }

  .auth-brand {
    font-family: 'DM Serif Display', serif;
    font-size: 1.3rem;
    color: #647FBC;
    margin-bottom: 3rem;
    display: block;
  }

  .auth-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2.2rem;
    color: #2e3a5c;
    margin: 0 0 0.4rem 0;
    line-height: 1.2;
  }

  .auth-sub {
    color: #8a95ad;
    font-size: 0.9rem;
    font-weight: 300;
    margin: 0 0 2.5rem 0;
  }

  .auth-label {
    font-size: 0.78rem;
    font-weight: 500;
    color: #6b7a9a;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    display: block;
    margin-bottom: 0.4rem;
  }

  .auth-input {
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
    transition: border-color 0.2s;
    margin-bottom: 1.2rem;
  }

  .auth-input:focus {
    border-color: #647FBC;
  }

  .auth-btn {
    width: 100%;
    background: #647FBC;
    color: #FAFDD6;
    border: none;
    border-radius: 10px;
    padding: 13px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    letter-spacing: 0.02em;
    transition: background 0.2s;
    margin-top: 0.4rem;
  }

  .auth-btn:hover { background: #5470a8; }

  .auth-footer {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.85rem;
    color: #8a95ad;
    font-weight: 300;
  }

  .auth-link {
    color: #647FBC;
    cursor: pointer;
    font-weight: 500;
    margin-left: 4px;
  }

  .auth-aside {
    flex: 1;
    background: #647FBC;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 4rem;
  }

  .auth-aside-headline {
    font-family: 'DM Serif Display', serif;
    font-size: 2.4rem;
    color: #FAFDD6;
    text-align: center;
    line-height: 1.25;
    margin-bottom: 1.2rem;
    max-width: 320px;
  }

  .auth-aside-sub {
    color: rgba(250,253,214,0.7);
    text-align: center;
    font-size: 0.95rem;
    font-weight: 300;
    max-width: 280px;
    line-height: 1.7;
  }

  .auth-dots {
    display: flex;
    gap: 8px;
    margin-top: 3rem;
  }

  .auth-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(250,253,214,0.3);
  }

  .auth-dot.active { background: #FAFDD6; }

  @media (max-width: 700px) {
    .auth-aside { display: none; }
    .auth-panel { width: 100%; border: none; }
  }
`;

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/token/", { username, password });
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      navigate("/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-root">
      <style>{styles}</style>

      <div className="auth-panel">
        <span className="auth-brand">PrepFlow</span>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to continue your interview prep.</p>

        <label className="auth-label">Username</label>
        <input
          type="text"
          className="auth-input"
          placeholder="your username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="auth-label">Password</label>
        <input
          type="password"
          className="auth-input"
          placeholder="••••••••"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} className="auth-btn">
          Sign in
        </button>

        <p className="auth-footer">
          Don't have an account?
          <span className="auth-link" onClick={() => navigate("/register")}>
            Create one
          </span>
        </p>
      </div>

      <div className="auth-aside">
        <h2 className="auth-aside-headline">
          Ace your next interview with AI
        </h2>
        <p className="auth-aside-sub">
          Practice with realistic questions, get instant feedback, and track your progress over time.
        </p>
        <div className="auth-dots">
          <div className="auth-dot active" />
          <div className="auth-dot" />
          <div className="auth-dot" />
        </div>
      </div>
    </div>
  );
}

export default Login;