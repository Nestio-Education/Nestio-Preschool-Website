import { useState } from "react";
import { Logo, Toast, Particles, S, globalCSS } from "../components/Shared";

const ADMIN_CREDENTIALS = { email:"admin@spaceece.com", password:"Admin@123" };

/* ── Animated illustration ── */
function LoginIllustration() {
  return (
    <div style={{ position:"relative", width:320, height:320, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div className="glow-ring ring-1"/><div className="glow-ring ring-2"/><div className="glow-ring ring-3"/>
      <div className="blob-wrap">
        <div className="blob blob-a"/><div className="blob blob-b"/><div className="blob blob-c"/>
        <div className="cap-center">🎓</div>
      </div>
      <div className="orbit orbit-a"><div className="planet p-blue"/></div>
      <div className="orbit orbit-b"><div className="planet p-violet"/></div>
      <div className="orbit orbit-c"><div className="planet p-teal"/></div>
      <div className="orbit orbit-d"><div className="planet p-amber"/></div>
      {["📐 Math","🔬 Science","📜 History","📖 Literature","⚛️ Physics","🌍 Geography"].map((l,i)=>(
        <div key={i} className={`chip chip-${i+1}`}>{l}</div>
      ))}
      <svg className="arcs-svg" viewBox="0 0 370 370" fill="none">
        <path d="M185 30 Q340 100 320 185 Q300 270 185 340 Q70 270 50 185 Q30 100 185 30Z"
          stroke="url(#g1)" strokeWidth="1" strokeDasharray="8 6" opacity="0.35">
          <animateTransform attributeName="transform" type="rotate" from="0 185 185" to="360 185 185" dur="18s" repeatCount="indefinite"/>
        </path>
        <path d="M185 55 Q310 110 295 185 Q280 260 185 315 Q90 260 75 185 Q60 110 185 55Z"
          stroke="url(#g2)" strokeWidth="1.5" strokeDasharray="12 8" opacity="0.28">
          <animateTransform attributeName="transform" type="rotate" from="360 185 185" to="0 185 185" dur="14s" repeatCount="indefinite"/>
        </path>
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="370" y2="370" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#d97706"/></linearGradient>
          <linearGradient id="g2" x1="370" y1="0" x2="0" y2="370" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#1c1917"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ── Login Form ── */
function LoginForm({ onLogin, onGoRegister }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [toast, setToast]       = useState({ msg:"", type:"" });

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email||!password) { setToast({ msg:"Please fill in all fields.", type:"error" }); return; }
    if (email===ADMIN_CREDENTIALS.email && password===ADMIN_CREDENTIALS.password) {
      onLogin({ role:"admin", name:"Admin", email }); return;
    }
    const teachers = JSON.parse(localStorage.getItem("spaceece_teachers")||"[]");
    const teacher  = teachers.find(t=>t.email===email && t.password===password);
    if (teacher) {
      if (teacher.status==="pending")  { setToast({ msg:"Your account is pending admin approval.", type:"error" }); return; }
      if (teacher.status==="rejected") { setToast({ msg:"Your account has been rejected.", type:"error" }); return; }
      onLogin({ role:"teacher", ...teacher }); return;
    }
    setToast({ msg:"Incorrect credentials. Please try again.", type:"error" });
  };

  return (
    <>
      <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast({msg:"",type:""})}/>
      <Logo size={160}/>
      <div style={{ textAlign:"center", marginBottom:22 }}>
        <span style={ls.badge}>Welcome Back</span>
        <p style={{ fontSize:12, color:"#9ca3af", marginTop:6, fontStyle:"italic" }}>Sign in to your account</p>
      </div>
      <form onSubmit={handleLogin}>
        <label style={S.label}>Email Address</label>
        <div style={{ position:"relative", marginBottom:14 }}>
          <span style={S.fieldIcon}></span>
          <input style={S.input} type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"/>
        </div>
        <label style={S.label}>Password</label>
        <div style={{ position:"relative", marginBottom:20 }}>
          <span style={S.fieldIcon}></span>
          <input style={S.input} type={showPass?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password"/>
          <button type="button" onClick={()=>setShowPass(!showPass)}
            style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16, color:"#9ca3af" }}>
            {showPass?"🙈":"👁️"}
          </button>
        </div>
        <button type="submit" style={{ ...S.primaryBtn, width:"100%", padding:"12px" }}>Sign In →</button>
      </form>
      <p style={{ textAlign:"center", fontSize:12, color:"#9ca3af", marginTop:16, marginBottom:0 }}>
        New teacher?{" "}
        <span onClick={onGoRegister} style={{ color:"#d97706", fontWeight:700, cursor:"pointer" }}>Register here</span>
      </p>
    </>
  );
}

