import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { AdminUser } from '@/lib/models/AdminUser';

export async function POST(request: Request) {
  const resetToken = process.env.ADMIN_RESET_TOKEN;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!resetToken || !adminEmail || !adminPassword) {
    return NextResponse.json({ error: 'Missing reset configuration' }, { status: 500 });
  }

  const authHeader = request.headers.get('authorization') || '';
  const provided = authHeader.replace('Bearer ', '').trim();

  if (!provided || provided !== resetToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    await AdminUser.deleteMany({});

    const created = await AdminUser.create({
      email: adminEmail.toLowerCase(),
      password: adminPassword,
    });

    return NextResponse.json({ ok: true, email: created.email });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to reset admin' }, { status: 500 });
  }
}
