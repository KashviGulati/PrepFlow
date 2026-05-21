import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body { background: #0E0F14; }

.ir-root {
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  color: #F0EDE8;
  background: #0E0F14;
  position: relative;
  overflow-x: hidden;
}

/* ── Background ── */
.ir-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 70% 55% at 75% 5%,  rgba(100, 90, 200, 0.16) 0%, transparent 60%),
    radial-gradient(ellipse 55% 45% at 15% 85%, rgba(210, 160, 90, 0.13) 0%, transparent 55%),
    radial-gradient(ellipse 45% 35% at 85% 70%, rgba(60, 160, 180, 0.09) 0%, transparent 50%),
    linear-gradient(160deg, #0E0F14 0%, #12141C 50%, #0F1018 100%);
}
.ir-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 180px;
  opacity: 0.5;
  pointer-events: none;
}

/* ── Nav ── */
.ir-nav {
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

.ir-logo {
  font-family: 'Playfair Display', serif;
  font-size: 1.7rem;
  color: #E8D4B0;
  letter-spacing: 0.06em;
}

.ir-nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ir-session-pill {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 999px;
  padding: 5px 14px;
  font-size: 0.75rem;
  color: #6B6880;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.ir-end-btn {
  background: rgba(200,80,80,0.08);
  border: 1px solid rgba(200,80,80,0.22);
  color: #D4857A;
  padding: 8px 18px;
  border-radius: 999px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.04em;
}
.ir-end-btn:hover {
  background: rgba(200,80,80,0.14);
  border-color: rgba(200,80,80,0.4);
  color: #E8A09A;
}

/* ── Body ── */
.ir-body {
  position: relative;
  z-index: 2;
  max-width: 740px;
  margin: 0 auto;
  padding: 3.5rem 2rem 6rem;
}

/* ── Progress ── */
.ir-progress-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 3rem;
  animation: fadeUp 0.5s ease both;
}

.ir-progress-bar {
  flex: 1;
  height: 3px;
  background: rgba(255,255,255,0.06);
  border-radius: 999px;
  overflow: hidden;
}

.ir-progress-fill {
  height: 100%;
  background: linear-gradient(to right, #C89B5E, #E0B97B);
  border-radius: 999px;
  width: 30%;
  box-shadow: 0 0 10px rgba(200,155,94,0.4);
  transition: width 0.6s ease;
}

.ir-progress-label {
  font-size: 0.75rem;
  color: #5A5670;
  white-space: nowrap;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ir-live-dot {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #8ECEBB;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.ir-live-dot::before {
  content: '';
  display: block;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #6B9E8A;
  box-shadow: 0 0 8px #6B9E8A;
  animation: pulse 1.8s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.7); }
}

/* ── Question card ── */
.ir-question-card {
  background: rgba(18, 18, 28, 0.8);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 28px;
  padding: 2.8rem;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(24px);
  box-shadow:
    0 1px 0 rgba(255,255,255,0.05) inset,
    0 24px 60px rgba(0,0,0,0.5),
    0 0 0 1px rgba(100,90,200,0.06);
  animation: fadeUp 0.5s 0.1s ease both;
}

/* decorative quote mark */
.ir-question-card::before {
  content: '"';
  position: absolute;
  top: -24px;
  right: 28px;
  font-family: 'Playfair Display', serif;
  font-size: 11rem;
  color: rgba(200,155,94,0.06);
  pointer-events: none;
  line-height: 1;
}

/* subtle top accent line */
.ir-question-card::after {
  content: '';
  position: absolute;
  top: 0; left: 10%; right: 10%;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(200,155,94,0.3), transparent);
}

.ir-q-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.72rem;
  font-weight: 500;
  color: #C89B5E;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  margin-bottom: 1.2rem;
}
.ir-q-label-icon {
  width: 20px; height: 20px;
  background: rgba(200,155,94,0.12);
  border: 1px solid rgba(200,155,94,0.2);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.65rem;
}

