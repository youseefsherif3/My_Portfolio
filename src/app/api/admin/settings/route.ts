import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { AdminUser, type AdminUserDocument } from '@/lib/models/AdminUser';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const isAdmin = Boolean((session?.user as { admin?: boolean } | undefined)?.admin);
  if (!isAdmin) {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const admin = await AdminUser.findOne().lean<AdminUserDocument>();

    return NextResponse.json({
      email: admin?.email || '',
    });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const email = String(body.email || '')
      .trim()
      .toLowerCase();
    const currentPassword = String(body.currentPassword || '');
    const newPassword = String(body.newPassword || '');

    await connectToDatabase();
    const admin = await AdminUser.findOne();

    if (!admin) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    if (newPassword) {
      if (currentPassword !== admin.password) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }
      admin.password = newPassword;
    }

    if (email) {
      admin.email = email;
    }

    await admin.save();

    return NextResponse.json({ ok: true, email: admin.email });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
