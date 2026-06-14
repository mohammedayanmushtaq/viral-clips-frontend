import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Navbar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 60px", borderBottom: "1px solid #1f1f1f" }}>
        <div style={{ fontSize: "22px", fontWeight: "800", color: "#a855f7" }}>FlickzClips</div>
        <div style={{ display: "flex", gap: "32px", color: "#aaa", fontSize: "14px" }}>
          <span style={{ cursor: "pointer" }}>Features</span>
          <span style={{ cursor: "pointer" }}>Pricing</span>
          <span style={{ cursor: "pointer" }}>About</span>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => navigate("/login")} style={{ padding: "10px 20px", background: "transparent", border: "1px solid #444", borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "14px" }}>
            Log in
          </button>
          <button onClick={() => navigate("/login")} style={{ padding: "10px 20px", background: "#a855f7", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}>
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "100px 20px 60px" }}>
        <div style={{ display: "inline-block", background: "#1a1a2e", border: "1px solid #a855f7", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", color: "#a855f7", marginBottom: "24px" }}>
          AI-Powered Viral Clip Generator
        </div>
        <h1 style={{ fontSize: "64px", fontWeight: "900", lineHeight: "1.1", marginBottom: "24px", maxWidth: "800px", margin: "0 auto 24px" }}>
          Turn Long Videos Into
          <span style={{ color: "#a855f7" }}> Viral Clips</span>
        </h1>
        <p style={{ fontSize: "18px", color: "#888", maxWidth: "560px", margin: "0 auto 40px", lineHeight: "1.6" }}>
          Upload your video and our AI finds the best moments, cuts them perfectly, and adds captions — ready to post on Reels, Shorts, and TikTok.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
          <button onClick={() => navigate("/login")} style={{ padding: "16px 36px", background: "#a855f7", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}>
            Start For Free
          </button>
          <button style={{ padding: "16px 36px", background: "transparent", border: "1px solid #444", borderRadius: "10px", color: "#fff", cursor: "pointer", fontSize: "16px" }}>
            Watch Demo
          </button>
        </div>
        <p style={{ color: "#555", fontSize: "13px", marginTop: "16px" }}>3 free videos — no credit card required</p>
      </div>

      {/* Features */}
      <div style={{ padding: "80px 60px", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "36px", fontWeight: "800", marginBottom: "60px" }}>Everything you need to go viral</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {[
            { icon: "AI", title: "AI Clip Detection", desc: "Our AI analyzes your video and finds the most engaging moments automatically." },
            { icon: "CC", title: "Auto Captions", desc: "Burned-in captions make your clips more watchable and accessible." },
            { icon: "Fast", title: "Lightning Fast", desc: "Get your viral clips in minutes, not hours. Powered by Groq." },
          ].map((f) => (
            <div key={f.title} style={{ background: "#111", border: "1px solid #222", borderRadius: "16px", padding: "32px" }}>
              <div style={{ width: "48px", height: "48px", background: "#1a1a2e", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#a855f7", fontWeight: "bold", fontSize: "12px", marginBottom: "16px" }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div style={{ padding: "80px 60px", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "36px", fontWeight: "800", marginBottom: "16px" }}>Simple Pricing</h2>
        <p style={{ color: "#888", marginBottom: "48px" }}>Start free, upgrade when you're ready</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          
          {/* Free */}
          <div style={{ background: "#111", border: "1px solid #222", borderRadius: "16px", padding: "32px", textAlign: "left" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Free</h3>
            <div style={{ fontSize: "36px", fontWeight: "900", marginBottom: "24px" }}>₹0</div>
            {["3 free videos", "Up to 30 min video", "3 clips per video", "Auto captions"].map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "#aaa", fontSize: "14px" }}>
                <span style={{ color: "#a855f7" }}>✓</span> {f}
              </div>
            ))}
            <button onClick={() => navigate("/login")} style={{ width: "100%", padding: "12px", background: "transparent", border: "1px solid #444", borderRadius: "8px", color: "#fff", cursor: "pointer", marginTop: "24px", fontSize: "14px" }}>
              Get Started
            </button>
          </div>

          {/* Pro */}
          <div style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", border: "1px solid #a855f7", borderRadius: "16px", padding: "32px", textAlign: "left", position: "relative" }}>
            <div style={{ position: "absolute", top: "-12px", right: "24px", background: "#a855f7", borderRadius: "20px", padding: "4px 12px", fontSize: "12px", fontWeight: "bold" }}>POPULAR</div>
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Pro</h3>
            <div style={{ fontSize: "36px", fontWeight: "900", marginBottom: "24px" }}>₹299<span style={{ fontSize: "16px", color: "#888" }}>/mo</span></div>
            {["Unlimited videos", "Up to 3 hour video", "10 clips per video", "Auto captions", "Priority processing"].map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "#aaa", fontSize: "14px" }}>
                <span style={{ color: "#a855f7" }}>✓</span> {f}
              </div>
            ))}
            <button onClick={() => navigate("/login")} style={{ width: "100%", padding: "12px", background: "#a855f7", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", marginTop: "24px", fontSize: "14px", fontWeight: "bold" }}>
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #1f1f1f", padding: "32px 60px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#555", fontSize: "13px" }}>
        <div style={{ color: "#a855f7", fontWeight: "800", fontSize: "16px" }}>FlickzClips</div>
        <div>© 2026 FlickzClips. All rights reserved.</div>
      </div>
    </div>
  );
}

export default LandingPage;