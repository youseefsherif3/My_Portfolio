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

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const projects = await Project.find()
      .sort({ order: 1, createdAt: -1 })
      .lean<ProjectDocument[]>();

    const payload = projects.map((project) => ({
      id: project._id.toString(),
      title: project.title,
      description: project.description,
      tags: project.tags || [],
      image: project.image || '',
      imageAlt: project.imageAlt || project.title,
      github: project.github || '',
      live: project.live || '',
      featured: Boolean(project.featured),
      highlight: project.highlight || '',
      order: project.order ?? 0,
    }));

    return NextResponse.json({ projects: payload });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to load projects' }, { status: 500 });
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
    const description = String(body.description || '').trim();

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    await connectToDatabase();

    const created = await Project.create({
      title,
      description,
      tags: normalizeTags(body.tags),
      image: String(body.image || '').trim(),
      imageAlt: String(body.imageAlt || '').trim(),
      github: String(body.github || '').trim(),
      live: String(body.live || '').trim(),
      featured: Boolean(body.featured),
      highlight: String(body.highlight || '').trim(),
      order: Number(body.order || 0),
    });

    return NextResponse.json({
      project: {
        id: created._id.toString(),
        title: created.title,
        description: created.description,
        tags: created.tags || [],
        image: created.image || '',
        imageAlt: created.imageAlt || created.title,
        github: created.github || '',
        live: created.live || '',
        featured: Boolean(created.featured),
        highlight: created.highlight || '',
        order: created.order ?? 0,
      },
    });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
