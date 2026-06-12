import { useState, useRef } from "react";
import { Logo, Toast, Badge, StatusBadge, StatCard, SectionCard, S, globalCSS } from "../components/Shared";
import AttendanceManager from "./AttendanceManager";
import TrainingAndClassroomManager from "./TrainingAndClassroomManager";
import GeotagAttendance from "./GeotagAttendance";

/* ═══════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════ */
const MOCK_SCHEDULE = [
  { time: "08:00 AM", class: "Grade 5A", topic: "Number Patterns",        room: "101", status: "completed" },
  { time: "09:30 AM", class: "Grade 6B", topic: "Algebraic Expressions",  room: "203", status: "ongoing"   },
  { time: "11:00 AM", class: "Grade 5B", topic: "Fractions & Decimals",   room: "101", status: "upcoming"  },
  { time: "01:00 PM", class: "Grade 7A", topic: "Geometry Basics",        room: "305", status: "upcoming"  },
  { time: "02:30 PM", class: "Grade 6A", topic: "Statistics",             room: "203", status: "upcoming"  },
  { time: "04:00 PM", class: "Grade 7B", topic: "Problem Solving Workshop",room: "Lab", status: "upcoming" },
];

const MOCK_GRADES = [
  { class: "Grade 5A", students: 38, avg: 82, highest: 98, lowest: 54, assignments: 8, completed: 7 },
  { class: "Grade 5B", students: 35, avg: 78, highest: 95, lowest: 48, assignments: 8, completed: 6 },
  { class: "Grade 6A", students: 40, avg: 85, highest: 100,lowest: 62, assignments: 8, completed: 8 },
  { class: "Grade 6B", students: 42, avg: 79, highest: 97, lowest: 50, assignments: 8, completed: 5 },
  { class: "Grade 7A", students: 36, avg: 88, highest: 99, lowest: 65, assignments: 8, completed: 8 },
  { class: "Grade 7B", students: 39, avg: 76, highest: 94, lowest: 45, assignments: 8, completed: 6 },
];

const MOCK_ATTENDANCE_MONTHLY = [
  { month: "Jan", val: 95 },{ month: "Feb", val: 88 },{ month: "Mar", val: 92 },
  { month: "Apr", val: 87 },{ month: "May", val: 90 },{ month: "Jun", val: 94 },
];

const MOCK_ASSIGNMENTS = [
  { id: 1, title: "Lesson Plan — Number Patterns",      course: "Pre-Primary Training", due: "05/06/2026", status: "pending",  score: null },
  { id: 2, title: "Activity Worksheet Set",             course: "Pre-Primary Training", due: "01/06/2026", status: "approved", score: 95   },
  { id: 3, title: "Assessment Tool Design",             course: "Pre-Primary Training", due: "28/05/2026", status: "revision", score: null },
  { id: 4, title: "Classroom Management Report",        course: "Pre-Primary Training", due: "20/05/2026", status: "approved", score: 88   },
];

const MOCK_COURSES = [
  { id: 1, title: "Pre-Primary Teacher Training",      progress: 72, total: 24, completed: 17, nextSession: "02/06/2026", status: "active"   },
  { id: 2, title: "Child Psychology & Development",    progress: 45, total: 16, completed: 7,  nextSession: "08/06/2026", status: "active"   },
  { id: 3, title: "Curriculum Design & Lesson Planning",progress: 0, total: 20, completed: 0,  nextSession: "15/06/2026", status: "enrolled" },
];

const MOCK_CERTIFICATES = [
  { id: 1, title: "Pre-Primary Teacher Training — Level 1", issued: "15/03/2026", grade: "A+", credentialId: "SPC-2026-001" },
  { id: 2, title: "Child Safety & Wellbeing",               issued: "10/02/2026", grade: "A",  credentialId: "SPC-2026-002" },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, type: "session",     msg: "Live session tomorrow at 10:00 AM — Classroom Management",  time: "2h ago",  read: false },
  { id: 2, type: "assignment",  msg: "Assignment reviewed — Activity Worksheet scored 95/100",     time: "5h ago",  read: false },
  { id: 3, type: "approval",    msg: "Assignment needs revision — Reattempt by 05/06/2026",        time: "1d ago",  read: true  },
  { id: 4, type: "certificate", msg: "Your certificate for Child Safety has been issued",           time: "3d ago",  read: true  },
  { id: 5, type: "course",      msg: "New course available — Curriculum Design & Lesson Planning", time: "5d ago",  read: true  },
];

