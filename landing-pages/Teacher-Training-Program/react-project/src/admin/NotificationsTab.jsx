import { useEffect, useMemo, useState } from "react";
import { Modal, S, SectionCard, StatCard, StatusBadge } from "../components/Shared";
import { getAdminNotifications, sendAdminNotification, deleteNotification } from "../services/api";

// Template subjects only — body left empty for admin to write original content
const NOTIFICATION_TEMPLATES = [
  { name: "Welcome",       subject: "Welcome to SpacECE Teacher Training Portal",          channel: "in_app" },
  { name: "Assignment",    subject: "Assignment Submission Reminder",                       channel: "in_app" },
  { name: "Session",       subject: "Upcoming Live Session Reminder",                      channel: "in_app" },
  { name: "Course Update", subject: "New Course Content Available",                         channel: "in_app" },
  { name: "Feedback",      subject: "We Value Your Feedback — Share Your Thoughts",         channel: "in_app" },
  { name: "Announcement",  subject: "Important Announcement for All Teachers",              channel: "in_app" },
];

function groupNotifications(items) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const groups = { today: [], yesterday: [], week: [], older: [] };

  items.forEach((item) => {
    const d = item.createdAt ? new Date(item.createdAt) : null;
    if (!d) { groups.older.push(item); return; }
    if (d >= today) groups.today.push(item);
    else if (d >= yesterday) groups.yesterday.push(item);
    else if (d >= weekAgo) groups.week.push(item);
    else groups.older.push(item);
  });

  return groups;
}

const GROUP_LABELS = {
  today: "Today",
  yesterday: "Yesterday",
  week: "This Week",
  older: "Older",
};

