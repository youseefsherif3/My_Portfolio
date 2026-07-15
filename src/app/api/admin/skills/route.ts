import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Skill, type SkillDocument } from '@/lib/models/Skill';

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
    const skills = await Skill.find()
      .sort({ category: 1, order: 1, createdAt: -1 })
      .lean<SkillDocument[]>();

    const payload = skills.map((skill) => ({
      id: skill._id.toString(),
      name: skill.name,
      level: skill.level,
      category: skill.category,
      icon: skill.icon || 'CpuChipIcon',
      order: skill.order ?? 0,
    }));

    return NextResponse.json({ skills: payload });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to load skills' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const category = String(body.category || '').trim();

    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 });
    }

    await connectToDatabase();

    const created = await Skill.create({
      name,
      category,
      level: Math.max(0, Math.min(100, Number(body.level || 0))),
      icon: String(body.icon || 'CpuChipIcon').trim(),
      order: Number(body.order || 0),
    });

    return NextResponse.json({
      skill: {
        id: created._id.toString(),
        name: created.name,
        level: created.level,
        category: created.category,
        icon: created.icon || 'CpuChipIcon',
        order: created.order ?? 0,
      },
    });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}
