import { useNavigate } from "react-router-dom";

function Terms() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 60px", borderBottom: "1px solid #1f1f1f" }}>
        <div onClick={() => navigate("/")} style={{ fontSize: "22px", fontWeight: "800", color: "#a855f7", cursor: "pointer" }}>FlickzClips</div>
        <button onClick={() => navigate("/")} style={{ padding: "10px 20px", background: "transparent", border: "1px solid #444", borderRadius: "8px", color: "#fff", cursor: "pointer" }}>
          Back to Home
        </button>
      </nav>

      <div style={{ maxWidth: "800px", margin: "60px auto", padding: "0 20px", lineHeight: "1.8" }}>
        
        <h1 style={{ fontSize: "36px", fontWeight: "900", marginBottom: "8px" }}>Terms & Conditions</h1>
        <p style={{ color: "#888", marginBottom: "48px" }}>Last updated: June 2026</p>

        {[
          {
            title: "1. Service Description",
            content: "FlickzClips is an AI-powered video clipping service that analyzes uploaded videos and generates short clips. Users must upload videos they own or have rights to use."
          },
          {
            title: "2. Free Plan",
            content: "New users receive 3 free video credits upon registration. Free credits are non-transferable and expire after 30 days of account inactivity."
          },
          {
            title: "3. Pro Plan & Payments",
            content: "The Pro Plan is billed at ₹299/month. Payments are processed securely by Razorpay. Your subscription renews automatically each month unless cancelled."
          },
          {
            title: "4. Refund Policy",
            content: "We offer a 7-day refund policy. If you are not satisfied with FlickzClips Pro within 7 days of your first payment, contact us at support@flickzclips.com for a full refund. Refunds are not available after 7 days or if more than 10 videos have been processed."
          },
          {
            title: "5. Cancellation",
            content: "You can cancel your Pro subscription at any time. After cancellation, you retain Pro access until the end of your current billing period. No partial refunds are given for unused days."
          },
          {
            title: "6. Content Policy",
            content: "Users must not upload videos containing illegal content, content they do not own, or content that violates third-party rights. FlickzClips is not responsible for user-uploaded content."
          },
          {
            title: "7. Data & Privacy",
            content: "Uploaded videos are processed and temporarily stored on our servers. Videos are automatically deleted within 24 hours of processing. We do not share your content with third parties."
          },
          {
            title: "8. Limitation of Liability",
            content: "FlickzClips is provided as-is. We are not liable for any indirect or consequential damages arising from use of our service. Our maximum liability is limited to the amount paid in the last 30 days."
          },
          {
            title: "9. Contact",
            content: "For any questions, refund requests, or support, email us at support@flickzclips.com. We respond within 24-48 hours."
          }
        ].map((section) => (
          <div key={section.title} style={{ marginBottom: "36px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px", color: "#a855f7" }}>{section.title}</h2>
            <p style={{ color: "#ccc", fontSize: "15px" }}>{section.content}</p>
          </div>
        ))}

        <div style={{ background: "#111", border: "1px solid #222", borderRadius: "12px", padding: "24px", marginTop: "48px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px" }}>Refund Requests</h3>
          <p style={{ color: "#888", fontSize: "14px" }}>Email <span style={{ color: "#a855f7" }}>support@flickzclips.com</span> with your payment ID and reason. We process refunds within 5-7 business days.</p>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #1f1f1f", padding: "32px 60px", textAlign: "center", color: "#555", fontSize: "13px", marginTop: "60px" }}>
        © 2026 FlickzClips. All rights reserved.
      </div>
    </div>
  );
}

export default Terms;