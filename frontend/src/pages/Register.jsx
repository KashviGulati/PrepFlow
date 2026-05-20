import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

*{
  box-sizing:border-box;
}

body{
  margin:0;
  background:#0B0B0C;
}

.auth-root{
  min-height:100vh;
  display:flex;
  background:
    radial-gradient(circle at top right, rgba(200,155,94,0.08), transparent 30%),
    linear-gradient(180deg, #0B0B0C 0%, #111214 100%);
  font-family:'Inter', sans-serif;
}

.auth-panel{
  width:480px;
  padding:4rem;
  display:flex;
  flex-direction:column;
  justify-content:center;
  background:rgba(10,10,10,0.78);
  backdrop-filter:blur(16px);
  border-right:1px solid rgba(200,155,94,0.12);
}

.auth-brand{
  font-family:'Cormorant Garamond', serif;
  font-size:2rem;
  color:#E8D4B0;
  margin-bottom:3rem;
}

.auth-title{
  font-family:'Cormorant Garamond', serif;
  font-size:4rem;
  line-height:0.95;
  color:#F5F1EA;
  margin:0;
}

.auth-sub{
  margin-top:1rem;
  color:#9D968C;
  line-height:1.8;
  margin-bottom:2.5rem;
}

.auth-label{
  color:#C89B5E;
  font-size:0.75rem;
  text-transform:uppercase;
  letter-spacing:0.15em;
  margin-bottom:0.6rem;
}

.auth-input{
  width:100%;
  background:#111214;
  border:1px solid rgba(200,155,94,0.15);
  color:#F5F1EA;
  padding:14px 16px;
  border-radius:16px;
  outline:none;
  margin-bottom:1.4rem;
  font-size:0.95rem;
}

.auth-input:focus{
  border-color:#C89B5E;
  box-shadow:0 0 0 4px rgba(200,155,94,0.08);
}

.auth-btn{
  width:100%;
  border:none;
  padding:15px;
  border-radius:999px;
  background:linear-gradient(135deg,#C89B5E,#E0B97B);
  color:#111;
  font-weight:600;
  font-size:1rem;
  cursor:pointer;
  margin-top:1rem;
}

.auth-footer{
  margin-top:1.8rem;
  color:#9D968C;
}

.auth-link{
  color:#E8D4B0;
  cursor:pointer;
  margin-left:6px;
}

.auth-aside{
  flex:1;
  position:relative;
  overflow:hidden;
}

.auth-aside img{
  width:100%;
  height:100%;
  object-fit:cover;
}

.auth-overlay{
  position:absolute;
  inset:0;
  background:
    linear-gradient(to top, rgba(0,0,0,0.7), transparent),
    linear-gradient(to right, rgba(0,0,0,0.55), transparent);
}

.auth-content{
  position:absolute;
  bottom:80px;
  left:60px;
  max-width:500px;
  z-index:2;
}

.auth-content h2{
  font-family:'Cormorant Garamond', serif;
  font-size:4rem;
  line-height:1;
  color:#F5F1EA;
  margin:0;
}

.auth-content p{
  margin-top:1rem;
  color:#D6CEC2;
  line-height:1.8;
}

@media(max-width:900px){

  .auth-root{
    flex-direction:column;
  }

  .auth-panel{
    width:100%;
  }

  .auth-aside{
    height:400px;
  }

  .auth-title{
    font-size:3rem;
  }

}
`;

function Register() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    try {

      await api.post("/users/register/", {
        username,
        email,
        password,
      });

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

        <span className="auth-brand">
          PrepFlow
        </span>

        <h1 className="auth-title">
          Create account
        </h1>

        <p className="auth-sub">
          Begin your AI interview preparation experience.
        </p>

        <label className="auth-label">
          Username
        </label>

        <input
          type="text"
          className="auth-input"
          placeholder="your username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="auth-label">
          Email
        </label>

        <input
          type="email"
          className="auth-input"
          placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="auth-label">
          Password
        </label>

        <input
          type="password"
          className="auth-input"
          placeholder="••••••••"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="auth-btn"
        >
          Create Account
        </button>

        <p className="auth-footer">
          Already have an account?
          <span
            className="auth-link"
            onClick={() => navigate("/")}
          >
            Sign in
          </span>
        </p>

      </div>

      <div className="auth-aside">

        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop"
          alt="AI Workspace"
        />

        <div className="auth-overlay" />

        <div className="auth-content">

          <h2>
            Prepare for the future of interviews.
          </h2>

          <p>
            Realistic AI conversations, intelligent scoring,
            and premium feedback systems designed to sharpen your confidence.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;