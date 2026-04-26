import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-10">

          <h1 className="text-4xl font-bold">
            PrepFlow Dashboard
          </h1>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>

        </div>

        <div className="grid grid-cols-2 gap-6">

          <div
            onClick={() => navigate("/start")}
            className="bg-white p-8 rounded-xl shadow cursor-pointer hover:shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-2">
              Start Interview
            </h2>

            <p>
              Begin AI mock interview session
            </p>
          </div>

          <div
            className="bg-white p-8 rounded-xl shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">
              Past Interviews
            </h2>

            <p>
              View completed sessions
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;