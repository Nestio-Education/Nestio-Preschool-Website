import { useState, useEffect, useRef } from "react";
import { SectionCard, S, Badge, StatusBadge } from "../components/Shared";
import {
  getTeacherLessonPlans,
  getTeacherLessonReports,
  submitLessonCompletion,
  getActivities,
  submitActivity,
  getTeacherMe,
  uploadFile
} from "../services/api";

export default function TrainingAndClassroomManager({ user }) {
  const [activeSubTab, setActiveSubTab] = useState("courses");
  const [lessonPlans, setLessonPlans] = useState([]);
  const [activities, setActivities] = useState([]);
  const [reports, setReports] = useState([]);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Completion modal state
  const [completionModal, setCompletionModal] = useState(null);
  const [teachingNotes, setTeachingNotes] = useState("");
  const [activityDescription, setActivityDescription] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  // New activity form state
  const [newActivityTitle, setNewActivityTitle] = useState("");
  const [newActivityType, setNewActivityType] = useState("Image");
  const [newActivityLessonId, setNewActivityLessonId] = useState("");

  // New report form state
  const [reportTopic, setReportTopic] = useState("");
  const [reportText, setReportText] = useState("");
  const [reportLessonId, setReportLessonId] = useState("");

  // Common file states
  const [selectedFileObj, setSelectedFileObj] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const [toastMsg, setToastMsg] = useState("");

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const refreshData = async () => {
    try {
      const profile = await getTeacherMe();
      if (profile && profile.teacher) {
        setTeacherProfile(profile.teacher);
      }
      
      const lpRes = await getTeacherLessonPlans();
      if (lpRes && lpRes.lessonPlans) {
        setLessonPlans(lpRes.lessonPlans);
      }
      
      const actRes = await getActivities();
      if (actRes && actRes.activities) {
        setActivities(actRes.activities);
      }
      
      const repRes = await getTeacherLessonReports();
      if (repRes && repRes.reports) {
        setReports(repRes.reports);
      }
    } catch (err) {
      console.error("Error loading training manager data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  // Handle native device input file change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileObj(file);
      setSelectedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB"
      });
    }
  };

  // Trigger file attachment browsing
  const triggerFileBrowser = () => {
    fileInputRef.current?.click();
  };

  const handleCompleteLessonPlan = async (e) => {
    e.preventDefault();
    if (!completionModal) return;
    
    setSubmittingReport(true);
    try {
      let fileId = "";
      if (selectedFileObj) {
        const uploadRes = await uploadFile(selectedFileObj);
        if (uploadRes && uploadRes.asset) {
          fileId = uploadRes.asset._id;
        }
      }
      
      const payload = {
        teachingNotes,
        activityDescription: activityDescription || "Lesson Plan Completed",
        files: fileId ? [fileId] : []
      };
      
      await submitLessonCompletion(completionModal._id, payload);
      triggerToast("Lesson plan marked complete! Completion report saved.");
      
      // Reset modal state
      setCompletionModal(null);
      setTeachingNotes("");
      setActivityDescription("");
      setSelectedFile(null);
      setSelectedFileObj(null);
      
      refreshData();
    } catch (err) {
      console.error(err);
      alert("Failed to save completion report: " + err.message);
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) return;
    
    setLoading(true);
    try {
      let fileId = "";
      if (selectedFileObj) {
        const uploadRes = await uploadFile(selectedFileObj);
        if (uploadRes && uploadRes.asset) {
          fileId = uploadRes.asset._id;
        }
      }
      
      const payload = {
        center: teacherProfile?.teacherProfile?.center?._id || teacherProfile?.teacherProfile?.center || undefined,
        class: teacherProfile?.teacherProfile?.class?._id || teacherProfile?.teacherProfile?.class || undefined,
        lessonPlan: newActivityLessonId || undefined,
        description: newActivityTitle.trim(),
        files: fileId ? [fileId] : []
      };
      
      await submitActivity(payload);
      triggerToast("Classroom activity media asset uploaded successfully!");
      
      // Reset inputs & files
      setNewActivityTitle("");
      setNewActivityLessonId("");
      setSelectedFile(null);
      setSelectedFileObj(null);
      
      refreshData();
    } catch (err) {
      console.error(err);
      alert("Failed to submit activity: " + err.message);
      setLoading(false);
    }
  };

  const handleAddReport = async (e) => {
    e.preventDefault();
    if (!reportLessonId || !reportText.trim()) return;
    
    setLoading(true);
    try {
      let fileId = "";
      if (selectedFileObj) {
        const uploadRes = await uploadFile(selectedFileObj);
        if (uploadRes && uploadRes.asset) {
          fileId = uploadRes.asset._id;
        }
      }
      
      const payload = {
        teachingNotes: reportTopic ? `${reportTopic.trim()}: ${reportText.trim()}` : reportText.trim(),
        activityDescription: "Teaching Log Report Entry",
        files: fileId ? [fileId] : []
      };
      
      await submitLessonCompletion(reportLessonId, payload);
      triggerToast("Teaching notes and report saved successfully!");
      
      // Reset inputs & files
      setReportTopic("");
      setReportText("");
      setReportLessonId("");
      setSelectedFile(null);
      setSelectedFileObj(null);
      
      refreshData();
    } catch (err) {
      console.error(err);
      alert("Failed to submit report: " + err.message);
      setLoading(false);
    }
  };

  // Dynamically group lessonPlans by Course
  const coursesMap = {};
  lessonPlans.forEach(item => {
    const lp = item.lessonPlan;
    if (!lp || !lp.course) return;
    const course = lp.course;
    if (!coursesMap[course._id]) {
      coursesMap[course._id] = {
        id: course._id,
        title: course.title,
        description: course.description || "Advanced methods for ECCE early childhood care.",
        hours: course.duration || "24 Hrs",
        lessons: []
      };
    }
    coursesMap[course._id].lessons.push(item);
  });
  const coursesData = Object.values(coursesMap);

  if (loading && lessonPlans.length === 0 && reports.length === 0) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", fontSize: 14, color: "#64748b", fontWeight: 700 }}>
        🔄 Loading Training & Classroom Portal Data...
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={S.pageTitle}>Training & Classroom Portal</h1>
        <p style={S.pageSub}>Access assigned courses, complete lesson plan tasks, upload activities, and submit teaching notes.</p>
      </div>

      {toastMsg && (
        <div style={{ padding: "12px", marginBottom: "16px", background: "#d1fae5", color: "#065f46", borderRadius: "10px", fontSize: "13px", fontWeight: "600" }}>
          ✓ {toastMsg}
        </div>
      )}

      {/* Internal Navigation Menu Bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
        {[
          { key: "courses", label: "📚 Courses & Lesson Plans", icon: "🎓" },
          { key: "activities", label: "🎨 Upload Activities", icon: "🧩" },
          { key: "reports", label: "📝 Notes & Teaching Reports", icon: "📋" }
        ].map(sub => (
          <button
            key={sub.key}
            onClick={() => {
              setActiveSubTab(sub.key);
              // Reset file states when switching tabs
              setSelectedFile(null);
              setSelectedFileObj(null);
            }}
            style={{
              padding: "8px 16px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "700",
              background: activeSubTab === sub.key ? "#fffbeb" : "transparent",
              color: activeSubTab === sub.key ? "#d97706" : "#64748b",
              borderBottom: activeSubTab === sub.key ? "3px solid #d97706" : "none",
              transition: "all 0.2s"
            }}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: Courses Progress Tracking */}
      {activeSubTab === "courses" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <SectionCard title="📈 Track My Training Progress">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {coursesData.length === 0 ? (
                <div style={{ gridColumn: "span 2", padding: 20, textAlign: "center", color: "#64748b", background: "#f8fafc", borderRadius: 12, border: "1px dashed #cbd5e1" }}>
                  No active training progress logs.
                </div>
              ) : (
                coursesData.map(c => {
                  const completeCount = c.lessons.filter(l => l.status === "completed" || l.status === "reviewed").length;
                  const pct = c.lessons.length ? Math.round((completeCount / c.lessons.length) * 100) : 0;

                  return (
                    <div key={c.id} style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#1c1917", margin: 0 }}>{c.title}</h4>
                        <Badge children={c.hours} color="#1e40af" bg="#dbeafe" />
                      </div>
                      <p style={{ fontSize: "12px", color: "#64748b", marginTop: 4, marginBottom: 12 }}>{c.description}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "700", marginBottom: 4 }}>
                        <span style={{ color: "#d97706" }}>Course Progress ({completeCount}/{c.lessons.length} lessons)</span>
                        <span>{pct}% Complete</span>
                      </div>
                      <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #f59e0b, #d97706)" }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </SectionCard>

          <SectionCard title="📖 View & Complete Lesson Plans">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {lessonPlans.length === 0 ? (
                <div style={{ padding: 30, textAlign: "center", color: "#94a3b8", background: "white", border: "1px dashed #e2e8f0", borderRadius: 10 }}>
                  No assigned lesson plans found in the database.
                </div>
              ) : (
                lessonPlans.map(item => {
                  const lp = item.lessonPlan;
                  if (!lp) return null;
                  const isDone = item.status === "completed" || item.status === "reviewed";
                  return (
                    <div key={item._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "white", border: "1px solid #f1f5f9", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.01)" }}>
                      <div>
                        <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", color: "#94a3b8" }}>{lp.course?.title || "General Course"}</span>
                        <h5 style={{ fontSize: "13px", fontWeight: "700", color: "#1c1917", margin: "2px 0 0" }}>{lp.title}</h5>
                        {lp.objectives && <span style={{ fontSize: "11px", color: "#64748b", display: "block", marginTop: 2 }}>🎯 Objectives: {lp.objectives}</span>}
                        {lp.instructions && <span style={{ fontSize: "11px", color: "#94a3b8", display: "block" }}>📋 Instructions: {lp.instructions}</span>}
                      </div>
                      <button
                        disabled={isDone}
                        onClick={() => {
                          setSelectedFile(null);
                          setSelectedFileObj(null);
                          setCompletionModal(item);
                        }}
                        style={{
                          border: "none", borderRadius: "20px", padding: "6px 14px", fontSize: "11px", fontWeight: "800", cursor: isDone ? "not-allowed" : "pointer",
                          background: isDone ? "#d1fae5" : "#f1f5f9",
                          color: isDone ? "#065f46" : "#475569"
                        }}
                      >
                        {isDone ? "✓ Complete" : "Mark Complete"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </SectionCard>
        </div>
      )}

      {/* SUB-TAB 2: Upload Activities */}
      {activeSubTab === "activities" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 20 }}>
          <SectionCard title="📤 Upload New Classroom Activity">
            <form onSubmit={handleAddActivity}>
              <div style={{ marginBottom: 12 }}>
                <label style={S.label}>Activity Title / Goal</label>
                <input required value={newActivityTitle} onChange={e => setNewActivityTitle(e.target.value)} style={S.input} placeholder="e.g., Color Matching Exercise" />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={S.label}>Associated Lesson Plan (Optional)</label>
                <select value={newActivityLessonId} onChange={e => setNewActivityLessonId(e.target.value)} style={S.input}>
                  <option value="">-- Choose Lesson Plan --</option>
                  {lessonPlans.map(item => (
                    <option key={item._id} value={item.lessonPlan?._id}>{item.lessonPlan?.title}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>Activity Classification Type</label>
                <select value={newActivityType} onChange={e => setNewActivityType(e.target.value)} style={S.input}>
                  <option value="Image">📸 Photographic Upload (.JPG / .PNG)</option>
                  <option value="Video">🎥 Video Demonstration (.MP4)</option>
                  <option value="Document">📄 Classroom Resource Guide (.PDF)</option>
                </select>
              </div>

              {/* Native Hidden Device File Picker Input */}
              <input 
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*,video/*,application/pdf"
              />

              {/* Action Container for Picking Files */}
              <div 
                onClick={triggerFileBrowser}
                style={{ padding: "24px", border: "2px dashed #fbbf24", borderRadius: "12px", background: "#fffbeb", textAlign: "center", marginBottom: 16, cursor: "pointer" }}
              >
                <span style={{ fontSize: "28px" }}>📎</span>
                {selectedFile ? (
                  <>
                    <p style={{ fontSize: "13px", fontWeight: "700", color: "#059669", margin: "4px 0 0" }}>File attached securely!</p>
                    <p style={{ fontSize: "11px", color: "#1c1917", margin: "4px 0 0", wordBreak: "break-all", fontWeight: "600" }}>{selectedFile.name}</p>
                    <p style={{ fontSize: "10px", color: "#64748b", margin: "2px 0 0" }}>Size: {selectedFile.size}</p>
                  </>
                ) : (
                  <p style={{ fontSize: "12px", fontWeight: "700", color: "#92400e", margin: "4px 0 0" }}>Drag & drop or browse student classroom files</p>
                )}
              </div>
              <button type="submit" style={{ ...S.primaryBtn, width: "100%" }}>Publish Activity Log</button>
            </form>
          </SectionCard>

          <SectionCard title="📂 Activity Submission Archives">
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "500px", overflowY: "auto" }}>
              {activities.length === 0 ? (
                <div style={{ padding: 30, textAlign: "center", color: "#94a3b8", border: "1px dashed #e2e8f0", borderRadius: 10 }}>
                  No classroom activities submitted yet.
                </div>
              ) : (
                activities.map(act => (
                  <div key={act._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px" }}>
                    <div style={{ overflow: "hidden", paddingRight: "8px" }}>
                      <div style={{ fontSize: "13px", fontWeight: "700", color: "#1c1917" }}>{act.description}</div>
                      <div style={{ fontSize: "11px", color: "#64748b", marginTop: 2 }}>
                        Lesson: <b>{act.lessonPlan?.title || "General Classroom Activity"}</b>
                      </div>
                      <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: 2 }}>
                        Posted: {act.activityDate ? new Date(act.activityDate).toLocaleDateString() : new Date(act.createdAt).toLocaleDateString()}
                      </div>
                      {act.files && act.files.length > 0 && (
                        <div style={{ fontSize: "10px", color: "#059669", fontWeight: "600", marginTop: "2px" }}>
                          📄 {act.files.map(f => f.originalName || "attachment").join(", ")}
                        </div>
                      )}
                      {act.adminComments && (
                        <div style={{ fontSize: "11px", color: "#991b1b", marginTop: 4, background: "#fef2f2", padding: "4px 8px", borderRadius: 4 }}>
                          💬 Feedback: <i>{act.adminComments}</i>
                        </div>
                      )}
                    </div>
                    <StatusBadge status={act.status} />
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>
      )}

      {/* SUB-TAB 3: Notes & Reports */}
      {activeSubTab === "reports" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 20 }}>
          <SectionCard title="✍️ Draft Teaching Note / Progress Report">
            <form onSubmit={handleAddReport}>
              <div style={{ marginBottom: 12 }}>
                <label style={S.label}>Select Lesson Plan to Report On</label>
                <select required value={reportLessonId} onChange={e => setReportLessonId(e.target.value)} style={S.input}>
                  <option value="">-- Choose Lesson --</option>
                  {lessonPlans.map(item => (
                    <option key={item._id} value={item._id}>{item.lessonPlan?.title}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={S.label}>Report Core Subject / Focus Topic</label>
                <input required value={reportTopic} onChange={e => setReportTopic(e.target.value)} style={S.input} placeholder="e.g., Weekly Phonics Class Performance Log" />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={S.label}>Observation Summary Details</label>
                <textarea required value={reportText} onChange={e => setReportText(e.target.value)} style={{ ...S.input, height: "110px", resize: "none" }} placeholder="Type detailed class notes or performance reports here..." />
              </div>

              <input 
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*,video/*,application/pdf"
              />

              <div 
                onClick={triggerFileBrowser}
                style={{ padding: "16px", border: "2px dashed #fbbf24", borderRadius: "12px", background: "#fffbeb", textAlign: "center", marginBottom: 16, cursor: "pointer" }}
              >
                <span style={{ fontSize: "20px" }}>📎</span>
                {selectedFile ? (
                  <p style={{ fontSize: "11px", color: "#059669", margin: "4px 0 0", fontWeight: "600" }}>{selectedFile.name}</p>
                ) : (
                  <p style={{ fontSize: "11px", fontWeight: "700", color: "#92400e", margin: "4px 0 0" }}>Attach report file (Optional)</p>
                )}
              </div>

              <button type="submit" style={{ ...S.primaryBtn, width: "100%" }}>Save Report Entry</button>
            </form>
          </SectionCard>

          <SectionCard title="🗃️ Historic Saved Notebook Logs">
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: "500px", overflowY: "auto" }}>
              {reports.length === 0 ? (
                <div style={{ padding: 30, textAlign: "center", color: "#94a3b8", border: "1px dashed #e2e8f0", borderRadius: 10 }}>
                  No saved teaching notebook logs found.
                </div>
              ) : (
                reports.map(rep => (
                  <div key={rep._id} style={{ padding: "14px", background: "white", border: "1px solid #f1f5f9", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: "13px", fontWeight: "800", color: "#d97706" }}>📌 {rep.assignment?.lessonPlan?.title || "Lesson Completion Report"}</span>
                      <span style={{ fontSize: "11px", color: "#94a3b8" }}>{new Date(rep.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#475569", margin: "4px 0", lineHeight: "1.5" }}>{rep.teachingNotes}</p>
                    {rep.activityDescription && (
                      <div style={{ fontSize: "11px", color: "#64748b", marginTop: 4 }}>
                        Description: <i>{rep.activityDescription}</i>
                      </div>
                    )}
                    {rep.files && rep.files.length > 0 && (
                      <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {rep.files.map(f => (
                          <a key={f._id} href={f.publicUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "10px", background: "#f1f5f9", padding: "2px 6px", borderRadius: 4, color: "#d97706", textDecoration: "none", fontWeight: 700 }}>
                            📎 {f.originalName || "View Evidence"}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>
      )}

      {/* Lesson Completion Modal */}
      {completionModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(4px)" }}>
          <form onSubmit={handleCompleteLessonPlan} style={{ background: "white", borderRadius: 20, padding: "28px", width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1c1917", margin: 0 }}>Lesson Completion Report</h3>
              <button type="button" onClick={() => setCompletionModal(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>✕</button>
            </div>
            
            <div style={{ marginBottom: 12, fontSize: 13, background: "#fffbeb", padding: "10px 14px", borderRadius: 8, border: "1px solid #fbbf24", color: "#92400e", fontWeight: 700 }}>
              📖 Lesson: {completionModal.lessonPlan?.title}
            </div>

            <label style={S.label}>Teaching Notes / Observations</label>
            <textarea required value={teachingNotes} onChange={e => setTeachingNotes(e.target.value)} style={{ ...S.input, height: 80, resize: "none", marginBottom: 12 }} placeholder="Detail children's engagement, phonics milestones, etc..."/>
            
            <label style={S.label}>Classroom Activity / Demonstration</label>
            <input required type="text" value={activityDescription} onChange={e => setActivityDescription(e.target.value)} style={{ ...S.input, marginBottom: 12 }} placeholder="e.g. Alphabet tracking in sand play"/>

            <label style={S.label}>Upload File / Evidence (Optional)</label>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.docx,.ppt,.pptx,image/*,video/*" style={{ display: "none" }}/>
            <div onClick={triggerFileBrowser} style={{ border: "2px dashed #fbbf24", borderRadius: 12, padding: "20px", textAlign: "center", marginBottom: 16, background: "#fffbeb", cursor: "pointer" }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>📎</div>
              {selectedFile ? (
                <>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#059669" }}>📄 File Attached Securely!</div>
                  <div style={{ fontSize: 11, color: "#374151", marginTop: 2, fontWeight: 600, wordBreak: "break-all" }}>{selectedFile.name}</div>
                  <div style={{ fontSize: 10, color: "#6b7280" }}>Size: {selectedFile.size}</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#92400e" }}>Click to add from your device</div>
                  <div style={{ fontSize: 10, color: "#9ca3af" }}>Image, PDF, Video up to 10MB</div>
                </>
              )}
            </div>

            <button type="submit" disabled={submittingReport} style={{ ...S.primaryBtn, width: "100%" }}>
              {submittingReport ? "Uploading & Submitting..." : "📤 Submit Completion Report"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}