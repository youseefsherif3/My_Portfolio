import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const subject = String(body.subject || '').trim();
    const message = String(body.message || '').trim();

    if (!name || !email || !subject || message.length < 10) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
    }

    const host = requiredEnv('SMTP_HOST');
    const port = Number(requiredEnv('SMTP_PORT'));
    const user = requiredEnv('SMTP_USER');
    const pass = requiredEnv('SMTP_PASS');
    const fromName = requiredEnv('SMTP_FROM_NAME');
    const to = requiredEnv('SMTP_TO');

    const transport = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const text = [`Name: ${name}`, `Email: ${email}`, `Subject: ${subject}`, '', message].join(
      '\n'
    );

    await transport.sendMail({
      from: `${fromName} <${user}>`,
      to,
      subject: `New contact form: ${subject}`,
      replyTo: email,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact API Error:', err);
    return NextResponse.json({ ok: false, error: 'Send failed' }, { status: 500 });
  }
}
