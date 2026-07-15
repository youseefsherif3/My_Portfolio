import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Certification, type CertificationDocument } from '@/lib/models/Certification';

export async function GET() {
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
    return NextResponse.json({ certifications: [] }, { status: 500 });
  }
}
