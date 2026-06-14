import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#111", border: "1px solid #222", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "400px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "8px", fontSize: "24px", fontWeight: "800" }}>Welcome to FlickzClips</h2>
        <p style={{ textAlign: "center", color: "#888", marginBottom: "32px", fontSize: "14px" }}>Sign in to start creating viral clips</p>

        <input type="email" placeholder="Email address" style={{ width: "100%", padding: "12px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box" }} />
        <input type="password" placeholder="Password" style={{ width: "100%", padding: "12px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "14px", marginBottom: "20px", boxSizing: "border-box" }} />

        <button onClick={() => navigate("/dashboard")} style={{ width: "100%", padding: "12px", background: "#a855f7", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "15px", fontWeight: "bold", marginBottom: "12px" }}>
          Sign In
        </button>

        <div style={{ textAlign: "center", color: "#555", fontSize: "13px", marginBottom: "12px" }}>or</div>

        <button onClick={() => navigate("/dashboard")} style={{ width: "100%", padding: "12px", background: "#fff", border: "none", borderRadius: "8px", color: "#000", cursor: "pointer", fontSize: "14px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <span>G</span> Continue with Google
        </button>

        <p style={{ textAlign: "center", color: "#555", fontSize: "13px", marginTop: "24px" }}>
          Don't have an account? <span onClick={() => navigate("/login")} style={{ color: "#a855f7", cursor: "pointer" }}>Sign up free</span>
        </p>
      </div>
    </div>
  );
}

export default Login;