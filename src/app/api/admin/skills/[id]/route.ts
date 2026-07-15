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

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    await connectToDatabase();

    const updated = await Skill.findByIdAndUpdate(
      params.id,
      {
        name: String(body.name || '').trim(),
        category: String(body.category || '').trim(),
        level: Math.max(0, Math.min(100, Number(body.level || 0))),
        icon: String(body.icon || 'CpuChipIcon').trim(),
        order: Number(body.order || 0),
      },
      { new: true }
    ).lean<SkillDocument>();

    if (!updated) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json({
      skill: {
        id: updated._id.toString(),
        name: updated.name,
        level: updated.level,
        category: updated.category,
        icon: updated.icon || 'CpuChipIcon',
        order: updated.order ?? 0,
      },
    });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const deleted = await Skill.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (_err) {
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
