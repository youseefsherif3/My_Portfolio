import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Skill, type SkillDocument } from '@/lib/models/Skill';
import { defaultSkills } from '@/lib/defaultSkills';

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

    const names = defaultSkills.map((skill) => skill.name);
    const existing = await Skill.find({ name: { $in: names } })
      .select('name')
      .lean<SkillDocument[]>();
    const existingNames = new Set(existing.map((item) => item.name));

    const toCreate = defaultSkills.filter((skill) => !existingNames.has(skill.name));

    if (toCreate.length > 0) {
      await Skill.insertMany(toCreate);
    }

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

    return NextResponse.json({ created: toCreate.length, skills: payload });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to seed skills' }, { status: 500 });
  }
}
