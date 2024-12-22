import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import TraceBuilder from "./traces/CreateTrace";
import Trace from "./components/Trace";

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
        <Route path="/test" element={<Trace />} />
      </Routes>
    </Router>
  );
}

export default App;
