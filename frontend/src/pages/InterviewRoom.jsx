import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function InterviewRoom() {

  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {

    fetchQuestion();

  }, []);

  const fetchQuestion = async () => {

    try {

      const response = await api.post(
        "/interview/generate-question/",
        {
          session_id: sessionId,
        }
      );

      setQuestion(response.data);

    } catch (error) {

      console.log(error);

      alert("Failed to load question");

    } finally {

      setLoading(false);
    }
  };

  const submitAnswer = async () => {

    if (!answer.trim()) {

      alert("Please enter an answer");

      return;
    }

    try {

      setSubmitting(true);

      const response = await api.post(
        "/interview/interview-step/",
        {
          question_id: question.id,
          answer_text: answer,
        }
      );

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
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-semibold">
          Loading Interview...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">

        <h1 className="text-3xl font-bold mb-8">
          AI Interview
        </h1>

        <div className="mb-8">

          <h2 className="text-xl font-semibold mb-3">
            Question
          </h2>

          <p className="text-gray-700 leading-relaxed">
            {question?.question_text}
          </p>

        </div>

        <textarea
          className="border w-full p-4 rounded mb-6 resize-none"
          rows="6"
          placeholder="Type your answer here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        <button
          onClick={submitAnswer}
          disabled={submitting}
          className="bg-black text-white px-6 py-3 rounded hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Answer"}
        </button>
        <button
            onClick={() => navigate(`/summary/${sessionId}`)}
            className="ml-4 bg-red-500 text-white px-6 py-3 rounded hover:opacity-90"
            >
            End Interview
        </button>

      </div>
    </div>
  );
}

export default InterviewRoom;