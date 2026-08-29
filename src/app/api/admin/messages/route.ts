import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ContactMessage } from '@/lib/models/ContactMessage';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
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
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    const unreadCount = await ContactMessage.countDocuments({ read: false });

    return NextResponse.json({
      messages,
      unreadCount,
      total: messages.length,
    });
  } catch (err) {
    console.error('Failed to fetch messages:', err);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, read, replied } = body;

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    const updateData: Record<string, boolean> = {};
    if (typeof read === 'boolean') updateData.read = read;
    if (typeof replied === 'boolean') updateData.replied = replied;

    const updated = await ContactMessage.findByIdAndUpdate(id, updateData, { new: true }).lean();

    return NextResponse.json({ message: updated });
  } catch (err) {
    console.error('Failed to update message status:', err);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    await ContactMessage.findByIdAndDelete(id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Failed to delete message:', err);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