.ir-question-text {
  font-family: 'Playfair Display', serif;
  font-size: 1.65rem;
  color: #F5F1EA;
  line-height: 1.45;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.ir-q-hint {
  margin-top: 1.4rem;
  padding: 0.85rem 1.2rem;
  background: rgba(107,158,138,0.07);
  border: 1px solid rgba(107,158,138,0.15);
  border-radius: 12px;
  font-size: 0.82rem;
  color: #7ABFB0;
  line-height: 1.6;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.ir-q-hint-icon { flex-shrink: 0; margin-top: 1px; }

/* ── Answer card ── */
.ir-answer-card {
  background: rgba(18, 18, 28, 0.75);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 28px;
  padding: 2.2rem;
  backdrop-filter: blur(24px);
  box-shadow: 0 16px 50px rgba(0,0,0,0.4);
  animation: fadeUp 0.5s 0.2s ease both;
}

.ir-a-label {
  font-size: 0.72rem;
  font-weight: 500;
  color: #8C879E;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  margin-bottom: 1.4rem;
  display: block;
}

/* ── Voice visualiser ── */
.ir-voice-vis {
  height: 72px;
  border-radius: 16px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  overflow: hidden;
  position: relative;
}

.ir-voice-vis-idle {
  font-size: 0.8rem;
  color: #4A4660;
  letter-spacing: 0.08em;
}

.ir-bar {
  width: 3px;
  border-radius: 999px;
  background: linear-gradient(to top, #C89B5E, #E0B97B);
  animation: barBounce 0.8s ease-in-out infinite;
  transform-origin: bottom;
}
@keyframes barBounce {
  0%, 100% { transform: scaleY(0.15); opacity: 0.4; }
  50%       { transform: scaleY(1);    opacity: 1; }
}

/* ── Record status ── */
.ir-record-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.84rem;
  font-weight: 500;
  margin-bottom: 1.4rem;
  min-height: 24px;
}
.ir-status-recording { color: #E8988A; }
.ir-status-done      { color: #8ECEBB; }
.ir-status-idle      { color: #4A4660; }

/* ── Action buttons ── */
.ir-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.ir-btn {
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

.ir-btn-record {
  background: rgba(200,80,80,0.1);
  border: 1px solid rgba(200,80,80,0.25);
  color: #E8A09A;
}
.ir-btn-record:hover {
  background: rgba(200,80,80,0.16);
  border-color: rgba(200,80,80,0.45);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(200,80,80,0.12);
}
.ir-btn-record.recording {
  background: rgba(200,80,80,0.18);
  border-color: rgba(200,80,80,0.5);
  color: #F0A8A0;
  animation: recordPulse 1.5s ease-in-out infinite;
}
@keyframes recordPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(200,80,80,0.2); }
  50%       { box-shadow: 0 0 0 8px rgba(200,80,80,0); }
}

.ir-btn-submit {
  background: linear-gradient(135deg, #C89B5E, #E0B97B);
  color: #1A1408;
  box-shadow: 0 4px 20px rgba(200,155,94,0.25);
}
.ir-btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(200,155,94,0.38);
}
.ir-btn-submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

/* ── Eval tags ── */
.ir-eval-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 1.8rem;
  animation: fadeUp 0.5s 0.35s ease both;
}
.ir-tag {
  font-size: 0.72rem;
  color: #5A5670;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 999px;
  padding: 5px 12px;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

/* ── Loading ── */
.ir-loading {
  min-height: 100vh;
  background: #0E0F14;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  font-family: 'DM Sans', sans-serif;
}

.ir-spinner {
  width: 36px;
  height: 36px;
  border: 2px solid rgba(200,155,94,0.15);
  border-top-color: #C89B5E;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.ir-loading-text {
  color: #5A5670;
  font-size: 0.9rem;
  letter-spacing: 0.08em;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  .ir-nav { padding: 0 1.5rem; }
  .ir-body { padding: 2.5rem 1.2rem 5rem; }
  .ir-question-text { font-size: 1.35rem; }
  .ir-actions { grid-template-columns: 1fr; }
  .ir-session-pill { display: none; }
  .ir-question-card, .ir-answer-card { border-radius: 22px; padding: 1.8rem; }
}
`;

const BAR_HEIGHTS = [28, 44, 60, 52, 36, 68, 44, 32, 56, 40, 64, 48, 36, 52, 28];

function InterviewRoom() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [questionAudio, setQuestionAudio] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => { fetchCurrentQuestion(); }, []);

  useEffect(() => {
    if (questionAudio) {
      const audio = new Audio(
  `${import.meta.env.VITE_API_BASE_URL}${questionAudio}`
);
      audio.play();
    }
  }, [questionAudio]);

  const fetchCurrentQuestion = async () => {
    try {
      const response = await api.get(`/interview/current-question/${sessionId}/`);
      setQuestion(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load question");
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => { audioChunksRef.current.push(event.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
      };
      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.log(error);
      alert("Microphone permission denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const submitAnswer = async () => {
    try {
      setSubmitting(true);
      if (!audioBlob) { alert("Please record your answer"); setSubmitting(false); return; }
      const formData = new FormData();
      formData.append("question_id", question.id);
      formData.append("audio", audioBlob, "answer.webm");
      const response = await api.post("/interview/submit-audio-answer/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.interview_completed) { navigate(`/summary/${sessionId}`); return; }
      setQuestion(response.data.next_question);
      setQuestionAudio(response.data.audio_path);
      setAudioBlob(null);
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
        <p className="ir-loading-text">Preparing your interview...</p>
      </div>
    );
  }

  return (
    <div className="ir-root">
      <style>{styles}</style>
      <div className="ir-bg" />

      {/* Nav */}
      <nav className="ir-nav">
        <span className="ir-logo">PrepFlow</span>
        <div className="ir-nav-right">
          <span className="ir-session-pill">Live Session</span>
          <button className="ir-end-btn" onClick={() => navigate(`/summary/${sessionId}`)}>
            End Session
          </button>
        </div>
      </nav>

      <div className="ir-body">

        {/* Progress */}
        <div className="ir-progress-wrap">
          <div className="ir-live-dot">Live</div>
          <div className="ir-progress-bar">
            <div className="ir-progress-fill" />
          </div>
          <span className="ir-progress-label">In progress</span>
        </div>

        {/* Question */}
        <div className="ir-question-card">
          <p className="ir-q-label">
            <span className="ir-q-label-icon">Q</span>
            Interview Question
          </p>
          <p className="ir-question-text">{question?.question_text}</p>
          <div className="ir-q-hint">
            <span className="ir-q-hint-icon">💡</span>
            Take a moment to gather your thoughts before recording. Speak clearly and at a natural pace.
          </div>
        </div>

        {/* Answer */}
        <div className="ir-answer-card">
          <label className="ir-a-label">Your Voice Response</label>

          {/* Visual waveform */}
          <div className="ir-voice-vis">
            {recording ? (
              BAR_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  className="ir-bar"
                  style={{
                    height: `${h}px`,
                    animationDelay: `${(i * 0.08).toFixed(2)}s`,
                    animationDuration: `${0.6 + (i % 4) * 0.12}s`,
                  }}
                />
              ))
            ) : audioBlob ? (
              BAR_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  className="ir-bar"
                  style={{
                    height: `${h * 0.5}px`,
                    opacity: 0.35,
                    animation: 'none',
                  }}
                />
              ))
            ) : (
              <span className="ir-voice-vis-idle">
                🎙 Press record to begin your response
              </span>
            )}
          </div>

          {/* Status */}
          <div className="ir-record-status">
            {recording ? (
              <span className="ir-status-recording">● Recording in progress...</span>
            ) : audioBlob ? (
              <span className="ir-status-done">✓ Voice answer captured — ready to submit</span>
            ) : (
              <span className="ir-status-idle">No recording yet</span>
            )}
          </div>

          {/* Buttons */}
          <div className="ir-actions">
            <button
              className={`ir-btn ir-btn-record ${recording ? "recording" : ""}`}
              onClick={recording ? stopRecording : startRecording}
            >
              {recording ? "⏹ Stop Recording" : "🎤 Record Answer"}
            </button>
            <button
              className="ir-btn ir-btn-submit"
              onClick={submitAnswer}
              disabled={submitting || !audioBlob}
            >
              {submitting ? "Processing..." : "Submit Answer →"}
            </button>
          </div>
        </div>

        {/* Eval tags */}
        <div className="ir-eval-tags">
          {["Communication", "Clarity", "Vocabulary", "Pacing", "Filler Words", "Technical Relevance"].map((tag) => (
            <span key={tag} className="ir-tag">{tag}</span>
          ))}
        </div>

      </div>
    </div>
  );
}

export default InterviewRoom;