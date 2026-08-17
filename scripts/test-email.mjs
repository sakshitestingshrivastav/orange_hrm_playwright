import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

async function main() {
  const user = process.env.SMTP_USER;
  const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
  const to = process.env.ALERT_EMAIL_TO;
  const from = process.env.ALERT_EMAIL_FROM || user;

  if (!user || !pass || !to) {
    console.error('Missing SMTP_USER / SMTP_PASS / ALERT_EMAIL_TO');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  console.log('Verifying SMTP...');
  await transporter.verify();
  console.log('SMTP OK. Sending test email...');

  await transporter.sendMail({
    from,
    to,
    subject: 'Playwright email test - OrangeHRM framework',
    text: 'If you received this, failure email setup is working.',
  });

  console.log(`Test email sent to ${to}`);
}

main().catch((error) => {
  console.error('Email test failed:', error.message);
  process.exit(1);
});
