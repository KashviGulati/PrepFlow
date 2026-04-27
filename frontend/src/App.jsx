import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import StartInterview from "./pages/StartInterview";
import InterviewRoom from "./pages/InterviewRoom";
import Summary from "./pages/Summary";
import History from "./pages/History";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/start"
          element={
            <ProtectedRoute>
              <StartInterview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview/:sessionId"
          element={
            <ProtectedRoute>
              <InterviewRoom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/summary/:sessionId"
          element={
            <ProtectedRoute>
              <Summary />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;