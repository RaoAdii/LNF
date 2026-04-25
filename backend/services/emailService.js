const nodemailer = require('nodemailer');

const isPlaceholderValue = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) return true;

  return (
    normalized.includes('your-gmail') ||
    normalized.includes('app-password') ||
    normalized === 'change-me' ||
    normalized === 'changeme'
  );
};

const hasRequiredSmtpConfig = () => {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      !isPlaceholderValue(process.env.SMTP_HOST) &&
      !isPlaceholderValue(process.env.SMTP_USER) &&
      !isPlaceholderValue(process.env.SMTP_PASS)
  );
};

const transporter = hasRequiredSmtpConfig()
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

// Verify connection on startup (non-blocking)
if (transporter) {
  transporter.verify().catch((err) => {
    console.warn('[emailService] SMTP connection warning:', err.message);
  });
} else {
  console.warn(
    '[emailService] SMTP is not fully configured. Set SMTP_HOST/PORT/USER/PASS with real values.'
  );
}

const wrap = (title, body) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background:#f5f5f5; margin:0; padding:0; }
    .card { max-width:480px; margin:40px auto; background:#fff;
            border-radius:12px; overflow:hidden;
            box-shadow:0 4px 20px rgba(0,0,0,0.08); }
    .header { background:#4F46E5; padding:28px 32px; }
    .header h1 { color:#fff; margin:0; font-size:1.3rem; letter-spacing:-0.02em; }
    .body   { padding:32px; }
    .otp    { font-size:2.4rem; font-weight:700; letter-spacing:0.18em;
              color:#4F46E5; text-align:center; margin:24px 0; }
    .note   { font-size:0.82rem; color:#888; margin-top:20px; }
    p       { color:#374151; line-height:1.6; margin:0 0 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header"><h1>${process.env.APP_NAME || 'LostHub'}</h1></div>
    <div class="body">
      <h2 style="margin:0 0 16px;color:#111;font-size:1.1rem;">${title}</h2>
      ${body}
    </div>
  </div>
</body>
</html>`;

async function sendOTPEmail(toEmail, otp, userName) {
  if (!transporter) {
    const configError = new Error(
      'SMTP configuration is incomplete. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.'
    );
    configError.code = 'EMAIL_NOT_CONFIGURED';
    throw configError;
  }

  const body = `
    <p>Hi <strong>${userName}</strong>,</p>
    <p>Use the code below to verify your account. It expires in
       <strong>${process.env.OTP_EXPIRES_MINUTES || 10} minutes</strong>.</p>
    <div class="otp">${otp}</div>
    <p class="note">If you did not create an account, ignore this email.</p>`;

  try {
    await transporter.sendMail({
      from: `"${process.env.APP_NAME || 'LostHub'}" <${
        process.env.FROM_EMAIL || process.env.SMTP_USER
      }>`,
      to: toEmail,
      subject: `Your ${process.env.APP_NAME || 'LostHub'} verification code: ${otp}`,
      html: wrap('Verify your email address', body),
    });
  } catch (error) {
    console.error('[emailService] sendOTPEmail failed:', error.message);
    throw error;
  }
}

async function sendResendOTPEmail(toEmail, otp, userName) {
  try {
    await sendOTPEmail(toEmail, otp, userName);
  } catch (error) {
    console.error('[emailService] sendResendOTPEmail failed:', error.message);
    throw error;
  }
}

module.exports = {
  sendOTPEmail,
  sendResendOTPEmail,
  hasRequiredSmtpConfig,
};
