import { useState, useEffect } from "react";
import { SectionCard, S, Badge } from "../components/Shared";

export default function AttendanceManager({ user }) {
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceDict, setAttendanceDict] = useState({});
  const [isSavedRecord, setIsSavedRecord] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState("");
  const [pendingAttendanceChange, setPendingAttendanceChange] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const storageKeyStudents = `spaceece_students_${user.subject}`;
  const storageKeyAttendance = `spaceece_attendance_${user.subject}`;

  // 1. Load Sorted Students and Attendance Sheet for the chosen date dynamically
  useEffect(() => {
    const savedStudents = JSON.parse(localStorage.getItem(storageKeyStudents) || "[]");
    setStudents(savedStudents);

    const savedRecords = JSON.parse(localStorage.getItem(storageKeyAttendance) || "{}");
    
    if (savedRecords[selectedDate]) {
      // Historical data found! Load past attendance sheet records
      setAttendanceDict(savedRecords[selectedDate]);
      setIsSavedRecord(true);
    } else {
      // Fresh new attendance record profile
      const initial = {};
      savedStudents.forEach(st => {
        initial[st.rollNo] = "P";
      });
      setAttendanceDict(initial);
      setIsSavedRecord(false);
    }
  }, [selectedDate, user.subject]);

  // Alert toast auto-clearing message handler
  const triggerToast = (msg, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(""), 3000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  // 2. Add New Child and Automatically Rearrange by Roll Number (Alphabetical order)
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const currentStudents = JSON.parse(localStorage.getItem(storageKeyStudents) || "[]");
    const updatedList = [...currentStudents, { name: newStudentName.trim() }];
    
    // Sort alphabetically by student name
    updatedList.sort((a, b) => a.name.localeCompare(b.name));

    // Re-assign Roll Numbers sequentially starting from 1
    const structuredList = updatedList.map((st, index) => ({
      rollNo: index + 1,
      name: st.name
    }));

    localStorage.setItem(storageKeyStudents, JSON.stringify(structuredList));
    setStudents(structuredList);
    setNewStudentName("");
    setShowAddModal(false);
    triggerToast("Child registered and roll numbers re-sorted!");

    // Dynamically patch state tracking for active view template
    const addedChild = structuredList.find(s => s.name === newStudentName.trim());
    if (addedChild) {
      setAttendanceDict(prev => ({ ...prev, [addedChild.rollNo]: "P" }));
    }
  };

  // 3. Intercept Changes (Requires Verification if updating a previously saved entry)
  const handleStatusToggle = (rollNo, currentStatus) => {
    const nextStatus = currentStatus === "P" ? "A" : currentStatus === "A" ? "L" : "P";

    if (isSavedRecord) {
      // Lock change behind security verification checkpoint
      setPendingAttendanceChange({ rollNo, nextStatus });
      setVerifyPassword("");
      setShowVerifyModal(true);
    } else {
      // Free modification for new sheets
      setAttendanceDict(prev => ({ ...prev, [rollNo]: nextStatus }));
    }
  };

  // 4. Verify Password against Profile Credentials
  const handleVerifyAndUpdate = (e) => {
    e.preventDefault();
    
    if (verifyPassword === user.password) {
      if (pendingAttendanceChange) {
        const { rollNo, nextStatus } = pendingAttendanceChange;
        setAttendanceDict(prev => ({ ...prev, [rollNo]: nextStatus }));
      }
      setShowVerifyModal(false);
      setPendingAttendanceChange(null);
      triggerToast("Authorization verified. Attendance entry modified successfully!");
    } else {
      triggerToast("Incorrect verification credentials.", true);
    }
  };

  // 5. Save Sheet to Persistence Cache
  const handleSaveSheet = () => {
    const savedRecords = JSON.parse(localStorage.getItem(storageKeyAttendance) || "{}");
    savedRecords[selectedDate] = attendanceDict;
    localStorage.setItem(storageKeyAttendance, JSON.stringify(savedRecords));
    setIsSavedRecord(true);
    triggerToast(`Attendance sheet archived successfully for date: ${selectedDate}`);
  };

  // 6. Reset or Un-Archive the sheet to clear history metrics if needed
  const handleClearSheetRecord = () => {
    if (window.confirm("Are you sure you want to delete this archived sheet record from the database history logs?")) {
      const savedRecords = JSON.parse(localStorage.getItem(storageKeyAttendance) || "{}");
      delete savedRecords[selectedDate];
      localStorage.setItem(storageKeyAttendance, JSON.stringify(savedRecords));
      
      // Re-initialize view state back to default present configuration
      const initial = {};
      students.forEach(st => { initial[st.rollNo] = "P"; });
      setAttendanceDict(initial);
      setIsSavedRecord(false);
      triggerToast("Archived record removed. Sheet reset to defaults.");
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={S.pageTitle}>Children Attendance</h1>
          <p style={S.pageSub}>Manage rosters, record daily rolls, and search through past historical sheets.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={S.primaryBtn}>
          + Add New Child
        </button>
      </div>

      {/* Realtime Action Toast Info banners */}
      {successMsg && <div style={{ padding: "12px", marginBottom: "16px", background: "#d1fae5", color: "#065f46", borderRadius: "10px", fontSize: "13px", fontWeight: "600" }}>✓ {successMsg}</div>}
      {errorMsg && <div style={{ padding: "12px", marginBottom: "16px", background: "#fee2e2", color: "#991b1b", borderRadius: "10px", fontSize: "13px", fontWeight: "600" }}>⚠️ {errorMsg}</div>}

      {/* Date Picker Controls with History Status Trackers */}
      <SectionCard title="📅 Target Date Picker Directory Lookup">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ ...S.label, margin: 0, fontWeight: "700" }}>Select Sheet Date:</label>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              style={{ ...S.input, width: "auto", padding: "8px 12px" }}
            />
            
            {/* Dynamic Historical Log Badge Status */}
            {isSavedRecord ? (
              <Badge children="📝 Reviewing Saved Sheet History" color="#1e40af" bg="#dbeafe" />
            ) : (
              <Badge children="✨ New Unsaved Data Register" color="#854d0e" bg="#fef9c3" />
            )}
          </div>
          <Badge children={`Classroom Group: ${user.subject}`} color="#d97706" bg="#fef3c7" />
        </div>
      </SectionCard>

      {/* Main Register List */}
      <div style={{ marginTop: 20 }}>
        <SectionCard title={`👥 Roster List Overview — Date: ${selectedDate} (${students.length} Children)`}>
          {students.length === 0 ? (
            <p style={{ fontSize: 13, color: "#9ca3af", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>
              No children records linked to this account directory yet. Click "+ Add New Child" above to populate your database.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Table Column headers row */}
              <div style={{ display: "flex", alignItems: "center", padding: "8px 16px", background: "#f9fafb", borderRadius: 8, fontWeight: "700", fontSize: 12, color: "#6b7280" }}>
                <div style={{ width: 80 }}>Roll No.</div>
                <div style={{ flex: 1 }}>Full Student Name</div>
                <div style={{ width: 140, textAlign: "right" }}>Status Badge</div>
              </div>

              {/* Dynamic Map Stack Output array */}
              {students.map((st) => {
                const status = attendanceDict[st.rollNo] || "P";
                const badgeStyle = 
                  status === "P" ? { bg: "#d1fae5", text: "#065f46", lbl: "Present" } :
                  status === "A" ? { bg: "#fee2e2", text: "#991b1b", lbl: "Absent" } :
                                   { bg: "#fef3c7", text: "#92400e", lbl: "Leave" };

                return (
                  <div 
                    key={st.rollNo} 
                    style={{ 
                      display: "flex", alignItems: "center", padding: "12px 16px", 
                      background: "white", border: "1px solid #f1f5f9", borderRadius: 10,
                      transition: "all 0.15s"
                    }}
                  >
                    <div style={{ width: 80, fontSize: 13, fontWeight: "800", color: "#d97706" }}>#{st.rollNo}</div>
                    <div style={{ flex: 1, fontSize: 14, fontWeight: "600", color: "#1c1917" }}>{st.name}</div>
                    <div style={{ width: 140, textAlign: "right" }}>
                      <button
                        onClick={() => handleStatusToggle(st.rollNo, status)}
                        style={{
                          border: "none", background: badgeStyle.bg, color: badgeStyle.text,
                          padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: "700",
                          cursor: "pointer"
                        }}
                      >
                        {badgeStyle.lbl}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Action Toolbar footer control cluster */}
              <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  {isSavedRecord && (
                    <button onClick={handleClearSheetRecord} style={{ ...S.exportBtn, color: "#ef4444", border: "1px solid #fca5a5" }}>
                      🗑️ Delete Saved Record Log
                    </button>
                  )}
                </div>
                <button onClick={handleSaveSheet} style={{ ...S.primaryBtn, padding: "10px 24px" }}>
                  {isSavedRecord ? "💾 Update Saved Sheet Changes" : "💾 Archive & Save Attendance Sheet"}
                </button>
              </div>
            </div>
          )}
        </SectionCard>
      </div>

      {/* MODAL 1: Student registration */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "white", borderRadius: 20, padding: "28px", width: "100%", maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1c1917", margin: 0 }}>Register New Pupil</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
            </div>
            <form onSubmit={handleAddStudent}>
              <label style={S.label}>Student Full Name</label>
              <input 
                required
                style={{ ...S.input, marginBottom: 20 }} 
                placeholder="Enter first and last name..."
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
              />
              <button type="submit" style={{ ...S.primaryBtn, width: "100%" }}>➕ Inject and Sort Entry</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Identity Security Authentication lock overlay */}
      {showVerifyModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(5px)" }}>
          <div style={{ background: "white", borderRadius: 20, padding: "28px", width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#991b1b", margin: 0 }}>🔒 Secure Authentication Check</h3>
              <button onClick={() => { setShowVerifyModal(false); setPendingAttendanceChange(null); }} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
            </div>
            <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>
              You are updating a previously saved history sheet profile for this calendar date. Please enter your teacher login password credentials to authenticate.
            </p>
            <form onSubmit={handleVerifyAndUpdate}>
              <label style={S.label}>Password Credential Verification</label>
              <input 
                required
                type="password" 
                style={{ ...S.input, marginBottom: 20 }} 
                placeholder="••••••••"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
              />
              <button type="submit" style={{ ...S.primaryBtn, background: "linear-gradient(135deg, #ef4444, #b91c1c)", width: "100%" }}>
                Confirm Profile Authorization Check
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}