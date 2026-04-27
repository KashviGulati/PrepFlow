import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  .ir-root {
    min-height: 100vh;
    background: #FAFDD6;
    font-family: 'DM Sans', sans-serif;
  }

  .ir-nav {
    background: #647FBC;
    padding: 0 3rem;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ir-logo {
    font-family: 'DM Serif Display', serif;
    font-size: 1.4rem;
    color: #FAFDD6;
  }

  .ir-nav-end {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .ir-end-btn {
    background: rgba(250,253,214,0.12);
    border: 1.5px solid rgba(250,253,214,0.35);
    color: #FAFDD6;
    padding: 7px 18px;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .ir-end-btn:hover {
    background: rgba(250,253,214,0.22);
  }

  .ir-body {
    max-width: 720px;
    margin: 0 auto;
    padding: 3.5rem 2rem;
  }

  .ir-progress-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 2.8rem;
  }

  .ir-progress-bar {
    flex: 1;
    height: 4px;
    background: rgba(100,127,188,0.15);
    border-radius: 100px;
    overflow: hidden;
  }

  .ir-progress-fill {
    height: 100%;
    background: #647FBC;
    border-radius: 100px;
    width: 30%;
    transition: width 0.4s ease;
  }

  .ir-progress-label {
    font-size: 0.8rem;
    color: #8a95ad;
    font-weight: 400;
    white-space: nowrap;
  }

  .ir-question-card {
    background: #647FBC;
    border-radius: 20px;
    padding: 2.5rem;
    margin-bottom: 1.5rem;
    position: relative;
    overflow: hidden;
  }

  .ir-question-card::before {
    content: '"';
    position: absolute;
    top: -10px;
    left: 20px;
    font-family: 'DM Serif Display', serif;
    font-size: 9rem;
    color: rgba(250,253,214,0.1);
    line-height: 1;
    pointer-events: none;
  }

  .ir-q-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: rgba(250,253,214,0.6);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 1rem;
  }

  .ir-question-text {
    font-family: 'DM Serif Display', serif;
    font-size: 1.5rem;
    color: #FAFDD6;
    line-height: 1.4;
    margin: 0;
  }

  .ir-answer-section {
    background: #fff;
    border: 1px solid rgba(100,127,188,0.15);
    border-radius: 20px;
    padding: 2rem;
  }

  .ir-a-label {
    font-size: 0.78rem;
    font-weight: 500;
    color: #6b7a9a;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-bottom: 0.8rem;
    display: block;
  }

  .ir-textarea {
    width: 100%;
    box-sizing: border-box;
    border: 1.5px solid rgba(100,127,188,0.2);
    border-radius: 12px;
    padding: 14px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    color: #2e3a5c;
    line-height: 1.65;
    resize: none;
    outline: none;
    transition: border-color 0.2s;
    background: #fafbff;
  }

  .ir-textarea:focus {
    border-color: #647FBC;
    background: #fff;
  }

  .ir-char-count {
    text-align: right;
    font-size: 0.78rem;
    color: #b0baca;
    margin-top: 0.4rem;
    margin-bottom: 1.4rem;
  }

  .ir-actions {
    display: flex;
    gap: 0.8rem;
  }

  .ir-submit-btn {
    flex: 1;
    background: #647FBC;
    color: #FAFDD6;
    border: none;
    border-radius: 10px;
    padding: 13px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, opacity 0.2s;
  }

  .ir-submit-btn:hover:not(:disabled) { background: #5470a8; }
  .ir-submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  .ir-loading {
    min-height: 100vh;
    background: #FAFDD6;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    font-family: 'DM Sans', sans-serif;
  }

  .ir-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid rgba(100,127,188,0.2);
    border-top-color: #647FBC;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .ir-loading-text {
    color: #6b7a9a;
    font-size: 0.95rem;
    font-weight: 300;
  }

  .ir-tip {
    margin-top: 1.5rem;
    padding: 0.9rem 1.2rem;
    background: rgba(174,214,207,0.25);
    border-left: 3px solid #AED6CF;
    border-radius: 0 10px 10px 0;
    font-size: 0.83rem;
    color: #4a7a74;
    font-weight: 300;
    line-height: 1.6;
  }
`;

function InterviewRoom() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchQuestion(); }, []);

  const fetchQuestion = async () => {
    try {
      const response = await api.post("/interview/generate-question/", { session_id: sessionId });
      setQuestion(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load question");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) { alert("Please enter an answer"); return; }
    try {
      setSubmitting(true);
      const response = await api.post("/interview/interview-step/", {
        question_id: question.id,
        answer_text: answer,
      });
      if (response.data.interview_completed) {
        navigate(`/summary/${sessionId}`);
        return;
      }
      setQuestion(response.data.next_question);
      setAnswer("");
    } catch (error) {
      console.log(error);
      alert("Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="ir-loading">
        <style>{styles}</style>
        <div className="ir-spinner" />
        <p className="ir-loading-text">Preparing your question...</p>
      </div>
    );
  }

  return (
    <div className="ir-root">
      <style>{styles}</style>

      <nav className="ir-nav">
        <span className="ir-logo">PrepFlow</span>
        <div className="ir-nav-end">
          <button
            className="ir-end-btn"
            onClick={() => navigate(`/summary/${sessionId}`)}
          >
            End session
          </button>
        </div>
      </nav>

      <div className="ir-body">
        <div className="ir-progress-wrap">
          <div className="ir-progress-bar">
            <div className="ir-progress-fill" />
          </div>
          <span className="ir-progress-label">In progress</span>
        </div>

        <div className="ir-question-card">
          <p className="ir-q-label">Question</p>
          <p className="ir-question-text">{question?.question_text}</p>
        </div>

        <div className="ir-answer-section">
          <label className="ir-a-label">Your Answer</label>
          <textarea
            className="ir-textarea"
            rows={7}
            placeholder="Type your answer here — be as detailed as you like..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <div className="ir-char-count">{answer.length} characters</div>

          <div className="ir-actions">
            <button
              onClick={submitAnswer}
              disabled={submitting}
              className="ir-submit-btn"
            >
              {submitting ? "Submitting..." : "Submit answer →"}
            </button>
          </div>
        </div>

        <div className="ir-tip">
          💡 Tip: Structure your answer clearly — explain your reasoning, give examples, and conclude with a summary.
        </div>
      </div>
    </div>
  );
}

export default InterviewRoom;