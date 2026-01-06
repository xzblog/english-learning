import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import WordProgress from '@/models/WordProgress';
import { getVocabularyByLevel } from '@/lib/vocabulary';
import type { Word } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level');
  const query = searchParams.get('query');
  const letter = (searchParams.get('letter') || '').toUpperCase();
  const status = searchParams.get('status') || 'all';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '200');

  let words: Word[] = [];
  
  // Base set by level
  // @ts-expect-error level type check
  words = getVocabularyByLevel(level || 'all');

  // Apply query filter if provided
  if (query) {
    const lowerQuery = query.toLowerCase();
    words = words.filter(
      (word) =>
        word.word.toLowerCase().includes(lowerQuery) ||
        (word.meanings || []).some((m) => (m.definition || '').includes(query))
    );
  }

  // Apply letter filter if provided
  if (letter && letter.length === 1 && /[A-Z]/.test(letter)) {
    words = words.filter((w) => (w.word || '').toUpperCase().startsWith(letter));
  }

  // Apply status filter if provided
  if (status && status !== 'all') {
    const session = await getServerSession(authOptions);
    if (session && session.user) {
      await dbConnect();
      // @ts-expect-error session.user.id
      const userId = session.user.id;
      const progressList = await WordProgress.find({ userId });
      const progressMap = new Map(progressList.map(p => [p.wordId, p.status]));

      words = words.filter((word) => {
        const wordStatus = progressMap.get(word.id) || 'new';
        if (status === 'new') return wordStatus === 'new';
        if (status === 'learning') return wordStatus === 'learning' || wordStatus === 'reviewing';
        if (status === 'mastered') return wordStatus === 'mastered';
        return true;
      });
    } else {
       // If not logged in, all words are 'new'.
       if (status === 'new') {
         // keep all
       } else {
         // learning/mastered = empty
         words = [];
       }
    }
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedWords = words.slice(startIndex, endIndex);

  return NextResponse.json({
    words: paginatedWords,
    total: words.length,
    page,
    totalPages: Math.ceil(words.length / limit),
  });
}
