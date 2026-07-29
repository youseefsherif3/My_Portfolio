import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { SiteSettings, type SiteSettingsDocument } from '@/lib/models/SiteSettings';

export async function GET() {
  try {
    await connectToDatabase();
    const settings = await SiteSettings.findOne({ key: 'main' }).lean<SiteSettingsDocument>();

    return NextResponse.json({
      cvUrl: settings?.cvUrl || '/cv.pdf',
    });
  } catch (_err) {
    return NextResponse.json({ cvUrl: '/cv.pdf' });
  }
}
