import { useState, useEffect } from "react";
import { Logo, Toast, Particles, S, globalCSS } from "../components/Shared";
import { loginUser, registerTeacher, requestPasswordReset, resetPassword, verifyPasswordResetToken } from "../services/api";

/* ── Animated illustration ── */
/* Self-contained: every position is computed inline rather than relying on
   guessed classes from globalCSS, so chips never collide with the central
   blob or with each other, and there's a clean gap below for the portal label. */
function LoginIllustration() {
  const SIZE = 232;          // outer illustration box
  const CENTER = SIZE / 2;
  const BLOB_SIZE = 80;      // central graduation-cap blob
  const CHIP_RADIUS = 104;   // distance of chips from center

  const subjects = [
    { label: "Math",       icon: "📐", color: "#d97706", angle: -90 },
    { label: "Science",    icon: "🔬", color: "#059669", angle: -30 },
    { label: "Literature", icon: "📖", color: "#db2777", angle: 30 },
    { label: "Geography",  icon: "🌍", color: "#2563eb", angle: 90 },
    { label: "Physics",    icon: "⚛️", color: "#7c3aed", angle: 150 },
    { label: "History",    icon: "📜", color: "#0d9488", angle: 210 },
  ];

  return (
    <div style={{ position: "relative", width: SIZE, height: SIZE, flexShrink: 0, margin: "0 auto" }}>
      {/* Rotating dashed orbit rings, behind everything */}
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <linearGradient id="ringGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        <circle cx={CENTER} cy={CENTER} r={CHIP_RADIUS - 6} fill="none" stroke="url(#ringGrad1)" strokeWidth="1" strokeDasharray="5 7" opacity="0.32">
          <animateTransform attributeName="transform" type="rotate" from={`0 ${CENTER} ${CENTER}`} to={`360 ${CENTER} ${CENTER}`} dur="45s" repeatCount="indefinite" />
        </circle>
        <circle cx={CENTER} cy={CENTER} r={BLOB_SIZE / 2 + 13} fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 6" opacity="0.4">
          <animateTransform attributeName="transform" type="rotate" from={`360 ${CENTER} ${CENTER}`} to={`0 ${CENTER} ${CENTER}`} dur="32s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Central graduation-cap blob */}
      <div style={{
        position: "absolute",
        top: CENTER - BLOB_SIZE / 2,
        left: CENTER - BLOB_SIZE / 2,
        width: BLOB_SIZE, height: BLOB_SIZE,
        borderRadius: "38% 62% 60% 40% / 45% 40% 60% 55%",
        background: "linear-gradient(150deg,#fbbf24,#f59e0b 55%,#d97706)",
        boxShadow: "0 8px 22px rgba(217,119,6,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 30,
        animation: "loginBlobFloat 5s ease-in-out infinite",
      }}>
        🎓
      </div>

      {/* Floating particles of varying sizes, drifting around the subject ring */}
      {[
        { size: 10, color: "#f59e0b", angle: 0,   radius: CHIP_RADIUS + 18, dur: "9s",  delay: "0s" },
        { size: 6,  color: "#34d399", angle: 60,  radius: CHIP_RADIUS - 30, dur: "7s",  delay: "0.6s" },
        { size: 8,  color: "#60a5fa", angle: 120, radius: CHIP_RADIUS + 14, dur: "10s", delay: "1.2s" },
        { size: 5,  color: "#f472b6", angle: 180, radius: CHIP_RADIUS - 26, dur: "6.5s",delay: "0.3s" },
        { size: 9,  color: "#a78bfa", angle: 240, radius: CHIP_RADIUS + 20, dur: "8s",  delay: "0.9s" },
        { size: 6,  color: "#fbbf24", angle: 300, radius: CHIP_RADIUS - 22, dur: "7.5s",delay: "1.5s" },
      ].map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const x = CENTER + p.radius * Math.cos(rad);
        const y = CENTER + p.radius * Math.sin(rad);
        return (
          <div key={`particle-${i}`} style={{
            position: "absolute",
            top: y, left: x,
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: p.color,
            opacity: 0.55,
            transform: "translate(-50%, -50%)",
            animation: `loginParticleDrift ${p.dur} ease-in-out infinite`,
            animationDelay: p.delay,
            zIndex: 0,
          }} />
        );
      })}

      {/* Subject chips, evenly spaced on a circle — no overlap with center or each other */}
      {subjects.map((s, i) => {
        const rad = (s.angle * Math.PI) / 180;
        const x = CENTER + CHIP_RADIUS * Math.cos(rad);
        const y = CENTER + CHIP_RADIUS * Math.sin(rad);
        return (
          <div key={i} style={{
            position: "absolute",
            top: y, left: x,
            transform: "translate(-50%, -50%)",
            display: "flex", alignItems: "center", gap: 4,
            padding: "4px 9px",
            borderRadius: 14,
            background: "#fff",
            border: `1px solid ${s.color}50`,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            fontSize: 10, fontWeight: 600,
            color: s.color,
            whiteSpace: "nowrap",
            animation: "loginChipFloat 4s ease-in-out infinite",
            animationDelay: `${i * 0.3}s`,
            zIndex: 2,
          }}>
            <span style={{ fontSize: 10.5 }}>{s.icon}</span>{s.label}
          </div>
        );
      })}

      <style>{`
        @keyframes loginBlobFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes loginChipFloat { 0%, 100% { transform: translate(-50%, -50%); } 50% { transform: translate(-50%, calc(-50% - 4px)); } }
        @keyframes loginParticleDrift {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.55; }
          50% { transform: translate(calc(-50% + 6px), calc(-50% - 10px)) scale(1.25); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}

/* ── Password Strength Indicator ── */
function StrengthBar({ password }) {
  let s = 0;
  if (password.length >= 8) s++;
  if (/[A-Z]/.test(password)) s++;
  if (/[0-9]/.test(password)) s++;
  if (/[^A-Za-z0-9]/.test(password)) s++;
  const colors = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
  const labels = ["Weak", "Fair", "Good", "Strong"];
  if (!password) return null;
  return (
    <div style={{ marginTop: 4, marginBottom: 8 }}>
      <div style={{ display: "flex", gap: 3, marginBottom: 2 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i < s ? colors[s - 1] : "rgba(0,0,0,0.08)", transition: "background 0.3s" }} />
        ))}
      </div>
      <span style={{ fontSize: 10, color: colors[s - 1], fontWeight: 600 }}>{labels[s - 1]}</span>
    </div>
  );
}

/* ── Compact input style overrides ── */
const ci = {
  input:     { fontSize: 12, padding: "7px 10px 7px 28px", marginBottom: 0 },
  label:     { fontSize: 11, marginBottom: 3, display: "block", fontWeight: 600, color: "#374151" },
  fieldIcon: { position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", fontSize: 12, pointerEvents: "none" },
  mb:        { marginBottom: 10 },
};

/* ── Login Form ── */
function LoginForm({ onLogin, onGoRegister, onGoForgot }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [toast, setToast]       = useState({ msg: "", type: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) { setToast({ msg: "Please fill in all fields.", type: "error" }); return; }
    setLoading(true);
    loginUser({ email, password })
      .then((data) => { onLogin(data); })
      .catch((err) => { setToast({ msg: err.message || "Incorrect credentials. Please try again.", type: "error" }); })
      .finally(() => { setLoading(false); });
  };

  return (
    <>
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: "", type: "" })} />
      <Logo size={110} />
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <span style={ls.badge}>Welcome Back</span>
        <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, fontStyle: "italic" }}>Sign in to your account</p>
      </div>
      <form onSubmit={handleLogin}>
        <div style={ci.mb}>
          <label style={ci.label}>Email Address</label>
          <div style={{ position: "relative" }}>
            <span style={ci.fieldIcon}>📧</span>
            <input style={{ ...S.input, ...ci.input }} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" autoComplete="email" disabled={loading} />
          </div>
        </div>
        <div style={ci.mb}>
          <label style={ci.label}>Password</label>
          <div style={{ position: "relative" }}>
            <span style={ci.fieldIcon}>🔒</span>
            <input style={{ ...S.input, ...ci.input }} type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" autoComplete="current-password" disabled={loading} />
            <button type="button" onClick={() => setShowPass(!showPass)}
              style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#9ca3af" }}>
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        <div style={{ textAlign: "right", marginBottom: 14 }}>
          <span onClick={onGoForgot} style={{ fontSize: 11, color: "#d97706", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>
            Forgot password?
          </span>
        </div>
        <button type="submit" style={{ ...S.primaryBtn, width: "100%", padding: "9px", fontSize: 13 }}>Sign In →</button>
      </form>
      <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 12, marginBottom: 0 }}>
        New teacher?{" "}
        <span onClick={onGoRegister} style={{ color: "#d97706", fontWeight: 700, cursor: "pointer" }}>Register here</span>
      </p>
    </>
  );
}

/* ── Forgot Password Form ── */
function ForgotPasswordForm({ onBack }) {
  const [email, setEmail]         = useState("");
  const [sent, setSent]           = useState(false);
  const [toast, setToast]         = useState({ msg: "", type: "" });
  const [resetLink, setResetLink] = useState("");

  const handleForgot = (e) => {
    e.preventDefault();
    if (!email) { setToast({ msg: "Please enter your email address.", type: "error" }); return; }
    requestPasswordReset(email)
      .then((data) => {
        const generatedLink = data?.resetToken
          ? `${window.location.origin}${window.location.pathname}?reset_token=${encodeURIComponent(data.resetToken)}`
          : "";
        setResetLink(generatedLink);
        setSent(true);
      })
      .catch((error) => { setToast({ msg: error.message || "Failed to request password reset.", type: "error" }); });
  };

  if (sent) {
    return (
      <>
        <Logo size={100} />
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📬</div>
          <span style={ls.badge}>Check Your Inbox</span>
          <p style={{ fontSize: 11, color: "#6b7280", marginTop: 6, lineHeight: 1.5 }}>
            A password reset link has been sent to<br />
            <strong style={{ color: "#92400e" }}>{email}</strong>
          </p>
          <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>Link expires in 15 minutes.</p>
        </div>
        <div style={{ background: "#fffbeb", border: "1px dashed #fbbf24", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>
          <p style={{ fontSize: 10, color: "#92400e", fontWeight: 700, marginBottom: 4 }}>Password Reset Link</p>
          <p style={{ fontSize: 10, color: "#6b7280", marginBottom: 6, lineHeight: 1.4 }}>
            Email delivery not configured yet — use this secure link directly:
          </p>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input readOnly value={resetLink}
              style={{ ...S.input, fontSize: 9, flex: 1, padding: "5px 8px", color: "#374151", background: "#fff", marginBottom: 0 }} />
            <button onClick={() => { navigator.clipboard.writeText(resetLink); setToast({ msg: "Link copied!", type: "success" }); }}
              style={{ ...S.primaryBtn, padding: "5px 10px", fontSize: 10, whiteSpace: "nowrap" }}>Copy</button>
          </div>
        </div>
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: "", type: "" })} />
        <button onClick={onBack} style={{ ...S.primaryBtn, width: "100%", padding: "9px", fontSize: 13 }}>← Back to Sign In</button>
      </>
    );
  }

  return (
    <>
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: "", type: "" })} />
      <Logo size={100} />
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🔑</div>
        <span style={ls.badge}>Reset Password</span>
        <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, fontStyle: "italic" }}>Enter your registered email and we'll send a reset link</p>
      </div>
      <form onSubmit={handleForgot}>
        <div style={ci.mb}>
          <label style={ci.label}>Registered Email Address</label>
          <div style={{ position: "relative" }}>
            <span style={ci.fieldIcon}>📧</span>
            <input style={{ ...S.input, ...ci.input }} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" autoFocus />
          </div>
        </div>
        <div style={{ marginBottom: 14 }} />
        <button type="submit" style={{ ...S.primaryBtn, width: "100%", padding: "9px", fontSize: 13 }}>Send Reset Link →</button>
      </form>
      <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 12, marginBottom: 0 }}>
        Remembered it?{" "}
        <span onClick={onBack} style={{ color: "#d97706", fontWeight: 700, cursor: "pointer" }}>Sign in</span>
      </p>
    </>
  );
}

/* ── Reset Password Form ── */
function ResetPasswordForm({ token, onDone }) {
  const [password, setPassword]       = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [showPass, setShowPass]       = useState(false);
  const [toast, setToast]             = useState({ msg: "", type: "" });
  const [tokenValid, setTokenValid]   = useState(null);
  const [tokenEmail, setTokenEmail]   = useState("");

  useEffect(() => {
    verifyPasswordResetToken(token)
      .then((data) => { setTokenValid(Boolean(data?.valid)); setTokenEmail(data?.email || ""); })
      .catch(() => { setTokenValid(false); });
  }, [token]);

  const handleReset = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) { setToast({ msg: "Please fill in both fields.", type: "error" }); return; }
    if (password !== confirmPassword)  { setToast({ msg: "Passwords do not match.", type: "error" }); return; }
    if (password.length < 8)           { setToast({ msg: "Password must be at least 8 characters.", type: "error" }); return; }
    resetPassword(token, password)
      .then(() => { setToast({ msg: "Password updated successfully!", type: "success" }); setTimeout(onDone, 1800); })
      .catch((error) => { setToast({ msg: error.message || "Unable to reset password.", type: "error" }); });
  };

  if (tokenValid === null) return <div style={{ textAlign: "center", padding: 30, color: "#9ca3af", fontSize: 12 }}>Verifying link…</div>;

  if (tokenValid === false) {
    return (
      <>
        <Logo size={100} />
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>⛔</div>
          <span style={ls.badge}>Link Expired or Invalid</span>
          <p style={{ fontSize: 12, color: "#6b7280", marginTop: 8, lineHeight: 1.5 }}>
            This password reset link is no longer valid.<br />Please request a new one.
          </p>
          <button onClick={onDone} style={{ ...S.primaryBtn, marginTop: 18, padding: "9px 24px", fontSize: 13 }}>← Back to Sign In</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: "", type: "" })} />
      <Logo size={100} />
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🛡️</div>
        <span style={ls.badge}>Set New Password</span>
        <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, fontStyle: "italic" }}>
          Resetting for <strong style={{ color: "#92400e" }}>{tokenEmail}</strong>
        </p>
      </div>
      <form onSubmit={handleReset}>
        <div style={ci.mb}>
          <label style={ci.label}>New Password</label>
          <div style={{ position: "relative" }}>
            <span style={ci.fieldIcon}>🔒</span>
            <input style={{ ...S.input, ...ci.input }} type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" autoFocus />
            <button type="button" onClick={() => setShowPass(!showPass)}
              style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        <StrengthBar password={password} />
        <div style={ci.mb}>
          <label style={ci.label}>Confirm New Password</label>
          <div style={{ position: "relative" }}>
            <span style={ci.fieldIcon}>🛡️</span>
            <input style={{ ...S.input, ...ci.input }} type="password" value={confirmPassword} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter new password" />
          </div>
          {confirmPassword && (
            <p style={{ fontSize: 10, marginTop: 3, color: password === confirmPassword ? "#10b981" : "#ef4444", fontWeight: 600 }}>
              {password === confirmPassword ? "✅ Passwords match" : "❌ Do not match"}
            </p>
          )}
        </div>
        <button type="submit" style={{ ...S.primaryBtn, width: "100%", padding: "9px", fontSize: 13 }}>Update Password →</button>
      </form>
    </>
  );
}

/* ── Register Form ── */
function RegisterForm({ onBack }) {
  const [form, setForm]         = useState({ name: "", email: "", phone: "", address: "", subject: "", photo: "", password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [toast, setToast]       = useState({ msg: "", type: "" });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setToast({ msg: "Please upload an image file (PNG/JPG).", type: "error" }); return; }
    if (file.size > 1024 * 1024)         { setToast({ msg: "Image too large. Under 1MB please.", type: "error" }); return; }
    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, photo: reader.result });
    reader.readAsDataURL(file);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const { name, email, phone, address, subject, password, confirmPassword } = form;
    if (!name || !email || !phone || !address || !subject || !password || !confirmPassword) { setToast({ msg: "Please fill all fields.", type: "error" }); return; }
    if (password !== confirmPassword) { setToast({ msg: "Passwords do not match.", type: "error" }); return; }
    if (password.length < 8)          { setToast({ msg: "Password must be at least 8 characters.", type: "error" }); return; }
    registerTeacher({ name, email, phone, password, qualification: "B.Ed", subject, experience: "2 years", address })
      .then(() => { setToast({ msg: "Registration submitted! Awaiting admin approval.", type: "success" }); setTimeout(onBack, 2000); })
      .catch((err) => { setToast({ msg: err.message || "Failed to submit registration.", type: "error" }); });
  };

  return (
    <>
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: "", type: "" })} />
      <Logo size={100} />
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <span style={ls.badge}>Teacher Registration</span>
        <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, fontStyle: "italic" }}>Admin will approve your account</p>
      </div>
      <form onSubmit={handleRegister}>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, ...ci.mb }}>
            <label style={ci.label}>Full Name</label>
            <div style={{ position: "relative" }}>
              <span style={ci.fieldIcon}>👤</span>
              <input style={{ ...S.input, ...ci.input }} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Dr. Jane Smith" />
            </div>
          </div>
          <div style={{ flex: 1, ...ci.mb }}>
            <label style={ci.label}>Subject</label>
            <div style={{ position: "relative" }}>
              <span style={ci.fieldIcon}>📘</span>
              <input style={{ ...S.input, ...ci.input }} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Mathematics" />
            </div>
          </div>
        </div>
        {[
          { key: "email", label: "Email", icon: "📧", type: "email", ph: "teacher@school.edu" },
          { key: "phone", label: "Phone", icon: "📱", type: "tel",   ph: "+91 98765 43210" },
        ].map(f => (
          <div key={f.key} style={ci.mb}>
            <label style={ci.label}>{f.label}</label>
            <div style={{ position: "relative" }}>
              <span style={ci.fieldIcon}>{f.icon}</span>
              <input style={{ ...S.input, ...ci.input }} type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.ph} />
            </div>
          </div>
        ))}
        <div style={ci.mb}>
          <label style={ci.label}>Upload Profile Photo</label>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 3 }}>
            <input type="file" accept="image/*" onChange={handlePhotoUpload}
              style={{ fontSize: 11, color: "#6b7280", width: "100%", padding: "6px 8px", borderRadius: 7, border: "1px dashed #d97706", background: "#fffbeb", cursor: "pointer" }} />
            {form.photo && <img src={form.photo} alt="Preview" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "1.5px solid #fbbf24", flexShrink: 0 }} />}
          </div>
        </div>
        <div style={ci.mb}>
          <label style={ci.label}>School / Address</label>
          <textarea style={{ ...S.input, height: 48, resize: "none", fontSize: 12, padding: "7px 10px" }}
            value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="School name and location" />
        </div>
        <div style={ci.mb}>
          <label style={ci.label}>Password</label>
          <div style={{ position: "relative" }}>
            <span style={ci.fieldIcon}>🔒</span>
            <input style={{ ...S.input, ...ci.input }} type={showPass ? "text" : "password"} value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min. 8 characters" />
            <button type="button" onClick={() => setShowPass(!showPass)}
              style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
          <StrengthBar password={form.password} />
        </div>
        <div style={ci.mb}>
          <label style={ci.label}>Confirm Password</label>
          <div style={{ position: "relative" }}>
            <span style={ci.fieldIcon}>🛡️</span>
            <input style={{ ...S.input, ...ci.input }} type="password" value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Re-enter password" />
          </div>
        </div>
        <div style={{ marginBottom: 14 }} />
        <button type="submit" style={{ ...S.primaryBtn, width: "100%", padding: "9px", fontSize: 13 }}>Submit Registration →</button>
      </form>
      <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 12, marginBottom: 0 }}>
        Already registered?{" "}
        <span onClick={onBack} style={{ color: "#d97706", fontWeight: 700, cursor: "pointer" }}>Sign in</span>
      </p>
    </>
  );
}

/* ── Main LoginPage Export ── */
export default function LoginPage({ onLogin }) {
  const [view, setView] = useState("login");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get("reset_token");
    if (token) setView({ type: "reset", token });
  }, []);

  const handleResetDone = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
    setView("login");
  };

  const isResetView = typeof view === "object" && view.type === "reset";

  return (
    <div style={ls.bg}>
      <Particles />
      <style>{globalCSS}</style>
      <div style={ls.panel}>
        {/* Left — illustration */}
        {!isResetView && (
          <div style={ls.left}>
            <LoginIllustration />
            <div style={ls.portalLabel}>
              <span style={{ fontSize: 13 }}>🎓</span>
              <span>SpacECE Teacher Portal</span>
            </div>
          </div>
        )}
        {/* Right — form */}
        <div style={isResetView ? { ...ls.right, maxWidth: 420, margin: "0 auto", flex: "unset", width: "100%" } : ls.right}>
          {isResetView ? (
            <ResetPasswordForm token={view.token} onDone={handleResetDone} />
          ) : view === "login" ? (
            <LoginForm onLogin={onLogin} onGoRegister={() => setView("register")} onGoForgot={() => setView("forgot")} />
          ) : view === "register" ? (
            <RegisterForm onBack={() => setView("login")} />
          ) : (
            <ForgotPasswordForm onBack={() => setView("login")} />
          )}
        </div>
      </div>
    </div>
  );
}

const ls = {
  bg:    { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
           background: "linear-gradient(135deg,#fef3c7 0%,#fde68a 30%,#fbbf24 65%,#f59e0b 100%)",
           position: "relative", overflow: "hidden", padding: "16px",
           fontFamily: "'Segoe UI','Inter',-apple-system,sans-serif" },
  panel: { display: "flex", alignItems: "stretch", background: "rgba(255,255,255,0.97)",
           borderRadius: 18, overflow: "hidden", boxShadow: "0 16px 48px rgba(180,120,0,0.18)",
           border: "1px solid rgba(245,158,11,0.2)", zIndex: 1, width: "100%", maxWidth: 680 },
  left:  { flex: "0 0 300px", background: "linear-gradient(160deg,#fffbeb,#fef3c7)", padding: "36px 20px",
           display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
           borderRight: "1px solid rgba(245,158,11,0.15)", gap: 20 },
  portalLabel: { display: "flex", alignItems: "center", gap: 6,
           fontSize: 12, fontWeight: 700, color: "#92400e", letterSpacing: "0.2px",
           background: "rgba(255,255,255,0.6)", padding: "5px 14px", borderRadius: 20,
           border: "1px solid rgba(217,119,6,0.2)" },
  right: { flex: 1, padding: "32px 32px", display: "flex", flexDirection: "column", justifyContent: "center", overflowY: "auto" },
  badge: { display: "inline-block", padding: "3px 12px", background: "#fef3c7", color: "#92400e",
           borderRadius: 20, fontSize: 11, fontWeight: 600, border: "1px solid #fbbf24" },
};