import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const certDir = path.join(process.cwd(), 'certifications');
    if (!fs.existsSync(certDir)) {
      return NextResponse.json({ files: [] });
    }

    const files = fs.readdirSync(certDir).filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif'].includes(ext);
    });

    const list = files.map((name) => ({
      name,
      url: `/api/certifications/${encodeURIComponent(name)}`,
    }));

    return NextResponse.json({ files: list });
  } catch (_err) {
    return NextResponse.json({ files: [] }, { status: 500 });
  }
}
