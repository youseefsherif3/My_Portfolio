import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import nodemailer from 'nodemailer';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ContactMessage } from '@/lib/models/ContactMessage';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return null;
  }
  return session;
}

const TOPIC_TITLES: Record<string, string> = {
  'backend-api': 'Backend API Development',
  'auth-security': 'Authentication & Security Systems',
  'database-design': 'Database Design & Optimization',
  'full-consultation': 'Full Project Consultation',
  'other': 'Inquiry & Collaboration',
};

function formatTopicSubject(rawSubject: string): string {
  if (!rawSubject) return 'Inquiry & Collaboration';
  const clean = rawSubject.trim();
  if (TOPIC_TITLES[clean.toLowerCase()]) {
    return TOPIC_TITLES[clean.toLowerCase()];
  }
  if (/^[a-z0-9-]+$/i.test(clean) && clean.includes('-')) {
    return clean
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
  return clean;
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = String(body.id || '').trim();
    const replyText = String(body.replyText || '').trim();

    if (!id || !replyText) {
      return NextResponse.json(
        { error: 'Message ID and reply text are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const msg = await ContactMessage.findById(id);

    if (!msg) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    // SMTP Config
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 465);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const fromName = process.env.SMTP_FROM_NAME || 'Youseef Sherif';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.youseefsherifdeveloper.dev';

    if (!host || !user || !pass) {
      return NextResponse.json(
        { error: 'SMTP credentials are not configured on the server' },
        { status: 500 }
      );
    }

    const transport = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const topicTitle = formatTopicSubject(msg.subject);
    const emailSubject = `Re: ${topicTitle} — Youseef Sherif`;
    const formattedReplyText = replyText.replace(/\n/g, '<br/>');
    const formattedOriginalMessage = msg.message.replace(/\n/g, '<br/>');
    const sentDate = new Date(msg.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Executive-Grade Dark Theme HTML Template
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${emailSubject}</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    a { text-decoration: none; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #080C10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #E2E8F0;">
  
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #080C10; width: 100%; padding: 40px 16px;">
    <tr>
      <td align="center">
        
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 620px; background-color: #0F1923; border: 1px solid #1E2D3D; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);">
          
          <!-- Top Header Bar -->
          <tr>
            <td style="padding: 24px 32px; background-color: #131D28; border-bottom: 1px solid #1E2D3D;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td valign="middle">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="width: 36px; height: 36px; background-color: rgba(14, 207, 207, 0.12); border: 1px solid rgba(14, 207, 207, 0.35); border-radius: 10px; text-align: center; vertical-align: middle;">
                          <span style="font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; font-weight: 800; font-size: 15px; color: #0ECFCF; line-height: 36px; display: inline-block;">
                            &gt;_
                          </span>
                        </td>
                        <td style="padding-left: 12px;">
                          <div style="font-size: 16px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.3px; line-height: 1.2;">
                            Youseef Sherif
                          </div>
                          <div style="font-size: 11px; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; color: #0ECFCF; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; margin-top: 2px;">
                            Backend Software Engineer
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display: inline-block; padding: 5px 12px; background-color: rgba(14, 207, 207, 0.1); border: 1px solid rgba(14, 207, 207, 0.3); border-radius: 20px; color: #0ECFCF; font-size: 11px; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; font-weight: 700;">
                      ${topicTitle}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Body Content -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              
              <!-- Greeting -->
              <p style="margin: 0 0 18px 0; font-size: 15px; color: #94A3B8; font-weight: 500; line-height: 1.5;">
                Hello <strong style="color: #FFFFFF; font-weight: 700;">${msg.name}</strong>,
              </p>
              
              <!-- Primary Reply Block -->
              <div style="font-size: 15px; line-height: 1.75; color: #E2E8F0; background-color: #080C10; border: 1px solid #1E2D3D; border-left: 4px solid #0ECFCF; border-radius: 12px; padding: 22px 24px; margin-bottom: 30px; box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);">
                ${formattedReplyText}
              </div>

              <!-- Context: Original Inquiry Box -->
              <div style="margin-top: 24px; padding: 20px 22px; background-color: #141F2B; border: 1px solid #223244; border-radius: 12px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 10px;">
                  <tr>
                    <td>
                      <span style="font-size: 11px; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; color: #64748B; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">
                        Original Inquiry
                      </span>
                    </td>
                    <td align="right">
                      <span style="font-size: 11px; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; color: #64748B;">
                        ${sentDate}
                      </span>
                    </td>
                  </tr>
                </table>

                <div style="font-size: 12px; font-weight: 700; color: #0ECFCF; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; margin-bottom: 8px;">
                  Topic: ${topicTitle}
                </div>

                <div style="font-size: 13px; line-height: 1.6; color: #94A3B8; font-style: italic; border-left: 2px solid #2A3F55; padding-left: 12px; margin: 0;">
                  &ldquo;${formattedOriginalMessage}&rdquo;
                </div>
              </div>

              <!-- Signature Section -->
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #1E2D3D;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td valign="top">
                      <div style="font-size: 15px; font-weight: 700; color: #FFFFFF; line-height: 1.3;">
                        Youseef Sherif
                      </div>
                      <div style="font-size: 12px; color: #0ECFCF; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; margin-top: 3px;">
                        Backend Developer &bull; Node.js &bull; Systems Architecture
                      </div>
                      <div style="font-size: 11px; color: #64748B; margin-top: 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        Feel free to reply directly to this email to continue our conversation.
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

            </td>
          </tr>

          <!-- Footer Buttons & Links -->
          <tr>
            <td style="padding: 22px 32px; background-color: #0B1117; border-top: 1px solid #1E2D3D; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto;">
                <tr>
                  <td style="padding: 0 6px;">
                    <a href="${siteUrl}" target="_blank" style="display: inline-block; padding: 7px 16px; background-color: rgba(14, 207, 207, 0.12); border: 1px solid rgba(14, 207, 207, 0.4); border-radius: 8px; color: #0ECFCF; font-size: 12px; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; font-weight: 700; text-decoration: none;">
                      🌐 Visit Portfolio
                    </a>
                  </td>
                  <td style="padding: 0 6px;">
                    <a href="https://github.com/youseefsherif3" target="_blank" style="display: inline-block; padding: 7px 14px; background-color: #15222E; border: 1px solid #233547; border-radius: 8px; color: #CBD5E1; font-size: 12px; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; text-decoration: none;">
                      GitHub
                    </a>
                  </td>
                  <td style="padding: 0 6px;">
                    <a href="https://www.linkedin.com/in/youseef-sherif" target="_blank" style="display: inline-block; padding: 7px 14px; background-color: #15222E; border: 1px solid #233547; border-radius: 8px; color: #CBD5E1; font-size: 12px; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; text-decoration: none;">
                      LinkedIn
                    </a>
                  </td>
                </tr>
              </table>

              <div style="margin-top: 14px; font-size: 11px; color: #475569; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif;">
                &copy; ${new Date().getFullYear()} Youseef Sherif &bull; Sent via Portfolio Contact System
              </div>
            </td>
          </tr>

        </table>
        
      </td>
    </tr>
  </table>

</body>
</html>
    `;

    const plainText = [
      `Hello ${msg.name},`,
      ``,
      replyText,
      ``,
      `-----------------------------------------`,
      `Original Inquiry (${sentDate}):`,
      `Topic: ${topicTitle}`,
      `"${msg.message}"`,
      `-----------------------------------------`,
      `Best regards,`,
      `Youseef Sherif - Backend Developer`,
      `Portfolio: ${siteUrl}`,
      `GitHub: https://github.com/youseefsherif3`,
      `LinkedIn: https://www.linkedin.com/in/youseef-sherif`,
    ].join('\n');

    await transport.sendMail({
      from: `"${fromName}" <${user}>`,
      to: msg.email,
      replyTo: user,
      subject: emailSubject,
      text: plainText,
      html: htmlContent,
    });

    // Update in database: mark as replied & read
    msg.replied = true;
    msg.read = true;
    await msg.save();

    return NextResponse.json({
      ok: true,
      message: msg,
      notice: `Reply sent successfully to ${msg.email}`,
    });
  } catch (err) {
    console.error('Failed to send reply email:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to send reply email' },
      { status: 500 }
    );
  }
}
