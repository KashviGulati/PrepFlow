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

    <div className="max-w-4xl mx-auto">

      <div className="bg-white rounded-xl shadow p-8">

        <h1 className="text-4xl font-bold mb-8">
          Interview Report
        </h1>

        <div className="grid grid-cols-2 gap-6 mb-8">

          <div className="bg-gray-50 p-6 rounded-lg">

            <h3 className="text-gray-500 mb-2">
              Domain
            </h3>

            <p className="text-2xl font-bold">
              {summary.domain}
            </p>

          </div>

          <div className="bg-gray-50 p-6 rounded-lg">

            <h3 className="text-gray-500 mb-2">
              Questions Answered
            </h3>

            <p className="text-2xl font-bold">
              {summary.questions_answered}
            </p>

          </div>

        </div>

        <div className="space-y-4">

          <div className="bg-gray-50 p-4 rounded">

            <p className="font-semibold">
              Semantic Score
            </p>

            <p className="text-2xl">
              {summary.average_semantic_score}
            </p>

          </div>

          <div className="bg-gray-50 p-4 rounded">

            <p className="font-semibold">
              Confidence Score
            </p>

            <p className="text-2xl">
              {summary.average_confidence_score}
            </p>

          </div>

          <div className="bg-gray-50 p-4 rounded">

            <p className="font-semibold">
              Vocabulary Score
            </p>

            <p className="text-2xl">
              {summary.average_vocabulary_score}
            </p>

          </div>

          <div className="bg-gray-50 p-4 rounded">

            <p className="font-semibold">
              Technical Score
            </p>

            <p className="text-2xl">
              {summary.average_technical_score}
            </p>

          </div>

        </div>

      </div>

    </div>
  </div>
);
}

export default Summary;