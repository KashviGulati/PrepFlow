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

  .auth-input:focus { border-color: #647FBC; }

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
    background: #AED6CF;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 4rem;
  }

  .auth-aside-headline {
    font-family: 'DM Serif Display', serif;
    font-size: 2.4rem;
    color: #2e3a5c;
    text-align: center;
    line-height: 1.25;
    margin-bottom: 1.2rem;
    max-width: 320px;
  }

  .auth-aside-sub {
    color: rgba(46,58,92,0.65);
    text-align: center;
    font-size: 0.95rem;
    font-weight: 300;
    max-width: 280px;
    line-height: 1.7;
  }

  .auth-steps {
    margin-top: 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 260px;
  }

  .auth-step {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .auth-step-num {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(46,58,92,0.15);
    color: #2e3a5c;
    font-size: 0.8rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .auth-step-text {
    font-size: 0.88rem;
    color: #2e3a5c;
    font-weight: 300;
  }

  @media (max-width: 700px) {
    .auth-aside { display: none; }
    .auth-panel { width: 100%; border: none; }
  }
`;

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await api.post("/users/register/", { username, email, password });
      alert("Registration successful");
      navigate("/");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-root">
      <style>{styles}</style>

      <div className="auth-panel">
        <span className="auth-brand">PrepFlow</span>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Start your interview prep journey today.</p>

        <label className="auth-label">Username</label>
        <input
          type="text"
          className="auth-input"
          placeholder="your username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="auth-label">Email</label>
        <input
          type="email"
          className="auth-input"
          placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="auth-label">Password</label>
        <input
          type="password"
          className="auth-input"
          placeholder="••••••••"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleRegister} className="auth-btn">
          Create account
        </button>

        <p className="auth-footer">
          Already have an account?
          <span className="auth-link" onClick={() => navigate("/")}>
            Sign in
          </span>
        </p>
      </div>

      <div className="auth-aside">
        <h2 className="auth-aside-headline">
          Get interview-ready in three steps
        </h2>
        <p className="auth-aside-sub">
          Our AI adapts to your domain and helps you improve with every session.
        </p>
        <div className="auth-steps">
          <div className="auth-step">
            <div className="auth-step-num">1</div>
            <span className="auth-step-text">Create your free account</span>
          </div>
          <div className="auth-step">
            <div className="auth-step-num">2</div>
            <span className="auth-step-text">Pick your domain and start a session</span>
          </div>
          <div className="auth-step">
            <div className="auth-step-num">3</div>
            <span className="auth-step-text">Review scores and improve over time</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;