import { useState, useEffect } from "react";
import { Modal, S, SearchBar, StatCard, StatusBadge, Toast } from "../components/Shared";
import { getActivities, reviewActivity, getCenters } from "../services/api";

const getFileUrl = (file) => {
  if (!file) return null;
  const path = file.publicUrl || file.path || (typeof file === "string" ? file : "");
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `http://localhost:5000${path}`;
};

const mapActivityFromApi = (a) => ({
  id: a._id || a.id,
  date: a.activityDate ? new Date(a.activityDate).toLocaleDateString("en-IN") : "—",
  centerName: a.center?.name || "Unassigned Center",
  centerId: a.center?._id || a.center || "",
  teacherName: a.teacher?.name || "Unknown Teacher",
  className: a.class?.name || "Unassigned Class",
  description: a.description || "",
  image: a.files?.length > 0 ? getFileUrl(a.files[0]) : null,
  imageName: a.files?.length > 0 ? a.files[0].originalName || "Classroom Photo" : "📸 Classroom Photo",
  status: a.status || "pending",
  adminComments: a.adminComments || ""
});

/* ── Activity Process/Detail Modal ── */
function ActivityReviewModal({ activity, onAction, onClose }) {
  const [comments, setComments] = useState(activity.adminComments || "");

  const handleStatusUpdate = (newStatus) => {
    onAction(activity.id, newStatus, comments);
    onClose();
  };

  return (
    <Modal title="🔎 Review Classroom Activity Submission" onClose={onClose}>
      {/* Detail Fields Matrix Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[
          { icon: "📅", label: "Date", val: activity.date },
          { icon: "🏢", label: "Center Context", val: activity.centerName },
          { icon: "👩‍🏫", label: "Teacher", val: activity.teacherName },
          { icon: "🎒", label: "Class Target", val: activity.className },
        ].map((item, idx) => (
          <div key={idx} style={{ background: "#f9fafb", borderRadius: 10, padding: "10px 12px", border: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 2 }}>{item.label}</span>
            <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{item.icon} {item.val}</span>
          </div>
        ))}
      </div>

      {/* Description Content Box */}
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>Activity Description Summary</label>
        <div style={{ background: "#f8fafc", padding: 12, borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12, lineHeight: "1.5", color: "#334155" }}>
          {activity.description}
        </div>
      </div>

      {/* Uploaded Media Box */}
      <div style={{ marginBottom: 16 }}>
        <label style={S.label}>Uploaded Documentation Media</label>
        {activity.image ? (
          <div style={{ textAlign: "center", borderRadius: 12, border: "1px solid #cbd5e1", overflow: "hidden", background: "#f1f5f9" }}>
            <img src={activity.image} alt={activity.imageName} style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain", display: "block", margin: "0 auto" }} />
          </div>
        ) : (
          <div style={{ background: "#fef3c7", border: "1.5px dashed #f59e0b", borderRadius: 12, height: 110, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#b45309" }}>
            <span style={{ fontSize: 24, marginBottom: 4 }}>📷</span>
            <b style={{ fontSize: 12 }}>No image attached</b>
            <span style={{ fontSize: 10, color: "#92400e", marginTop: 2 }}>This report contains text observation details only.</span>
          </div>
        )}
      </div>

      {/* Admin Review Workspace Feedback Form */}
      <div style={{ marginBottom: 18 }}>
        <label style={S.label}>Admin Feedback Comments</label>
        <textarea 
          style={{ ...S.input, height: 60, resize: "none" }} 
          value={comments} 
          onChange={e => setComments(e.target.value)} 
          placeholder="Type constructive advice, observations, or follow-up criteria..."
        />
      </div>

      {/* Operational Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <button 
          onClick={() => handleStatusUpdate("approved")} 
          style={{ ...S.primaryBtn, flex: 1, padding: "10px", fontSize: 12, background: "linear-gradient(135deg,#10b981,#059669)", border: "none" }}
        >
          ✓ Approve Activity
        </button>
        <button 
          onClick={() => handleStatusUpdate("flagged")} 
          style={{ ...S.tblBtn, flex: 1, padding: "10px", fontSize: 12, color: "#dc2626", borderColor: "#fca5a5" }}
        >
          🔕 Flag for Review
        </button>
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════
    MAIN CLASSROOM ACTIVITY MONITORING TAB
   ══════════════════════════════════════════ */
export default function ActivityMonitoringTab({ setToast }) {
  const [activities, setActivities] = useState([]);
  const [centers, setCenters] = useState([]);
  const [search, setSearch] = useState("");
  const [centerFilter, setCenterFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setLocalToast] = useState({ msg: "", type: "" });

  const showToast = setToast || setLocalToast;

  const loadData = () => {
    setLoading(true);
    Promise.all([getActivities(), getCenters()])
      .then(([actRes, centersRes]) => {
        setActivities((actRes.activities || []).map(mapActivityFromApi));
        setCenters(centersRes.centers || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading activities:", err);
        setLoading(false);
        showToast({ msg: "Failed to fetch activities from database.", type: "error" });
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter based on dropdown selectors & search query
  const filtered = activities.filter(act => {
    const query = search.toLowerCase();
    const matchSearch = act.teacherName.toLowerCase().includes(query) || 
      act.description.toLowerCase().includes(query) || 
      act.className.toLowerCase().includes(query);
    const matchCenter = centerFilter === "all" || act.centerId === centerFilter;
    const matchStatus = statusFilter === "all" || act.status === statusFilter;
    return matchSearch && matchCenter && matchStatus;
  });

  const handleReviewAction = (id, newStatus, comments) => {
    reviewActivity(id, { status: newStatus, adminComments: comments })
      .then(() => {
        showToast({ msg: `Activity submission marked as ${newStatus}!`, type: "success" });
        loadData();
      })
      .catch(err => {
        console.error("Error reviewing activity:", err);
        showToast({ msg: "Failed to save review: " + err.message, type: "error" });
      });
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh", fontSize: 14, fontWeight: 600, color: "#d97706" }}>
        🔄 Loading Classroom Activities...
      </div>
    );
  }

  const pending = activities.filter(a => a.status === "pending").length;
  const approved = activities.filter(a => a.status === "approved").length;
  const flagged = activities.filter(a => a.status === "flagged").length;

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {!setToast && <Toast msg={toast.msg} type={toast.type} onClose={() => setLocalToast({ msg: "", type: "" })} />}

      {/* Review Modals */}
      {selectedActivity && (
        <ActivityReviewModal 
          activity={selectedActivity} 
          onAction={handleReviewAction} 
          onClose={() => setSelectedActivity(null)} 
        />
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={S.pageTitle}>Classroom Activity Monitoring</h1>
          <p style={S.pageSub}>{pending} pending review · {approved} approved · {flagged} flagged logs</p>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 14, marginBottom: 20 }}>
        <StatCard icon="📸" label="Total Activities" val={activities.length} color="#3b82f6" bg="#dbeafe" />
        <StatCard icon="⏳" label="Awaiting Review" val={pending} color="#f59e0b" bg="#fef3c7" />
        <StatCard icon="✅" label="Approved Logs" val={approved} color="#10b981" bg="#d1fae5" />
        <StatCard icon="🔕" label="Flagged Issues" val={flagged} color="#ef4444" bg="#fee2e2" />
      </div>

      {/* Filter Toolbar */}
      <div style={{ background: "white", borderRadius: 14, padding: "14px 18px", border: "1px solid #f1f5f9", marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by teacher, class, description..." />
        </div>
        <select style={{ ...S.input, width: 200, marginBottom: 0 }} value={centerFilter} onChange={e => setCenterFilter(e.target.value)}>
          <option value="all">All Centers</option>
          {centers.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
        </select>
        <select style={{ ...S.input, width: 160, marginBottom: 0 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>

      {/* Submissions Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
        {filtered.map(act => (
          <div key={act.id} style={{ background: "white", borderRadius: 14, border: "1px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            
            {/* Image Thumbnail */}
            {act.image ? (
              <div style={{ height: 160, width: "100%", overflow: "hidden", background: "#f1f5f9" }}>
                <img src={act.image} alt={act.imageName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ) : (
              <div style={{ height: 160, background: "#fef3c7", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#b45309" }}>
                <span style={{ fontSize: 36 }}>📝</span>
                <span style={{ fontSize: 11, fontWeight: 700, marginTop: 4 }}>Observation Log (No Image)</span>
              </div>
            )}

            {/* Body */}
            <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700 }}>📅 {act.date}</span>
                <StatusBadge status={act.status} />
              </div>

              <div style={{ fontSize: 14, fontWeight: 800, color: "#1c1917", marginBottom: 4 }}>
                {act.teacherName}
              </div>
              <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, marginBottom: 8 }}>
                🏢 {act.centerName} · {act.className}
              </div>

              <p style={{ fontSize: 12, color: "#475569", margin: "0 0 12px", lineHeight: 1.5, flex: 1 }}>
                {act.description.length > 120 ? act.description.substring(0, 120) + "..." : act.description}
              </p>

              {act.adminComments && (
                <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 8, padding: "8px 10px", fontSize: 11, color: "#334155", marginBottom: 12 }}>
                  💬 <b>Admin:</b> {act.adminComments}
                </div>
              )}

              <button 
                onClick={() => setSelectedActivity(act)} 
                style={{ ...S.primaryBtn, width: "100%", fontSize: 12, padding: "8px 12px", background: "linear-gradient(135deg,#f59e0b,#d97706)", border: "none" }}
              >
                🔎 Review & Feedback
              </button>
            </div>

          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📸</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>No activities found</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Try adjusting filters or wait for teacher submissions.</div>
        </div>
      )}
    </div>
  );
}