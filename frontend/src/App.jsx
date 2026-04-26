import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import StartInterview from "./pages/StartInterview";
import InterviewRoom from "./pages/InterviewRoom";
import Summary from "./pages/Summary";


function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/start" element={<StartInterview />} />
        <Route path="/interview/:sessionId" element={<InterviewRoom />} />
        <Route path="/summary/:sessionId" element={<Summary />}/> 
      </Routes>

    </BrowserRouter>
  );
}

export default App;