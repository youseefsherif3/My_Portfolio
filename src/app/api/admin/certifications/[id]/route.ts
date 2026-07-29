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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    await connectToDatabase();

    const updated = await Certification.findByIdAndUpdate(
      id,
      {
        title: String(body.title || '').trim(),
        issuer: String(body.issuer || '').trim(),
        year: String(body.year || '').trim(),
        description: String(body.description || '').trim(),
        imageUrl: String(body.imageUrl || '').trim(),
        order: Number(body.order || 0),
      },
      { new: true }
    ).lean<CertificationDocument>();

    if (!updated) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }

    return NextResponse.json({
      certification: {
        id: updated._id.toString(),
        title: updated.title,
        issuer: updated.issuer,
        year: updated.year,
        description: updated.description,
        imageUrl: updated.imageUrl || '',
        order: updated.order ?? 0,
      },
    });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to update certification' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectToDatabase();
    const deleted = await Certification.findByIdAndDelete(id).lean<CertificationDocument>();

    if (!deleted) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, id });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to delete certification' }, { status: 500 });
  }
}
