import { useState, useEffect } from "react";
import { AttendanceBar, BarChart, S, SectionCard, StatCard, StatusBadge } from "../components/Shared";
import { MONTHLY_ENROLLMENT, MONTHLY_REVENUE } from "../data/mockData";
import { getAdminDashboard, getAdminTeachers } from "../services/api";

export default function OverviewTab({ teachers: propTeachers }) {
  const [stats, setStats] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminDashboard(), getAdminTeachers()])
      .then(([dashboardData, teachersData]) => {
        setStats(dashboardData);
        setTeachers(teachersData.teachers || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading admin dashboard stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", fontSize: 16, fontWeight: 600, color: "#d97706" }}>
        🔄 Loading Dashboard Overview...
      </div>
    );
  }

  // Calculate metrics
  const approved = teachers.filter(t => t.status === "approved");
  const avgAttendance = approved.length 
    ? Math.round(approved.reduce((sum, t) => sum + (t.attendanceRate || 85), 0) / approved.length) 
    : 85;

  const completionRate = stats?.courseCompletionPercent ?? 0;
  const teacherGrowth = 12; // simulated indicator

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={S.pageTitle}>Admin Dashboard 👋</h1>
        <p style={S.pageSub}>
          Here's your SpacECE platform overview for today — {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard icon="🏫" label="Total Centers" val={stats?.totalCenters ?? 0} color="#f59e0b" bg="#fef3c7" sub="Active training centers" />
        <StatCard icon="👩‍🏫" label="Total Teachers" val={stats?.totalTeachers ?? teachers.length} color="#10b981" bg="#d1fae5" sub={`+${teacherGrowth}% this month`} />
        <StatCard icon="👶" label="Total Children" val={stats?.totalChildren ?? 0} color="#3b82f6" bg="#dbeafe" sub="Enrolled across all centers" />
        <StatCard icon="📊" label="Avg Attendance" val={`${avgAttendance}%`} color="#8b5cf6" bg="#ede9fe" sub="Overall teacher rate" />
        <StatCard icon="🎓" label="Course Completion" val={`${completionRate}%`} color="#06b6d4" bg="#cffafe" sub="Completed vs in-progress" />
        <StatCard icon="📋" label="Pending Activities" val={stats?.pendingActivities ?? 0} color="#ef4444" bg="#fee2e2" sub="Awaiting approval" />
      </div>

      {/* Attendance Overview + Course Completion */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <SectionCard title="📅 Attendance Overview — Today">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[
              { label: "Teachers Present Today", val: `${stats?.teacherAttendanceToday ?? 0}/${stats?.totalTeachers ?? teachers.length}`, pct: stats?.totalTeachers ? Math.round(((stats?.teacherAttendanceToday ?? 0) / stats.totalTeachers) * 100) : 0, color: "#10b981" },
              { label: "Children Enrolled", val: `${stats?.totalChildren ?? 0}`, pct: 100, color: "#3b82f6" },
              { label: "Pending Lesson Plans", val: `${stats?.pendingLessons ?? 0}`, pct: 50, color: "#f59e0b" },
              { label: "Course Assignments", val: `${stats?.assignedCourses ?? 0}`, pct: stats?.assignedCourses ? 100 : 0, color: "#8b5cf6" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#f9fafb", borderRadius: 12, padding: "12px 14px", border: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#1c1917" }}>{item.val}</div>
                <div style={{ height: 5, background: "#e5e7eb", borderRadius: 4, overflow: "hidden", marginTop: 8 }}>
                  <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="🎓 Course Completion Status">
          {[
            { label: "Completed", val: stats?.completedCourses ?? 0, pct: stats?.assignedCourses ? Math.round(((stats.completedCourses) / stats.assignedCourses) * 100) : 0, color: "#10b981" },
            { label: "In Progress / Assigned", val: (stats?.assignedCourses ?? 0) - (stats?.completedCourses ?? 0), pct: stats?.assignedCourses ? Math.round((((stats.assignedCourses) - (stats.completedCourses)) / stats.assignedCourses) * 100) : 0, color: "#f59e0b" },
          ].map((item, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: item.color }}>{item.val} ({item.pct}%)</span>
              </div>
              <div style={{ height: 8, background: "#f3f4f6", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: 6 }} />
              </div>
            </div>
          ))}
        </SectionCard>
      </div>

      {/* Teacher Progress + Activity Upload */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <SectionCard title="👩‍🏫 Teacher Training Progress">
          {teachers.length > 0 ? (
            teachers.filter(t => t.status === "approved").slice(0, 5).map((t, i) => {
              const score = t.teacherProfile?.performanceRating ? t.teacherProfile.performanceRating * 20 : 85;
              return (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{t.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: score >= 75 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444" }}>{score}%</span>
                  </div>
                  <div style={{ height: 6, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${score}%`, background: score >= 75 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444", borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>
                    Qualification: {t.teacherProfile?.qualification || "N/A"} · Center: {t.teacherProfile?.center?.name || "Unassigned"}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: "center", color: "#9ca3af", padding: 20, fontSize: 13 }}>No teachers registered.</div>
          )}
        </SectionCard>

        <SectionCard title="📤 Activity Upload Summary">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[
              { label: "Pending Review", val: stats?.pendingActivities ?? 0, icon: "⏳", color: "#f59e0b", bg: "#fef3c7" },
              { label: "Total Assigned Courses", val: stats?.assignedCourses ?? 0, icon: "📚", color: "#3b82f6", bg: "#dbeafe" },
            ].map((item, i) => (
              <div key={i} style={{ background: item.bg, borderRadius: 12, padding: "12px 14px", border: `1px solid ${item.color}30`, textAlign: "center" }}>
                <div style={{ fontSize: 20 }}>{item.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#1c1917", marginTop: 4 }}>{item.val}</div>
                <div style={{ fontSize: 11, color: item.color, fontWeight: 700 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
