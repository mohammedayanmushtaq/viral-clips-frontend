import { useState } from "react";
import { auth } from "./firebase";

const RAZORPAY_KEY = "rzp_live_T1ZTORbeCUJIEt,LftvK0rf4dVMRoxwHWjtgI4r";

function Upgrade({ user, onClose }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);

    const options = {
      key: RAZORPAY_KEY,
      amount: 29900,
      currency: "INR",
      name: "FlickzClips",
      description: "Pro Plan - Unlimited Videos",
      image: "https://flickzclips.vercel.app/favicon.ico",
      prefill: {
        name: user?.displayName || "",
        email: user?.email || "",
      },
      theme: {
        color: "#a855f7",
      },
      handler: function (response) {
        alert("Payment successful! Your Pro plan is now active.");
        onClose();
        setLoading(false);
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#111", border: "1px solid #333", borderRadius: "20px", padding: "40px", maxWidth: "440px", width: "90%", position: "relative" }}>
        
        <button onClick={onClose} style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", color: "#888", fontSize: "20px", cursor: "pointer" }}>✕</button>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>⚡</div>
          <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "8px" }}>Upgrade to Pro</h2>
          <p style={{ color: "#888", fontSize: "14px" }}>Unlock unlimited video processing</p>
        </div>

        <div style={{ background: "#0a0a0a", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
          <div style={{ fontSize: "36px", fontWeight: "900", textAlign: "center", marginBottom: "4px" }}>
            ₹299<span style={{ fontSize: "16px", color: "#888", fontWeight: "400" }}>/month</span>
          </div>
          <p style={{ textAlign: "center", color: "#888", fontSize: "13px", marginBottom: "20px" }}>Cancel anytime</p>

          {[
            "Unlimited videos per month",
            "Up to 3 hours per video",
            "10 clips per video",
            "All caption styles",
            "9:16 and 16:9 export",
            "Priority processing",
          ].map((feature) => (
            <div key={feature} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", fontSize: "14px", color: "#ccc" }}>
              <span style={{ color: "#a855f7", fontWeight: "bold" }}>✓</span>
              {feature}
            </div>
          ))}
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          style={{ width: "100%", padding: "16px", background: "#a855f7", border: "none", borderRadius: "12px", color: "#fff", fontSize: "16px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Opening payment..." : "Upgrade Now — ₹299/month"}
        </button>

        <p style={{ textAlign: "center", color: "#555", fontSize: "12px", marginTop: "16px" }}>
          Secured by Razorpay. Your payment is safe.
        </p>
      </div>
    </div>
  );
}

export default Upgrade;