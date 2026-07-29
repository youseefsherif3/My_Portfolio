import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Experience, type ExperienceDocument } from '@/lib/models/Experience';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
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
