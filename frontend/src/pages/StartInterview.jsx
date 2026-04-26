import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function StartInterview() {

  const navigate = useNavigate();

  const [domain, setDomain] = useState("software_engineer");
  const [resumeId, setResumeId] = useState("");

  const startInterview = async () => {

    try {

      const payload = {
        domain,
      };

      if (resumeId) {
        payload.resume_id = resumeId;
      }

      const response = await api.post(
        "/interview/start/",
        payload
      );

      const sessionId = response.data.id;

      navigate(`/interview/${sessionId}`);

    } catch {

      alert("Failed to start interview");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white p-8 rounded-xl shadow w-[500px]">

        <h1 className="text-3xl font-bold mb-6">
          Start Interview
        </h1>

        <label className="block mb-2">
          Select Domain
        </label>

        <select
          className="border w-full p-2 mb-4"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        >
          <option value="software_engineer">
            Software Engineer
          </option>

          <option value="data_analyst">
            Data Analyst
          </option>

          <option value="machine_learning">
            Machine Learning
          </option>
        </select>

        <label className="block mb-2">
          Resume ID (Optional)
        </label>

        <input
          type="text"
          placeholder="Resume ID"
          className="border w-full p-2 mb-6"
          value={resumeId}
          onChange={(e) => setResumeId(e.target.value)}
        />

        <button
          onClick={startInterview}
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          Start Interview
        </button>

      </div>
    </div>
  );
}

export default StartInterview;