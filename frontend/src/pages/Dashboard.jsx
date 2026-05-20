
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

.pf-root {
  min-height: 100vh;
  background:
    radial-gradient(circle at top right, rgba(200,155,94,0.08), transparent 30%),
    linear-gradient(180deg, #0B0B0C 0%, #111214 100%);
  color:#F5F1EA;
  font-family: 'Inter', sans-serif;
}

.pf-nav {
  height:80px;
  padding:0 4rem;
  display:flex;
  align-items:center;
  justify-content:space-between;
  border-bottom:1px solid rgba(200,155,94,0.12);
  background:rgba(0,0,0,0.35);
  backdrop-filter: blur(12px);
}

.pf-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size:2rem;
  color:#E8D4B0;
  letter-spacing:0.08em;
}

.pf-logout {
  border:none;
  background:linear-gradient(135deg,#C89B5E,#E0B97B);
  color:#111;
  padding:12px 24px;
  border-radius:999px;
  font-weight:600;
  cursor:pointer;
}

.pf-body {
  max-width:1280px;
  margin:auto;
  padding:3rem;
}

.pf-hero {
  display:grid;
  grid-template-columns:1.1fr 0.9fr;
  gap:2rem;
  align-items:center;
  margin-bottom:3rem;
}

.pf-greeting {
  color:#C89B5E;
  letter-spacing:0.2em;
  text-transform:uppercase;
  margin-bottom:1rem;
  font-size:0.8rem;
}

.pf-headline {
  font-family: 'Cormorant Garamond', serif;
  font-size:5rem;
  line-height:0.95;
  margin:0;
  color:#F5F1EA;
}

.pf-subline {
  color:#9D968C;
  margin-top:1.5rem;
  line-height:1.8;
  max-width:540px;
}

.pf-primary-btn {
  margin-top:2rem;
  background:linear-gradient(135deg,#C89B5E,#E0B97B);
  border:none;
  color:#111;
  padding:14px 28px;
  border-radius:999px;
  font-weight:600;
  cursor:pointer;
}

.pf-hero-image {
  height:560px;
  border-radius:30px;
  overflow:hidden;
  position:relative;
  border:1px solid rgba(200,155,94,0.15);
}

.pf-hero-image img {
  width:100%;
  height:100%;
  object-fit:cover;
}

.pf-overlay {
  position:absolute;
  inset:0;
  background:linear-gradient(to top, rgba(0,0,0,0.55), transparent);
}

.pf-cards {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:1.5rem;
}

.pf-card {
  background: rgba(18,18,20,0.88);
  border:1px solid rgba(200,155,94,0.14);
  border-radius:28px;
  padding:2rem;
  cursor:pointer;
  transition:all .28s ease;
}

.pf-card:hover {
  transform:translateY(-4px);
  border-color:rgba(200,155,94,0.4);
}

.pf-card-title {
  font-family: 'Cormorant Garamond', serif;
  font-size:2rem;
  margin-bottom:1rem;
}

.pf-card-desc {
  color:#9D968C;
  line-height:1.7;
}

@media(max-width:900px){
  .pf-hero{
    grid-template-columns:1fr;
  }

  .pf-headline{
    font-size:3.5rem;
  }

  .pf-cards{
    grid-template-columns:1fr;
  }

  .pf-nav{
    padding:0 1.5rem;
  }

  .pf-body{
    padding:1.5rem;
  }
}
`;

function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
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

        <div className="pf-hero">

          <div>
            <p className="pf-greeting">AI Interview Studio</p>

            <h1 className="pf-headline">
              Master modern interviews with confidence.
            </h1>

            <p className="pf-subline">
              Practice realistic AI-driven interviews, receive intelligent feedback,
              and elevate your communication with an interactive experience.
            </p>

            <button
              className="pf-primary-btn"
              onClick={() => navigate('/start')}
            >
              Start Interview
            </button>
          </div>

          <div className="pf-hero-image">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
              alt="AI Interview Workspace"
            />
            <div className="pf-overlay" />
          </div>

        </div>

        <div className="pf-cards">

          <div
            className="pf-card"
            onClick={() => navigate('/start')}
          >
            <div className="pf-card-title">Start Session</div>
            <div className="pf-card-desc">
              Begin an immersive AI interview tailored to your role and difficulty.
            </div>
          </div>

          <div
            className="pf-card"
            onClick={() => navigate('/history')}
          >
            <div className="pf-card-title">Interview History</div>
            <div className="pf-card-desc">
              Review past sessions, feedback reports, and performance growth.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;

