import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function Summary() {

  const { sessionId } = useParams();

  const [summary, setSummary] = useState(null);

  useEffect(() => {

    fetchSummary();

  }, []);

  const fetchSummary = async () => {

    try {

      const response = await api.get(
        `/interview/summary/${sessionId}/`
      );

      setSummary(response.data);

    } catch {

      alert("Failed to load summary");
    }
  };

  if (!summary) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Summary...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">

        <h1 className="text-3xl font-bold mb-6">
          Interview Summary
        </h1>

        <p className="mb-2">
          Domain: {summary.domain}
        </p>

        <p className="mb-2">
          Questions Answered: {summary.questions_answered}
        </p>

        <p className="mb-2">
          Semantic Score: {summary.average_semantic_score}
        </p>

        <p className="mb-2">
          Confidence Score: {summary.average_confidence_score}
        </p>

        <p className="mb-2">
          Vocabulary Score: {summary.average_vocabulary_score}
        </p>

        <p className="mb-2">
          Technical Score: {summary.average_technical_score}
        </p>

      </div>
    </div>
  );
}

export default Summary;