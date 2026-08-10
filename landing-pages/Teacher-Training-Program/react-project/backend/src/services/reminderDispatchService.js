import { User } from "../models/User.js";
import { Notification } from "../models/Notification.js";
import { getUpcomingReminders } from "./reminderPredictionService.js";

/**
 * Write a single in-app reminder notification for a teacher.
 */
const sendTeacherReminder = async (item) => {
  return Notification.create({
    recipient: item.teacherId,
    channel: "in_app",
    title: `Reminder: ${item.category}`,
    body: item.message,
    status: "delivered",
    sentAt: new Date(),
    metadata: { category: "reminder", priority: "high" }
  });
};

/**
 * Notify all approved admins about registration approvals that have
 * been pending too long.
 */
const notifyAdminsOfPendingApprovals = async (registrationApprovals) => {
  if (registrationApprovals.length === 0) return 0;

  const admins = await User.find({ role: "admin", status: "approved" }).select("_id").lean();
  const approvalSummary = registrationApprovals.map((u) => u.message).join(" | ");

  await Promise.allSettled(
    admins.map((admin) =>
      Notification.create({
        recipient: admin._id,
        channel: "in_app",
        title: "Pending registration approvals",
        body: approvalSummary,
        status: "delivered",
        sentAt: new Date(),
        metadata: { category: "reminder", priority: "urgent" }
      })
    )
  );

  return admins.length;
};

/**
 * Scans everything due within the next 24 hours (via reminderPredictionService)
 * and actually sends the reminders. This is the single function called by:
 *  - POST /api/reminder-automation/send-reminders (manual admin trigger)
 *  - the daily cron job (automatic, unattended)
 */
export const dispatchDueReminders = async () => {
  const upcoming = await getUpcomingReminders();
  const { activityReports, assessments, courseDeadlines, parentSessions } = upcoming.teacherReminders;
  const allTeacherItems = [...activityReports, ...assessments, ...courseDeadlines, ...parentSessions];

  const results = await Promise.allSettled(allTeacherItems.map(sendTeacherReminder));

  // Build a human-readable log of exactly who got what and why —
  // this is what an admin/supervisor can point to as "the basis" for each reminder.
  const sentDetails = [];
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      const item = allTeacherItems[index];
      sentDetails.push({
        teacherName: item.teacherName,
        category: item.category,
        reason: item.message,
        dueDate: item.dueDate
      });
    }
  });

  const sentCount = results.filter((r) => r.status === "fulfilled").length;
  const failedCount = results.length - sentCount;

  const adminNotified = await notifyAdminsOfPendingApprovals(upcoming.adminReminders.registrationApprovals);

  return {
    scannedAt: upcoming.generatedAt,
    sentCount,
    failedCount,
    adminNotified,
    totalItemsScanned: allTeacherItems.length,
    sentDetails
  };
};

export default { dispatchDueReminders };