export default function NotificationsTab({ teachers = [], setToast }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("all");
  const [channel, setChannel] = useState("in_app");
  const [sending, setSending] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [logSearch, setLogSearch] = useState("");
  const [logChannelFilter, setLogChannelFilter] = useState("all");
  const [logStatusFilter, setLogStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const refreshNotifications = () => {
    setLoading(true);
    getAdminNotifications()
      .then((data) => {
        setNotifications(data?.notifications || []);
      })
      .catch((error) => {
        setToast?.({ msg: error.message || "Failed to load notifications.", type: "error" });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshNotifications();
  }, []);

  const audienceCount = useMemo(() => {
    if (audience === "approved") return teachers.filter((t) => t.status === "approved").length;
    if (audience === "pending") return teachers.filter((t) => t.status === "pending").length;
    return teachers.length;
  }, [audience, teachers]);

  const deliveryStats = useMemo(() => ({
    total: notifications.length,
    sent: notifications.filter((item) => ["sent"].includes(item.status)).length,
    delivered: notifications.filter((item) => item.status === "delivered").length,
    unread: notifications.filter((item) => !item.read).length,
    failed: notifications.filter((item) => item.status === "failed").length,
  }), [notifications]);

  const bodyCharCount = body.length;
  const bodyMaxChars = 5000;

  const applyTemplate = (template) => {
    setSubject(template.subject);
    setBody("");
    setChannel(template.channel);
    setAudience("approved");
    setToast?.({ msg: `Template "${template.name}" applied — compose your message.`, type: "success" });
  };

  const clearForm = () => {
    setSubject("");
    setBody("");
    setAudience("all");
    setChannel("in_app");
  };

  const handleSend = async (keepForm = false) => {
    if (!subject.trim() || !body.trim()) {
      setToast?.({ msg: "Subject and message are required.", type: "error" });
      return;
    }
    setSending(true);
    try {
      const data = await sendAdminNotification({
        subject: subject.trim(),
        body: body.trim(),
        audience,
        channel,
      });
      if (!keepForm) {
        clearForm();
      }
      setToast?.({ msg: `Notification sent to ${data?.recipientCount || 0} teachers.`, type: "success" });
      setShowPreview(false);
      refreshNotifications();
    } catch (error) {
      setToast?.({ msg: error.message || "Failed to send notification.", type: "error" });
    } finally {
      setSending(false);
    }
  };

  const handleRetry = (item) => {
    setSubject(item.title || "");
    setBody(item.body || "");
    setChannel(item.channel || "in_app");
    setAudience("approved");
    setToast?.({ msg: "Failed notification loaded for resend.", type: "success" });
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setToast?.({ msg: "Notification deleted.", type: "success" });
    } catch (error) {
      setToast?.({ msg: error.message || "Failed to delete.", type: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.read ? n : { ...n, read: true, readAt: new Date().toISOString() }))
    );
    setToast?.({ msg: "All notifications marked as read.", type: "success" });
  };

  // Filtered delivery log
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const q = logSearch.toLowerCase();
      const matchSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.body?.toLowerCase().includes(q) ||
        item.recipient?.name?.toLowerCase().includes(q) ||
        item.recipient?.email?.toLowerCase().includes(q);
      const matchChannel = logChannelFilter === "all" || item.channel === logChannelFilter;
      const matchStatus = logStatusFilter === "all" || item.status === logStatusFilter;
      return matchSearch && matchChannel && matchStatus;
    });
  }, [notifications, logSearch, logChannelFilter, logStatusFilter]);

  const grouped = useMemo(() => groupNotifications(filteredNotifications), [filteredNotifications]);
  const channelOptions = ["all", "in_app", "email", "sms", "whatsapp"];
  const statusOptions = ["all", "sent", "delivered", "failed"];

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Preview Modal */}
      {showPreview && (
        <Modal title="📨 Preview Notification" onClose={() => setShowPreview(false)}>
          <div style={{ padding: "16px", background: "#f9fafb", borderRadius: 12, border: "1px solid #f3f4f6", marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>To</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1c1917" }}>
              {audience === "all" ? "All teachers" : audience === "approved" ? "Approved teachers" : "Pending teachers"}
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{audienceCount} recipient(s) · {channel.replace("_", " ")}</div>
          </div>
          <div style={{ padding: "16px", background: "white", borderRadius: 12, border: "1px solid #e5e7eb", marginBottom: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1c1917", marginBottom: 8 }}>{subject}</div>
            <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{body}</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setShowPreview(false)} style={{ ...S.tblBtn, flex: 1, textAlign: "center" }}>
              Edit
            </button>
            <button onClick={() => handleSend(false)} disabled={sending} style={{ ...S.primaryBtn, flex: 2, textAlign: "center" }}>
              {sending ? "Sending..." : `Send to ${audienceCount} teacher(s)`}
            </button>
          </div>
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => handleSend(true)}
              disabled={sending}
              style={{ ...S.tblBtn, width: "100%", textAlign: "center", fontSize: 11 }}
            >
              {sending ? "Sending..." : "Send & Keep Editing"}
            </button>
          </div>
        </Modal>
      )}

      <div style={{ marginBottom: 20 }}>
        <h1 style={S.pageTitle}>Notifications Management</h1>
        <p style={S.pageSub}>Send real notifications to teachers and review the delivery log.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 14, marginBottom: 20 }}>
        <StatCard icon="📨" label="Total Sent" val={deliveryStats.total} color="#f59e0b" bg="#fef3c7" />
        <StatCard icon="✅" label="Delivered" val={deliveryStats.delivered} color="#10b981" bg="#d1fae5" />
        <StatCard icon="🔔" label="Unread" val={deliveryStats.unread} color="#3b82f6" bg="#dbeafe" />
        <StatCard icon="⚠️" label="Failed" val={deliveryStats.failed} color="#ef4444" bg="#fee2e2" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20 }}>
        {/* Compose */}
        <SectionCard title="Compose notification">
          {/* Templates */}
          <div style={{ marginBottom: 12 }}>
            <label style={S.label}>Quick Templates</label>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {NOTIFICATION_TEMPLATES.map((t, i) => (
                <button
                  key={i}
                  onClick={() => applyTemplate(t)}
                  style={{ ...S.tblBtn, fontSize: 10, padding: "4px 10px" }}
                  title={t.name}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <label style={S.label}>Audience</label>
          <select value={audience} onChange={(e) => setAudience(e.target.value)} style={{ ...S.input, marginBottom: 12 }}>
            <option value="all">All teachers ({teachers.length})</option>
            <option value="approved">Approved teachers ({teachers.filter((t) => t.status === "approved").length})</option>
            <option value="pending">Pending teachers ({teachers.filter((t) => t.status === "pending").length})</option>
          </select>

          <label style={S.label}>Channel</label>
          <select value={channel} onChange={(e) => setChannel(e.target.value)} style={{ ...S.input, marginBottom: 12 }}>
            <option value="in_app">In-app notification</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="whatsapp">WhatsApp</option>
          </select>

          <div style={{ marginBottom: 12, fontSize: 12, color: "#64748b" }}>
            Estimated recipients: <b>{audienceCount}</b>
          </div>

          <label style={S.label}>Subject *</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ ...S.input, marginBottom: 12 }}
            placeholder="Enter notification subject..."
          />

          <label style={S.label}>Message *</label>
          <div style={{ position: "relative" }}>
            <textarea
              value={body}
              onChange={(e) => {
                if (e.target.value.length <= bodyMaxChars) setBody(e.target.value);
              }}
              style={{ ...S.input, minHeight: 140, resize: "vertical", marginBottom: 4 }}
              placeholder="Write your notification message here..."
            />
            <div
              style={{
                fontSize: 10,
                color: bodyCharCount > bodyMaxChars * 0.9 ? "#ef4444" : "#9ca3af",
                textAlign: "right",
                marginBottom: 6,
              }}
            >
              {bodyCharCount}/{bodyMaxChars}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => {
                if (!subject.trim() || !body.trim()) {
                  setToast?.({ msg: "Subject and message are required.", type: "error" });
                  return;
                }
                setShowPreview(true);
              }}
              disabled={sending}
              style={{ ...S.primaryBtn, flex: 1, textAlign: "center", opacity: sending ? 0.7 : 1 }}
            >
              {sending ? "Sending..." : "Review & Send"}
            </button>
            {(subject || body) && (
              <button onClick={clearForm} style={{ ...S.tblBtn, fontSize: 11 }}>
                ✕ Clear
              </button>
            )}
          </div>
        </SectionCard>

        {/* Delivery Log */}
        <SectionCard
          title="Delivery log"
          action={
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {hasUnread && (
                <button onClick={handleMarkAllRead} style={{ ...S.tblBtn, fontSize: 10, color: "#2563eb", borderColor: "#93c5fd" }}>
                  ✓ Mark all read
                </button>
              )}
              <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>
                {filteredNotifications.length} shown
              </span>
            </div>
          }
        >
          {/* Filters */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            <input
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              placeholder="Search title, body, teacher..."
              style={{ ...S.input, marginBottom: 0, flex: 1, minWidth: 140, fontSize: 12, padding: "6px 10px" }}
            />
            <select
              value={logChannelFilter}
              onChange={(e) => setLogChannelFilter(e.target.value)}
              style={{ ...S.input, marginBottom: 0, width: 100, fontSize: 12, padding: "6px 8px" }}
            >
              {channelOptions.map((o) => (
                <option key={o} value={o}>
                  {o === "all" ? "All channels" : o.replace("_", " ")}
                </option>
              ))}
            </select>
            <select
              value={logStatusFilter}
              onChange={(e) => setLogStatusFilter(e.target.value)}
              style={{ ...S.input, marginBottom: 0, width: 90, fontSize: 12, padding: "6px 8px" }}
            >
              {statusOptions.map((o) => (
                <option key={o} value={o}>
                  {o === "all" ? "All status" : o}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div style={{ color: "#9ca3af", fontSize: 13 }}>Loading notification history...</div>
          ) : filteredNotifications.length === 0 ? (
            <div style={{ textAlign: "center", padding: 30, color: "#9ca3af" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>📭</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>No notifications found</div>
              <div style={{ fontSize: 11, marginTop: 2 }}>
                {logSearch || logChannelFilter !== "all" || logStatusFilter !== "all"
                  ? "Try adjusting your filters."
                  : "Send your first notification above."}
              </div>
            </div>
          ) : (
            Object.entries(grouped).map(([groupKey, items]) => {
              if (items.length === 0) return null;
              return (
                <div key={groupKey}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      padding: "8px 0 4px",
                      borderBottom: "1px solid #f3f4f6",
                      marginBottom: 4,
                    }}
                  >
                    {GROUP_LABELS[groupKey]} · {items.length}
                  </div>
                  {items.map((item) => {
                    const isExpanded = expandedId === item._id;
                    return (
                      <div
                        key={item._id}
                        style={{
                          padding: "10px 12px",
                          borderBottom: "1px solid #f3f4f6",
                          cursor: "pointer",
                          background: item.read ? "transparent" : "#fffbeb",
                          borderRadius: isExpanded ? 10 : 0,
                          marginBottom: 2,
                          transition: "background 0.15s",
                        }}
                        onClick={() => setExpandedId(isExpanded ? null : item._id)}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                              {!item.read && (
                                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", flexShrink: 0 }} />
                              )}
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: item.read ? 600 : 800,
                                  color: "#1c1917",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {item.title}
                              </div>
                            </div>
                            {!isExpanded && (
                              <div style={{ fontSize: 12, color: "#64748b", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {item.body}
                              </div>
                            )}
                            {isExpanded && (
                              <div style={{ marginTop: 8 }}>
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: "#374151",
                                    lineHeight: 1.6,
                                    whiteSpace: "pre-wrap",
                                    marginBottom: 10,
                                    background: "#f9fafb",
                                    padding: 10,
                                    borderRadius: 8,
                                  }}
                                >
                                  {item.body}
                                </div>
                                <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.8 }}>
                                  <div>
                                    To: <b>{item.recipient?.name || "Unknown"}</b> ({item.recipient?.email || "No email"})
                                  </div>
                                  <div>
                                    Channel: <b style={{ textTransform: "capitalize" }}>{item.channel?.replace("_", " ") || "in-app"}</b>
                                  </div>
                                  <div>
                                    Sent: <b>{item.createdAt ? new Date(item.createdAt).toLocaleString("en-IN") : "Unknown"}</b>
                                  </div>
                                  {item.read && (
                                    <div>
                                      Read: <b>{item.readAt ? new Date(item.readAt).toLocaleString("en-IN") : "Yes"}</b>
                                    </div>
                                  )}
                                </div>
                                <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                                  {item.status === "failed" && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRetry(item);
                                      }}
                                      style={{ ...S.tblBtn, color: "#2563eb", borderColor: "#93c5fd", fontSize: 10 }}
                                    >
                                      🔄 Retry
                                    </button>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(item._id);
                                    }}
                                    disabled={deletingId === item._id}
                                    style={{ ...S.tblBtn, color: "#dc2626", borderColor: "#fca5a5", fontSize: 10, marginLeft: "auto" }}
                                  >
                                    {deletingId === item._id ? "..." : "🗑️ Delete"}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", flexShrink: 0 }}>
                            <StatusBadge status={item.status} />
                            {!isExpanded && <StatusBadge status={item.read ? "active" : "pending"} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </SectionCard>
      </div>
    </div>
  );
}
