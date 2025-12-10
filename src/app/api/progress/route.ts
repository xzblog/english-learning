import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import WordProgress from '@/models/WordProgress';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  // @ts-expect-error session.user.id
  const userId = session.user.id;

  const progress = await WordProgress.find({ userId });
  return NextResponse.json(progress);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { wordId, status, correct } = await request.json();

  await dbConnect();
  // @ts-expect-error session.user.id
  const userId = session.user.id;

  let progress = await WordProgress.findOne({ userId, wordId });

  if (!progress) {
    progress = new WordProgress({
      userId,
      wordId,
      status: status || 'learning',
    });
  } else {
    if (status) progress.status = status;
    if (correct === true) {
      progress.correctCount += 1;
    } else if (correct === false) {
      progress.wrongCount += 1;
    }
    progress.lastReviewedAt = new Date();
  }

  await progress.save();
  return NextResponse.json(progress);
}
