import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Certification, type CertificationDocument } from '@/lib/models/Certification';
import { defaultCertifications } from '@/lib/defaultCertifications';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const isAdmin = Boolean((session?.user as { admin?: boolean } | undefined)?.admin);
  if (!isAdmin) {
    return null;
  }
  return session;
}

export async function POST() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const titles = defaultCertifications.map((cert) => cert.title);
    const existing = await Certification.find({ title: { $in: titles } })
      .select('title')
      .lean<CertificationDocument[]>();
    const existingTitles = new Set(existing.map((item) => item.title));

    const toCreate = defaultCertifications.filter((cert) => !existingTitles.has(cert.title));

    if (toCreate.length > 0) {
      await Certification.insertMany(toCreate);
    }

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

    return NextResponse.json({ created: toCreate.length, certifications: payload });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to seed certifications' }, { status: 500 });
  }
}
