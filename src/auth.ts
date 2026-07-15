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
  const fromName = getEnv('SMTP_FROM_NAME');
  const to = getEnv('SMTP_TO') || targetEmail;

  if (!host || !portValue || !user || !pass || !fromName) {
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
  });

  const timestamp = new Date().toISOString();

  const text = [
    'A new admin login was detected.',
    '',
    `Time: ${timestamp}`,
    `Email: ${targetEmail}`,
    meta?.ip ? `IP: ${meta.ip}` : null,
    meta?.userAgent ? `User Agent: ${meta.userAgent}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  await transport.sendMail({
    from: `${fromName} <${user}>`,
    to,
    subject: 'Admin login alert',
    text,
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
