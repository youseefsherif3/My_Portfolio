import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Project, type ProjectDocument } from '@/lib/models/Project';
import { defaultProjects } from '@/lib/defaultProjects';

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

    const titles = defaultProjects.map((project) => project.title);
    const existing = await Project.find({ title: { $in: titles } })
      .select('title')
      .lean<ProjectDocument[]>();
    const existingTitles = new Set(existing.map((item) => item.title));

    const toCreate = defaultProjects.filter((project) => !existingTitles.has(project.title));

    if (toCreate.length > 0) {
      await Project.insertMany(toCreate);
    }

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

    return NextResponse.json({ created: toCreate.length, projects: payload });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to seed projects' }, { status: 500 });
  }
}
