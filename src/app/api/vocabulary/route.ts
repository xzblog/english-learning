import { NextResponse } from 'next/server';
import { getVocabularyByLevel, searchWords } from '@/lib/vocabulary';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level');
  const query = searchParams.get('query');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  let words = [];

  if (query) {
    words = searchWords(query);
  } else {
    // @ts-expect-error level type check
    words = getVocabularyByLevel(level || 'all');
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
