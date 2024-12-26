import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import TraceBuilder from "./traces/CreateTrace";
import TraceEditPage from "./components/TraceEdit";
import AllTraces from "./traces/AllTraces";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createTrace"
          element={
            <ProtectedRoute>
              <TraceBuilder />
            </ProtectedRoute>
          }
        />
        <Route path="/trace/:traceId" element={<TraceEditPage />} />
        <Route path="/alltraces" element={<AllTraces />} />
      </Routes>
    </Router>
  );
}

export default App;