/* ═══════════════════════════════════════════
   TAB COMPONENTS
═══════════════════════════════════════════ */

function OverviewTab({ user, setActiveTab }) {
  const attendance = user.attendance || 90;
  const attColor   = attendance>=85 ? "#10b981" : attendance>=70 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", borderRadius: 20, padding: "24px 28px", marginBottom: 24, color: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 6px", letterSpacing: "-0.3px" }}>Good morning, {user.name?.split(" ")[0]}! 👋</h1>
          <p style={{ fontSize: 13, margin: 0, opacity: 0.88 }}>{user.subject} Teacher · {user.batch || "SpacECE"} · {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}</p>
        </div>
        <div style={{ fontSize: 48, opacity: 0.7 }}>🎓</div>
      </div>

      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700 }}>
        <span style={{ fontSize: 18 }}>📍</span>
        <span>Working Center : {user.workingCenter || "Dhayri, Pune, Maharashtra"}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 16, marginBottom: 24, marginTop: 16 }}>
        <StatCard icon="📚" label="My Classes"     val={user.classes||6}   color="#f59e0b" bg="#fef3c7"/>
        <StatCard icon="👥" label="Total Students" val={user.students||230} color="#3b82f6" bg="#dbeafe"/>
        <StatCard icon="📊" label="Attendance"     val={`${attendance}%`}  color={attColor} bg={attendance>=85?"#d1fae5":attendance>=70?"#fef3c7":"#fee2e2"}/>
        <StatCard icon="📝" label="Avg Grade"      val="82%"               color="#8b5cf6" bg="#ede9fe"/>
        <StatCard icon="🏆" label="Certificates"   val={MOCK_CERTIFICATES.length} color="#06b6d4" bg="#cffafe"/>
        <StatCard icon="⏳" label="Pending Tasks"  val={MOCK_ASSIGNMENTS.filter(a=>a.status==="pending"||a.status==="revision").length} color="#ef4444" bg="#fee2e2"/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <SectionCard title="📈 My Monthly Attendance">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 220, paddingTop: 15 }}>
            {MOCK_ATTENDANCE_MONTHLY.map((d, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <span style={{ marginBottom: 8, fontSize: 12, fontWeight: 800, color: d.val >= 90 ? "#10b981" : d.val >= 80 ? "#f59e0b" : "#ef4444" }}>{d.val}%</span>
                <div style={{ width: 36, height: `${d.val * 1.6}px`, borderRadius: "12px 12px 0 0", background: d.val >= 90 ? "linear-gradient(180deg,#34d399,#10b981)" : d.val >= 80 ? "linear-gradient(180deg,#fbbf24,#f59e0b)" : "linear-gradient(180deg,#f87171,#ef4444)", transition: "all .6s ease" }}/>
                <span style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: "#6b7280" }}>{d.month}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="📚 Course Progress">
          {MOCK_COURSES.map((c,i)=>(
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{c.title.split(" ").slice(0,3).join(" ")}...</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#f59e0b" }}>{c.progress}%</span>
              </div>
              <div style={{ height: 6, background: "#f3f4f6", borderRadius: 4, overflow: "hidden", marginBottom: 2 }}>
                <div style={{ height: "100%", width: `${c.progress}%`, background: "linear-gradient(90deg,#f59e0b,#d97706)", borderRadius: 4 }}/>
              </div>
              <div style={{ fontSize: 10, color: "#9ca3af" }}>{c.completed}/{c.total} modules · Next: {c.nextSession}</div>
            </div>
          ))}
          <button onClick={()=>setActiveTab("courses")} style={{ fontSize: 12, color: "#d97706", fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 4 }}>View all courses →</button>
        </SectionCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <SectionCard title="📅 Today's Classes">
          {MOCK_SCHEDULE.slice(0,4).map((cl,i)=>{
            const statusColor = { completed: "#10b981", ongoing: "#f59e0b", upcoming: "#6b7280" };
            return (
              <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor[cl.status], marginTop: 5, flexShrink: 0 }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1c1917" }}>{cl.class} — {cl.topic}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af" }}>{cl.time} · Room {cl.room}</div>
                </div>
                <StatusBadge status={cl.status}/>
              </div>
            );
          })}
          <button onClick={()=>setActiveTab("schedule")} style={{ fontSize: 12, color: "#d97706", fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 8 }}>Full schedule →</button>
        </SectionCard>

        <SectionCard title="📝 Assignment Status">
          {MOCK_ASSIGNMENTS.map((a,i)=>(
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: a.status==="approved"?"#10b981":a.status==="revision"?"#ef4444":"#f59e0b" }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#1c1917" }}>{a.title.substring(0,28)}...</div>
                <div style={{ fontSize: 10, color: "#9ca3af" }}>Due: {a.due}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {a.score && <span style={{ fontSize: 11, fontWeight: 800, color: "#10b981" }}>{a.score}/100</span>}
                <StatusBadge status={a.status}/>
              </div>
            </div>
          ))}
          <button onClick={()=>setActiveTab("assignments")} style={{ fontSize: 12, color: "#d97706", fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 8 }}>View all →</button>
        </SectionCard>
      </div>
    </div>
  );
}

