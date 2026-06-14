import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async () => {
    setLoading(true);
    setError("");
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#111", border: "1px solid #222", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "400px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "8px", fontSize: "24px", fontWeight: "800" }}>Welcome to FlickzClips</h2>
        <p style={{ textAlign: "center", color: "#888", marginBottom: "32px", fontSize: "14px" }}>
          {isSignUp ? "Create your free account" : "Sign in to continue"}
        </p>

        {error && (
          <div style={{ padding: "10px", background: "#3a1a1a", borderRadius: "8px", color: "#f87171", fontSize: "13px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "12px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "12px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "14px", marginBottom: "20px", boxSizing: "border-box" }}
        />

        <button
          onClick={handleEmailAuth}
          disabled={loading}
          style={{ width: "100%", padding: "12px", background: "#a855f7", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "15px", fontWeight: "bold", marginBottom: "12px" }}
        >
          {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
        </button>

        <div style={{ textAlign: "center", color: "#555", fontSize: "13px", marginBottom: "12px" }}>or</div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          style={{ width: "100%", padding: "12px", background: "#fff", border: "none", borderRadius: "8px", color: "#000", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}
        >
          G &nbsp; Continue with Google
        </button>

        <p style={{ textAlign: "center", color: "#555", fontSize: "13px", marginTop: "24px" }}>
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <span onClick={() => setIsSignUp(!isSignUp)} style={{ color: "#a855f7", cursor: "pointer" }}>
            {isSignUp ? "Sign in" : "Sign up free"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;