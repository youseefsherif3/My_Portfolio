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

const initialExperiences = [
  {
    title: 'Summer Internship ( Back-End Developer .NET )',
    company: 'PROART | Microsoft Solutions Partner',
    companyUrl: 'https://proart-eg.com',
    location: 'Maadi, Egypt',
    period: 'July 2026 - Present',
    description:
      'Participating in a Back-End Development internship focused on the Microsoft technology stack, learning ASP.NET Core, C#, SQL Server, RESTful APIs, and modern backend development practices through hands-on projects.',
    technologies: ['ASP.NET Core', 'C#', 'SQL Server', 'RESTful APIs', '.NET'],
    order: 1,
  },
];

export async function POST() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    await Experience.deleteMany({});
    const created = await Experience.insertMany(initialExperiences);

    return NextResponse.json({
      ok: true,
      count: created.length,
    });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to seed experiences' }, { status: 500 });
  }
}
