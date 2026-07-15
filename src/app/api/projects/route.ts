import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Project, type ProjectDocument } from '@/lib/models/Project';

export async function GET() {
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
    return NextResponse.json({ projects: [] }, { status: 500 });
  }
}
