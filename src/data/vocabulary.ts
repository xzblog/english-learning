import type { Word } from '../types';

// 导入所有词汇部分
import { juniorVocabularyPartA } from './vocabulary/juniorPartA';
import { juniorVocabularyPartB } from './vocabulary/juniorPartB';
import { juniorVocabularyPartC } from './vocabulary/juniorPartC';
import { juniorVocabularyPartD } from './vocabulary/juniorPartD';

// 合并所有初中词汇
export const juniorVocabulary: Word[] = [
  ...juniorVocabularyPartA,
  ...juniorVocabularyPartB,
  ...juniorVocabularyPartC,
  ...juniorVocabularyPartD,
];

// 高中词汇示例 (可以类似地扩展)
export const seniorVocabulary: Word[] = [
  { id: 's001', word: 'abandon', phonetic: '/əˈbændən/', meanings: [{ pos: 'v', definition: '放弃；抛弃' }], examples: [{ en: 'They had to abandon their home.', cn: '他们不得不离开家。' }], level: 'senior' },
  { id: 's002', word: 'abstract', phonetic: '/ˈæbstrækt/', meanings: [{ pos: 'adj', definition: '抽象的' }], examples: [{ en: 'Abstract art is interesting.', cn: '抽象艺术很有趣。' }], level: 'senior' },
  { id: 's003', word: 'abundant', phonetic: '/əˈbʌndənt/', meanings: [{ pos: 'adj', definition: '丰富的' }], examples: [{ en: 'China has abundant resources.', cn: '中国有丰富的资源。' }], level: 'senior' },
  { id: 's004', word: 'academic', phonetic: '/ˌækəˈdemɪk/', meanings: [{ pos: 'adj', definition: '学术的' }], examples: [{ en: 'Academic achievement is important.', cn: '学业成就很重要。' }], level: 'senior' },
  { id: 's005', word: 'accelerate', phonetic: '/əkˈseləreɪt/', meanings: [{ pos: 'v', definition: '加速' }], examples: [{ en: 'The car accelerated quickly.', cn: '汽车迅速加速。' }], level: 'senior' },
  { id: 's006', word: 'acceptable', phonetic: '/əkˈseptəbl/', meanings: [{ pos: 'adj', definition: '可接受的' }], examples: [{ en: 'This is acceptable.', cn: '这是可以接受的。' }], level: 'senior' },
  { id: 's007', word: 'access', phonetic: '/ˈækses/', meanings: [{ pos: 'n', definition: '进入；获取' }, { pos: 'v', definition: '访问' }], examples: [{ en: 'Access to education is a right.', cn: '接受教育是一项权利。' }], level: 'senior' },
  { id: 's008', word: 'accommodation', phonetic: '/əˌkɒməˈdeɪʃn/', meanings: [{ pos: 'n', definition: '住宿' }], examples: [{ en: 'We need to find accommodation.', cn: '我们需要找住处。' }], level: 'senior' },
  { id: 's009', word: 'accompany', phonetic: '/əˈkʌmpəni/', meanings: [{ pos: 'v', definition: '陪伴' }], examples: [{ en: 'I will accompany you.', cn: '我会陪你。' }], level: 'senior' },
  { id: 's010', word: 'accomplish', phonetic: '/əˈkɒmplɪʃ/', meanings: [{ pos: 'v', definition: '完成；实现' }], examples: [{ en: 'We accomplished our goal.', cn: '我们完成了目标。' }], level: 'senior' },
  { id: 's011', word: 'account', phonetic: '/əˈkaʊnt/', meanings: [{ pos: 'n', definition: '账户；描述' }], examples: [{ en: 'I have a bank account.', cn: '我有一个银行账户。' }], level: 'senior' },
  { id: 's012', word: 'accurate', phonetic: '/ˈækjərət/', meanings: [{ pos: 'adj', definition: '准确的' }], examples: [{ en: 'The data is accurate.', cn: '数据是准确的。' }], level: 'senior' },
  { id: 's013', word: 'accuse', phonetic: '/əˈkjuːz/', meanings: [{ pos: 'v', definition: '指控；谴责' }], examples: [{ en: 'He was accused of lying.', cn: '他被指控说谎。' }], level: 'senior' },
  { id: 's014', word: 'acknowledge', phonetic: '/əkˈnɒlɪdʒ/', meanings: [{ pos: 'v', definition: '承认；感谢' }], examples: [{ en: 'I acknowledge my mistake.', cn: '我承认我的错误。' }], level: 'senior' },
  { id: 's015', word: 'acquire', phonetic: '/əˈkwaɪər/', meanings: [{ pos: 'v', definition: '获得；学到' }], examples: [{ en: 'Acquire new skills.', cn: '获得新技能。' }], level: 'senior' },
  { id: 's016', word: 'adapt', phonetic: '/əˈdæpt/', meanings: [{ pos: 'v', definition: '适应' }], examples: [{ en: 'We must adapt to changes.', cn: '我们必须适应变化。' }], level: 'senior' },
  { id: 's017', word: 'addicted', phonetic: '/əˈdɪktɪd/', meanings: [{ pos: 'adj', definition: '上瘾的' }], examples: [{ en: 'He is addicted to games.', cn: '他沉迷于游戏。' }], level: 'senior' },
  { id: 's018', word: 'adequate', phonetic: '/ˈædɪkwət/', meanings: [{ pos: 'adj', definition: '足够的' }], examples: [{ en: 'We have adequate supplies.', cn: '我们有充足的供应。' }], level: 'senior' },
  { id: 's019', word: 'adjust', phonetic: '/əˈdʒʌst/', meanings: [{ pos: 'v', definition: '调整' }], examples: [{ en: 'Adjust the volume.', cn: '调整音量。' }], level: 'senior' },
  { id: 's020', word: 'administration', phonetic: '/ədˌmɪnɪˈstreɪʃn/', meanings: [{ pos: 'n', definition: '管理；行政' }], examples: [{ en: 'The school administration...', cn: '学校管理层...' }], level: 'senior' },
  { id: 's021', word: 'admire', phonetic: '/ədˈmaɪər/', meanings: [{ pos: 'v', definition: '钦佩；欣赏' }], examples: [{ en: 'I admire your courage.', cn: '我钦佩你的勇气。' }], level: 'senior' },
  { id: 's022', word: 'admission', phonetic: '/ədˈmɪʃn/', meanings: [{ pos: 'n', definition: '入场；承认' }], examples: [{ en: 'Free admission.', cn: '免费入场。' }], level: 'senior' },
  { id: 's023', word: 'admit', phonetic: '/ədˈmɪt/', meanings: [{ pos: 'v', definition: '承认；准许进入' }], examples: [{ en: 'I admit I was wrong.', cn: '我承认我错了。' }], level: 'senior' },
  { id: 's024', word: 'adolescent', phonetic: '/ˌædəˈlesnt/', meanings: [{ pos: 'n', definition: '青少年' }], examples: [{ en: 'Adolescents face challenges.', cn: '青少年面临挑战。' }], level: 'senior' },
  { id: 's025', word: 'adopt', phonetic: '/əˈdɒpt/', meanings: [{ pos: 'v', definition: '采纳；收养' }], examples: [{ en: 'Adopt new methods.', cn: '采用新方法。' }], level: 'senior' },
  { id: 's026', word: 'advanced', phonetic: '/ədˈvɑːnst/', meanings: [{ pos: 'adj', definition: '先进的；高级的' }], examples: [{ en: 'Advanced technology.', cn: '先进技术。' }], level: 'senior' },
  { id: 's027', word: 'advocate', phonetic: '/ˈædvəkeɪt/', meanings: [{ pos: 'v', definition: '提倡' }], examples: [{ en: 'Advocate for change.', cn: '倡导变革。' }], level: 'senior' },
  { id: 's028', word: 'affair', phonetic: '/əˈfeər/', meanings: [{ pos: 'n', definition: '事务' }], examples: [{ en: 'Current affairs.', cn: '时事。' }], level: 'senior' },
  { id: 's029', word: 'affect', phonetic: '/əˈfekt/', meanings: [{ pos: 'v', definition: '影响' }], examples: [{ en: 'This will affect you.', cn: '这会影响你。' }], level: 'senior' },
  { id: 's030', word: 'affection', phonetic: '/əˈfekʃn/', meanings: [{ pos: 'n', definition: '喜爱' }], examples: [{ en: 'Show affection.', cn: '表达爱意。' }], level: 'senior' },
  { id: 's031', word: 'aggressive', phonetic: '/əˈɡresɪv/', meanings: [{ pos: 'adj', definition: '有进取心的；好斗的' }], examples: [{ en: 'An aggressive approach.', cn: '积极的方法。' }], level: 'senior' },
  { id: 's032', word: 'agriculture', phonetic: '/ˈæɡrɪkʌltʃər/', meanings: [{ pos: 'n', definition: '农业' }], examples: [{ en: 'Agriculture is important.', cn: '农业很重要。' }], level: 'senior' },
  { id: 's033', word: 'alarm', phonetic: '/əˈlɑːm/', meanings: [{ pos: 'n', definition: '警报' }], examples: [{ en: 'Set the alarm.', cn: '设置闹钟。' }], level: 'senior' },
  { id: 's034', word: 'album', phonetic: '/ˈælbəm/', meanings: [{ pos: 'n', definition: '相册；专辑' }], examples: [{ en: 'A photo album.', cn: '一本相册。' }], level: 'senior' },
  { id: 's035', word: 'alcohol', phonetic: '/ˈælkəhɒl/', meanings: [{ pos: 'n', definition: '酒精' }], examples: [{ en: 'Avoid alcohol.', cn: '避免饮酒。' }], level: 'senior' },
  { id: 's036', word: 'algorithm', phonetic: '/ˈælɡərɪðəm/', meanings: [{ pos: 'n', definition: '算法' }], examples: [{ en: 'A search algorithm.', cn: '搜索算法。' }], level: 'senior' },
  { id: 's037', word: 'allocate', phonetic: '/ˈæləkeɪt/', meanings: [{ pos: 'v', definition: '分配' }], examples: [{ en: 'Allocate resources.', cn: '分配资源。' }], level: 'senior' },
  { id: 's038', word: 'alternative', phonetic: '/ɔːlˈtɜːnətɪv/', meanings: [{ pos: 'n', definition: '替代品' }, { pos: 'adj', definition: '替代的' }], examples: [{ en: 'Find an alternative.', cn: '找一个替代方案。' }], level: 'senior' },
  { id: 's039', word: 'amateur', phonetic: '/ˈæmətər/', meanings: [{ pos: 'n', definition: '业余爱好者' }], examples: [{ en: 'An amateur photographer.', cn: '一个业余摄影师。' }], level: 'senior' },
  { id: 's040', word: 'ambassador', phonetic: '/æmˈbæsədər/', meanings: [{ pos: 'n', definition: '大使' }], examples: [{ en: 'The Chinese ambassador.', cn: '中国大使。' }], level: 'senior' },
  { id: 's041', word: 'ambition', phonetic: '/æmˈbɪʃn/', meanings: [{ pos: 'n', definition: '雄心；野心' }], examples: [{ en: 'He has great ambition.', cn: '他有远大的抱负。' }], level: 'senior' },
  { id: 's042', word: 'ambitious', phonetic: '/æmˈbɪʃəs/', meanings: [{ pos: 'adj', definition: '有雄心的' }], examples: [{ en: 'She is very ambitious.', cn: '她非常有雄心。' }], level: 'senior' },
  { id: 's043', word: 'ambulance', phonetic: '/ˈæmbjələns/', meanings: [{ pos: 'n', definition: '救护车' }], examples: [{ en: 'Call an ambulance!', cn: '叫救护车！' }], level: 'senior' },
  { id: 's044', word: 'amuse', phonetic: '/əˈmjuːz/', meanings: [{ pos: 'v', definition: '使发笑' }], examples: [{ en: 'The story amused us.', cn: '这个故事逗乐了我们。' }], level: 'senior' },
  { id: 's045', word: 'analyze', phonetic: '/ˈænəlaɪz/', meanings: [{ pos: 'v', definition: '分析' }], examples: [{ en: 'Analyze the data.', cn: '分析数据。' }], level: 'senior' },
  { id: 's046', word: 'ancestor', phonetic: '/ˈænsestər/', meanings: [{ pos: 'n', definition: '祖先' }], examples: [{ en: 'Honor your ancestors.', cn: '尊敬你的祖先。' }], level: 'senior' },
  { id: 's047', word: 'anniversary', phonetic: '/ˌænɪˈvɜːsəri/', meanings: [{ pos: 'n', definition: '周年纪念' }], examples: [{ en: 'Their 10th anniversary.', cn: '他们的十周年纪念。' }], level: 'senior' },
  { id: 's048', word: 'announce', phonetic: '/əˈnaʊns/', meanings: [{ pos: 'v', definition: '宣布' }], examples: [{ en: 'They announced the winner.', cn: '他们宣布了获胜者。' }], level: 'senior' },
  { id: 's049', word: 'annual', phonetic: '/ˈænjuəl/', meanings: [{ pos: 'adj', definition: '年度的' }], examples: [{ en: 'The annual report.', cn: '年度报告。' }], level: 'senior' },
  { id: 's050', word: 'anticipate', phonetic: '/ænˈtɪsɪpeɪt/', meanings: [{ pos: 'v', definition: '预期' }], examples: [{ en: 'We anticipate success.', cn: '我们预期会成功。' }], level: 'senior' },
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
