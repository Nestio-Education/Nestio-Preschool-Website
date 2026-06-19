import { useEffect, useMemo, useState } from "react";
import { S, SectionCard, StatCard } from "../components/Shared";
import { getTeacherAttendance } from "../services/api";

function AttendanceBadge({ status }) {
  const palette = {
    present: { color: "#059669", bg: "#d1fae5" },
    late: { color: "#d97706", bg: "#fef3c7" },
    absent: { color: "#dc2626", bg: "#fee2e2" },
    excused: { color: "#7c3aed", bg: "#ede9fe" },
  };
  const item = palette[status] || { color: "#6b7280", bg: "#f3f4f6" };
  return (
    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, color: item.color, background: item.bg }}>
      {status}
    </span>
  );
}

function exportCsv(rows) {
  const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "teacher-attendance.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function AttendanceTab({ teachers = [] }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    getTeacherAttendance(dateFilter ? { date: dateFilter } : {})
      .then((data) => {
        setRecords(data?.records || []);
      })
      .catch((error) => {
        console.error("Failed to load teacher attendance", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dateFilter]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    return records.filter((record) => {
      const teacherName = String(record.teacher?.name || "").toLowerCase();
      const teacherEmail = String(record.teacher?.email || "").toLowerCase();
      const matchesSearch = !query || teacherName.includes(query) || teacherEmail.includes(query);
      const matchesStatus = statusFilter === "all" || record.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const summary = useMemo(() => ({
    total: filteredRecords.length,
    present: filteredRecords.filter((record) => record.status === "present").length,
    late: filteredRecords.filter((record) => record.status === "late").length,
    absent: filteredRecords.filter((record) => record.status === "absent").length,
    excused: filteredRecords.filter((record) => record.status === "excused").length,
  }), [filteredRecords]);

  const attendanceByTeacher = useMemo(() => {
    return teachers
      .filter((teacher) => teacher.status === "approved")
      .map((teacher) => {
        const teacherRecords = records.filter((record) => String(record.teacher?._id || record.teacher) === String(teacher._id));
        const presentCount = teacherRecords.filter((record) => ["present", "late"].includes(record.status)).length;
        const pct = teacherRecords.length ? Math.round((presentCount / teacherRecords.length) * 100) : 0;
        return { teacher, pct, count: teacherRecords.length };
      })
      .sort((a, b) => b.pct - a.pct);
  }, [records, teachers]);

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={S.pageTitle}>Teacher Attendance</h1>
          <p style={S.pageSub}>Live teacher attendance records from the database.</p>
        </div>
        <button
          onClick={() => exportCsv([
            ["Teacher", "Email", "Date", "Status", "Source", "Latitude", "Longitude", "Note"],
            ...filteredRecords.map((record) => [
              record.teacher?.name || "",
              record.teacher?.email || "",
              record.attendanceDate ? new Date(record.attendanceDate).toLocaleDateString("en-IN") : "",
              record.status,
              record.source || "",
              record.latitude || "",
              record.longitude || "",
              record.note || "",
            ]),
          ])}
          style={S.exportBtn}
        >
          Export CSV
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 14, marginBottom: 20 }}>
        <StatCard icon="📋" label="Total Records" val={summary.total} color="#f59e0b" bg="#fef3c7" />
        <StatCard icon="✅" label="Present" val={summary.present} color="#10b981" bg="#d1fae5" />
        <StatCard icon="⏰" label="Late" val={summary.late} color="#d97706" bg="#fef3c7" />
        <StatCard icon="❌" label="Absent" val={summary.absent} color="#ef4444" bg="#fee2e2" />
        <StatCard icon="📝" label="Excused" val={summary.excused} color="#7c3aed" bg="#ede9fe" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <SectionCard title="Attendance records">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search teacher or email..." style={{ ...S.input, flex: 1, minWidth: 220, marginBottom: 0 }} />
            <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} style={{ ...S.input, width: 170, marginBottom: 0 }} />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} style={{ ...S.input, width: 150, marginBottom: 0 }}>
              <option value="all">All statuses</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
              <option value="excused">Excused</option>
            </select>
          </div>

          {loading ? (
            <div style={{ color: "#9ca3af", fontSize: 13 }}>Loading attendance records...</div>
          ) : filteredRecords.length === 0 ? (
            <div style={{ color: "#9ca3af", fontSize: 13 }}>No attendance records found.</div>
          ) : (
            filteredRecords.slice(0, 100).map((record) => (
              <div key={record._id} style={{ padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1c1917" }}>{record.teacher?.name || "Unknown teacher"}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>{record.teacher?.email || "No email"}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                      Date: {record.attendanceDate ? new Date(record.attendanceDate).toLocaleDateString("en-IN") : "Unknown"} • Source: {record.source || "manual"}
                    </div>
                    {record.note && <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Note: {record.note}</div>}
                  </div>
                  <AttendanceBadge status={record.status} />
                </div>
              </div>
            ))
          )}
        </SectionCard>

        <SectionCard title="Teacher attendance rate">
          {attendanceByTeacher.length === 0 ? (
            <div style={{ color: "#9ca3af", fontSize: 13 }}>No approved teachers found.</div>
          ) : (
            attendanceByTeacher.map((item) => (
              <div key={item.teacher._id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{item.teacher.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: item.pct >= 85 ? "#10b981" : item.pct >= 60 ? "#f59e0b" : "#ef4444" }}>
                    {item.pct}% ({item.count} records)
                  </span>
                </div>
                <div style={{ height: 6, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${item.pct}%`, background: item.pct >= 85 ? "#10b981" : item.pct >= 60 ? "#f59e0b" : "#ef4444", borderRadius: 4 }} />
                </div>
              </div>
            ))
          )}
        </SectionCard>
      </div>
    </div>
  );
}
