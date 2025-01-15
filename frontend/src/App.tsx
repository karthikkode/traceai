import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import TraceBuilder from "./traces/CreateTrace";
import TraceEditPage from "./traces/TraceEdit";
import AllTraces from "./traces/AllTraces";
import Setup from "./setup/Setup";
import TraceFunnel from "./traces/ViewTrace";
import PaymentSetup from "./payment/Setup";

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
        <Route path="/setup" element={<Setup />} />
        <Route path="/payment/setup" element={<PaymentSetup />} />
        <Route
          path="/trace/funnel/viewTrace/:traceId"
          element={<TraceFunnel />}
        />
      </Routes>
    </Router>
  );
}

export default App;
