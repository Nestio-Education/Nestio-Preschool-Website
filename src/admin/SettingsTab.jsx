import { useEffect, useState, useCallback } from "react";
import { Modal, S, SectionCard, StatCard, StatusBadge } from "../components/Shared";
import { getAdminDashboard, getAdminTeachers, getTrainers, getCourses, getAdminUsers, getPortalSettings, updatePortalSettings } from "../services/api";

const safeBool = (val, defaultVal = false) => {
  if (typeof val === "boolean") return val;
  if (val === "true") return true;
  if (val === "false") return false;
  return defaultVal;
};

const safeNum = (val, defaultVal = 0) => {
  const n = Number(val);
  return Number.isFinite(n) ? n : defaultVal;
};

export default function SettingsTab({ setToast }) {
  const [activeSection, setActiveSection] = useState("portal");
  const [settings, setSettings] = useState({
    portalName: "SpacECE Teacher Training Portal",
    defaultLanguage: "English",
    timezone: "Asia/Kolkata (IST)",
    maintenanceMode: false,
  });
  const [emailConfig, setEmailConfig] = useState({
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPass: "",
    fromEmail: "",
    fromName: "",
  });
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecial: false,
    expiryDays: 90,
  });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadErrors, setLoadErrors] = useState([]);
  const [roleUsers, setRoleUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  // Load all data with individual fallbacks — one failure doesn't block everything
  useEffect(() => {
    let cancelled = false;
    const errors = [];

    const load = async () => {
      // 1. Load server settings
      try {
        const settingsData = await getPortalSettings();
        if (cancelled) return;
        const serverSettings = settingsData?.settings || {};
        if (Object.keys(serverSettings).length > 0) {
          setSettings((prev) => ({
            portalName: serverSettings.portalName || prev.portalName,
            defaultLanguage: serverSettings.defaultLanguage || prev.defaultLanguage,
            timezone: serverSettings.timezone || prev.timezone,
            maintenanceMode: safeBool(serverSettings.maintenanceMode, prev.maintenanceMode),
          }));
          setEmailConfig((prev) => ({
            smtpHost: serverSettings.smtpHost || prev.smtpHost,
            smtpPort: serverSettings.smtpPort || prev.smtpPort,
            smtpUser: serverSettings.smtpUser || prev.smtpUser,
            smtpPass: serverSettings.smtpPass || prev.smtpPass,
            fromEmail: serverSettings.fromEmail || prev.fromEmail,
            fromName: serverSettings.fromName || prev.fromName,
          }));
          setPasswordPolicy((prev) => ({
            minLength: safeNum(serverSettings.minLength, prev.minLength),
            requireUppercase: safeBool(serverSettings.requireUppercase, prev.requireUppercase),
            requireNumbers: safeBool(serverSettings.requireNumbers, prev.requireNumbers),
            requireSpecial: safeBool(serverSettings.requireSpecial, prev.requireSpecial),
            expiryDays: safeNum(serverSettings.expiryDays, prev.expiryDays),
          }));
        }
      } catch (err) {
        errors.push("settings");
      }

      // 2. Load dashboard stats
      let dashboardData = {};
      try {
        const data = await getAdminDashboard();
        if (!cancelled) dashboardData = data || {};
      } catch (err) {
        errors.push("dashboard");
      }

      // 3. Load teachers
      let teachers = [];
      try {
        const data = await getAdminTeachers();
        if (!cancelled) teachers = data?.teachers || [];
      } catch (err) {
        errors.push("teachers");
      }

      // 4. Load trainers
      let trainers = [];
      try {
        const data = await getTrainers();
        if (!cancelled) trainers = data?.trainers || [];
      } catch (err) {
        errors.push("trainers");
      }

      // 5. Load courses
      let courses = [];
      try {
        const data = await getCourses();
        if (!cancelled) courses = data?.courses || [];
      } catch (err) {
        errors.push("courses");
      }

      // 6. Load all users (for admins count)
      let allUsers = [];
      try {
        const data = await getAdminUsers();
        if (!cancelled) allUsers = data?.users || [];
      } catch (err) {
        errors.push("users");
      }

      if (cancelled) return;

      const admins = allUsers.filter((u) => u.role === "admin");

      setStats({
        totalTeachers: teachers.length,
        approvedTeachers: teachers.filter((t) => t.status === "approved").length,
        pendingTeachers: teachers.filter((t) => t.status === "pending").length,
        totalTrainers: trainers.length,
        activeTrainers: trainers.filter((t) => t.status === "active").length,
        totalCourses: courses.length,
        totalAdmins: admins.length,
        ...dashboardData,
      });

      // Build role-wise user data
      setRoleUsers([
        {
          role: "admin",
          label: "Super Admin",
          count: admins.length,
          users: admins.map((u) => ({ name: u.name, email: u.email, status: u.status || "active", _id: u._id })),
        },
        {
          role: "trainer",
          label: "Trainer",
          count: trainers.length,
          users: trainers.map((t) => ({ name: t.name, email: t.email || "", status: t.status || "active", _id: t._id })),
        },
        {
          role: "teacher",
          label: "Teacher",
          count: teachers.length,
          users: teachers.map((t) => ({ name: t.name, email: t.email, status: t.status, _id: t._id })),
        },
      ]);

      setLoadErrors(errors);
      setLoading(false);
    };

    load();

    return () => { cancelled = true; };
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      // Coerce booleans properly before sending
      const payload = {
        portalName: settings.portalName,
        defaultLanguage: settings.defaultLanguage,
        timezone: settings.timezone,
        maintenanceMode: settings.maintenanceMode,
        smtpHost: emailConfig.smtpHost,
        smtpPort: emailConfig.smtpPort,
        smtpUser: emailConfig.smtpUser,
        smtpPass: emailConfig.smtpPass,
        fromEmail: emailConfig.fromEmail,
        fromName: emailConfig.fromName,
        minLength: passwordPolicy.minLength,
        requireUppercase: passwordPolicy.requireUppercase,
        requireNumbers: passwordPolicy.requireNumbers,
        requireSpecial: passwordPolicy.requireSpecial,
        expiryDays: passwordPolicy.expiryDays,
      };

      const data = await updatePortalSettings(payload);
      if (data?.settings) {
        setDirty(false);
        setToast?.({ msg: "All settings saved to server successfully!", type: "success" });
      }
    } catch (error) {
      setToast?.({ msg: error.message || "Failed to save settings.", type: "error" });
    } finally {
      setSaving(false);
    }
  }, [settings, emailConfig, passwordPolicy, setToast]);

  const markDirty = useCallback(() => setDirty(true), []);

  const roleCards = [
    {
      role: "Super Admin",
      access: "Full access to all modules including financial and role management",
      count: stats?.totalAdmins || 0,
      color: "#ef4444",
      bg: "#fee2e2",
    },
    {
      role: "Trainer",
      access: "Content upload, assignment review, live sessions, forum",
      count: stats?.activeTrainers || 0,
      color: "#8b5cf6",
      bg: "#ede9fe",
    },
    {
      role: "Teacher",
      access: "Course access, lesson plan submission, attendance, feedback",
      count: stats?.approvedTeachers || 0,
      color: "#10b981",
      bg: "#d1fae5",
    },
    {
      role: "Pending Teachers",
      access: "Awaiting approval in Teacher Management tab",
      count: stats?.pendingTeachers || 0,
      color: "#f59e0b",
      bg: "#fef3c7",
    },
  ];

  const sections = [
    { key: "portal", label: "⚙️ Portal" },
    { key: "email", label: "📧 Email" },
    { key: "security", label: "🔒 Security" },
    { key: "roles", label: "🛡️ Roles" },
  ];

  const openUserModal = (roleLabel) => {
    setSelectedRole(roleLabel);
    setShowUserModal(true);
  };

  // Find users matching the selected role label
  const modalUsers = (() => {
    const roleMap = {
      "Super Admin": "admin",
      "Trainer": "trainer",
      "Teacher": "teacher",
      "Pending Teachers": "teacher",
    };
    const roleKey = roleMap[selectedRole] || "";
    const matched = roleUsers.find((r) => r.role === roleKey);
    if (!matched) return [];

    if (selectedRole === "Pending Teachers") {
      return matched.users.filter((u) => u.status === "pending");
    }
    return matched.users;
  })();

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {showUserModal && (
        <Modal title={`Users — ${selectedRole}`} onClose={() => setShowUserModal(false)}>
          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            {modalUsers.length > 0 ? (
              modalUsers.map((u, i) => (
                <div key={u._id || i} style={{ padding: "10px 14px", background: "#f9fafb", borderRadius: 8, border: "1px solid #f3f4f6", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1c1917" }}>{u.name || "Unnamed"}</div>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>{u.email || "—"}</div>
                  </div>
                  <StatusBadge status={u.status} />
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: 30, color: "#9ca3af", fontSize: 13 }}>No users found for this role.</div>
            )}
          </div>
        </Modal>
      )}

      <h1 style={S.pageTitle}>Settings & Roles</h1>
      <p style={S.pageSub}>Manage portal settings, email configuration, security policies, and role-based access.</p>

      {/* Load errors banner */}
      {loadErrors.length > 0 && !loading && (
        <div style={{ marginBottom: 16, padding: "10px 16px", background: "#fef3c7", borderRadius: 10, border: "1px solid #fbbf24", fontSize: 12, color: "#92400e", display: "flex", alignItems: "center", gap: 8 }}>
          <span>⚠️</span>
          <span>Could not load: {loadErrors.join(", ")}. Some data may be unavailable.</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#9ca3af", fontSize: 14, fontWeight: 600 }}>Loading system data...</div>
      ) : (
        <>
          {stats && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 14, marginBottom: 20 }}>
              <StatCard icon="👥" label="Total Teachers" val={stats.totalTeachers} color="#f59e0b" bg="#fef3c7" />
              <StatCard icon="✅" label="Approved" val={stats.approvedTeachers} color="#10b981" bg="#d1fae5" />
              <StatCard icon="⏳" label="Pending" val={stats.pendingTeachers} color="#3b82f6" bg="#dbeafe" />
              <StatCard icon="🎓" label="Trainers" val={stats.totalTrainers} color="#8b5cf6" bg="#ede9fe" />
              <StatCard icon="📚" label="Courses" val={stats.totalCourses} color="#06b6d4" bg="#cffafe" />
            </div>
          )}

          <div style={{ display: "flex", gap: 4, marginBottom: 18, borderBottom: "2px solid #f3f4f6" }}>
            {sections.map((s) => (
              <button key={s.key} onClick={() => setActiveSection(s.key)} style={{ padding: "10px 18px", border: "none", borderBottom: `2px solid ${activeSection === s.key ? "#f59e0b" : "transparent"}`, background: "none", color: activeSection === s.key ? "#92400e" : "#9ca3af", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: -2 }}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Portal Settings */}
          {activeSection === "portal" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <SectionCard title="⚙️ General Settings">
                <div style={{ marginBottom: 12 }}>
                  <label style={S.label}>Portal Name</label>
                  <input style={S.input} value={settings.portalName} onChange={(e) => { setSettings((p) => ({ ...p, portalName: e.target.value })); markDirty(); }} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={S.label}>Default Language</label>
                  <select style={S.input} value={settings.defaultLanguage} onChange={(e) => { setSettings((p) => ({ ...p, defaultLanguage: e.target.value })); markDirty(); }}>
                    {["English", "Hindi", "Marathi", "Tamil", "Telugu"].map((l) => (<option key={l}>{l}</option>))}
                  </select>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={S.label}>Timezone</label>
                  <select style={S.input} value={settings.timezone} onChange={(e) => { setSettings((p) => ({ ...p, timezone: e.target.value })); markDirty(); }}>
                    <option>Asia/Kolkata (IST)</option>
                    <option>UTC</option>
                  </select>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid #f3f4f6", marginTop: 4 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1c1917" }}>🔧 Maintenance Mode</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>Disable public access to portal</div>
                  </div>
                  <div onClick={() => { setSettings((p) => ({ ...p, maintenanceMode: !p.maintenanceMode })); markDirty(); }} style={{ width: 46, height: 26, borderRadius: 13, background: settings.maintenanceMode ? "#ef4444" : "#e5e7eb", position: "relative", cursor: "pointer", transition: "background 0.3s" }}>
                    <div style={{ position: "absolute", top: 3, left: settings.maintenanceMode ? 22 : 3, width: 20, height: 20, borderRadius: "50%", background: "white", transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="📊 System Information">
                {stats && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { label: "Active Centers", val: stats.totalCenters || 0 },
                      { label: "Total Children", val: stats.totalChildren || 0 },
                      { label: "Pending Activities", val: stats.pendingActivities || 0 },
                      { label: "Course Completion", val: `${stats.courseCompletionPercent || 0}%`, color: "#10b981" },
                    ].map((item, i) => (
                      <div key={i} style={{ padding: "12px 14px", background: "#f9fafb", borderRadius: 10, border: "1px solid #f3f4f6" }}>
                        <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase" }}>{item.label}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: item.color || "#1c1917" }}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>
          )}

          {/* Email Configuration */}
          {activeSection === "email" && (
            <SectionCard title="📧 Email (SMTP) Configuration">
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 16, lineHeight: 1.5 }}>
                Configure SMTP settings for sending email notifications to teachers. Save after making changes.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={S.label}>SMTP Host</label>
                  <input style={S.input} value={emailConfig.smtpHost} onChange={(e) => { setEmailConfig((p) => ({ ...p, smtpHost: e.target.value })); markDirty(); }} placeholder="smtp.gmail.com" />
                </div>
                <div>
                  <label style={S.label}>SMTP Port</label>
                  <select style={S.input} value={emailConfig.smtpPort} onChange={(e) => { setEmailConfig((p) => ({ ...p, smtpPort: e.target.value })); markDirty(); }}>
                    <option value="587">587 (TLS)</option>
                    <option value="465">465 (SSL)</option>
                    <option value="25">25 (Plain)</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={S.label}>SMTP Username</label>
                  <input style={S.input} value={emailConfig.smtpUser} onChange={(e) => { setEmailConfig((p) => ({ ...p, smtpUser: e.target.value })); markDirty(); }} placeholder="admin@spaceece.com" />
                </div>
                <div>
                  <label style={S.label}>SMTP Password</label>
                  <input type="password" style={S.input} value={emailConfig.smtpPass} onChange={(e) => { setEmailConfig((p) => ({ ...p, smtpPass: e.target.value })); markDirty(); }} placeholder="••••••••" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={S.label}>From Email</label>
                  <input style={S.input} value={emailConfig.fromEmail} onChange={(e) => { setEmailConfig((p) => ({ ...p, fromEmail: e.target.value })); markDirty(); }} placeholder="noreply@spaceece.com" />
                </div>
                <div>
                  <label style={S.label}>From Name</label>
                  <input style={S.input} value={emailConfig.fromName} onChange={(e) => { setEmailConfig((p) => ({ ...p, fromName: e.target.value })); markDirty(); }} placeholder="SpacECE Admin" />
                </div>
              </div>
            </SectionCard>
          )}

          {/* Security / Password Policy */}
          {activeSection === "security" && (
            <SectionCard title="🔒 Password & Security Policy">
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 16, lineHeight: 1.5 }}>
                Configure password requirements for all users. These rules will be enforced on registration and password reset.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={S.label}>Minimum Password Length</label>
                  <input type="number" style={S.input} value={passwordPolicy.minLength} onChange={(e) => { setPasswordPolicy((p) => ({ ...p, minLength: Number(e.target.value) })); markDirty(); }} min={6} max={32} />
                </div>
                <div>
                  <label style={S.label}>Password Expiry (days)</label>
                  <input type="number" style={S.input} value={passwordPolicy.expiryDays} onChange={(e) => { setPasswordPolicy((p) => ({ ...p, expiryDays: Number(e.target.value) })); markDirty(); }} min={0} max={365} />
                  <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 3 }}>0 = never expires</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { key: "requireUppercase", label: "Require Uppercase Letter", desc: "At least one uppercase character" },
                  { key: "requireNumbers", label: "Require Numbers", desc: "At least one numeric character" },
                  { key: "requireSpecial", label: "Require Special Characters", desc: "At least one special character (!@#$ etc.)" },
                ].map((item) => (
                  <div key={item.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "#f9fafb", borderRadius: 8, border: "1px solid #f3f4f6" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1c1917" }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>Password must contain {item.desc}</div>
                    </div>
                    <div onClick={() => { setPasswordPolicy((p) => ({ ...p, [item.key]: !p[item.key] })); markDirty(); }} style={{ width: 40, height: 22, borderRadius: 11, background: passwordPolicy[item.key] ? "#10b981" : "#e5e7eb", position: "relative", cursor: "pointer", transition: "background 0.3s" }}>
                      <div style={{ position: "absolute", top: 2, left: passwordPolicy[item.key] ? 19 : 2, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left 0.3s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Roles */}
          {activeSection === "roles" && (
            <SectionCard title="🛡️ Role-Based Access Control">
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 14, lineHeight: 1.5 }}>
                Live user counts from the database. Click "View Users" to see the actual users assigned to each role.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {roleCards.map((r, i) => (
                  <div key={i} style={{ padding: "12px 16px", background: "#f9fafb", borderRadius: 10, border: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#1c1917" }}>{r.role}</span>
                          <span style={{ marginLeft: 8, padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: r.count > 0 ? r.bg : "#f3f4f6", color: r.count > 0 ? r.color : "#9ca3af" }}>
                            {r.count > 0 ? `${r.count} user${r.count !== 1 ? "s" : ""}` : "No users"}
                          </span>
                        </div>
                      </div>
                      {r.count > 0 && (
                        <button onClick={() => openUserModal(r.role)} style={{ ...S.tblBtn, fontSize: 10, padding: "4px 10px" }}>
                          👥 View Users
                        </button>
                      )}
                    </div>
                    <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, paddingLeft: 18 }}>{r.access}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {dirty && (
            <div style={{ position: "sticky", bottom: 0, background: "white", padding: "16px 24px", borderRadius: 16, border: "1px solid #f1f5f9", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)", marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 13, color: "#d97706", fontWeight: 600 }}>⚠️ You have unsaved changes</div>
              <button onClick={handleSave} disabled={saving} style={{ ...S.primaryBtn }}>{saving ? "Saving..." : "💾 Save All Settings"}</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