/* ── Password Strength ── */
function StrengthBar({ password }) {
  let s=0;
  if(password.length>=8)s++; if(/[A-Z]/.test(password))s++; if(/[0-9]/.test(password))s++; if(/[^A-Za-z0-9]/.test(password))s++;
  const colors=["#ef4444","#f59e0b","#3b82f6","#10b981"];
  const labels=["Weak","Fair","Good","Strong"];
  if(!password) return null;
  return (
    <div style={{ marginTop:6 }}>
      <div style={{ display:"flex", gap:4, marginBottom:3 }}>
        {[0,1,2,3].map(i=><div key={i} style={{ flex:1, height:4, borderRadius:4, background:i<s?colors[s-1]:"rgba(0,0,0,0.08)", transition:"background 0.3s" }}/>)}
      </div>
      <span style={{ fontSize:11, color:colors[s-1], fontWeight:600 }}>{labels[s-1]}</span>
    </div>
  );
}

/* ── Register Form ── */
function RegisterForm({ onBack }) {
  const [form, setForm] = useState({ name:"",email:"",phone:"",address:"",subject:"",password:"",confirmPassword:"" });
  const [showPass, setShowPass] = useState(false);
  const [toast, setToast]       = useState({ msg:"", type:"" });

  const handleRegister = (e) => {
    e.preventDefault();
    const { name,email,phone,address,subject,password,confirmPassword } = form;
    if(!name||!email||!phone||!address||!subject||!password||!confirmPassword) { setToast({msg:"Please fill all fields.",type:"error"}); return; }
    if(password!==confirmPassword) { setToast({msg:"Passwords do not match.",type:"error"}); return; }
    if(password.length<8) { setToast({msg:"Password must be at least 8 characters.",type:"error"}); return; }
    const teachers = JSON.parse(localStorage.getItem("spaceece_teachers")||"[]");
    if(teachers.find(t=>t.email===email)) { setToast({msg:"Email already registered.",type:"error"}); return; }
    const newTeacher = { id:Date.now(), name,email,phone,address,subject,password,
      status:"pending", joined:new Date().toLocaleDateString("en-IN"),
      attendance:0, classes:0, students:0, batch:"", course:"", revenue:0 };
    localStorage.setItem("spaceece_teachers", JSON.stringify([...teachers, newTeacher]));
    setToast({msg:"Registration submitted! Awaiting admin approval.",type:"success"});
    setTimeout(onBack, 2000);
  };

  return (
    <>
      <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast({msg:"",type:""})}/>
      <Logo size={140}/>
      <div style={{ textAlign:"center", marginBottom:20 }}>
        <span style={ls.badge}>Teacher Registration</span>
        <p style={{ fontSize:12, color:"#9ca3af", marginTop:6, fontStyle:"italic" }}>Admin will approve your account</p>
      </div>
      <form onSubmit={handleRegister}>
        <div style={{ display:"flex", gap:12 }}>
          <div style={{ flex:1 }}>
            <label style={S.label}>Full Name</label>
            <div style={{ position:"relative", marginBottom:12 }}>
              <span style={S.fieldIcon}>👤</span>
              <input style={S.input} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Dr. Jane Smith"/>
            </div>
          </div>
          <div style={{ flex:1 }}>
            <label style={S.label}>Subject</label>
            <div style={{ position:"relative", marginBottom:12 }}>
              <span style={S.fieldIcon}>📘</span>
              <input style={S.input} value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="Mathematics"/>
            </div>
          </div>
        </div>
        {[
          {key:"email",label:"Email",icon:"📧",type:"email",ph:"teacher@school.edu"},
          {key:"phone",label:"Phone",icon:"📱",type:"tel",ph:"+91 98765 43210"},
        ].map(f=>(
          <div key={f.key}>
            <label style={S.label}>{f.label}</label>
            <div style={{ position:"relative", marginBottom:12 }}>
              <span style={S.fieldIcon}>{f.icon}</span>
              <input style={S.input} type={f.type} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} placeholder={f.ph}/>
            </div>
          </div>
        ))}
        <label style={S.label}>School / Address</label>
        <textarea style={{ ...S.input, height:56, resize:"none", marginBottom:12 }}
          value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="School name and location"/>
        <label style={S.label}>Password</label>
        <div style={{ position:"relative", marginBottom:4 }}>
          <span style={S.fieldIcon}>🔒</span>
          <input style={S.input} type={showPass?"text":"password"} value={form.password}
            onChange={e=>setForm({...form,password:e.target.value})} placeholder="Min. 8 characters"/>
          <button type="button" onClick={()=>setShowPass(!showPass)}
            style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16 }}>
            {showPass?"🙈":"👁️"}
          </button>
        </div>
        <StrengthBar password={form.password}/>
        <div style={{ marginTop:12, marginBottom:20 }}>
          <label style={S.label}>Confirm Password</label>
          <div style={{ position:"relative" }}>
            <span style={S.fieldIcon}>🛡️</span>
            <input style={S.input} type="password" value={form.confirmPassword}
              onChange={e=>setForm({...form,confirmPassword:e.target.value})} placeholder="Re-enter password"/>
          </div>
        </div>
        <button type="submit" style={{ ...S.primaryBtn, width:"100%", padding:"12px" }}>Submit Registration →</button>
      </form>
      <p style={{ textAlign:"center", fontSize:12, color:"#9ca3af", marginTop:14, marginBottom:0 }}>
        Already registered?{" "}
        <span onClick={onBack} style={{ color:"#d97706", fontWeight:700, cursor:"pointer" }}>Sign in</span>
      </p>
    </>
  );
}

