import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function History() {

  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    fetchHistory();

  }, []);

  const fetchHistory = async () => {

    try {

      const response = await api.get(
        "/interview/history/"
      );

      setSessions(response.data);

    } catch {

      alert("Failed to load history");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Past Interviews
        </h1>

        <div className="space-y-4">

          {sessions.map((session) => (

            <div
              key={session.id}
              className="bg-white p-6 rounded-xl shadow flex justify-between items-center"
            >

              <div>

                <p className="font-semibold">
                  {session.domain}
                </p>

                <p className="text-sm text-gray-500">
                  {session.started_at}
                </p>

              </div>

              <button
                onClick={() =>
                  navigate(`/summary/${session.id}`)
                }
                className="bg-black text-white px-4 py-2 rounded"
              >
                View Summary
              </button>

            </div>

          ))}

        </div>

      </div>
    </div>
  );
}

export default History;