import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { SiteSettings, type SiteSettingsDocument } from '@/lib/models/SiteSettings';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    let cvUrl = '/cv.pdf';
    try {
      await connectToDatabase();
      const settings = await SiteSettings.findOne({ key: 'main' }).lean<SiteSettingsDocument>();
      if (settings?.cvUrl) {
        cvUrl = settings.cvUrl;
      }
    } catch (_dbErr) {
      console.error('DB error fetching CV setting:', _dbErr);
    }

    // If external URL (e.g. Cloudinary or Google Drive), redirect directly
    if (cvUrl.startsWith('http://') || cvUrl.startsWith('https://')) {
      return NextResponse.redirect(cvUrl);
    }

    // Serve local file from public directory with proper headers
    const relativePath = cvUrl.startsWith('/') ? cvUrl.slice(1) : cvUrl;
    const filePath = path.join(process.cwd(), 'public', relativePath || 'cv.pdf');

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'CV file not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="Youseef_Sherif_CV.pdf"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    console.error('Error serving CV:', err);
    return NextResponse.json({ error: 'Failed to serve CV' }, { status: 500 });
  }
}
