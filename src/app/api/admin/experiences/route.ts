import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Experience, type ExperienceDocument } from '@/lib/models/Experience';

export const dynamic = 'force-dynamic';

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
    const experiences = await Experience.find()
      .sort({ order: 1, createdAt: -1 })
      .lean<ExperienceDocument[]>();

    return NextResponse.json({
      experiences: experiences.map((exp: ExperienceDocument & { _id?: unknown }) => ({
        id: String(exp._id),
        title: exp.title,
        company: exp.company,
        companyUrl: exp.companyUrl || '',
        location: exp.location || '',
        period: exp.period,
        description: exp.description || '',
        technologies: exp.technologies || [],
        order: exp.order ?? 0,
      })),
    });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
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
    const newExperience = await Experience.create({
      title,
      company,
      companyUrl,
      location,
      period,
      description,
      technologies,
      order,
    });

    return NextResponse.json({
      experience: {
        id: String(newExperience._id),
        title: newExperience.title,
        company: newExperience.company,
        companyUrl: newExperience.companyUrl,
        location: newExperience.location,
        period: newExperience.period,
        description: newExperience.description,
        technologies: newExperience.technologies,
        order: newExperience.order,
      },
    });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}
