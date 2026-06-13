import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clips, setClips] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!youtubeUrl && !file) {
      setError("Please enter a YouTube URL or upload a video file.");
      return;
    }
    setLoading(true);
    setError("");
    setClips([]);
    try {
      const formData = new FormData();
      if (youtubeUrl) formData.append("youtube_url", youtubeUrl);
      if (file) formData.append("file", file);
      const response = await axios.post("https://proudly-subject-customers-travelers.trycloudflare.com/process", formData);
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setClips(response.data.clips);
      }
    } catch (err) {
      setError("Something went wrong. Make sure the backend is running.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "#fff", fontFamily: "sans-serif" }}>
      <div style={{ background: "#1a1a1a", padding: "20px 40px", borderBottom: "1px solid #333" }}>
        <h1 style={{ margin: 0, fontSize: "24px", color: "#a855f7" }}>ViralClips AI</h1>
        <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>Turn long videos into viral short clips using AI</p>
      </div>

      <div style={{ maxWidth: "700px", margin: "60px auto", padding: "0 20px" }}>
        <div style={{ background: "#1a1a1a", borderRadius: "12px", padding: "32px", border: "1px solid #333" }}>
          <h2 style={{ marginTop: 0, fontSize: "20px" }}>Paste a YouTube link</h2>
          <input
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #444",
              background: "#2a2a2a",
              color: "#fff",
              fontSize: "14px",
              boxSizing: "border-box"
            }}
          />

          <div style={{ textAlign: "center", margin: "20px 0", color: "#666" }}>or upload a video</div>

          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ color: "#aaa", fontSize: "14px" }}
          />

          {error && (
            <div style={{ marginTop: "16px", padding: "12px", background: "#3a1a1a", borderRadius: "8px", color: "#f87171", fontSize: "14px" }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              marginTop: "24px",
              width: "100%",
              padding: "14px",
              background: loading ? "#555" : "#a855f7",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold"
            }}
          >
            {loading ? "Processing... this may take a few minutes" : "Generate Viral Clips"}
          </button>
        </div>

        {clips.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <h2>Your Viral Clips</h2>
            {clips.map((clip) => (
              <div
                key={clip.clip_number}
                style={{
                  background: "#1a1a1a",
                  borderRadius: "12px",
                  padding: "24px",
                  marginBottom: "16px",
                  border: "1px solid #333"
                }}
              >
                <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>
                  Clip {clip.clip_number}
                </div>
                <div style={{ color: "#aaa", fontSize: "14px", marginBottom: "16px" }}>
                  {clip.reason}
                </div>
                <a
                href={"https://proudly-subject-customers-travelers.trycloudflare.com" + clip.download_url}
                download
                style={{
                display: "inline-block",
                padding: "10px 20px",
                background: "#a855f7",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "bold"
                }}
                  >
  Download Clip {clip.clip_number}
</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;