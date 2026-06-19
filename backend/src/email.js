import nodemailer from "nodemailer";
import { PortalSetting } from "./models/PortalSetting.js";

/**
 * Load SMTP config from the PortalSetting collection.
 * Returns null if SMTP is not configured.
 */
async function getSmtpConfig() {
  const keys = ["smtpHost", "smtpPort", "smtpUser", "smtpPass", "fromEmail", "fromName"];
  const docs = await PortalSetting.find({ key: { $in: keys } });
  const map = {};
  docs.forEach((d) => { map[d.key] = d.value; });

  if (!map.smtpHost || !map.smtpUser || !map.smtpPass) {
    return null;
  }

  return {
    host: String(map.smtpHost),
    port: Number(map.smtpPort) || 587,
    user: String(map.smtpUser),
    pass: String(map.smtpPass),
    fromEmail: String(map.fromEmail || map.smtpUser),
    fromName: String(map.fromName || "SpacECE Notifications"),
  };
}

/**
 * Send an email to a single recipient using the portal's SMTP config.
 * Returns { success: boolean, error?: string }.
 */
export async function sendEmail({ to, subject, html }) {
  try {
    const config = await getSmtpConfig();
    if (!config) {
      return { success: false, error: "SMTP not configured. Set SMTP settings in Settings & Roles > Email." };
    }

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: { user: config.user, pass: config.pass },
    });

    await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to,
      subject,
      html: html || subject,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message || "Unknown email error" };
  }
}

/**
 * Send bulk emails to multiple recipients.
 * Returns an array of results, one per recipient.
 */
export async function sendBulkEmails({ recipients, subject, body }) {
  const html = body
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  const results = await Promise.allSettled(
    recipients.map(async (r) => {
      const result = await sendEmail({ to: r.email, subject, html });
      return { recipientId: r._id, ...result };
    })
  );

  return results.map((r) =>
    r.status === "fulfilled"
      ? r.value
      : { recipientId: null, success: false, error: r.reason?.message || "Failed to send" }
  );
}
