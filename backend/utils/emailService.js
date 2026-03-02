/**
 * Email notifications for booking events.
 * Set SMTP_* in .env to enable; otherwise emails are logged only.
 */
let transporter = null;

function getTransporter() {
  if (transporter !== undefined) return transporter;
  const nodemailer = require('nodemailer');
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    console.log('[Email] SMTP not configured (SMTP_HOST, SMTP_USER, SMTP_PASS). Emails will be logged only.');
    transporter = false;
    return transporter;
  }
  transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: port === '465',
    auth: { user, pass },
  });
  return transporter;
}

function getFrom() {
  return process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@spiritual-katha.local';
}

async function sendMail(options) {
  const transport = getTransporter();
  const from = getFrom();
  const msg = {
    from: `"Spiritual Katha" <${from}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html || options.text,
  };
  if (transport) {
    try {
      await transport.sendMail(msg);
      console.log('[Email] Sent:', options.subject, 'to', options.to);
    } catch (err) {
      console.error('[Email] Send failed:', err.message);
    }
  } else {
    console.log('[Email] (not sent - no SMTP) To:', options.to, 'Subject:', options.subject);
    console.log('[Email] Body:', options.text);
  }
}

async function sendBookingReceivedToGuru(booking, guruEmail, devoteeName, slotSummary) {
  const text = `A new katha booking request has been received.\n\nDevotee: ${devoteeName}\nSlot: ${slotSummary}\nGranth: ${booking.selectedGranth}\nFrom: ${booking.fromDate}\nTo: ${booking.toDate}\n\nPlease log in to your dashboard to approve or reject.`;
  await sendMail({
    to: guruEmail,
    subject: 'New Katha Booking Request – Spiritual Katha',
    text,
  });
}

async function sendBookingStatusToDevotee(booking, devoteeEmail, devoteeName, status) {
  const action = status === 'Approved' ? 'approved' : 'rejected';
  const text = `Dear ${devoteeName},\n\nYour katha booking has been ${action}.\n\nGranth: ${booking.selectedGranth}\nFrom: ${booking.fromDate}\nTo: ${booking.toDate}\n\nThank you for using Spiritual Katha.`;
  await sendMail({
    to: devoteeEmail,
    subject: `Your Katha Booking ${status === 'Approved' ? 'Approved' : 'Rejected'} – Spiritual Katha`,
    text,
  });
}

async function sendReminderToDevotee(booking, devoteeEmail, devoteeName) {
  const text = `Dear ${devoteeName},\n\nReminder: Your katha session is scheduled for ${booking.fromDate} to ${booking.toDate}.\n\nGranth: ${booking.selectedGranth}\n\nWe look forward to your participation.`;
  await sendMail({
    to: devoteeEmail,
    subject: 'Reminder: Your Katha Session Tomorrow – Spiritual Katha',
    text,
  });
}

async function sendPasswordResetEmail(email, name, resetUrl) {
  const text = `Dear ${name},\n\nWe received a request to reset the password for your Spiritual Katha account.\n\nIf you made this request, please click the link below (or paste it into your browser) to set a new password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request a password reset, you can safely ignore this email.\n\nWith regards,\nSpiritual Katha Team`;
  await sendMail({
    to: email,
    subject: 'Reset your Spiritual Katha password',
    text,
  });
}

module.exports = {
  sendMail,
  sendBookingReceivedToGuru,
  sendBookingStatusToDevotee,
  sendReminderToDevotee,
  sendPasswordResetEmail,
};
