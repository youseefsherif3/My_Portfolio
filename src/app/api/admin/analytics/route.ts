import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Analytics, type AnalyticsDocument } from '@/lib/models/Analytics';

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
    const analytics = await Analytics.findOne({ key: 'site_visits' }).lean<AnalyticsDocument>();

    return NextResponse.json({ total: analytics?.total ?? 0 });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 });
  }
}
