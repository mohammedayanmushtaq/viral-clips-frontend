import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import LandingPage from "./LandingPage";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Terms from "./Terms";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "#a855f7", fontSize: "18px" }}>
      Loading...
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/terms" element={<Terms />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;