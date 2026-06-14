import { useState } from "react";
import axios from "axios";

const BACKEND = "https://originally-awareness-concerns-scheme.trycloudflare.com";

function Dashboard() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clips, setClips] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!file) { setError("Please upload a video file."); return; }
    setLoading(true); setError(""); setClips([]);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(`${BACKEND}/process`, formData);
      if (response.data.error) { setError(response.data.error); }
      else { setClips(response.data.clips); }
    } catch (err) { setError("Something went wrong. Make sure the backend is running."); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      
      {/* Navbar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", borderBottom: "1px solid #1f1f1f" }}>
        <div style={{ fontSize: "20px", fontWeight: "800", color: "#a855f7" }}>FlickzClips</div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ background: "#1a1a2e", border: "1px solid #a855f7", borderRadius: "20px", padding: "4px 12px", fontSize: "12px", color: "#a855f7" }}>Free — 3 videos left</span>
          <div style={{ width: "36px", height: "36px", background: "#a855f7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>M</div>
        </div>
      </nav>

      <div style={{ maxWidth: "800px", margin: "60px auto", padding: "0 20px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "8px" }}>Create Viral Clips</h1>
        <p style={{ color: "#888", marginBottom: "40px" }}>Upload your video and AI will find the best moments</p>

        {/* Upload Box */}
        <div style={{ background: "#111", border: "2px dashed #333", borderRadius: "16px", padding: "60px 40px", textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>video</div>
          <p style={{ color: "#888", marginBottom: "20px" }}>Drop your video here or click to browse</p>
          <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} style={{ display: "none" }} id="fileInput" />
          <label htmlFor="fileInput" style={{ padding: "10px 24px", background: "#1a1a1a", border: "1px solid #444", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
            Choose File
          </label>
          {file && <p style={{ color: "#a855f7", marginTop: "12px", fontSize: "14px" }}>{file.name}</p>}
        </div>

        {error && <div style={{ padding: "12px", background: "#3a1a1a", borderRadius: "8px", color: "#f87171", fontSize: "14px", marginBottom: "16px" }}>{error}</div>}

        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "16px", background: loading ? "#555" : "#a855f7", border: "none", borderRadius: "10px", color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontSize: "16px", fontWeight: "bold" }}>
          {loading ? "Processing... please wait" : "Generate Viral Clips"}
        </button>

        {/* Results */}
        {clips.length > 0 && (
          <div style={{ marginTop: "48px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>Your Viral Clips</h2>
            {clips.map((clip) => (
              <div key={clip.clip_number} style={{ background: "#111", border: "1px solid #222", borderRadius: "12px", padding: "24px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: "700", marginBottom: "4px" }}>Clip {clip.clip_number}</div>
                  <div style={{ color: "#888", fontSize: "14px" }}>{clip.reason}</div>
                </div>
                <a href={`${BACKEND}${clip.download_url}`} download style={{ padding: "10px 20px", background: "#a855f7", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: "bold" }}>
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;