/* ── Main LoginPage Export ── */
export default function LoginPage({ onLogin }) {
  const [view, setView] = useState("login"); // login | register

  return (
    <div style={ls.bg}>
      <Particles/>
      <style>{globalCSS}</style>
      <div style={ls.panel}>
        {/* Left — illustration */}
        <div style={ls.left}>
          <LoginIllustration/>
          <p style={{ fontSize:13, fontWeight:600, color:"#92400e", marginTop:20, letterSpacing:"0.3px" }}>
            🎓 SpacECE Teacher Portal
          </p>
        </div>
        {/* Right — form */}
        <div style={ls.right}>
          {view==="login"
            ? <LoginForm    onLogin={onLogin} onGoRegister={()=>setView("register")}/>
            : <RegisterForm onBack={()=>setView("login")}/>
          }
        </div>
      </div>
    </div>
  );
}

const ls = {
  bg:    { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
           background:"linear-gradient(135deg,#fef3c7 0%,#fde68a 30%,#fbbf24 65%,#f59e0b 100%)",
           position:"relative", overflow:"hidden", padding:"24px",
           fontFamily:"'Segoe UI','Inter',-apple-system,sans-serif" },
  panel: { display:"flex", alignItems:"stretch", background:"rgba(255,255,255,0.97)",
           borderRadius:24, overflow:"hidden", boxShadow:"0 20px 60px rgba(180,120,0,0.18)",
           border:"1px solid rgba(245,158,11,0.2)", zIndex:1, width:"100%", maxWidth:900 },
  left:  { flex:"0 0 440px", background:"linear-gradient(160deg,#fffbeb,#fef3c7)", padding:"48px 32px",
           display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
           borderRight:"1px solid rgba(245,158,11,0.15)" },
  right: { flex:1, padding:"48px 44px", display:"flex", flexDirection:"column", justifyContent:"center", overflowY:"auto" },
  badge: { display:"inline-block", padding:"4px 14px", background:"#fef3c7", color:"#92400e",
           borderRadius:20, fontSize:12, fontWeight:600, border:"1px solid #fbbf24" },
};