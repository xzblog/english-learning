import type { Word } from '@/types';

// 导入所有初中词汇部分
import { juniorVocabularyPartA } from '@/data/vocabulary/juniorPartA';
import { juniorVocabularyPartB } from '@/data/vocabulary/juniorPartB';
import { juniorVocabularyPartC } from '@/data/vocabulary/juniorPartC';
import { juniorVocabularyPartD } from '@/data/vocabulary/juniorPartD';
import { juniorVocabularyPartE } from '@/data/vocabulary/juniorPartE';
import { juniorVocabularyPartF } from '@/data/vocabulary/juniorPartF';
import { juniorVocabularyPartG } from '@/data/vocabulary/juniorPartG';
import { juniorVocabularyPartH } from '@/data/vocabulary/juniorPartH';
import { juniorVocabularyPartI } from '@/data/vocabulary/juniorPartI';
import { juniorVocabularyPartJ } from '@/data/vocabulary/juniorPartJ';
import { juniorVocabularyPartK } from '@/data/vocabulary/juniorPartK';
import { juniorVocabularyPartL } from '@/data/vocabulary/juniorPartL';
import { juniorVocabularyPartM } from '@/data/vocabulary/juniorPartM';
import { juniorVocabularyPartN } from '@/data/vocabulary/juniorPartN';
import { juniorVocabularyPartO } from '@/data/vocabulary/juniorPartO';
import { juniorVocabularyPartP } from '@/data/vocabulary/juniorPartP';
import { juniorVocabularyPartQ } from '@/data/vocabulary/juniorPartQ';
import { juniorVocabularyPartR } from '@/data/vocabulary/juniorPartR';
import { juniorVocabularyPartS } from '@/data/vocabulary/juniorPartS';
import { juniorVocabularyPartT } from '@/data/vocabulary/juniorPartT';
import { juniorVocabularyPartU } from '@/data/vocabulary/juniorPartU';
import { juniorVocabularyPartV } from '@/data/vocabulary/juniorPartV';
import { juniorVocabularyPartW } from '@/data/vocabulary/juniorPartW';
import { juniorVocabularyPartX } from '@/data/vocabulary/juniorPartX';
import { juniorVocabularyPartY } from '@/data/vocabulary/juniorPartY';
import { juniorVocabularyPartZ } from '@/data/vocabulary/juniorPartZ';

import { seniorVocabularyPartA } from '@/data/vocabulary/seniorPartA';
import { seniorVocabularyPartB } from '@/data/vocabulary/seniorPartB';
import { seniorVocabularyPartC } from '@/data/vocabulary/seniorPartC';
import { seniorVocabularyPartD } from '@/data/vocabulary/seniorPartD';

// 合并所有初中词汇
export const juniorVocabulary: Word[] = [
  ...juniorVocabularyPartA,
  ...juniorVocabularyPartB,
  ...juniorVocabularyPartC,
  ...juniorVocabularyPartD,
  ...juniorVocabularyPartE,
  ...juniorVocabularyPartF,
  ...juniorVocabularyPartG,
  ...juniorVocabularyPartH,
  ...juniorVocabularyPartI,
  ...juniorVocabularyPartJ,
  ...juniorVocabularyPartK,
  ...juniorVocabularyPartL,
  ...juniorVocabularyPartM,
  ...juniorVocabularyPartN,
  ...juniorVocabularyPartO,
  ...juniorVocabularyPartP,
  ...juniorVocabularyPartQ,
  ...juniorVocabularyPartR,
  ...juniorVocabularyPartS,
  ...juniorVocabularyPartT,
  ...juniorVocabularyPartU,
  ...juniorVocabularyPartV,
  ...juniorVocabularyPartW,
  ...juniorVocabularyPartX,
  ...juniorVocabularyPartY,
  ...juniorVocabularyPartZ,
];

// 高中核心词汇 (3500+词汇)
export const seniorVocabulary: Word[] = [
  ...seniorVocabularyPartA,
  ...seniorVocabularyPartB,
  ...seniorVocabularyPartC,
  ...seniorVocabularyPartD,
];

// 合并所有词汇
export const allVocabulary: Word[] = [...juniorVocabulary, ...seniorVocabulary];

// 按级别获取词汇
export function getVocabularyByLevel(level: 'junior' | 'senior' | 'cet4' | 'ielts' | 'all'): Word[] {
  if (level === 'junior') return juniorVocabulary;
  if (level === 'senior') return seniorVocabulary;
  if (level === 'cet4') return [];
  if (level === 'ielts') return [];
  return allVocabulary;
}

// 根据ID获取单词
export function getWordById(id: string): Word | undefined {
  return allVocabulary.find(word => word.id === id);
}

// 搜索单词
export function searchWords(query: string): Word[] {
  const lowerQuery = query.toLowerCase();
  return allVocabulary.filter(
    word =>
      word.word.toLowerCase().includes(lowerQuery) ||
      word.meanings.some(m => m.definition.includes(query))
  );
}

// 获取词汇统计
export function getVocabularyStats() {
  return {
    totalJunior: juniorVocabulary.length,
    totalSenior: seniorVocabulary.length,
    total: allVocabulary.length
  };
}
