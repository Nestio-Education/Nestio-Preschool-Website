import { useState, useEffect, useRef } from "react";
import { SectionCard, Badge, S } from "../components/Shared";
import { getParentModules, getParentSessionAssignments, submitParentSessionFeedback, uploadFile } from "../services/api";

/* ═══════════════════════════════════════════
   PARENT CAPACITY BUILDING TAB
═══════════════════════════════════════════ */
export default function ParentCapacityBuildingTab({ user, setToast }) {
  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [sessionLang, setSessionLang] = useState("en");

  useEffect(() => {
    getParentModules({ lang: sessionLang })
      .then(res => {
        const list = res?.modules || [];
        setModules(list);
        if (list.length) setSelectedModuleId(prev => prev || list[0]._id);
      })
      .catch(() => setToast?.({ msg: "Failed to load modules.", type: "error" }));
  }, [sessionLang]);

  const selectedModule = modules.find(m => m._id === selectedModuleId);

  // Snehal change: real per-teacher session status, fetched from backend
  const [sessionAssignments, setSessionAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);

  const loadAssignments = () => {
    if (!selectedModuleId) return;
    setAssignmentsLoading(true);
    getParentSessionAssignments(selectedModuleId)
      .then(res => setSessionAssignments(res?.assignments || []))
      .catch(() => setToast?.({ msg: "Failed to load session status.", type: "error" }))
      .finally(() => setAssignmentsLoading(false));
  };

  useEffect(() => {
    loadAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModuleId]);

  const getAssignment = (sessionNumber) =>
    sessionAssignments.find(a => a.sessionNumber === sessionNumber);

  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const [sessionDetails, setSessionDetails] = useState({ date: "", duration: "", venue: "", parentsPresent: "" });
  const [participants, setParticipants] = useState([{ parentName: "", childName: "", contact: "", attendance: "Present" }]);
  const [feedback, setFeedback] = useState({
    parentParticipation: 0, parentEngagement: 0, understandingLevel: "Good",
    questionsAsked: "", challengesFaced: "", suggestions: "", overallRating: 0, remarks: ""
  });
  const [submitting, setSubmitting] = useState(false);

  // Snehal change: photo + attendance sheet upload state
  const [photoFile, setPhotoFile] = useState(null);
  const [attendanceFile, setAttendanceFile] = useState(null);
  const photoInputRef = useRef(null);
  const attendanceInputRef = useRef(null);

  const statusColor = (status) => {
    if (status === "Completed") return { c: "#059669", bg: "#d1fae5" };
    if (status === "In Progress") return { c: "#2563eb", bg: "#dbeafe" };
    return { c: "#d97706", bg: "#fef3c7" };
  };

  const openFeedback = (sess) => {
    const assignment = getAssignment(sess.sessionNumber);
    setSelectedSession(sess);
    setSelectedAssignment(assignment);
    setSessionDetails({ date: new Date().toISOString().split("T")[0], duration: "", venue: "", parentsPresent: "" });
    setParticipants([{ parentName: "", childName: "", contact: "", attendance: "Present" }]);
    setFeedback({ parentParticipation: 0, parentEngagement: 0, understandingLevel: "Good", questionsAsked: "", challengesFaced: "", suggestions: "", overallRating: 0, remarks: "" });
    setPhotoFile(null);
    setAttendanceFile(null);
    setFeedbackOpen(true);
  };

  const handleAddParticipant = () => {
    setParticipants([...participants, { parentName: "", childName: "", contact: "", attendance: "Present" }]);
  };

  const handleParticipantChange = (idx, field, value) => {
    const updated = [...participants];
    updated[idx][field] = value;
    setParticipants(updated);
  };

  // Snehal change: real submit — uploads files, then saves feedback + marks Completed
  const handleSubmitFeedback = async () => {
    if (!feedback.overallRating) {
      setToast?.({ msg: "Please give an overall session rating.", type: "error" });
      return;
    }
    if (!selectedAssignment?._id) {
      setToast?.({ msg: "Session assignment not found. Please refresh and try again.", type: "error" });
      return;
    }
    setSubmitting(true);
    try {
      let photoUploadId, attendanceSheetUploadId;

      if (photoFile) {
        const photoRes = await uploadFile(photoFile);
        photoUploadId = photoRes?.asset?._id;
      }
      if (attendanceFile) {
        const attRes = await uploadFile(attendanceFile);
        attendanceSheetUploadId = attRes?.asset?._id;
      }

      await submitParentSessionFeedback(selectedAssignment._id, {
        sessionDetails,
        participants,
        feedback,
        photoUploadId,
        attendanceSheetUploadId
      });

      setToast?.({ msg: "Feedback submitted successfully!", type: "success" });
      setFeedbackOpen(false);
      setSelectedSession(null);
      setSelectedAssignment(null);
      loadAssignments();
    } catch (err) {
      setToast?.({ msg: err.message || "Failed to submit feedback.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const stars = (value, onChange, size = 22) => (
    <div style={{ display: "flex", gap: 4, cursor: "pointer" }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} onClick={() => onChange(i)} style={{ fontSize: size, color: i <= value ? "#f59e0b" : "#e5e7eb" }}>{i <= value ? "★" : "☆"}</span>
      ))}
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <h1 style={S.pageTitle}>Parent Capacity Building</h1>
      <p style={S.pageSub}>Sessions assigned to you by the admin</p>

      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <select
          style={{ ...S.input, maxWidth: 340, border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", background: "white", fontWeight: 600, fontSize: 13, color: "#1c1917", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", cursor: "pointer", outline: "none" }}
          value={selectedModuleId}
          onChange={e => setSelectedModuleId(e.target.value)}
        >
          {modules.map(m => (
            <option key={m._id} value={m._id}>Module {m.moduleNumber}: {m.title}</option>
          ))}
        </select>

        <select
          style={{ ...S.input, maxWidth: 160, border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", background: "white", fontWeight: 600, fontSize: 13, color: "#1c1917", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", cursor: "pointer", outline: "none" }}
          value={sessionLang}
          onChange={e => setSessionLang(e.target.value)}
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="mr">मराठी</option>
        </select>
      </div>

      {selectedModule && (
        <SectionCard title="">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {selectedModule.sessions.map(sess => {
              const assignment = getAssignment(sess.sessionNumber);
              const status = assignment?.status || "Pending";
              const sc = statusColor(status);
              return (
                <div key={sess.sessionNumber} style={{ background: "white", border: "1px solid #f1f5f9", borderRadius: 14, padding: "16px 20px", borderLeft: "4px solid #3b82f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1c1917" }}>Session {sess.sessionNumber}: {sess.title}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{sess.objective}</div>
                    </div>
                    <Badge children={status} color={sc.c} bg={sc.bg} />
                  </div>

                  <table style={{ width: "100%", marginTop: 10, borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "#fef3c7", textAlign: "left" }}>
                        <th style={{ padding: "6px 8px" }}>Time</th>
                        <th style={{ padding: "6px 8px" }}>Activity</th>
                        <th style={{ padding: "6px 8px" }}>Key Focus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sess.activities.map((a, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "6px 8px" }}>{a.time}</td>
                          <td style={{ padding: "6px 8px" }}>{a.activity}</td>
                          <td style={{ padding: "6px 8px" }}>{a.keyFocus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {sess.homePractice && (
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 8 }}>Home Practice: {sess.homePractice}</div>
                  )}

                  <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
                    {status === "Completed" ? (
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#059669" }}>✓ Session Completed</span>
                    ) : (
                      <button
                        onClick={() => openFeedback(sess)}
                        disabled={assignmentsLoading}
                        style={{ ...S.primaryBtn, padding: "8px 16px", fontSize: 12 }}
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      )}

      {feedbackOpen && selectedSession && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "white", borderRadius: 20, padding: "28px", width: "100%", maxWidth: 600, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1c1917", margin: 0 }}>Session Feedback — {selectedSession.title}</h3>
              <button onClick={() => setFeedbackOpen(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
            </div>

            <h4 style={{ fontSize: 13, fontWeight: 800, color: "#1c1917", marginBottom: 10 }}>Session Details</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={S.label}>Session Date</label>
                <input style={S.input} type="date" value={sessionDetails.date} onChange={e => setSessionDetails({ ...sessionDetails, date: e.target.value })} />
              </div>
              <div>
                <label style={S.label}>Duration</label>
                <input style={S.input} placeholder="e.g. 90 mins" value={sessionDetails.duration} onChange={e => setSessionDetails({ ...sessionDetails, duration: e.target.value })} />
              </div>
              <div>
                <label style={S.label}>Venue</label>
                <input style={S.input} value={sessionDetails.venue} onChange={e => setSessionDetails({ ...sessionDetails, venue: e.target.value })} />
              </div>
              <div>
                <label style={S.label}>Number of Parents Present</label>
                <input style={S.input} type="number" min="0" value={sessionDetails.parentsPresent} onChange={e => setSessionDetails({ ...sessionDetails, parentsPresent: e.target.value })} />
              </div>
            </div>

            <h4 style={{ fontSize: 13, fontWeight: 800, color: "#1c1917", marginBottom: 10 }}>Participants</h4>
            {participants.map((p, idx) => (
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 100px", gap: 8, marginBottom: 8 }}>
                <input style={S.input} placeholder="Parent Name" value={p.parentName} onChange={e => handleParticipantChange(idx, "parentName", e.target.value)} />
                <input style={S.input} placeholder="Child Name" value={p.childName} onChange={e => handleParticipantChange(idx, "childName", e.target.value)} />
                <input style={S.input} placeholder="Contact Number" value={p.contact} onChange={e => handleParticipantChange(idx, "contact", e.target.value)} />
                <select style={S.input} value={p.attendance} onChange={e => handleParticipantChange(idx, "attendance", e.target.value)}>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
            ))}
            <button onClick={handleAddParticipant} style={{ ...S.exportBtn, marginBottom: 20 }}>+ Add Participant</button>

            <h4 style={{ fontSize: 13, fontWeight: 800, color: "#1c1917", marginBottom: 10 }}>Uploads</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div>
                <label style={S.label}>Session Photo</label>
                <input type="file" ref={photoInputRef} accept="image/*" style={{ display: "none" }}
                  onChange={e => setPhotoFile(e.target.files?.[0] || null)} />
                <div onClick={() => photoInputRef.current?.click()} style={{ border: "2px dashed #fbbf24", borderRadius: 10, padding: "14px", textAlign: "center", cursor: "pointer", background: "#fffbeb" }}>
                  <div style={{ fontSize: 20 }}>📷</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: photoFile ? "#059669" : "#92400e" }}>
                    {photoFile ? photoFile.name : "Upload photo"}
                  </div>
                </div>
              </div>
              <div>
                <label style={S.label}>Attendance Sheet</label>
                <input type="file" ref={attendanceInputRef} accept="image/*,.pdf" style={{ display: "none" }}
                  onChange={e => setAttendanceFile(e.target.files?.[0] || null)} />
                <div onClick={() => attendanceInputRef.current?.click()} style={{ border: "2px dashed #fbbf24", borderRadius: 10, padding: "14px", textAlign: "center", cursor: "pointer", background: "#fffbeb" }}>
                  <div style={{ fontSize: 20 }}>📋</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: attendanceFile ? "#059669" : "#92400e" }}>
                    {attendanceFile ? attendanceFile.name : "Upload attendance sheet"}
                  </div>
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: 13, fontWeight: 800, color: "#1c1917", marginBottom: 10 }}>Teacher Feedback</h4>
            <div style={{ marginBottom: 12 }}>
              <label style={S.label}>Parent Participation Rating</label>
              {stars(feedback.parentParticipation, (v) => setFeedback({ ...feedback, parentParticipation: v }))}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={S.label}>Parent Engagement Rating</label>
              {stars(feedback.parentEngagement, (v) => setFeedback({ ...feedback, parentEngagement: v }))}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={S.label}>Understanding Level</label>
              <select style={S.input} value={feedback.understandingLevel} onChange={e => setFeedback({ ...feedback, understandingLevel: e.target.value })}>
                <option>Excellent</option>
                <option>Good</option>
                <option>Average</option>
                <option>Poor</option>
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={S.label}>Questions Asked</label>
              <textarea style={{ ...S.input, height: 60 }} value={feedback.questionsAsked} onChange={e => setFeedback({ ...feedback, questionsAsked: e.target.value })} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={S.label}>Challenges Faced</label>
              <textarea style={{ ...S.input, height: 60 }} value={feedback.challengesFaced} onChange={e => setFeedback({ ...feedback, challengesFaced: e.target.value })} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={S.label}>Suggestions</label>
              <textarea style={{ ...S.input, height: 60 }} value={feedback.suggestions} onChange={e => setFeedback({ ...feedback, suggestions: e.target.value })} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={S.label}>Overall Session Rating *</label>
              {stars(feedback.overallRating, (v) => setFeedback({ ...feedback, overallRating: v }), 26)}
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Additional Remarks</label>
              <textarea style={{ ...S.input, height: 60 }} value={feedback.remarks} onChange={e => setFeedback({ ...feedback, remarks: e.target.value })} />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button style={S.exportBtn} onClick={() => setFeedbackOpen(false)}>Cancel</button>
              <button style={S.primaryBtn} disabled={submitting} onClick={handleSubmitFeedback}>{submitting ? "Submitting..." : "Submit Feedback"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}