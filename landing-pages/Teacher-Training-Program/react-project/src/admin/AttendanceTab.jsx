import { useEffect, useMemo, useState } from "react";
import { Modal, S, SectionCard, StatCard, StatusBadge } from "../components/Shared";
import { getTeacherAttendance } from "../services/api";

/* ── Audit Log Entry ── */
function AuditLogEntry({ entry }) {
  return (
    <div style={{ display: "flex", gap: 8, padding: "7px 0", borderBottom: "1px solid #f3f4f6", alignItems: "flex-start" }}>
      <div style={{ width: 24, height: 24, borderRadius: 6, background: "#f0f9ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>📝</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: "#1c1917", fontWeight: 600 }}>{entry.action}</div>
        <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 1 }}>{entry.by} · {entry.time}</div>
      </div>
    </div>
  );
}

/* ── Edit Record Modal ── */
function EditRecordModal({ record, onSave, onClose }) {
  const [status, setStatus] = useState(record.status);
  const [note, setNote]     = useState(record.note || "");

  const handleSave = () => {
    onSave({ ...record, status, note, markedBy: "admin", editedAt: new Date().toLocaleString("en-IN") });
    onClose();
  };

  return (
    <Modal title={`✏️ Edit — ${record.teacher?.name || "Teacher"}`} onClose={onClose}>
      <div style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 12px", marginBottom: 12, fontSize: 11, color: "#6b7280" }}>
        Date: <b>{record.attendanceDate ? new Date(record.attendanceDate).toLocaleDateString("en-IN") : "—"}</b>
      </div>
      <label style={{ ...S.label, fontSize: 11 }}>Status</label>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {["present", "late", "absent", "excused"].map((s) => (
          <button key={s} onClick={() => setStatus(s)}
            style={{ flex: 1, padding: "6px 4px", borderRadius: 7, border: `1.5px solid ${status === s ? "#f59e0b" : "#e5e7eb"}`, background: status === s ? "#fef3c7" : "white", color: status === s ? "#92400e" : "#6b7280", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
            {s}
          </button>
        ))}
      </div>
      <label style={{ ...S.label, fontSize: 11 }}>Note</label>
      <textarea style={{ ...S.input, height: 60, resize: "none", marginBottom: 12, fontSize: 11 }} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason for change..." />
      <div style={{ background: "#fef3c7", border: "1px solid #fbbf24", borderRadius: 7, padding: "7px 10px", fontSize: 10, color: "#92400e", marginBottom: 14 }}>
        ⚠️ This edit will be logged in the audit trail.
      </div>
      <button onClick={handleSave} style={{ ...S.primaryBtn, width: "100%", fontSize: 12 }}>Save Change →</button>
    </Modal>
  );
}

/* ── Export CSV ── */
function exportCsv(rows) {
  const csv = rows.map((row) => row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "teacher-attendance.csv"; a.click();
  URL.revokeObjectURL(url);
}

/* ══════════════════════════════════════════
   ATTENDANCE TAB — Backend Connected + Compact UI
══════════════════════════════════════════ */
export default function AttendanceTab({ teachers = [] }) {

  /* ── Backend state ── */
  const [records, setRecords]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [dateFilter, setDateFilter]     = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch]             = useState("");

  /* ── UI state ── */
  const [activeTab, setActiveTab]       = useState("register");
  const [batchFilter, setBatchFilter]   = useState("all");
  const [editModal, setEditModal]       = useState(null);
  const [auditLog, setAuditLog]         = useState([
    { action: "Backend sync on load", by: "System", time: new Date().toLocaleString("en-IN") },
  ]);

  /* ── Fetch from backend ── */
  useEffect(() => {
    setLoading(true);
    getTeacherAttendance(dateFilter ? { date: dateFilter } : {})
      .then((data) => setRecords(data?.records || []))
      .catch((err) => console.error("Failed to load teacher attendance", err))
      .finally(() => setLoading(false));
  }, [dateFilter]);

  /* ── Filtered records ── */
  const filteredRecords = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((r) => {
      const name  = String(r.teacher?.name  || "").toLowerCase();
      const email = String(r.teacher?.email || "").toLowerCase();
      return (!q || name.includes(q) || email.includes(q))
        && (statusFilter === "all" || r.status === statusFilter)
        && (batchFilter  === "all" || r.batch  === batchFilter);
    });
  }, [records, search, statusFilter, batchFilter]);

  /* ── Summary ── */
  const summary = useMemo(() => ({
    total:   filteredRecords.length,
    present: filteredRecords.filter((r) => r.status === "present").length,
    late:    filteredRecords.filter((r) => r.status === "late").length,
    absent:  filteredRecords.filter((r) => r.status === "absent").length,
    excused: filteredRecords.filter((r) => r.status === "excused").length,
  }), [filteredRecords]);

  /* ── Per-teacher stats ── */
  const attendanceByTeacher = useMemo(() => {
    return teachers
      .filter((t) => t.status === "approved")
      .map((teacher) => {
        const tRecs    = records.filter((r) => String(r.teacher?._id || r.teacher) === String(teacher._id));
        const present  = tRecs.filter((r) => r.status === "present").length;
        const late     = tRecs.filter((r) => r.status === "late").length;
        const absent   = tRecs.filter((r) => r.status === "absent").length;
        const excused  = tRecs.filter((r) => r.status === "excused").length;
        const attended = tRecs.filter((r) => ["present", "late"].includes(r.status)).length;
        const pct      = tRecs.length ? Math.round((attended / tRecs.length) * 100) : 0;
        return { teacher, pct, count: tRecs.length, present, late, absent, excused };
      })
      .sort((a, b) => b.pct - a.pct);
  }, [records, teachers]);

  /* ── Alerts ── */
  const lowAlert  = attendanceByTeacher.filter((t) => t.pct < 60  && t.count > 0);
  const warnAlert = attendanceByTeacher.filter((t) => t.pct >= 60 && t.pct < 75 && t.count > 0);

  /* ── Dynamic batch list ── */
  const batches = useMemo(() => {
    const set = new Set(records.map((r) => r.batch).filter(Boolean));
    return ["all", ...set];
  }, [records]);

  /* ── Save edit ── */
  const saveEdit = (updated) => {
    setRecords((prev) => prev.map((r) => r._id === updated._id ? updated : r));
    setAuditLog((prev) => [{
      action: `Edited: ${updated.teacher?.name || "Teacher"} → ${updated.status}${updated.note ? ` (${updated.note})` : ""}`,
      by: "Admin",
      time: new Date().toLocaleString("en-IN"),
    }, ...prev]);
  };

  /* ── Shared tiny styles ── */
  const tabBtn = (key) => ({
    padding: "6px 14px",
    borderRadius: 7,
    border: `1.5px solid ${activeTab === key ? "#f59e0b" : "#e5e7eb"}`,
    background: activeTab === key ? "#fef3c7" : "white",
    color: activeTab === key ? "#92400e" : "#6b7280",
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  });

  const batchBtn = (b) => ({
    padding: "5px 12px",
    borderRadius: 7,
    border: `1.5px solid ${batchFilter === b ? "#f59e0b" : "#e5e7eb"}`,
    background: batchFilter === b ? "#fef3c7" : "white",
    color: batchFilter === b ? "#92400e" : "#6b7280",
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  });

  const pctColor = (pct) => pct >= 75 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>

      {/* Edit Modal */}
      {editModal && (
        <EditRecordModal record={editModal} onSave={saveEdit} onClose={() => setEditModal(null)} />
      )}

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <h1 style={{ ...S.pageTitle, fontSize: 18, marginBottom: 2 }}>Attendance Management</h1>
          <p style={{ ...S.pageSub, fontSize: 11, margin: 0 }}>Session attendance, reports, and analytics across all batches</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => exportCsv([
            ["Teacher", "Email", "Date", "Status", "Source", "Note"],
            ...filteredRecords.map((r) => [
              r.teacher?.name  || "",
              r.teacher?.email || "",
              r.attendanceDate ? new Date(r.attendanceDate).toLocaleDateString("en-IN") : "",
              r.status, r.source || "", r.note || "",
            ]),
          ])} style={{ ...S.exportBtn, fontSize: 11, padding: "5px 12px" }}>
            ⬇ Export CSV
          </button>
          <button onClick={() => alert("PDF export requires a PDF library. Use CSV instead.")}
            style={{ ...S.exportBtn, fontSize: 11, padding: "5px 12px" }}>
            ⬇ Export PDF
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 14 }}>
        <StatCard icon="📋" label="Total Records"   val={summary.total}          color="#f59e0b" bg="#fef3c7" />
        <StatCard icon="✅" label="Present"         val={summary.present}        color="#10b981" bg="#d1fae5" />
        <StatCard icon="⏰" label="Late"            val={summary.late}           color="#d97706" bg="#fef3c7" />
        <StatCard icon="❌" label="Absent"          val={summary.absent}         color="#ef4444" bg="#fee2e2" />
        <StatCard icon="⚠️" label="Low Attendance" val={lowAlert.length}        color="#ef4444" bg="#fee2e2" />
      </div>

      {/* ── Low Attendance Alert ── */}
      {!loading && lowAlert.length > 0 && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "10px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>🚨</span>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#991b1b" }}>
              Low Attendance Alert — {lowAlert.length} teacher{lowAlert.length > 1 ? "s" : ""} below 60%
            </span>
            <span style={{ marginLeft: 10 }}>
              {lowAlert.map((t) => (
                <span key={t.teacher._id} style={{ marginRight: 6, padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5" }}>
                  {t.teacher.name} ({t.pct}%)
                </span>
              ))}
            </span>
          </div>
          <button style={{ ...S.primaryBtn, fontSize: 10, padding: "5px 12px", flexShrink: 0 }}>📧 Send Alerts</button>
        </div>
      )}
      {!loading && warnAlert.length > 0 && (
        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "8px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>⚠️</span>
          <div style={{ fontSize: 11, color: "#92400e" }}>
            <b>{warnAlert.length} teacher{warnAlert.length > 1 ? "s" : ""}</b> between 60–75%: {warnAlert.map((t) => `${t.teacher.name} (${t.pct}%)`).join(" · ")}
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {[
          { key: "register",  label: "📋 Attendance Register" },
          { key: "matrix",    label: "🗂️ Session Matrix"      },
          { key: "analytics", label: "📊 Analytics"           },
          { key: "audit",     label: "🕓 Audit Log"            },
        ].map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={tabBtn(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ TAB: REGISTER ══ */}
      {activeTab === "register" && (
        <div>
          {/* Batch filter */}
          <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
            {batches.map((b) => (
              <button key={b} onClick={() => setBatchFilter(b)} style={batchBtn(b)}>
                {b === "all" ? "All Batches" : b}
              </button>
            ))}
          </div>

          {/* Teacher Attendance Register Table */}
          <SectionCard title="👩‍🏫 Teacher Attendance Register">
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 580 }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f1f5f9" }}>
                    {["Teacher", "Batch", "Sessions", "Present", "Late", "Absent", "Excused", "Rate", "Alert"].map((h) => (
                      <th key={h} style={{ padding: "8px 10px", fontSize: 10, fontWeight: 700, color: "#9ca3af", textAlign: "left", textTransform: "uppercase", letterSpacing: "0.4px", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={9} style={{ padding: "16px 10px", fontSize: 12, color: "#9ca3af", textAlign: "center" }}>Loading...</td></tr>
                  ) : attendanceByTeacher.filter((t) => batchFilter === "all" || t.teacher.batch === batchFilter).length === 0 ? (
                    <tr><td colSpan={9} style={{ padding: "16px 10px", fontSize: 12, color: "#9ca3af", textAlign: "center" }}>No approved teachers found.</td></tr>
                  ) : (
                    attendanceByTeacher
                      .filter((t) => batchFilter === "all" || t.teacher.batch === batchFilter)
                      .map((item, i) => (
                        <tr key={item.teacher._id} style={{ borderBottom: "1px solid #f9fafb", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                          <td style={{ padding: "9px 10px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "white", flexShrink: 0 }}>
                                {(item.teacher.name || "?")[0].toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: "#1c1917" }}>{item.teacher.name}</div>
                                <div style={{ fontSize: 10, color: "#9ca3af" }}>{item.teacher.email}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "9px 10px", fontSize: 11, color: "#374151" }}>{item.teacher.batch || "—"}</td>
                          <td style={{ padding: "9px 10px", fontSize: 12, fontWeight: 600, color: "#374151", textAlign: "center" }}>{item.count || "—"}</td>
                          <td style={{ padding: "9px 10px", textAlign: "center" }}><span style={{ fontSize: 11, fontWeight: 700, color: "#10b981" }}>{item.present || "—"}</span></td>
                          <td style={{ padding: "9px 10px", textAlign: "center" }}><span style={{ fontSize: 11, fontWeight: 700, color: "#d97706" }}>{item.late    || "—"}</span></td>
                          <td style={{ padding: "9px 10px", textAlign: "center" }}><span style={{ fontSize: 11, fontWeight: 700, color: "#ef4444" }}>{item.absent  || "—"}</span></td>
                          <td style={{ padding: "9px 10px", textAlign: "center" }}><span style={{ fontSize: 11, fontWeight: 700, color: "#6366f1" }}>{item.excused || "—"}</span></td>
                          <td style={{ padding: "9px 10px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                              <div style={{ width: 48, height: 5, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${item.pct}%`, background: pctColor(item.pct) }} />
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 800, color: pctColor(item.pct) }}>{item.pct}%</span>
                            </div>
                          </td>
                          <td style={{ padding: "9px 10px" }}>
                            {item.pct < 60  && item.count > 0 && <span style={{ fontSize: 9,  fontWeight: 700, color: "#dc2626", background: "#fee2e2", padding: "2px 7px", borderRadius: 20 }}>🚨 LOW</span>}
                            {item.pct >= 60 && item.pct < 75  && <span style={{ fontSize: 9,  fontWeight: 700, color: "#d97706", background: "#fef3c7", padding: "2px 7px", borderRadius: 20 }}>⚠️ WARN</span>}
                            {(item.pct >= 75 || item.count === 0) && <span style={{ fontSize: 10, color: "#9ca3af" }}>—</span>}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Attendance Records List + Rate side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>

            {/* Records list with filters */}
            <SectionCard title="📋 Attendance Records">
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search teacher or email..." style={{ ...S.input, flex: 1, minWidth: 140, marginBottom: 0, fontSize: 11, padding: "6px 10px" }} />
                <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} style={{ ...S.input, width: 140, marginBottom: 0, fontSize: 11, padding: "6px 10px" }} />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ ...S.input, width: 120, marginBottom: 0, fontSize: 11, padding: "6px 10px" }}>
                  <option value="all">All statuses</option>
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="absent">Absent</option>
                  <option value="excused">Excused</option>
                </select>
              </div>

              <div style={{ maxHeight: 360, overflowY: "auto" }}>
                {loading ? (
                  <div style={{ color: "#9ca3af", fontSize: 12, padding: "16px 0", textAlign: "center" }}>Loading attendance records...</div>
                ) : filteredRecords.length === 0 ? (
                  <div style={{ color: "#9ca3af", fontSize: 12, padding: "16px 0", textAlign: "center" }}>No records found.</div>
                ) : (
                  filteredRecords.slice(0, 100).map((record) => {
                    /* ── Parse note JSON — backend stores checkin/out inside note field ── */
                    let noteData = {};
                    try {
                      const raw = typeof record.note === "string" ? record.note.trim() : "";
                      if (raw.startsWith("{")) noteData = JSON.parse(raw);
                    } catch (_) {}

                    /* ── Format time value (ISO string or "03:32:24 pm" string) ── */
                    const fmtTime = (val) => {
                      if (!val) return null;
                      if (typeof val === "string" && /^\d{1,2}:\d{2}/.test(val)) return val;
                      const d = new Date(val);
                      return isNaN(d) ? String(val) : d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
                    };

                    const checkIn  = fmtTime(record.checkIn  || record.checkInTime  || record.clockIn  || noteData.checkInTime  || noteData.checkIn);
                    const checkOut = fmtTime(record.checkOut || record.checkOutTime || record.clockOut || noteData.checkOutTime || noteData.checkOut);

                    /* ── Only show note if it's plain text, not raw JSON ── */
                    const displayNote = (typeof record.note === "string" && !record.note.trim().startsWith("{"))
                      ? record.note : null;

                    return (
                      <div key={record._id} style={{ padding: "9px 0", borderBottom: "1px solid #f3f4f6" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", flex: 1 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "white", flexShrink: 0 }}>
                              {(record.teacher?.name || "?")[0].toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: "#1c1917" }}>{record.teacher?.name || "Unknown"}</div>
                              <div style={{ fontSize: 10, color: "#9ca3af" }}>{record.teacher?.email || "—"}</div>

                              {/* Date row */}
                              <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>
                                📅 {record.attendanceDate ? new Date(record.attendanceDate).toLocaleDateString("en-IN") : "—"}
                                {record.source && <> · {record.source}</>}
                              </div>

                              {/* Check-in / Check-out row */}
                              <div style={{ display: "flex", gap: 8, marginTop: 3, flexWrap: "wrap" }}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 600,
                                  color: checkIn ? "#059669" : "#9ca3af",
                                  background: checkIn ? "#f0fdf4" : "#f9fafb",
                                  border: `1px solid ${checkIn ? "#86efac" : "#e5e7eb"}`,
                                  borderRadius: 5, padding: "1px 6px" }}>
                                  🟢 In: {checkIn || "—"}
                                </span>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 600,
                                  color: checkOut ? "#dc2626" : "#9ca3af",
                                  background: checkOut ? "#fef2f2" : "#f9fafb",
                                  border: `1px solid ${checkOut ? "#fca5a5" : "#e5e7eb"}`,
                                  borderRadius: 5, padding: "1px 6px" }}>
                                  🔴 Out: {checkOut || "—"}
                                </span>
                              </div>

                              {/* Plain text note only — hide raw JSON */}
                              {displayNote && <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>Note: {displayNote}</div>}
                            </div>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                            <span style={{ padding: "2px 7px", borderRadius: 20, fontSize: 9, fontWeight: 700,
                              color: { present: "#059669", late: "#d97706", absent: "#dc2626", excused: "#6366f1" }[record.status] || "#6b7280",
                              background: { present: "#d1fae5", late: "#fef3c7", absent: "#fee2e2", excused: "#ede9fe" }[record.status] || "#f3f4f6",
                              border: `1px solid ${{ present: "#059669", late: "#d97706", absent: "#dc2626", excused: "#6366f1" }[record.status] || "#6b7280"}30`,
                              whiteSpace: "nowrap" }}>
                              {record.status}
                            </span>
                            <button onClick={() => setEditModal(record)}
                              style={{ ...S.tblBtn, fontSize: 9, padding: "2px 7px", color: "#3b82f6", borderColor: "#93c5fd" }}>
                              ✏️ Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </SectionCard>

            {/* Teacher rate bars */}
            <SectionCard title="📊 Teacher Attendance Rate">
              <div style={{ maxHeight: 400, overflowY: "auto" }}>
                {attendanceByTeacher.length === 0 ? (
                  <div style={{ color: "#9ca3af", fontSize: 12, padding: "16px 0", textAlign: "center" }}>No approved teachers found.</div>
                ) : (
                  attendanceByTeacher.map((item) => (
                    <div key={item.teacher._id} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "white", flexShrink: 0 }}>
                            {(item.teacher.name || "?")[0].toUpperCase()}
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{item.teacher.name}</span>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 800, color: pctColor(item.pct) }}>
                          {item.pct}% <span style={{ fontSize: 9, color: "#9ca3af", fontWeight: 400 }}>({item.count} records)</span>
                        </span>
                      </div>
                      <div style={{ height: 5, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${item.pct}%`, background: pctColor(item.pct), borderRadius: 3 }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </SectionCard>
          </div>
        </div>
      )}

      {/* ══ TAB: SESSION MATRIX ══ */}
      {activeTab === "matrix" && (
        <SectionCard title="🗂️ Attendance Matrix — Teacher × Date">
          <div style={{ marginBottom: 10, display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>Batch:</span>
            {batches.map((b) => (
              <button key={b} onClick={() => setBatchFilter(b)} style={batchBtn(b)}>
                {b === "all" ? "All" : b}
              </button>
            ))}
          </div>
          {loading ? (
            <div style={{ color: "#9ca3af", fontSize: 12, textAlign: "center", padding: 20 }}>Loading...</div>
          ) : filteredRecords.length === 0 ? (
            <div style={{ color: "#9ca3af", fontSize: 12, textAlign: "center", padding: 20 }}>No records to display.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              {/* Group records by date */}
              {(() => {
                const dates = [...new Set(filteredRecords.map((r) => r.attendanceDate ? new Date(r.attendanceDate).toLocaleDateString("en-IN") : "—"))].slice(0, 10);
                const teacherList = attendanceByTeacher.filter((t) => batchFilter === "all" || t.teacher.batch === batchFilter);
                return (
                  <table style={{ borderCollapse: "collapse", minWidth: 500 }}>
                    <thead>
                      <tr style={{ background: "#f9fafb" }}>
                        <th style={{ padding: "8px 10px", fontSize: 10, fontWeight: 700, color: "#9ca3af", textAlign: "left", borderBottom: "1px solid #f1f5f9", minWidth: 140 }}>TEACHER</th>
                        {dates.map((d) => (
                          <th key={d} style={{ padding: "7px 8px", fontSize: 9, fontWeight: 700, color: "#9ca3af", textAlign: "center", borderBottom: "1px solid #f1f5f9", minWidth: 80 }}>{d}</th>
                        ))}
                        <th style={{ padding: "8px 10px", fontSize: 10, fontWeight: 700, color: "#9ca3af", textAlign: "center", borderBottom: "1px solid #f1f5f9", minWidth: 60 }}>RATE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teacherList.map((item, ri) => (
                        <tr key={item.teacher._id} style={{ borderBottom: "1px solid #f9fafb", background: ri % 2 === 0 ? "white" : "#fafafa" }}>
                          <td style={{ padding: "8px 10px" }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#1c1917" }}>{item.teacher.name}</div>
                            <div style={{ fontSize: 9, color: "#9ca3af" }}>{item.teacher.batch}</div>
                          </td>
                          {dates.map((d) => {
                            const rec = records.find((r) =>
                              String(r.teacher?._id || r.teacher) === String(item.teacher._id) &&
                              (r.attendanceDate ? new Date(r.attendanceDate).toLocaleDateString("en-IN") : "—") === d
                            );
                            const cellBg = !rec ? "#f9fafb" : rec.status === "present" ? "#d1fae5" : rec.status === "late" ? "#fef3c7" : rec.status === "absent" ? "#fee2e2" : "#ede9fe";
                            return (
                              <td key={d} style={{ padding: "7px 8px", textAlign: "center", background: cellBg, border: "1px solid white" }}>
                                {rec ? (
                                  <button onClick={() => setEditModal(rec)}
                                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13 }}
                                    title={`${rec.status}${rec.note ? ` — ${rec.note}` : ""}`}>
                                    {{ present: "✅", late: "⏰", absent: "❌", excused: "💙" }[rec.status] || "?"}
                                  </button>
                                ) : (
                                  <span style={{ fontSize: 11, color: "#d1d5db" }}>—</span>
                                )}
                              </td>
                            );
                          })}
                          <td style={{ padding: "8px 10px", textAlign: "center" }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: pctColor(item.pct) }}>{item.pct}%</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
              {/* Legend */}
              <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
                {[["✅", "Present", "#d1fae5"], ["⏰", "Late", "#fef3c7"], ["❌", "Absent", "#fee2e2"], ["💙", "Excused", "#ede9fe"], ["—", "No Record", "#f9fafb"]].map(([icon, label, bg]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, border: "1px solid #e5e7eb" }}>{icon}</div>
                    <span style={{ fontSize: 10, color: "#6b7280" }}>{label}</span>
                  </div>
                ))}
                <span style={{ fontSize: 10, color: "#9ca3af", marginLeft: "auto" }}>Click cell to edit</span>
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* ══ TAB: ANALYTICS ══ */}
      {activeTab === "analytics" && (
        <div>
          <SectionCard title="👩‍🏫 Individual Teacher Attendance">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {attendanceByTeacher.length === 0 ? (
                <div style={{ textAlign: "center", padding: 16, color: "#9ca3af", fontSize: 12 }}>No approved teachers found.</div>
              ) : (
                attendanceByTeacher.map((item) => (
                  <div key={item.teacher._id} style={{ padding: "11px 13px", borderRadius: 10, border: `1px solid ${item.pct < 60 ? "#fca5a5" : item.pct < 75 ? "#fde68a" : "#f1f5f9"}`, background: item.pct < 60 ? "#fef2f2" : item.pct < 75 ? "#fffbeb" : "white" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "white", flexShrink: 0 }}>
                        {(item.teacher.name || "?")[0].toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#1c1917" }}>{item.teacher.name}</div>
                        <div style={{ fontSize: 10, color: "#9ca3af" }}>{item.teacher.email || "—"}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: pctColor(item.pct) }}>{item.pct}%</div>
                        {item.pct < 60  && item.count > 0 && <span style={{ fontSize: 9,  fontWeight: 700, color: "#dc2626", background: "#fee2e2", padding: "1px 6px", borderRadius: 20 }}>🚨 LOW</span>}
                        {item.pct >= 60 && item.pct < 75 && item.count > 0 && <span style={{ fontSize: 9,  fontWeight: 700, color: "#d97706", background: "#fef3c7", padding: "1px 6px", borderRadius: 20 }}>⚠️ WARN</span>}
                      </div>
                    </div>
                    <div style={{ height: 6, background: "#f3f4f6", borderRadius: 4, overflow: "hidden", marginBottom: 6 }}>
                      <div style={{ height: "100%", width: `${item.pct}%`, background: pctColor(item.pct), borderRadius: 4, transition: "width 0.8s" }} />
                    </div>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      {[["✅", item.present, "Present"], ["⏰", item.late, "Late"], ["❌", item.absent, "Absent"], ["💙", item.excused, "Excused"]].map(([icon, val, label]) =>
                        val > 0 && <span key={label} style={{ fontSize: 10, color: "#6b7280" }}>{icon} {val} {label}</span>
                      )}
                      {item.count === 0 && <span style={{ fontSize: 10, color: "#9ca3af" }}>No records yet</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>

          {/* Overall breakdown */}
          <SectionCard title="📅 Overall Attendance Breakdown" action={<button onClick={() => exportCsv([["Teacher","Email","Date","Status","Source","Note"],...filteredRecords.map((r)=>[r.teacher?.name||"",r.teacher?.email||"",r.attendanceDate?new Date(r.attendanceDate).toLocaleDateString("en-IN"):"",r.status,r.source||"",r.note||""])])} style={{ ...S.exportBtn, fontSize: 10, padding: "4px 10px" }}>⬇ Export</button>}>
            {loading ? (
              <div style={{ color: "#9ca3af", fontSize: 12, textAlign: "center", padding: 16 }}>Loading...</div>
            ) : records.length === 0 ? (
              <div style={{ textAlign: "center", padding: 16, color: "#9ca3af", fontSize: 12 }}>No records yet.</div>
            ) : (() => {
              const total   = records.length;
              const present = records.filter((r) => r.status === "present").length;
              const late    = records.filter((r) => r.status === "late").length;
              const absent  = records.filter((r) => r.status === "absent").length;
              const excused = records.filter((r) => r.status === "excused").length;
              const pct     = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
              return (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#1c1917" }}>All Records</div>
                      <div style={{ fontSize: 10, color: "#9ca3af" }}>{total} total · all teachers</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: pctColor(pct) }}>{pct}%</div>
                      <div style={{ fontSize: 10, color: "#9ca3af" }}>{present + late}/{total} attended</div>
                    </div>
                  </div>
                  <div style={{ height: 8, background: "#f3f4f6", borderRadius: 5, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ height: "100%", borderRadius: 5, display: "flex" }}>
                      <div style={{ width: `${total > 0 ? (present / total * 100) : 0}%`, background: "#10b981" }} />
                      <div style={{ width: `${total > 0 ? (late    / total * 100) : 0}%`, background: "#f59e0b" }} />
                      <div style={{ width: `${total > 0 ? (absent  / total * 100) : 0}%`, background: "#ef4444" }} />
                      <div style={{ width: `${total > 0 ? (excused / total * 100) : 0}%`, background: "#6366f1" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 14, fontSize: 10, color: "#6b7280", flexWrap: "wrap" }}>
                    <span>✅ {present} Present</span>
                    <span>⏰ {late} Late</span>
                    <span>❌ {absent} Absent</span>
                    <span>💙 {excused} Excused</span>
                  </div>
                </div>
              );
            })()}
          </SectionCard>
        </div>
      )}

      {/* ══ TAB: AUDIT LOG ══ */}
      {activeTab === "audit" && (
        <SectionCard title="🕓 Attendance Audit Log">
          <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, padding: "8px 12px", marginBottom: 12, fontSize: 11, color: "#0369a1" }}>
            Every manual edit and auto-capture event is logged here for compliance.
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {auditLog.map((entry, i) => (
              <AuditLogEntry key={i} entry={entry} />
            ))}
            {auditLog.length === 0 && (
              <div style={{ textAlign: "center", padding: 16, color: "#9ca3af", fontSize: 12 }}>No audit entries yet.</div>
            )}
          </div>
        </SectionCard>
      )}
    </div>
  );
}