const nodemailer = require('nodemailer');
const logger = require('./logger');

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM = 'LMS <no-reply@lms.local>',
} = process.env;

const transporter =
  SMTP_HOST && SMTP_USER
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: Number(SMTP_PORT) === 465,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      })
    : null;

const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    logger.info('Email skipped (no SMTP configured)', { to, subject });
    return;
  }

  await transporter.sendMail({
    from: EMAIL_FROM,
    to,
    subject,
    html,
  });
};

module.exports = {
  sendEmail,
};

