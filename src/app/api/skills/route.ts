import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Skill, type SkillDocument } from '@/lib/models/Skill';

export async function GET() {
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
    return NextResponse.json({ skills: [] }, { status: 500 });
  }
}