function CoursesTab() {
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <h1 style={S.pageTitle}>My Courses</h1>
      <p style={S.pageSub}>Your enrolled courses and learning progress</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {MOCK_COURSES.map((c,i)=>(
          <div key={i} style={{ background: "white", borderRadius: 16, padding: "22px 24px", border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", borderLeft: `4px solid ${c.status==="active"?"#f59e0b":"#3b82f6"}` }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1c1917", margin: "0 0 6px" }}>{c.title}</h3>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <StatusBadge status={c.status}/>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>📅 Next session: {c.nextSession}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#f59e0b" }}>{c.progress}%</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>Complete</div>
              </div>
            </div>
            <div style={{ height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ height: "100%", width: `${c.progress}%`, background: "linear-gradient(90deg,#f59e0b,#d97706)", borderRadius: 4, transition: "width 1s" }}/>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#6b7280" }}>📖 {c.completed} / {c.total} modules completed</span>
              <button style={{ ...S.primaryBtn, padding: "7px 16px", fontSize: 12 }}>{c.progress>0 ? "Continue →" : "Start →"}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScheduleTab({ user }) {
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <h1 style={S.pageTitle}>My Schedule</h1>
      <p style={S.pageSub}>Subject: {user.subject} · {user.classes||6} classes today</p>
      <SectionCard title="📅 Today's Timetable">
        {MOCK_SCHEDULE.map((cl,i)=>{
          const bg = { completed: "#f0fdf4", ongoing: "#fffbeb", upcoming: "white" };
          const dot= { completed: "#10b981", ongoing: "#f59e0b", upcoming: "#d1d5db" };
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 16px", background: bg[cl.status], borderRadius: 10, marginBottom: 8, border: "1px solid #f3f4f6" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: dot[cl.status], flexShrink: 0 }}/>
              <div style={{ width: 90, fontSize: 13, fontWeight: 800, color: "#d97706", flexShrink: 0 }}>{cl.time}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1c1917" }}>{cl.class}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>📖 {cl.topic}</div>
              </div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>🚪 Room {cl.room}</div>
              <StatusBadge status={cl.status}/>
            </div>
          );
        })}
      </SectionCard>
    </div>
  );
}

function GradesTab() {
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <h1 style={S.pageTitle}>Grades Overview</h1>
      <p style={S.pageSub}>Student performance across all classes</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {MOCK_GRADES.map((g,i)=>(
          <div key={i} style={{ background: "white", borderRadius: 16, padding: "20px", border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", borderTop: `3px solid ${g.avg>=85?"#10b981":g.avg>=75?"#f59e0b":"#ef4444"}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#1c1917" }}>{g.class}</div>
              <Badge children={`${g.students} students`} color="#d97706" bg="#fef3c7"/>
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#f59e0b", letterSpacing: "-1px", marginBottom: 8 }}>{g.avg}%</div>
            <div style={{ height: 8, background: "#f3f4f6", borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ height: "100%", width: `${g.avg}%`, borderRadius: 4, background: g.avg>=85?"#10b981":g.avg>=75?"#f59e0b":"#ef4444" }}/>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af", marginBottom: 10 }}>
              <span>🏆 Highest: <b style={{ color: "#10b981" }}>{g.highest}%</b></span>
              <span>📉 Lowest: <b style={{ color: "#ef4444" }}>{g.lowest}%</b></span>
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", paddingTop: 10, borderTop: "1px solid #f3f4f6" }}>📝 Assignments: {g.completed}/{g.assignments} submitted</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AssignmentsTab() {
  const [uploadModal, setUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile({ name: file.name, size: (file.size / (1024 * 1024)).toFixed(2) + " MB" });
    }
  };

  const handleCloseModal = () => { setUploadModal(false); setSelectedFile(null); };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={S.pageTitle}>My Assignments</h1>
          <p style={S.pageSub}>{MOCK_ASSIGNMENTS.filter(a=>a.status==="pending").length} pending · {MOCK_ASSIGNMENTS.filter(a=>a.status==="revision").length} needs revision</p>
        </div>
        <button onClick={()=>setUploadModal(true)} style={S.primaryBtn}>+ Submit Assignment</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {MOCK_ASSIGNMENTS.map(a=>(
          <div key={a.id} style={{ background: "white", borderRadius: 14, padding: "16px 20px", border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", borderLeft: `4px solid ${a.status==="approved"?"#10b981":a.status==="revision"?"#ef4444":"#f59e0b"}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 24 }}>{a.status==="approved"?"✅":a.status==="revision"?"🔁":"📝"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1c1917" }}>{a.title}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{a.course} · Due: {a.due}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {a.score && <span style={{ fontSize: 16, fontWeight: 800, color: "#10b981" }}>{a.score}/100</span>}
                <StatusBadge status={a.status}/>
                {(a.status==="revision"||a.status==="pending") &&
                  <button onClick={()=>setUploadModal(true)} style={{ ...S.primaryBtn, padding: "6px 12px", fontSize: 12 }}>{a.status==="revision"?"Resubmit":"Submit"}</button>
                }
              </div>
            </div>
            {a.status==="revision" && (
              <div style={{ marginTop: 10, padding: "8px 12px", background: "#fef2f2", borderRadius: 8, fontSize: 12, color: "#991b1b" }}>⚠️ Revision required — please review admin feedback and resubmit.</div>
            )}
          </div>
        ))}
      </div>

      {uploadModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "white", borderRadius: 20, padding: "28px", width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1c1917", margin: 0 }}>Submit Assignment</h3>
              <button onClick={handleCloseModal} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
            </div>
            <label style={S.label}>Assignment Title</label>
            <input style={{ ...S.input, marginBottom: 12 }} placeholder="Enter assignment title"/>
            <label style={S.label}>Upload File</label>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.docx,.ppt,.pptx" style={{ display: "none" }}/>
            <div onClick={()=>fileInputRef.current?.click()} style={{ border: "2px dashed #fbbf24", borderRadius: 12, padding: "24px", textAlign: "center", marginBottom: 16, background: "#fffbeb", cursor: "pointer" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📎</div>
              {selectedFile ? (
                <>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>📄 File Added Successfully!</div>
                  <div style={{ fontSize: 12, color: "#374151", marginTop: 4, fontWeight: 600, wordBreak: "break-all" }}>{selectedFile.name}</div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Size: {selectedFile.size}</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#92400e" }}>Click to add from your device</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>PDF, DOCX, PPT up to 10MB</div>
                </>
              )}
            </div>
            <label style={S.label}>Notes (Optional)</label>
            <textarea style={{ ...S.input, height: 70, resize: "none", marginBottom: 20 }} placeholder="Any notes for the reviewer..."/>
            <button onClick={handleCloseModal} style={{ ...S.primaryBtn, width: "100%" }}>📤 Submit Assignment</button>
          </div>
        </div>
      )}
    </div>
  );
}

function CertificatesTab() {
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <h1 style={S.pageTitle}>My Certificates</h1>
      <p style={S.pageSub}>{MOCK_CERTIFICATES.length} certificates earned</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 16 }}>
        {MOCK_CERTIFICATES.map((c,i)=>(
          <div key={i} style={{ background: "linear-gradient(135deg,#fffbeb,#fef3c7)", borderRadius: 20, padding: "28px 24px", border: "2px solid #fbbf24", position: "relative", overflow: "hidden", boxShadow: "0 4px 20px rgba(245,158,11,0.15)" }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "#fbbf24", opacity: 0.15 }}/>
            <div style={{ position: "absolute", bottom: -30, left: -20, width: 100, height: 100, borderRadius: "50%", background: "#f59e0b", opacity: 0.1 }}/>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏆</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#1c1917", marginBottom: 8, lineHeight: 1.4 }}>{c.title}</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <Badge children={`Grade: ${c.grade}`} color="#059669" bg="#d1fae5"/>
              <Badge children={c.issued} color="#d97706" bg="#fef3c7"/>
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 16 }}>🔑 Credential ID: <span style={{ fontWeight: 700, color: "#374151" }}>{c.credentialId}</span></div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...S.primaryBtn, flex: 1, textAlign: "center" }}>⬇ Download PDF</button>
              <button style={{ ...S.exportBtn, flex: 1, textAlign: "center" }}>🔗 Share</button>
            </div>
          </div>
        ))}
        <div style={{ background: "#f9fafb", borderRadius: 20, padding: "28px 24px", border: "2px dashed #e5e7eb", opacity: 0.7 }}>
          <div style={{ fontSize: 40, marginBottom: 12, filter: "grayscale(1)" }}>🔒</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#9ca3af", marginBottom: 8 }}>Curriculum Design Certificate</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 16 }}>Complete the course to unlock this certificate</div>
          <div style={{ height: 6, background: "#e5e7eb", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "45%", background: "#d1d5db", borderRadius: 4 }}/>
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>45% complete</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PROFILE TAB  (with editable Working Center)
───────────────────────────────────────── */
function ProfileTab({ user, onWorkingCenterChange }) {
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name:          user.name          || "Bhavarth Surgude",
    phone:         user.phone         || "+91 98765 43210",
    address:       user.address       || "Pune, Maharashtra, India",
    workingCenter: user.workingCenter || "Dhayri, Pune, Maharashtra",
    subject:       user.subject       || "Computer Applications",
    degree:        "M.Sc. Computer Applications",
    university:    "University of Pune",
    netStatus:     "UGC NET Qualified",
    netDesc:       "Assistant Professor Eligibility",
    expYears:      "3+ Years Active",
    expBio:        "Senior Pre-Primary Core Instructor & Curriculum Designer specializing in childhood developmental tracking logic and technology-based pedagogy framework."
  });

  const [savedForm, setSavedForm] = useState({ ...form });

  const handleSave = () => {
    setSavedForm({ ...form });
    onWorkingCenterChange && onWorkingCenterChange(form.workingCenter);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({ ...savedForm });
    setEditing(false);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease", maxWidth: 640 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div>
          <h1 style={S.pageTitle}>My Profile</h1>
          <p style={S.pageSub}>Your account information and settings</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {editing && (
            <button onClick={handleCancel} style={S.exportBtn}>✕ Cancel</button>
          )}
          <button
            onClick={editing ? handleSave : () => setEditing(true)}
            style={editing ? { ...S.primaryBtn, background: "linear-gradient(135deg,#10b981,#059669)" } : S.primaryBtn}
          >
            {editing ? "💾 Save Changes" : "✏️ Edit Profile"}
          </button>
        </div>
      </div>

      {/* Basic info card */}
      <div style={{ background: "white", borderRadius: 20, padding: "28px", border: "1px solid #f1f5f9", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ width: 72, height: 72, borderRadius: 16, background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "white" }}>
            {form.name?.[0]}
          </div>
          <div style={{ flex: 1 }}>
            {editing ? (
              <input style={{ ...S.input, padding: "6px 10px", fontSize: 16, fontWeight: 700, width: "80%" }} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            ) : (
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1c1917", margin: "0 0 6px" }}>{form.name}</h2>
            )}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
              <Badge children={`${form.subject} Teacher`} color="#1d4ed8" bg="#dbeafe"/>
              <Badge children={user.batch || "SpacECE"} color="#d97706" bg="#fef3c7"/>
            </div>
          </div>
        </div>

        {/* 2-column info fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { icon: "📧", label: "Email",      val: user.email,         key: "email",   editable: false },
            { icon: "📱", label: "Phone",      val: form.phone,         key: "phone",   editable: true  },
            { icon: "📍", label: "Address",    val: form.address,       key: "address", editable: true  },
            { icon: "📅", label: "Joined",     val: user.joined,        key: "joined",  editable: false },
            { icon: "📚", label: "Subject",    val: form.subject,       key: "subject", editable: true  },
            { icon: "📊", label: "Attendance", val: `${user.attendance||90}%`, key: "", editable: false },
          ].map((r,i)=>(
            <div key={i} style={{ background: "#f9fafb", borderRadius: 10, padding: "10px 14px", border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{r.label}</div>
              {editing && r.editable ? (
                <input style={{ ...S.input, padding: "5px 8px", fontSize: 12, background: "white" }} value={r.val} onChange={e=>setForm({...form,[r.key]:e.target.value})}/>
              ) : (
                <div style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>{r.icon} {r.val}</div>
              )}
            </div>
          ))}
        </div>

        {/* Working Center — full-width, always visible, editable when editing */}
        <div style={{ marginTop: 12, background: editing ? "#fffbeb" : "#f9fafb", borderRadius: 10, padding: "12px 14px", border: `1px solid ${editing ? "#fbbf24" : "#f3f4f6"}`, transition: "background 0.2s, border-color 0.2s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Working Center</div>
            {editing && (
              <span style={{ fontSize: 10, background: "#fef3c7", color: "#92400e", fontWeight: 700, borderRadius: 20, padding: "1px 8px", border: "1px solid #fbbf24" }}>Editable</span>
            )}
          </div>
          {editing ? (
            <input
              style={{ ...S.input, padding: "7px 10px", fontSize: 13, background: "white", width: "100%", boxSizing: "border-box" }}
              value={form.workingCenter}
              onChange={e => setForm({ ...form, workingCenter: e.target.value })}
              placeholder="e.g. Dhayri, Pune, Maharashtra"
            />
          ) : (
            <div style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>📍 {form.workingCenter}</div>
          )}
        </div>
      </div>

      {/* Portfolio & Qualifications */}
      <div style={{ background: "white", borderRadius: 20, padding: "24px 28px", border: "1px solid #f1f5f9", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: "#1c1917", margin: "0 0 16px" }}>🎓 Portfolio & Qualifications</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px", background: "#f8fafc" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>📜</span>
              <Badge children="Highest Degree" color="#1e40af" bg="#dbeafe"/>
            </div>
            {editing ? (
              <>
                <input style={{ ...S.input, padding: "4px 8px", fontSize: 12, background: "white", marginBottom: 4 }} value={form.degree} onChange={e=>setForm({...form,degree:e.target.value})}/>
                <input style={{ ...S.input, padding: "4px 8px", fontSize: 11, background: "white" }} value={form.university} onChange={e=>setForm({...form,university:e.target.value})}/>
              </>
            ) : (
              <>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#1c1917", marginTop: 8 }}>{form.degree}</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{form.university}</div>
              </>
            )}
          </div>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px", background: "#f8fafc" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>⚡</span>
              <Badge children="National Level" color="#065f46" bg="#d1fae5"/>
            </div>
            {editing ? (
              <>
                <input style={{ ...S.input, padding: "4px 8px", fontSize: 12, background: "white", marginBottom: 4 }} value={form.netStatus} onChange={e=>setForm({...form,netStatus:e.target.value})}/>
                <input style={{ ...S.input, padding: "4px 8px", fontSize: 11, background: "white" }} value={form.netDesc} onChange={e=>setForm({...form,netDesc:e.target.value})}/>
              </>
            ) : (
              <>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#1c1917", marginTop: 8 }}>{form.netStatus}</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{form.netDesc}</div>
              </>
            )}
          </div>
        </div>

        <div style={{ border: "1px solid #f1f5f9", borderRadius: 12, padding: "14px 16px", background: "#fffbeb" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>💼</span>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e" }}>Professional Work Experience</div>
            </div>
            {editing ? (
              <input style={{ ...S.input, padding: "3px 6px", fontSize: 11, background: "white", width: 100, textAlign: "right" }} value={form.expYears} onChange={e=>setForm({...form,expYears:e.target.value})}/>
            ) : (
              <span style={{ fontSize: 11, fontWeight: 800, color: "#b45309" }}>{form.expYears}</span>
            )}
          </div>
          {editing ? (
            <textarea style={{ ...S.input, height: 60, fontSize: 12, background: "white", resize: "none", lineHeight: 1.4 }} value={form.expBio} onChange={e=>setForm({...form,expBio:e.target.value})}/>
          ) : (
            <div style={{ marginTop: 6, fontSize: 13, color: "#374151", fontWeight: 600, lineHeight: 1.5 }}>{form.expBio}</div>
          )}
        </div>

        {editing && (
          <button onClick={handleSave} style={{ ...S.primaryBtn, width: "100%", marginTop: 16, background: "linear-gradient(135deg,#f59e0b,#d97706)" }}>
            💾 Save Portfolio Details
          </button>
        )}
      </div>

      {/* Change Password */}
      <div style={{ background: "white", borderRadius: 16, padding: "20px 24px", border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: "#1c1917", margin: "0 0 14px" }}>🔒 Change Password</h3>
        {["Current Password","New Password","Confirm New Password"].map((label,i)=>(
          <div key={i} style={{ marginBottom: 12 }}>
            <label style={S.label}>{label}</label>
            <input style={S.input} type="password" placeholder="••••••••"/>
          </div>
        ))}
        <button style={{ ...S.primaryBtn, marginTop: 4 }}>Update Password</button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const icons = { session: "📹", assignment: "📝", approval: "✅", certificate: "🏆", course: "📚" };
  const markAll = () => setNotifications(prev=>prev.map(n=>({...n,read:true})));

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={S.pageTitle}>Notifications</h1>
          <p style={S.pageSub}>{notifications.filter(n=>!n.read).length} unread</p>
        </div>
        <button onClick={markAll} style={S.exportBtn}>✓ Mark all read</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {notifications.map(n=>(
          <div key={n.id} onClick={()=>setNotifications(prev=>prev.map(p=>p.id===n.id?{...p,read:true}:p))} style={{ background: n.read?"white":"#fffbeb", borderRadius: 14, padding: "14px 18px", border: `1px solid ${n.read?"#f1f5f9":"#fbbf24"}`, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", borderLeft: `4px solid ${n.read?"#e5e7eb":"#f59e0b"}` }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: n.read?"#f3f4f6":"#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{icons[n.type]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: n.read?500:700, color: "#1c1917" }}>{n.msg}</div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{n.time}</div>
            </div>
            {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", flexShrink: 0 }}/>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN TEACHER DASHBOARD
═══════════════════════════════════════════ */
export default function TeacherDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab]         = useState("overview");
  const [toast, setToast]                 = useState({ msg: "", type: "" });
  // workingCenter lives here so OverviewTab reflects changes saved in ProfileTab
  const [workingCenter, setWorkingCenter] = useState(user.workingCenter || "Dhayri, Pune, Maharashtra");

  const unreadCount = MOCK_NOTIFICATIONS.filter(n=>!n.read).length;

  const navItems = [
    { key: "overview",      label: "Teacher's Dashboard", icon: "📊" },
    { key: "children_att",  label: "Daily Attendance",    icon: "📋" },
    { key: "geotag",        label: "Geotag Attendance",   icon: "📍" },
    { key: "training",      label: "Training & Lessons",  icon: "🎓" },
    { key: "courses",       label: "My Courses",          icon: "📚" },
    { key: "schedule",      label: "Schedule",            icon: "📅" },
    { key: "grades",        label: "Grades",              icon: "📝" },
    { key: "assignments",   label: "Assignments",         icon: "✏️", badge: MOCK_ASSIGNMENTS.filter(a=>a.status==="pending"||a.status==="revision").length },
    { key: "certificates",  label: "Certificates",        icon: "🏆" },
    { key: "notifications", label: "Notifications",       icon: "🔔", badge: unreadCount },
    { key: "profile",       label: "My Profile",          icon: "👤" },
  ];

  // Pass live workingCenter to every child
  const enrichedUser = { ...user, workingCenter };

  const renderContent = () => {
    switch(activeTab) {
      case "overview":      return <OverviewTab user={enrichedUser} setActiveTab={setActiveTab}/>;
      case "children_att":  return <AttendanceManager user={enrichedUser}/>;
      case "geotag":        return <GeotagAttendance user={enrichedUser}/>;
      case "training":      return <TrainingAndClassroomManager user={enrichedUser}/>;
      case "courses":       return <CoursesTab/>;
      case "schedule":      return <ScheduleTab user={enrichedUser}/>;
      case "grades":        return <GradesTab/>;
      case "assignments":   return <AssignmentsTab/>;
      case "certificates":  return <CertificatesTab/>;
      case "notifications": return <NotificationsTab/>;
      case "profile":       return <ProfileTab user={enrichedUser} onWorkingCenterChange={setWorkingCenter}/>;
      default:              return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI','Inter',-apple-system,sans-serif" }}>
      <style>{globalCSS}</style>
      <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast({msg:"",type:""})}/>

      {/* Sidebar */}
      <div style={{ width: 240, background: "white", borderRight: "1px solid #f1f5f9", display: "flex", flexDirection: "column", flexShrink: 0, boxShadow: "2px 0 12px rgba(0,0,0,0.04)", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ padding: "20px 16px 12px" }}>
          <Logo size={120}/>
          <div style={{ textAlign: "center", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: "#dbeafe", color: "#1e40af", border: "1px solid #bfdbfe", margin: "6px auto 0", display: "inline-block", width: "fit-content" }}>
            🎓 Teacher Panel
          </div>
        </div>
        <nav style={{ padding: "4px 10px", flex: 1 }}>
          {navItems.map(item=>(
            <button key={item.key} onClick={()=>setActiveTab(item.key)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", border: "none", borderRadius: 10, background: activeTab===item.key?"#dbeafe":"transparent", color: activeTab===item.key?"#1e40af":"#6b7280", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textAlign: "left", marginBottom: 2, transition: "all 0.18s" }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge>0 && <span style={{ background: "#ef4444", color: "white", borderRadius: 20, fontSize: 10, fontWeight: 800, padding: "1px 7px" }}>{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "white", flexShrink: 0 }}>{user.name?.[0]}</div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1c1917" }}>{user.name?.split(" ")[0]}</div>
            <div style={{ fontSize: 10, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.subject}</div>
          </div>
          <button onClick={onLogout} title="Sign Out" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#9ca3af", padding: 4 }}>⏻</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, width: "0px", minWidth: "0px", padding: "28px 32px", overflowY: "auto", maxHeight: "100vh" }}>
        {renderContent()}
      </div>
    </div>
  );
}