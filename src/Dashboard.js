import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import axios from "axios";
import Upgrade from "./Upgrade";

const BACKEND = "https://originally-awareness-concerns-scheme.trycloudflare.com";

const CAPTION_PRESETS = [
  { id: "none", label: "No caption", preview: null },
  { id: "karaoke", label: "Karaoke", preview: { text: "CLIPPING WITH AI", color: "#fff" } },
  { id: "beasty", label: "Beasty", preview: { text: "CHOOSE A STYLE", color: "#ff6600" } },
  { id: "mozi", label: "Mozi", preview: { text: "TO GET STARTED", color: "#ff0000" } },
  { id: "minimal", label: "Minimal", preview: { text: "To get started", color: "#888" } },
  { id: "tiktok", label: "TikTok", preview: { text: "TO GET STARTED", color: "#a855f7" } },
];

function Dashboard({ user }) {
  const [file, setFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [clips, setClips] = useState([]);
  const [error, setError] = useState("");
  const [captionStyle, setCaptionStyle] = useState("karaoke");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [activeTab, setActiveTab] = useState("home");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [credits, setCredits] = useState(3);
  const [isPro, setIsPro] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setCredits(userSnap.data().credits ?? 3);
        setIsPro(userSnap.data().isPro ?? false);
      } else {
        await setDoc(userRef, {
          email: user.email,
          credits: 3,
          isPro: false,
          createdAt: new Date()
        });
        setCredits(3);
        setIsPro(false);
      }
    };
    loadUserData();
  }, [user.uid]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleSubmit = async () => {
    if (!file && !youtubeUrl) { setError("Please upload a video or paste a YouTube link."); return; }

    // Check credits
    if (!isPro && credits <= 0) {
      setError("You have used all 3 free videos. Please upgrade to Pro to continue!");
      setShowUpgrade(true);
      return;
    }

    setLoading(true); setError(""); setClips([]); setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => prev < 90 ? prev + Math.random() * 10 : prev);
    }, 3000);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (youtubeUrl) formData.append("youtube_url", youtubeUrl);
      formData.append("caption_style", captionStyle);
      formData.append("aspect_ratio", aspectRatio);
      const response = await axios.post(`${BACKEND}/process`, formData);

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setClips(response.data.clips);
        setProgress(100);
        // Deduct 1 credit if not pro
        if (!isPro) {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, { credits: increment(-1) });
          setCredits(prev => prev - 1);
        }
      }
    } catch (err) {
      setError("Something went wrong. Make sure the backend is running.");
    }
    clearInterval(interval);
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "Inter, sans-serif" }}>

      {/* Left Sidebar */}
      <div style={{ width: "60px", background: "#111", borderRight: "1px solid #1f1f1f", display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", gap: "8px", position: "fixed", height: "100vh", zIndex: 100 }}>
        <div style={{ fontSize: "18px", fontWeight: "900", color: "#a855f7", marginBottom: "24px" }}>F</div>
        {[
          { id: "home", icon: "⌂" },
          { id: "projects", icon: "▦" },
          { id: "files", icon: "▭" },
        ].map(item => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: activeTab === item.id ? "#1a1a2e" : "transparent",
              border: activeTab === item.id ? "1px solid #a855f7" : "1px solid transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: "16px"
            }}
          >
            {item.icon}
          </div>
        ))}
        <div style={{ marginTop: "auto" }}>
          <div onClick={handleLogout} style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "14px" }}>
            ⏻
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: "60px", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Top Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", borderBottom: "1px solid #1f1f1f", background: "#0a0a0a" }}>
          <div style={{ fontSize: "13px", color: "#888" }}>
            {isPro
              ? <span style={{ color: "#4ade80" }}>✓ Pro Plan</span>
              : <>You are on the Free Plan — <span onClick={() => setShowUpgrade(true)} style={{ color: "#a855f7", cursor: "pointer" }}>Upgrade</span></>
            }
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {!isPro && (
              <span onClick={() => setShowUpgrade(true)} style={{ background: credits <= 0 ? "#3a1a1a" : "#1a1a2e", border: `1px solid ${credits <= 0 ? "#f87171" : "#a855f7"}`, borderRadius: "20px", padding: "4px 12px", fontSize: "12px", color: credits <= 0 ? "#f87171" : "#a855f7", cursor: "pointer" }}>
                ⚡ {credits} credits left
              </span>
            )}
            <div style={{ width: "32px", height: "32px", background: "#a855f7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "13px" }}>
              {user?.displayName ? user.displayName[0].toUpperCase() : user?.email[0].toUpperCase()}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, padding: "40px 60px", maxWidth: "900px", margin: "0 auto", width: "100%" }}>

          <h1 style={{ fontSize: "36px", fontWeight: "900", textAlign: "center", marginBottom: "32px" }}>FlickzClips</h1>

          {/* Upload Box */}
          <div style={{ background: "#111", border: "1px solid #222", borderRadius: "16px", padding: "24px", marginBottom: "32px" }}>
            <input
              type="text"
              placeholder="Drop a YouTube link..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              style={{ width: "100%", padding: "14px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "10px", color: "#fff", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} style={{ display: "none" }} id="fileInput" />
              <label htmlFor="fileInput" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", cursor: "pointer", fontSize: "14px", color: "#aaa" }}>
                Upload {file && <span style={{ color: "#a855f7" }}>{file.name.substring(0, 20)}...</span>}
              </label>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{ flex: 1, padding: "10px 20px", background: loading ? "#555" : "#fff", border: "none", borderRadius: "8px", color: "#000", cursor: loading ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: "bold" }}
              >
                {loading ? `Processing ${Math.round(progress)}%...` : "Get clips in 1 click"}
              </button>
            </div>

            {loading && (
              <div style={{ marginTop: "16px" }}>
                <div style={{ background: "#222", borderRadius: "4px", height: "4px" }}>
                  <div style={{ background: "#a855f7", height: "4px", borderRadius: "4px", width: `${progress}%`, transition: "width 0.5s" }} />
                </div>
                <p style={{ color: "#888", fontSize: "12px", marginTop: "8px" }}>AI is finding the best viral moments...</p>
              </div>
            )}
          </div>

          {/* Caption Presets */}
          {!loading && clips.length === 0 && (
            <div style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700" }}>Caption Style</h3>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span onClick={() => setAspectRatio("9:16")} style={{ padding: "6px 12px", background: aspectRatio === "9:16" ? "#a855f7" : "#1a1a1a", borderRadius: "20px", fontSize: "12px", cursor: "pointer" }}>9:16</span>
                  <span onClick={() => setAspectRatio("16:9")} style={{ padding: "6px 12px", background: aspectRatio === "16:9" ? "#a855f7" : "#1a1a1a", borderRadius: "20px", fontSize: "12px", cursor: "pointer" }}>16:9</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "12px" }}>
                {CAPTION_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => setCaptionStyle(preset.id)}
                    style={{
                      background: "#111",
                      border: captionStyle === preset.id ? "2px solid #a855f7" : "2px solid #222",
                      borderRadius: "10px",
                      padding: "12px 8px",
                      cursor: "pointer",
                      textAlign: "center"
                    }}
                  >
                    <div style={{ background: "#000", borderRadius: "6px", padding: "10px 4px", marginBottom: "6px", minHeight: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {preset.preview ? (
                        <span style={{ fontSize: "9px", fontWeight: "bold", color: preset.preview.color }}>
                          {preset.preview.text}
                        </span>
                      ) : (
                        <span style={{ fontSize: "16px", color: "#444" }}>⊘</span>
                      )}
                    </div>
                    <div style={{ fontSize: "11px", color: "#aaa" }}>{preset.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div style={{ padding: "12px", background: "#3a1a1a", borderRadius: "8px", color: "#f87171", fontSize: "14px", marginBottom: "16px" }}>
              {error}
            </div>
          )}

          {/* Results */}
          {clips.length > 0 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "700" }}>Your Viral Clips ({clips.length})</h2>
                <button onClick={() => { setClips([]); setFile(null); setYoutubeUrl(""); }} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #444", borderRadius: "8px", color: "#aaa", cursor: "pointer", fontSize: "13px" }}>
                  New video
                </button>
              </div>
              {clips.map((clip) => (
                <div key={clip.clip_number} style={{ background: "#111", border: "1px solid #222", borderRadius: "12px", padding: "20px", marginBottom: "16px", display: "flex", gap: "20px", alignItems: "flex-start" }}>
                  <div style={{ background: "#1a1a1a", borderRadius: "8px", width: "120px", height: "80px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "24px" }}>
                    🎬
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span style={{ background: "#a855f7", borderRadius: "20px", padding: "2px 10px", fontSize: "12px", fontWeight: "bold" }}>
                        Clip {clip.clip_number}
                      </span>
                      <span style={{ background: "#1a2e1a", color: "#4ade80", borderRadius: "20px", padding: "2px 10px", fontSize: "12px" }}>
                        Score: {85 + clip.clip_number * 3}
                      </span>
                    </div>
                    <p style={{ color: "#aaa", fontSize: "14px", margin: 0 }}>{clip.reason}</p>
                  </div>
                  <a href={`${BACKEND}${clip.download_url}`} download target="_blank" rel="noopener noreferrer" style={{ padding: "10px 20px", background: "#a855f7", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "bold", flexShrink: 0 }}>
                    Download HD
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showUpgrade && <Upgrade user={user} onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}

export default Dashboard;