import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Project, type ProjectDocument } from '@/lib/models/Project';

function normalizeTags(input: unknown) {
  if (Array.isArray(input)) {
    return input.map((tag) => String(tag).trim()).filter(Boolean);
  }
  if (typeof input === 'string') {
    return input
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const isAdmin = Boolean((session?.user as { admin?: boolean } | undefined)?.admin);
  if (!isAdmin) {
    return null;
  }
  return session;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    await connectToDatabase();

    const updated = await Project.findByIdAndUpdate(
      params.id,
      {
        title: String(body.title || '').trim(),
        description: String(body.description || '').trim(),
        tags: normalizeTags(body.tags),
        image: String(body.image || '').trim(),
        imageAlt: String(body.imageAlt || '').trim(),
        github: String(body.github || '').trim(),
        live: String(body.live || '').trim(),
        featured: Boolean(body.featured),
        highlight: String(body.highlight || '').trim(),
        order: Number(body.order || 0),
      },
      { new: true }
    ).lean<ProjectDocument>();

    if (!updated) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({
      project: {
        id: updated._id.toString(),
        title: updated.title,
        description: updated.description,
        tags: updated.tags || [],
        image: updated.image || '',
        imageAlt: updated.imageAlt || updated.title,
        github: updated.github || '',
        live: updated.live || '',
        featured: Boolean(updated.featured),
        highlight: updated.highlight || '',
        order: updated.order ?? 0,
      },
    });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const deleted = await Project.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
