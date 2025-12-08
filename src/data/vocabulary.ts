import type { Word } from '../types';

// 导入所有初中词汇部分
import { juniorVocabularyPartA } from './vocabulary/juniorPartA';
import { juniorVocabularyPartB } from './vocabulary/juniorPartB';
import { juniorVocabularyPartC } from './vocabulary/juniorPartC';
import { juniorVocabularyPartD } from './vocabulary/juniorPartD';
import { juniorVocabularyPartE } from './vocabulary/juniorPartE';
import { juniorVocabularyPartF } from './vocabulary/juniorPartF';
import { juniorVocabularyPartG } from './vocabulary/juniorPartG';
import { juniorVocabularyPartH } from './vocabulary/juniorPartH';
import { juniorVocabularyPartI } from './vocabulary/juniorPartI';
import { juniorVocabularyPartJ } from './vocabulary/juniorPartJ';
import { juniorVocabularyPartK } from './vocabulary/juniorPartK';
import { juniorVocabularyPartL } from './vocabulary/juniorPartL';
import { juniorVocabularyPartM } from './vocabulary/juniorPartM';
import { juniorVocabularyPartN } from './vocabulary/juniorPartN';
import { juniorVocabularyPartO } from './vocabulary/juniorPartO';
import { juniorVocabularyPartP } from './vocabulary/juniorPartP';
import { juniorVocabularyPartQ } from './vocabulary/juniorPartQ';
import { juniorVocabularyPartR } from './vocabulary/juniorPartR';
import { juniorVocabularyPartS } from './vocabulary/juniorPartS';
import { juniorVocabularyPartT } from './vocabulary/juniorPartT';
import { juniorVocabularyPartU } from './vocabulary/juniorPartU';
import { juniorVocabularyPartV } from './vocabulary/juniorPartV';
import { juniorVocabularyPartW } from './vocabulary/juniorPartW';
import { juniorVocabularyPartX } from './vocabulary/juniorPartX';
import { juniorVocabularyPartY } from './vocabulary/juniorPartY';
import { juniorVocabularyPartZ } from './vocabulary/juniorPartZ';

import { seniorVocabularyPartA } from './vocabulary/seniorPartA';
import { seniorVocabularyPartB } from './vocabulary/seniorPartB';
import { seniorVocabularyPartC } from './vocabulary/seniorPartC';
import { seniorVocabularyPartD } from './vocabulary/seniorPartD';

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
export function getVocabularyByLevel(level: 'junior' | 'senior' | 'all'): Word[] {
  if (level === 'junior') return juniorVocabulary;
  if (level === 'senior') return seniorVocabulary;
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
