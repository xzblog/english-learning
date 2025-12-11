import { NextResponse } from 'next/server';
import { getVocabularyByLevel } from '@/lib/vocabulary';
import type { Word } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level');
  const query = searchParams.get('query');
  const letter = (searchParams.get('letter') || '').toUpperCase();
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
