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

.si-root{
  min-height:100vh;
  position:relative;
  overflow:hidden;
  font-family:'Inter', sans-serif;
  color:#F5F1EA;
  background:
    linear-gradient(135deg,#16181C 0%, #1D2025 45%, #181A1F 100%);
}

/* animated background glow */

.si-root::before,
.si-root::after{
  content:'';
  position:absolute;
  width:700px;
  height:700px;
  border-radius:50%;
  filter:blur(120px);
  opacity:0.22;
  z-index:0;
  animation:floatBlob 18s ease-in-out infinite;
}

.si-root::before{
  background:#D4A86A;
  top:-250px;
  right:-150px;
}

.si-root::after{
  background:#5B7CFA;
  bottom:-300px;
  left:-200px;
  animation-delay:6s;
}

@keyframes floatBlob{

  0%{
    transform:translate(0,0) scale(1);
  }

  25%{
    transform:translate(-40px,40px) scale(1.08);
  }

  50%{
    transform:translate(30px,-20px) scale(0.95);
  }

  75%{
    transform:translate(-20px,-40px) scale(1.04);
  }

  100%{
    transform:translate(0,0) scale(1);
  }

}

.si-nav,
.si-body{
  position:relative;
  z-index:2;
}

.si-nav{
  height:80px;
  padding:0 4rem;
  display:flex;
  align-items:center;
  border-bottom:1px solid rgba(200,155,94,0.12);
  background:rgba(0,0,0,0.35);
  backdrop-filter:blur(12px);
}

.si-logo{
  font-family:'Cormorant Garamond', serif;
  font-size:2rem;
  color:#E8D4B0;
  letter-spacing:0.08em;
}

.si-body{
  max-width:720px;
  margin:auto;
  padding:3rem 1.5rem 5rem;
}

.si-back{
  background:none;
  border:none;
  color:#C89B5E;
  cursor:pointer;
  margin-bottom:2rem;
  font-size:0.95rem;
}

.si-title{
  font-family:'Cormorant Garamond', serif;
  font-size:4.5rem;
  line-height:0.95;
  margin:0;
  color:#F5F1EA;
}

.si-sub{
  margin-top:1rem;
  color:#9D968C;
  line-height:1.8;
  margin-bottom:2.5rem;
}

.si-card{
  background:rgba(18,18,20,0.88);
  border:1px solid rgba(200,155,94,0.14);
  border-radius:28px;
  padding:2.5rem;
  backdrop-filter:blur(12px);
  box-shadow:
    0 10px 40px rgba(0,0,0,0.45),
    0 0 0 1px rgba(255,255,255,0.02) inset;
}

.si-label{
  display:block;
  margin-bottom:1rem;
  color:#C89B5E;
  font-size:0.78rem;
  letter-spacing:0.18em;
  text-transform:uppercase;
}

.si-mode-grid,
.si-domains,
.si-difficulty-grid{
  display:grid;
  gap:1rem;
  margin-bottom:2rem;
}

.si-mode-grid{
  grid-template-columns:1fr 1fr;
}

.si-domains{
  grid-template-columns:1fr 1fr;
}

.si-difficulty-grid{
  grid-template-columns:1fr 1fr 1fr;
}

.si-domain-chip{
  border:none;
  background:#121214;
  border:1px solid rgba(200,155,94,0.14);
  color:#D6CEC2;
  padding:14px;
  border-radius:18px;
  cursor:pointer;
  transition:all .25s ease;
  font-size:0.92rem;
}

.si-domain-chip:hover{
  border-color:rgba(200,155,94,0.4);
  transform:translateY(-2px);
}

.si-domain-chip.active{
  background:linear-gradient(135deg,#C89B5E,#E0B97B);
  color:#111;
  font-weight:600;
}

.si-custom-input,
.si-select{
  width:100%;
  background:#111214;
  border:1px solid rgba(200,155,94,0.15);
  color:#F5F1EA;
  padding:14px 16px;
  border-radius:16px;
  outline:none;
  margin-bottom:2rem;
  font-size:0.95rem;
}

.si-custom-input:focus,
.si-select:focus{
  border-color:#C89B5E;
  box-shadow:0 0 0 4px rgba(200,155,94,0.08);
}

.si-divider{
  height:1px;
  background:rgba(200,155,94,0.08);
  margin-bottom:2rem;
}

.si-btn{
  width:100%;
  border:none;
  padding:16px;
  border-radius:999px;
  background:linear-gradient(135deg,#C89B5E,#E0B97B);
  color:#111;
  font-size:1rem;
  font-weight:600;
  cursor:pointer;
  margin-top:1rem;
  transition:all .25s ease;
}

.si-btn:hover{
  transform:translateY(-2px);
}

@media(max-width:768px){

  .si-title{
    font-size:3rem;
  }

  .si-mode-grid,
  .si-domains,
  .si-difficulty-grid{
    grid-template-columns:1fr;
  }

  .si-nav{
    padding:0 1.5rem;
  }

}
`;

const DOMAINS = [
  { value: "software_engineer", label: "Software Engineer" },
  { value: "data_analyst", label: "Data Analyst" },
  { value: "machine_learning", label: "Machine Learning" },
  { value: "custom", label: "Custom Role" },
];

function StartInterview() {

  const navigate = useNavigate();

  const [interviewMode, setInterviewMode] = useState("domain");
  const [domain, setDomain] = useState("software_engineer");
  const [customDomain, setCustomDomain] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [difficulty, setDifficulty] = useState("beginner");

  const startInterview = async () => {

    try {

      let uploadedResumeId = null;

      if (interviewMode === "resume") {

        if (!resumeFile) {
          alert("Please upload a resume");
          return;
        }

        const formData = new FormData();

        formData.append("file", resumeFile);

        const uploadResponse = await api.post(
          "/resume/upload/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        uploadedResumeId = uploadResponse.data.id;
      }

      const payload = {
        difficulty_mode: difficulty,
      };

      if (interviewMode === "domain") {

        payload.domain =
          domain === "custom"
            ? customDomain
            : domain;

        if (!payload.domain) {
          alert("Please enter a custom role");
          return;
        }
      }

      if (interviewMode === "resume") {
        payload.resume_id = uploadedResumeId;
      }

      const response = await api.post(
        "/interview/start/",
        payload
      );

      navigate(
        `/interview/${response.data.session_id}`
      );

    } catch (error) {

      console.log(error);
      alert("Failed to start interview");
    }
  };

  return (
    <div className="si-root">

      <style>{styles}</style>

      <nav className="si-nav">
        <span className="si-logo">
          PrepFlow
        </span>
      </nav>

      <div className="si-body">

        <button
          className="si-back"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

        <h1 className="si-title">
          Start Interview
        </h1>

        <p className="si-sub">
          Choose your interview setup and begin practicing.
        </p>

        <div className="si-card">

          <label className="si-label">
            Interview Type
          </label>

          <div className="si-mode-grid">

            <button
              className={`si-domain-chip ${
                interviewMode === "domain"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setInterviewMode("domain")
              }
            >
              Domain Based
            </button>

            <button
              className={`si-domain-chip ${
                interviewMode === "resume"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setInterviewMode("resume")
              }
            >
              Resume Based
            </button>

          </div>

          <div className="si-divider" />

          {interviewMode === "domain" && (
            <>
              <label className="si-label">
                Domain
              </label>

              <div className="si-domains">

                {DOMAINS.map((d) => (

                  <button
                    key={d.value}
                    className={`si-domain-chip ${
                      domain === d.value
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setDomain(d.value)
                    }
                  >
                    {d.label}
                  </button>

                ))}

              </div>

              {domain === "custom" && (

                <input
                  type="text"
                  placeholder="e.g. Full Stack Developer"
                  className="si-custom-input"
                  value={customDomain}
                  onChange={(e) =>
                    setCustomDomain(
                      e.target.value
                    )
                  }
                />

              )}
            </>
          )}

          {interviewMode === "resume" && (
            <>
              <label className="si-label">
                Upload Resume
              </label>

              <input
                type="file"
                accept=".pdf"
                className="si-select"
                onChange={(e) =>
                  setResumeFile(
                    e.target.files[0]
                  )
                }
              />
            </>
          )}

          <label className="si-label">
            Difficulty Level
          </label>

          <div className="si-difficulty-grid">

            <button
              className={`si-domain-chip ${
                difficulty === "beginner"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setDifficulty("beginner")
              }
            >
              Beginner
            </button>

            <button
              className={`si-domain-chip ${
                difficulty === "intermediate"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setDifficulty("intermediate")
              }
            >
              Intermediate
            </button>

            <button
              className={`si-domain-chip ${
                difficulty === "advanced"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setDifficulty("advanced")
              }
            >
              Advanced
            </button>

          </div>

          <button
            onClick={startInterview}
            className="si-btn"
          >
            Start Interview
          </button>

        </div>
      </div>
    </div>
  );
}

export default StartInterview;