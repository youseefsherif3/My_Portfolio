import { type NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

import { connectToDatabase } from '@/lib/mongodb';
import { AdminUser } from '@/lib/models/AdminUser';

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

function getEnv(name: string) {
  return process.env[name];
}

async function sendLoginNotification(
  targetEmail: string,
  meta?: { ip?: string; userAgent?: string }
) {
  const host = getEnv('SMTP_HOST');
  const portValue = getEnv('SMTP_PORT');
  const user = getEnv('SMTP_USER');
  const pass = getEnv('SMTP_PASS');
  const fromName = getEnv('SMTP_FROM_NAME') || 'Youseef Sherif';
  const to = getEnv('SMTP_TO') || targetEmail;
  const siteUrl = getEnv('NEXT_PUBLIC_SITE_URL') || 'https://www.youseefsherifdeveloper.dev';

  if (!host || !portValue || !user || !pass) {
    console.info('SMTP ENV MISSING');
    return;
  }

  const port = Number(portValue);

  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const emailSubject = '🛡️ Security Alert: Admin Login Detected — Youseef Sherif';

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${emailSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080C10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #080C10; width: 100%; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #0F1923; border: 1px solid #1E2D3D; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);">
          
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
                          <div style="font-size: 16px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.3px;">
                            Youseef Sherif Portfolio
                          </div>
                          <div style="font-size: 11px; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; color: #64748B; text-transform: uppercase; letter-spacing: 0.8px; margin-top: 2px;">
                            Security &amp; Access Control System
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display: inline-block; padding: 4px 12px; background-color: rgba(14, 207, 207, 0.1); border: 1px solid rgba(14, 207, 207, 0.3); border-radius: 20px; color: #0ECFCF; font-size: 11px; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; font-weight: 700;">
                      🔒 AUTHENTICATED
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Body Content -->
          <tr>
            <td style="padding: 32px 32px 28px 32px;">
              
              <div style="margin-bottom: 24px;">
                <h2 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #FFFFFF;">
                  Admin Dashboard Login Alert
                </h2>
                <p style="margin: 0; font-size: 14px; color: #94A3B8; line-height: 1.6;">
                  A successful login to your Portfolio Admin Panel was detected with your authorized credentials.
                </p>
              </div>

              <!-- Session Details Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #080C10; border: 1px solid #1E2D3D; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #1A2634;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="font-size: 12px; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; color: #64748B; width: 120px;">
                          ACCOUNT
                        </td>
                        <td style="font-size: 13px; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; color: #0ECFCF; font-weight: 700;">
                          ${targetEmail}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #1A2634;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="font-size: 12px; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; color: #64748B; width: 120px;">
                          TIMESTAMP
                        </td>
                        <td style="font-size: 13px; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; color: #FFFFFF;">
                          ${formattedDate} &bull; ${formattedTime}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: ${meta?.ip || meta?.userAgent ? '1px solid #1A2634' : 'none'};">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="font-size: 12px; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; color: #64748B; width: 120px;">
                          LOCATION
                        </td>
                        <td style="font-size: 13px; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; color: #94A3B8;">
                          Portfolio Admin Portal (${siteUrl})
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ${meta?.ip ? `
                <tr>
                  <td style="padding: 16px 20px; border-bottom: ${meta?.userAgent ? '1px solid #1A2634' : 'none'};">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="font-size: 12px; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; color: #64748B; width: 120px;">
                          IP ADDRESS
                        </td>
                        <td style="font-size: 13px; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; color: #FFFFFF;">
                          ${meta.ip}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>` : ''}
              </table>

              <!-- Notice Box -->
              <div style="padding: 16px 18px; background-color: #111A24; border: 1px solid #1E2D3D; border-left: 3px solid #0ECFCF; border-radius: 8px; font-size: 12px; color: #94A3B8; line-height: 1.6;">
                If this was you, no action is needed. If you did not log in, please reset your password immediately from the dashboard settings.
              </div>

              <!-- Button CTA -->
              <div style="margin-top: 28px; text-align: center;">
                <a href="${siteUrl}/admin" target="_blank" style="display: inline-block; padding: 12px 28px; background-color: #0ECFCF; color: #080C10; font-size: 13px; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif; font-weight: 700; border-radius: 10px; text-decoration: none; box-shadow: 0 0 20px rgba(14, 207, 207, 0.3);">
                  Open Admin Dashboard &rarr;
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #080C10; border-top: 1px solid #1E2D3D; text-align: center;">
              <div style="font-size: 11px; color: #475569; font-family: 'JetBrains Mono', monospace, Consolas, sans-serif;">
                &copy; ${new Date().getFullYear()} Youseef Sherif Portfolio &bull; Automated Security Notification
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

  const text = [
    '🛡️ SECURITY ALERT: Admin Login Detected',
    '-----------------------------------------',
    `Account: ${targetEmail}`,
    `Time: ${formattedDate} at ${formattedTime}`,
    `Portal: ${siteUrl}/admin`,
    meta?.ip ? `IP: ${meta.ip}` : null,
    meta?.userAgent ? `User Agent: ${meta.userAgent}` : null,
    '-----------------------------------------',
    'If you did not perform this login, please secure your account immediately.',
  ]
    .filter(Boolean)
    .join('\n');

  await transport.sendMail({
    from: `"${fromName}" <${user}>`,
    to,
    subject: emailSubject,
    text,
    html: htmlContent,
  });
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/admin/login',
  },

  session: {
    strategy: 'jwt',
  },

  providers: [
    Credentials({
      name: 'Admin',

      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },

        password: {
          label: 'Password',
          type: 'password',
        },
      },

      async authorize(credentials) {
        try {
          console.info('========== LOGIN START ==========');

          await connectToDatabase();

          console.info('DATABASE CONNECTED');

          const email = String(credentials?.email || '')
            .trim()
            .toLowerCase();

          const password = String(credentials?.password || '').trim();

          console.info('ENTERED EMAIL:', email);

          console.info('ENTERED PASSWORD:', password);

          console.info('ENV EMAIL:', adminEmail);

          console.info('ENV PASSWORD:', adminPassword);

          let existingAdmin = await AdminUser.findOne({
            email,
          });

          console.info('FOUND ADMIN:', existingAdmin);

          /**
           * CREATE ADMIN IF NOT EXISTS
           */
          if (!existingAdmin) {
            console.info('NO ADMIN FOUND -> CREATING...');

            if (!adminEmail || !adminPassword) {
              console.info('ADMIN ENV VARIABLES MISSING');

              return null;
            }

            if (email !== adminEmail.toLowerCase()) {
              console.info('EMAIL DOES NOT MATCH ENV EMAIL');

              return null;
            }

            if (password !== adminPassword) {
              console.info('PASSWORD DOES NOT MATCH ENV PASSWORD');

              return null;
            }

            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            console.info('HASHED PASSWORD:', hashedPassword);

            existingAdmin = await AdminUser.create({
              email: adminEmail.toLowerCase(),
              password: hashedPassword,
            });

            console.info('ADMIN CREATED SUCCESSFULLY');
          }

          console.info('DB PASSWORD:', existingAdmin.password);

          const isPasswordCorrect = await bcrypt.compare(password, existingAdmin.password);

          console.info('PASSWORD MATCH:', isPasswordCorrect);

          if (!isPasswordCorrect) {
            console.info('INVALID PASSWORD');

            return null;
          }

          const ip = undefined;
          const userAgent = undefined;

          try {
            await sendLoginNotification(existingAdmin.email, {
              ip,
              userAgent,
            });

            console.info('LOGIN EMAIL SENT');
          } catch (err) {
            console.error('EMAIL ERROR:', err);
          }

          console.info('========== LOGIN SUCCESS ==========');

          return {
            id: existingAdmin._id.toString(),
            name: 'Admin',
            email: existingAdmin.email,
            admin: true,
          };
        } catch (err) {
          console.error('========== AUTH ERROR ==========', err);

          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }

      if ((user as { admin?: boolean } | undefined)?.admin) {
        token.admin = true;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token?.email) {
        session.user.email = String(token.email);
      }

      if (session.user) {
        (
          session.user as {
            admin?: boolean;
          }
        ).admin = Boolean(token?.admin);
      }

      return session;
    },
  },
};
