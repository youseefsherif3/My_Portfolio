import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Certification, type CertificationDocument } from '@/lib/models/Certification';

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
    const certs = await Certification.find()
      .sort({ order: 1, createdAt: -1 })
      .lean<CertificationDocument[]>();

    const payload = certs.map((cert) => ({
      id: cert._id.toString(),
      title: cert.title,
      issuer: cert.issuer,
      year: cert.year,
      description: cert.description,
      imageUrl: cert.imageUrl || '',
      order: cert.order ?? 0,
    }));

    return NextResponse.json({ certifications: payload });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to load certifications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const title = String(body.title || '').trim();
    const issuer = String(body.issuer || '').trim();
    const year = String(body.year || '').trim();
    const description = String(body.description || '').trim();

    if (!title || !issuer || !year || !description) {
      return NextResponse.json(
        { error: 'Title, issuer, year, description required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const created = await Certification.create({
      title,
      issuer,
      year,
      description,
      imageUrl: String(body.imageUrl || '').trim(),
      order: Number(body.order || 0),
    });

    return NextResponse.json({
      certification: {
        id: created._id.toString(),
        title: created.title,
        issuer: created.issuer,
        year: created.year,
        description: created.description,
        imageUrl: created.imageUrl || '',
        order: created.order ?? 0,
      },
    });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to create certification' }, { status: 500 });
  }
}
