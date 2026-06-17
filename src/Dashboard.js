import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import axios from "axios";
import Upgrade from "./Upgrade";

const BACKEND = "https://flickzclips.in";

const CAPTION_PRESETS = [
  { id: "none", label: "None", desc: "No captions", preview: null },
  { id: "karaoke", label: "Karaoke", desc: "Word highlight", color: "#00ff00", bg: "#000" },
  { id: "beasty", label: "Beasty", desc: "Bold italic", color: "#fff", bg: "#000" },
  { id: "deepdiver", label: "Deep Diver", desc: "Clean minimal", color: "#fff", bg: "#1a1a1a" },
  { id: "youshaei", label: "Youshaei", desc: "Two color pop", color: "#00ff00", bg: "#000" },
  { id: "podp", label: "Pod P", desc: "Pink accent", color: "#ff69b4", bg: "#000" },
  { id: "mozi", label: "Mozi", desc: "Purple style", color: "#a855f7", bg: "#000" },
  { id: "popline", label: "Popline", desc: "Small top text", color: "#fff", bg: "#000" },
  { id: "simple", label: "Simple", desc: "Classic white", color: "#fff", bg: "#000" },
  { id: "thinkmedia", label: "Think Media", desc: "Yellow bold", color: "#FFD700", bg: "#000" },
  { id: "tiktok", label: "TikTok", desc: "Purple glow", color: "#a855f7", bg: "#000" },
  { id: "minimal", label: "Minimal", desc: "Subtle grey", color: "#aaa", bg: "#000" },
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
  const [showProfile, setShowProfile] = useState(false);
  const [credits, setCredits] = useState(3);
  const [isPro, setIsPro] = useState(false);
  const [selectedClip, setSelectedClip] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setCredits(userSnap.data().credits ?? 3);
        setIsPro(userSnap.data().isPro ?? false);
      } else {
        await setDoc(userRef, { email: user.email, credits: 3, isPro: false, createdAt: new Date() });
      }
    };
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.uid]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleSubmit = async () => {
    if (!file && !youtubeUrl) { setError("Please upload a video or paste a YouTube link."); return; }
    if (!isPro && credits <= 0) { setError("No credits left! Please upgrade to Pro."); setShowUpgrade(true); return; }

    setLoading(true); setError(""); setClips([]); setProgress(0); setSelectedClip(null);

    const interval = setInterval(() => {
      setProgress(prev => prev < 90 ? prev + Math.random() * 8 : prev);
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
        setSelectedClip(response.data.clips[0]);
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

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const avatar = displayName[0].toUpperCase();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "Inter, sans-serif" }}>

      {/* Left Sidebar */}
      <div style={{ width: "60px", background: "#111", borderRight: "1px solid #1f1f1f", display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", gap: "8px", position: "fixed", height: "100vh", zIndex: 100 }}>
        <div style={{ fontSize: "18px", fontWeight: "900", color: "#a855f7", marginBottom: "16px" }}>F</div>

        {[
          { id: "home", icon: "⌂", label: "Home" },
          { id: "projects", icon: "▦", label: "Projects" },
          { id: "captions", icon: "CC", label: "Captions" },
          { id: "settings", icon: "⚙", label: "Settings" },
        ].map(item => (
          <div key={item.id} onClick={() => setActiveTab(item.id)} title={item.label}
            style={{ width: "40px", height: "40px", borderRadius: "10px", background: activeTab === item.id ? "#1a1a2e" : "transparent", border: activeTab === item.id ? "1px solid #a855f7" : "1px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: item.id === "captions" ? "10px" : "16px", color: activeTab === item.id ? "#a855f7" : "#888" }}>
            {item.icon}
          </div>
        ))}

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div onClick={() => setShowUpgrade(true)} title="Upgrade"
            style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "14px" }}>
            ⚡
          </div>
          <div onClick={() => setShowProfile(!showProfile)} title="Profile"
            style={{ width: "36px", height: "36px", background: "#a855f7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "14px", cursor: "pointer" }}>
            {avatar}
          </div>
        </div>
      </div>

      {/* Profile Panel */}
      {showProfile && (
        <div style={{ position: "fixed", left: "60px", bottom: "60px", width: "260px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "12px", padding: "20px", zIndex: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #333" }}>
            <div style={{ width: "44px", height: "44px", background: "#a855f7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "18px" }}>
              {avatar}
            </div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "14px" }}>{displayName}</div>
              <div style={{ color: "#888", fontSize: "12px" }}>{user?.email}</div>
            </div>
          </div>

          {[
            { icon: "⚡", label: isPro ? "Pro Plan" : `Free — ${credits} credits left`, action: () => { setShowUpgrade(true); setShowProfile(false); } },
            { icon: "⚙", label: "Settings", action: () => { setActiveTab("settings"); setShowProfile(false); } },
            { icon: "📄", label: "Terms & Refund Policy", action: () => navigate("/terms") },
          ].map(item => (
            <div key={item.label} onClick={item.action}
              style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 8px", borderRadius: "8px", cursor: "pointer", fontSize: "14px", color: "#ccc", marginBottom: "4px" }}
              onMouseEnter={e => e.currentTarget.style.background = "#2a2a2a"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <span>{item.icon}</span> {item.label}
            </div>
          ))}

          <div style={{ borderTop: "1px solid #333", marginTop: "12px", paddingTop: "12px" }}>
            <div onClick={handleLogout}
              style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 8px", borderRadius: "8px", cursor: "pointer", fontSize: "14px", color: "#f87171" }}
              onMouseEnter={e => e.currentTarget.style.background = "#2a1a1a"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <span>⏻</span> Logout
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ marginLeft: "60px", flex: 1, display: "flex", flexDirection: "column" }} onClick={() => showProfile && setShowProfile(false)}>

        {/* Top Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", borderBottom: "1px solid #1f1f1f", background: "#0a0a0a" }}>
          <div style={{ fontSize: "13px", color: "#888" }}>
            {isPro ? <span style={{ color: "#4ade80" }}>✓ Pro Plan</span>
              : <>Free Plan — <span onClick={() => setShowUpgrade(true)} style={{ color: "#a855f7", cursor: "pointer" }}>Upgrade</span></>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {!isPro && (
              <span onClick={() => setShowUpgrade(true)} style={{ background: credits <= 0 ? "#3a1a1a" : "#1a1a2e", border: `1px solid ${credits <= 0 ? "#f87171" : "#a855f7"}`, borderRadius: "20px", padding: "4px 12px", fontSize: "12px", color: credits <= 0 ? "#f87171" : "#a855f7", cursor: "pointer" }}>
                ⚡ {credits} credits left
              </span>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, padding: "32px 48px", maxWidth: "1000px", margin: "0 auto", width: "100%" }}>

          {activeTab === "home" && (
            <>
              <h1 style={{ fontSize: "32px", fontWeight: "900", textAlign: "center", marginBottom: "28px" }}>FlickzClips</h1>

              {/* Upload Box */}
              <div style={{ background: "#111", border: "1px solid #222", borderRadius: "16px", padding: "20px", marginBottom: "28px" }}>
                <input type="text" placeholder="Drop a YouTube link..." value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)}
                  style={{ width: "100%", padding: "12px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "10px", color: "#fff", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box" }} />
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} style={{ display: "none" }} id="fileInput" />
                  <label htmlFor="fileInput" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", cursor: "pointer", fontSize: "14px", color: "#aaa", whiteSpace: "nowrap" }}>
                    Upload {file && <span style={{ color: "#a855f7" }}>{file.name.substring(0, 15)}...</span>}
                  </label>
                  <button onClick={handleSubmit} disabled={loading}
                    style={{ flex: 1, padding: "10px 20px", background: loading ? "#333" : "#fff", border: "none", borderRadius: "8px", color: "#000", cursor: loading ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: "bold" }}>
                    {loading ? `Processing ${Math.round(progress)}%...` : "Get clips in 1 click"}
                  </button>
                </div>
                {loading && (
                  <div style={{ marginTop: "12px" }}>
                    <div style={{ background: "#222", borderRadius: "4px", height: "4px" }}>
                      <div style={{ background: "#a855f7", height: "4px", borderRadius: "4px", width: `${progress}%`, transition: "width 0.5s" }} />
                    </div>
                    <p style={{ color: "#888", fontSize: "12px", marginTop: "6px" }}>AI is finding the best viral moments...</p>
                  </div>
                )}
              </div>

              {/* Caption Style */}
              {!loading && clips.length === 0 && (
                <div style={{ marginBottom: "28px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: "700" }}>Caption Style</h3>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {["9:16", "16:9"].map(r => (
                        <span key={r} onClick={() => setAspectRatio(r)}
                          style={{ padding: "5px 12px", background: aspectRatio === r ? "#a855f7" : "#1a1a1a", borderRadius: "20px", fontSize: "12px", cursor: "pointer" }}>
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px" }}>
                    {CAPTION_PRESETS.map(preset => (
                      <div key={preset.id} onClick={() => setCaptionStyle(preset.id)}
                        style={{ background: "#111", border: captionStyle === preset.id ? "2px solid #a855f7" : "2px solid #222", borderRadius: "10px", padding: "10px 6px", cursor: "pointer", textAlign: "center" }}>
                        <div style={{ background: "#000", borderRadius: "6px", padding: "8px 4px", marginBottom: "6px", minHeight: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {preset.preview === null && preset.id !== "none" ? (
                            <span style={{ fontSize: "8px", fontWeight: "bold", color: preset.color }}>{preset.label.toUpperCase()}</span>
                          ) : preset.id === "none" ? (
                            <span style={{ fontSize: "14px", color: "#444" }}>⊘</span>
                          ) : null}
                        </div>
                        <div style={{ fontSize: "10px", color: "#aaa" }}>{preset.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && <div style={{ padding: "12px", background: "#3a1a1a", borderRadius: "8px", color: "#f87171", fontSize: "14px", marginBottom: "16px" }}>{error}</div>}

              {/* Results */}
              {clips.length > 0 && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "700" }}>Your Viral Clips ({clips.length})</h2>
                    <button onClick={() => { setClips([]); setFile(null); setYoutubeUrl(""); setSelectedClip(null); }}
                      style={{ padding: "8px 16px", background: "transparent", border: "1px solid #444", borderRadius: "8px", color: "#aaa", cursor: "pointer", fontSize: "13px" }}>
                      New video
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {/* Clip List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {clips.map(clip => (
                        <div key={clip.clip_number} onClick={() => setSelectedClip(clip)}
                          style={{ background: selectedClip?.clip_number === clip.clip_number ? "#1a1a2e" : "#111", border: `1px solid ${selectedClip?.clip_number === clip.clip_number ? "#a855f7" : "#222"}`, borderRadius: "12px", padding: "16px", cursor: "pointer", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                          <div style={{ background: "#1a1a1a", borderRadius: "8px", width: "80px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "20px" }}>
                            🎬
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", gap: "6px", marginBottom: "6px", flexWrap: "wrap" }}>
                              <span style={{ background: "#a855f7", borderRadius: "20px", padding: "2px 8px", fontSize: "11px", fontWeight: "bold" }}>Clip {clip.clip_number}</span>
                              <span style={{ background: "#1a2e1a", color: "#4ade80", borderRadius: "20px", padding: "2px 8px", fontSize: "11px" }}>Score: {85 + clip.clip_number * 3}</span>
                            </div>
                            <p style={{ color: "#aaa", fontSize: "12px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{clip.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Clip Preview */}
                    {selectedClip && (
                      <div style={{ background: "#111", border: "1px solid #222", borderRadius: "12px", padding: "20px" }}>
                        <div style={{ fontWeight: "700", marginBottom: "12px", fontSize: "15px" }}>Clip {selectedClip.clip_number} Preview</div>
                        <video
                          key={selectedClip.clip_number}
                          controls
                          style={{ width: "100%", borderRadius: "8px", background: "#000", marginBottom: "12px" }}
                          src={`${BACKEND}${selectedClip.download_url}`}
                        />
                        <p style={{ color: "#888", fontSize: "13px", marginBottom: "16px" }}>{selectedClip.reason}</p>
                        <a href={`${BACKEND}${selectedClip.download_url}`} download target="_blank" rel="noopener noreferrer"
                          style={{ display: "block", width: "100%", padding: "12px", background: "#a855f7", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: "bold", textAlign: "center", boxSizing: "border-box" }}>
                          Download HD
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "projects" && (
            <div style={{ textAlign: "center", paddingTop: "80px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📁</div>
              <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>Your Projects</h2>
              <p style={{ color: "#888" }}>Your processed videos will appear here soon.</p>
            </div>
          )}

          {activeTab === "captions" && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>Caption Styles</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                {CAPTION_PRESETS.filter(p => p.id !== "none").map(preset => (
                  <div key={preset.id} onClick={() => { setCaptionStyle(preset.id); setActiveTab("home"); }}
                    style={{ background: "#111", border: captionStyle === preset.id ? "2px solid #a855f7" : "2px solid #222", borderRadius: "12px", padding: "20px", cursor: "pointer" }}>
                    <div style={{ background: "#000", borderRadius: "8px", padding: "16px", marginBottom: "12px", textAlign: "center" }}>
                      <span style={{ fontSize: "14px", fontWeight: "bold", color: preset.color }}>{preset.label.toUpperCase()} STYLE</span>
                    </div>
                    <div style={{ fontWeight: "700", marginBottom: "4px" }}>{preset.label}</div>
                    <div style={{ color: "#888", fontSize: "13px" }}>{preset.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}>Settings</h2>
              <div style={{ background: "#111", border: "1px solid #222", borderRadius: "12px", padding: "24px", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Account</h3>
                <div style={{ color: "#888", fontSize: "14px", marginBottom: "8px" }}>Email: <span style={{ color: "#fff" }}>{user?.email}</span></div>
                <div style={{ color: "#888", fontSize: "14px", marginBottom: "16px" }}>Plan: <span style={{ color: isPro ? "#4ade80" : "#a855f7" }}>{isPro ? "Pro" : "Free"}</span></div>
                {!isPro && (
                  <button onClick={() => setShowUpgrade(true)}
                    style={{ padding: "10px 20px", background: "#a855f7", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}>
                    Upgrade to Pro
                  </button>
                )}
              </div>
              <div style={{ background: "#111", border: "1px solid #222", borderRadius: "12px", padding: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>Danger Zone</h3>
                <button onClick={handleLogout}
                  style={{ padding: "10px 20px", background: "transparent", border: "1px solid #f87171", borderRadius: "8px", color: "#f87171", cursor: "pointer", fontSize: "14px" }}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showUpgrade && <Upgrade user={user} onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}

export default Dashboard;