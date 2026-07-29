import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Experience } from '@/lib/models/Experience';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const isAdmin = Boolean((session?.user as { admin?: boolean } | undefined)?.admin);
  if (!isAdmin) {
    return null;
  }
  return session;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const title = String(body.title || '').trim();
    const company = String(body.company || '').trim();
    const companyUrl = String(body.companyUrl || '').trim();
    const location = String(body.location || '').trim();
    const period = String(body.period || '').trim();
    const description = String(body.description || '').trim();
    const technologies = Array.isArray(body.technologies)
      ? body.technologies.map(String).map((s: string) => s.trim()).filter(Boolean)
      : [];
    const order = Number(body.order ?? 0);

    if (!title || !company || !period) {
      return NextResponse.json({ error: 'Title, company, and period are required' }, { status: 400 });
    }

    await connectToDatabase();
    const updated = await Experience.findByIdAndUpdate(
      id,
      {
        title,
        company,
        companyUrl,
        location,
        period,
        description,
        technologies,
        order,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    return NextResponse.json({
      experience: {
        id: String(updated._id),
        title: updated.title,
        company: updated.company,
        companyUrl: updated.companyUrl,
        location: updated.location,
        period: updated.period,
        description: updated.description,
        technologies: updated.technologies,
        order: updated.order,
      },
    });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
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
    const deleted = await Experience.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
