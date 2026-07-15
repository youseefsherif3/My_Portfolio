import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Analytics, type AnalyticsDocument } from '@/lib/models/Analytics';

export async function POST() {
  try {
    await connectToDatabase();

    const updated = await Analytics.findOneAndUpdate(
      { key: 'site_visits' },
      { $inc: { total: 1 } },
      { new: true, upsert: true }
    ).lean<AnalyticsDocument>();

    return NextResponse.json({ total: updated?.total ?? 0 });
  } catch (_err) {
    return NextResponse.json({ total: 0 }, { status: 500 });
  }
}
