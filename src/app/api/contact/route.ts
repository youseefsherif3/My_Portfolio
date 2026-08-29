import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { connectToDatabase } from '@/lib/mongodb';
import { ContactMessage } from '@/lib/models/ContactMessage';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const subject = String(body.subject || '').trim();
    const message = String(body.message || '').trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ ok: false, error: 'All fields are required' }, { status: 400 });
    }

    let savedToDb = false;

    // 1. Save to MongoDB Database (so it appears in Admin Dashboard Messages Inbox)
    try {
      await connectToDatabase();
      await ContactMessage.create({
        name,
        email,
        subject,
        message,
        read: false,
        replied: false,
      });
      savedToDb = true;
      console.log('Successfully saved contact submission to MongoDB database');
    } catch (dbErr) {
      console.error('Failed to save contact message to DB:', dbErr);
    }

    // 2. Send email notification via SMTP Nodemailer if configured
    let emailSent = false;
    try {
      const host = process.env.SMTP_HOST;
      const port = Number(process.env.SMTP_PORT || 465);
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;
      const fromName = process.env.SMTP_FROM_NAME || 'Portfolio Contact';
      const to = process.env.SMTP_TO || 'youseefsherif89@gmail.com';

      if (host && user && pass && to) {
        const transport = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
          tls: {
            rejectUnauthorized: false,
          },
        });

        const textContent = [
          `New Contact Form Submission`,
          `---------------------------`,
          `Name: ${name}`,
          `Email: ${email}`,
          `Subject: ${subject}`,
          ``,
          `Message:`,
          `${message}`,
        ].join('\n');

        const htmlContent = `
          <div style="font-family: sans-serif; background-color: #080C10; color: #E2E8F0; padding: 24px; border-radius: 12px;">
            <h2 style="color: #0ECFCF; margin-top: 0;">New Inquiry Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #0ECFCF;">${email}</a></p>
            <p><strong>Topic / Subject:</strong> ${subject}</p>
            <hr style="border-color: #1E2D3D; margin: 16px 0;" />
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background: #0F1923; padding: 16px; border-radius: 8px; border: 1px solid #1E2D3D;">${message}</p>
          </div>
        `;

        await transport.sendMail({
          from: `"${fromName}" <${user}>`,
          to,
          subject: `Portfolio Message: ${subject} (${name})`,
          replyTo: email,
          text: textContent,
          html: htmlContent,
        });

        emailSent = true;
        console.log('Successfully sent email notification to', to);
      }
    } catch (mailErr) {
      console.error('SMTP Mail send failed:', mailErr);
    }

    // Return success if message was either saved in database or sent by email
    if (savedToDb || emailSent) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, error: 'Unable to process submission' }, { status: 500 });
  } catch (err) {
    console.error('Contact API Error:', err);
    return NextResponse.json({ ok: false, error: 'Send failed' }, { status: 500 });
  }
}
