import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request, { params }: { params: { name: string } }) {
  try {
    const name = params.name;
    const certDir = path.join(process.cwd(), 'certifications');
    const filePath = path.join(certDir, decodeURIComponent(name));

    if (!fs.existsSync(filePath)) return new NextResponse('Not found', { status: 404 });

    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType =
      ext === '.svg'
        ? 'image/svg+xml'
        : ext === '.png'
          ? 'image/png'
          : ext === '.jpg' || ext === '.jpeg'
            ? 'image/jpeg'
            : ext === '.webp'
              ? 'image/webp'
              : 'application/octet-stream';

    return new NextResponse(buffer, {
      status: 200,
      headers: { 'Content-Type': contentType },
    });
  } catch (_err) {
    return new NextResponse('Error', { status: 500 });
  }
}
