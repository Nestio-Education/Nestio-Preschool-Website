import { useEffect, useMemo, useState } from "react";
import { BarChart, S, SectionCard, StatCard, StatusBadge } from "../components/Shared";
import { getAdminDashboard, getAdminTeachers } from "../services/api";

function buildMonthlyRegistrations(teachers) {
  const now = new Date();
  const months = [];

  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.toLocaleString("en-IN", { month: "short" });
    const count = teachers.filter((teacher) => {
      const createdAt = teacher.createdAt ? new Date(teacher.createdAt) : null;
      return createdAt &&
        createdAt.getMonth() === date.getMonth() &&
        createdAt.getFullYear() === date.getFullYear();
    }).length;
    months.push({ month, val: count });
  }

  return months;
}

export default function OverviewTab() {
  const [stats, setStats] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminDashboard(), getAdminTeachers()])
      .then(([dashboardData, teachersData]) => {
        setStats(dashboardData || {});
        setTeachers(teachersData?.teachers || []);
      })
      .catch((error) => {
        console.error("Error loading admin dashboard stats:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const approvedTeachers = teachers.filter((teacher) => teacher.status === "approved");
  const pendingTeachers = teachers.filter((teacher) => teacher.status === "pending");
  const monthlyRegistrations = useMemo(() => buildMonthlyRegistrations(teachers), [teachers]);
  const teachersAddedThisMonth = monthlyRegistrations[monthlyRegistrations.length - 1]?.val || 0;
  const performanceAverage = approvedTeachers.length
    ? Math.round(
        approvedTeachers.reduce((sum, teacher) => sum + ((teacher.teacherProfile?.performanceRating || 0) * 20), 0) /
          approvedTeachers.length
      )
    : 0;

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", fontSize: 16, fontWeight: 600, color: "#d97706" }}>
        Loading dashboard overview...
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={S.pageTitle}>Admin Dashboard</h1>
        <p style={S.pageSub}>
          Platform overview for {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard icon="🏫" label="Total Centers" val={stats?.totalCenters ?? 0} color="#f59e0b" bg="#fef3c7" sub="Active centers" />
        <StatCard icon="👩‍🏫" label="Total Teachers" val={stats?.totalTeachers ?? teachers.length} color="#10b981" bg="#d1fae5" sub={`${teachersAddedThisMonth} added this month`} />
        <StatCard icon="⏳" label="Pending Approvals" val={pendingTeachers.length} color="#ef4444" bg="#fee2e2" sub="Teacher registrations" />
        <StatCard icon="👶" label="Total Children" val={stats?.totalChildren ?? 0} color="#3b82f6" bg="#dbeafe" sub="Active enrollments" />
        <StatCard icon="📚" label="Course Completion" val={`${stats?.courseCompletionPercent ?? 0}%`} color="#06b6d4" bg="#cffafe" sub="Assigned vs completed" />
        <StatCard icon="📋" label="Pending Activities" val={stats?.pendingActivities ?? 0} color="#8b5cf6" bg="#ede9fe" sub="Awaiting review" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 20, marginBottom: 20 }}>
        <SectionCard title="Teacher registrations">
          {teachers.length === 0 ? (
            <div style={{ color: "#9ca3af", fontSize: 13 }}>No teacher records available.</div>
          ) : (
            <BarChart data={monthlyRegistrations} color="#f59e0b" height={140} />
          )}
        </SectionCard>

        <SectionCard title="Operational summary">
          {[
            {
              label: "Teachers present today",
              value: `${stats?.teacherAttendanceToday ?? 0}/${stats?.totalTeachers ?? teachers.length}`,
              pct: stats?.totalTeachers ? Math.round(((stats?.teacherAttendanceToday ?? 0) / stats.totalTeachers) * 100) : 0,
              color: "#10b981",
            },
            {
              label: "Assigned courses",
              value: `${stats?.assignedCourses ?? 0}`,
              pct: stats?.assignedCourses ? 100 : 0,
              color: "#3b82f6",
            },
            {
              label: "Completed courses",
              value: `${stats?.completedCourses ?? 0}`,
              pct: stats?.courseCompletionPercent ?? 0,
              color: "#8b5cf6",
            },
            {
              label: "Pending lessons",
              value: `${stats?.pendingLessons ?? 0}`,
              pct: stats?.assignedCourses ? Math.min(100, Math.round(((stats?.pendingLessons ?? 0) / Math.max(1, stats.assignedCourses)) * 100)) : 0,
              color: "#f59e0b",
            },
          ].map((item) => (
            <div key={item.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: item.color }}>{item.value}</span>
              </div>
              <div style={{ height: 8, background: "#f3f4f6", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: 6 }} />
              </div>
            </div>
          ))}
        </SectionCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <SectionCard title="Top teacher performance">
          {approvedTeachers.length === 0 ? (
            <div style={{ color: "#9ca3af", fontSize: 13 }}>No approved teachers yet.</div>
          ) : (
            approvedTeachers
              .slice()
              .sort((a, b) => (b.teacherProfile?.performanceRating || 0) - (a.teacherProfile?.performanceRating || 0))
              .slice(0, 5)
              .map((teacher) => {
                const score = Math.round((teacher.teacherProfile?.performanceRating || 0) * 20);
                return (
                  <div key={teacher._id} style={{ padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1c1917" }}>{teacher.name}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>
                          {teacher.teacherProfile?.center?.name || "No center assigned"} • {teacher.teacherProfile?.subject || "No subject"}
                        </div>
                      </div>
                      <StatusBadge status={teacher.status} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 11, color: "#6b7280" }}>Performance score</span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444" }}>{score}%</span>
                    </div>
                    <div style={{ height: 6, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${score}%`, background: score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444", borderRadius: 4 }} />
                    </div>
                  </div>
                );
              })
          )}
        </SectionCard>

        <SectionCard title="Teacher status snapshot">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 16 }}>
            <div style={{ background: "#d1fae5", borderRadius: 12, padding: 14, border: "1px solid #86efac" }}>
              <div style={{ fontSize: 11, color: "#065f46", fontWeight: 700, marginBottom: 4 }}>Approved teachers</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#1c1917" }}>{approvedTeachers.length}</div>
            </div>
            <div style={{ background: "#fef3c7", borderRadius: 12, padding: 14, border: "1px solid #fbbf24" }}>
              <div style={{ fontSize: 11, color: "#92400e", fontWeight: 700, marginBottom: 4 }}>Average performance</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#1c1917" }}>{performanceAverage}%</div>
            </div>
          </div>

          <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}>
            <div>Approved: {approvedTeachers.length}</div>
            <div>Pending: {pendingTeachers.length}</div>
            <div>Rejected: {teachers.filter((teacher) => teacher.status === "rejected").length}</div>
            <div>Inactive: {teachers.filter((teacher) => teacher.status === "inactive").length}</div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
