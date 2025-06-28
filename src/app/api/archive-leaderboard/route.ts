import { NextResponse } from 'next/server';
import { archiveWeeklyLeaderboard } from '@/actions/leaderboard/archive/action';

export async function POST(request: Request) {
  const body = await request.json();
  const { secret } = body;

  if (secret !== process.env.ARCHIVE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await archiveWeeklyLeaderboard();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to archive leaderboard' }, { status: 500 });
  }
}
