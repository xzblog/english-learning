import type { GrammarRule } from '../types';

export const grammarRules: GrammarRule[] = [
  // Tenses - 时态
  {
    id: 'g001',
    category: 'tense',
    title: 'Simple Present Tense',
    titleCn: '一般现在时',
    description: '表示经常性、习惯性的动作或状态，以及客观真理。',
    structure: '主语 + 动词原形 (第三人称单数加s/es)',
    examples: [
      { en: 'I go to school every day.', cn: '我每天上学。' },
      { en: 'She speaks English fluently.', cn: '她英语说得很流利。' },
      { en: 'The sun rises in the east.', cn: '太阳从东方升起。' }
    ],
    tips: [
      '时间状语: always, usually, often, sometimes, every day等',
      '第三人称单数动词变化规则: 一般加s，以s/x/ch/sh/o结尾加es'
    ]
  },
  {
    id: 'g002',
    category: 'tense',
    title: 'Present Continuous Tense',
    titleCn: '现在进行时',
    description: '表示说话时正在进行的动作或当前阶段正在发生的事情。',
    structure: '主语 + am/is/are + 动词-ing',
    examples: [
      { en: 'I am reading a book now.', cn: '我现在正在看书。' },
      { en: 'They are playing basketball.', cn: '他们正在打篮球。' },
      { en: 'She is working on a project this week.', cn: '她这周正在做一个项目。' }
    ],
    tips: [
      '时间状语: now, at the moment, these days, look, listen等',
      '动词-ing变化: 一般直接加ing，以e结尾去e加ing，重读闭音节双写末尾辅音加ing'
    ]
  },
  {
    id: 'g003',
    category: 'tense',
    title: 'Simple Past Tense',
    titleCn: '一般过去时',
    description: '表示过去某个时间发生的动作或存在的状态。',
    structure: '主语 + 动词过去式',
    examples: [
      { en: 'I went to Beijing last month.', cn: '我上个月去了北京。' },
      { en: 'She finished her homework yesterday.', cn: '她昨天完成了作业。' },
      { en: 'They lived in Shanghai before.', cn: '他们以前住在上海。' }
    ],
    tips: [
      '时间状语: yesterday, last week, ago, in 2020, just now等',
      '规则动词过去式: 直接加ed，以e结尾加d，辅音+y变i加ed'
    ]
  },
  {
    id: 'g004',
    category: 'tense',
    title: 'Past Continuous Tense',
    titleCn: '过去进行时',
    description: '表示过去某一时刻或某一段时间正在进行的动作。',
    structure: '主语 + was/were + 动词-ing',
    examples: [
      { en: 'I was sleeping when you called.', cn: '你打电话时我正在睡觉。' },
      { en: 'They were having dinner at 7 pm.', cn: '他们晚上7点正在吃晚饭。' },
      { en: 'She was studying all night.', cn: '她整晚都在学习。' }
    ],
    tips: [
      '常与when/while连用',
      '主句用过去进行时，从句用一般过去时表示过去某一刻正在进行的动作被打断'
    ]
  },
  {
    id: 'g005',
    category: 'tense',
    title: 'Present Perfect Tense',
    titleCn: '现在完成时',
    description: '表示过去发生的动作对现在造成的影响或结果，或从过去持续到现在的动作。',
    structure: '主语 + have/has + 动词过去分词',
    examples: [
      { en: 'I have finished my homework.', cn: '我已经完成了作业。' },
      { en: 'She has lived here for 10 years.', cn: '她在这里住了10年了。' },
      { en: 'Have you ever been to Japan?', cn: '你去过日本吗？' }
    ],
    tips: [
      '时间状语: already, yet, just, ever, never, since, for等',
      'since + 时间点，for + 时间段'
    ]
  },
  {
    id: 'g006',
    category: 'tense',
    title: 'Simple Future Tense',
    titleCn: '一般将来时',
    description: '表示将来某个时间要发生的动作或存在的状态。',
    structure: '主语 + will/shall + 动词原形 或 主语 + be going to + 动词原形',
    examples: [
      { en: 'I will call you tomorrow.', cn: '我明天会给你打电话。' },
      { en: 'She is going to visit her parents.', cn: '她打算去看望她的父母。' },
      { en: 'It will rain this afternoon.', cn: '今天下午会下雨。' }
    ],
    tips: [
      '时间状语: tomorrow, next week, in the future, soon等',
      'will表示临时决定，be going to表示计划或有迹象表明要发生'
    ]
  },
  {
    id: 'g007',
    category: 'tense',
    title: 'Past Perfect Tense',
    titleCn: '过去完成时',
    description: '表示在过去某一时间或动作之前已经完成的动作，即"过去的过去"。',
    structure: '主语 + had + 动词过去分词',
    examples: [
      { en: 'I had finished my work before he came.', cn: '在他来之前我已经完成了工作。' },
      { en: 'She had left when I arrived.', cn: '当我到达时她已经离开了。' },
      { en: 'They had never seen such a beautiful place.', cn: '他们从未见过如此美丽的地方。' }
    ],
    tips: [
      '常与before, after, by the time, when等连用',
      '表示两个过去动作的先后顺序，先发生的用过去完成时'
    ]
  },
  {
    id: 'g008',
    category: 'tense',
    title: 'Future Perfect Tense',
    titleCn: '将来完成时',
    description: '表示到将来某一时间将已完成的动作。',
    structure: '主语 + will have + 动词过去分词',
    examples: [
      { en: 'I will have finished this book by Friday.', cn: '到周五我将读完这本书。' },
      { en: 'She will have graduated by next summer.', cn: '到明年夏天她将已经毕业了。' }
    ],
    tips: [
      '常与by + 将来时间, by the time等连用'
    ]
  },

  // Clauses - 从句
  {
    id: 'g009',
    category: 'clause',
    title: 'Attributive Clause',
    titleCn: '定语从句',
    description: '用来修饰名词或代词的从句，通常由关系代词或关系副词引导。',
    structure: '先行词 + 关系词(who/which/that/whose/where/when) + 从句',
    examples: [
      { en: 'The man who is standing there is my teacher.', cn: '站在那里的那个人是我的老师。' },
      { en: 'This is the book that I bought yesterday.', cn: '这就是我昨天买的那本书。' },
      { en: 'The house where I was born has been sold.', cn: '我出生的那栋房子已经被卖了。' }
    ],
    tips: [
      '先行词是人用who/whom/that，先行词是物用which/that',
      'whose表示所属关系，where表示地点，when表示时间'
    ]
  },
  {
    id: 'g010',
    category: 'clause',
    title: 'Adverbial Clause',
    titleCn: '状语从句',
    description: '在句中作状语，修饰主句中的动词、形容词或副词。',
    structure: '引导词 + 从句 + 主句 或 主句 + 引导词 + 从句',
    examples: [
      { en: 'If it rains tomorrow, we will stay at home.', cn: '如果明天下雨，我们就待在家里。' },
      { en: 'Although he is young, he is very capable.', cn: '虽然他年轻，但他很能干。' },
      { en: 'I will wait until you come back.', cn: '我会等到你回来。' }
    ],
    tips: [
      '时间状语从句: when, while, before, after, until, as soon as',
      '条件状语从句: if, unless, as long as',
      '让步状语从句: although, though, even if'
    ]
  },
  {
    id: 'g011',
    category: 'clause',
    title: 'Noun Clause',
    titleCn: '名词性从句',
    description: '在句中充当名词的从句，可作主语、宾语、表语或同位语。',
    structure: 'that/whether/what/who/when/where/how + 从句',
    examples: [
      { en: 'What he said is true.', cn: '他说的是真的。（主语从句）' },
      { en: 'I know that she is coming.', cn: '我知道她要来。（宾语从句）' },
      { en: 'The question is whether we should go.', cn: '问题是我们是否应该去。（表语从句）' }
    ],
    tips: [
      'that引导的宾语从句中that可省略',
      'whether和if都可引导"是否"从句，但介词后只能用whether'
    ]
  },

  // Sentence Patterns - 句型结构
  {
    id: 'g012',
    category: 'sentence',
    title: 'There Be Structure',
    titleCn: 'There be 句型',
    description: '表示某处存在某物或某人。',
    structure: 'There + be + 主语 + 地点/时间状语',
    examples: [
      { en: 'There is a book on the table.', cn: '桌子上有一本书。' },
      { en: 'There are many students in the classroom.', cn: '教室里有很多学生。' },
      { en: 'There will be a meeting tomorrow.', cn: '明天将有一个会议。' }
    ],
    tips: [
      'be动词根据最近的名词确定单复数（就近原则）',
      '可变换时态: there was/were, there will be, there has been等'
    ]
  },
  {
    id: 'g013',
    category: 'sentence',
    title: 'It as Formal Subject',
    titleCn: 'It 作形式主语',
    description: '用it作形式主语，将真正的主语（不定式、动名词或从句）后置。',
    structure: 'It + be + adj./n. + (for sb.) to do sth. / that从句',
    examples: [
      { en: 'It is important to learn English.', cn: '学习英语很重要。' },
      { en: 'It is necessary that we should help each other.', cn: '我们应该互相帮助是必要的。' },
      { en: 'It is a pity that you missed the concert.', cn: '你错过了音乐会真是太遗憾了。' }
    ],
    tips: [
      "常用形容词: important, necessary, easy, difficult, possible, impossible等",
      'It takes sb. time to do sth. 做某事花费某人多长时间'
    ]
  },
  {
    id: 'g014',
    category: 'sentence',
    title: 'Emphasis Structure',
    titleCn: '强调句型',
    description: '用于强调句子中的某个成分（主语、宾语、状语等，但不能强调谓语）。',
    structure: 'It is/was + 被强调部分 + that/who + 其他部分',
    examples: [
      { en: 'It was Tom that broke the window.', cn: '是汤姆打破了窗户。（强调主语）' },
      { en: 'It was yesterday that I met her.', cn: '我是昨天遇见她的。（强调时间状语）' },
      { en: 'It is English that I am learning.', cn: '我正在学习的是英语。（强调宾语）' }
    ],
    tips: [
      '判断方法: 去掉It is/was...that/who，句子仍然完整',
      '被强调部分是人时可用who，其他情况用that'
    ]
  },
  {
    id: 'g015',
    category: 'sentence',
    title: 'Inversion',
    titleCn: '倒装句',
    description: '为了强调、平衡句子结构或语法需要，将谓语动词或助动词放在主语之前。',
    structure: '否定词/Only/So/Neither + 助动词 + 主语 + 动词',
    examples: [
      { en: 'Never have I seen such a beautiful sunset.', cn: '我从未见过如此美丽的日落。' },
      { en: 'Only then did I realize my mistake.', cn: '直到那时我才意识到我的错误。' },
      { en: 'So do I.', cn: '我也是。' }
    ],
    tips: [
      '部分倒装: 助动词提前，常用于否定词(never/seldom/hardly)开头',
      '完全倒装: 整个谓语提前，常用于地点状语开头'
    ]
  },

  // Mood - 语气
  {
    id: 'g016',
    category: 'mood',
    title: 'Subjunctive Mood - Wish',
    titleCn: '虚拟语气 - wish从句',
    description: '用于表达与事实相反的愿望或假设。',
    structure: 'I wish + 从句（时态后退）',
    examples: [
      { en: 'I wish I were taller.', cn: '我希望我更高一些。（与现在事实相反）' },
      { en: 'I wish I had studied harder.', cn: '我希望我以前更努力学习。（与过去事实相反）' },
      { en: 'I wish you would come tomorrow.', cn: '我希望你明天能来。（对将来的愿望）' }
    ],
    tips: [
      '与现在相反: 过去式（be动词用were）',
      '与过去相反: had + 过去分词',
      '与将来相反: would/could + 动词原形'
    ]
  },
  {
    id: 'g017',
    category: 'mood',
    title: 'Subjunctive Mood - If',
    titleCn: '虚拟语气 - 条件句',
    description: '用于表达与事实相反或不太可能实现的假设条件。',
    structure: 'If + 从句（时态后退），主句 + would/could/should/might + 动词',
    examples: [
      { en: 'If I were you, I would accept the offer.', cn: '如果我是你，我会接受这个提议。' },
      { en: 'If I had known earlier, I would have helped you.', cn: '如果我早点知道，我会帮助你的。' },
      { en: 'If it should rain tomorrow, we would cancel the trip.', cn: '万一明天下雨，我们就取消旅行。' }
    ],
    tips: [
      '与现在相反: If + 过去式, would + 动词原形',
      '与过去相反: If + had done, would have + 过去分词',
      '与将来相反: If + should/were to + 动词原形, would + 动词原形'
    ]
  },

  // Non-finite Verbs - 非谓语动词
  {
    id: 'g018',
    category: 'non-finite',
    title: 'Infinitive',
    titleCn: '不定式',
    description: '由"to + 动词原形"构成，可作主语、宾语、表语、定语、状语等。',
    structure: 'to + 动词原形',
    examples: [
      { en: 'To learn a language well is not easy.', cn: '学好一门语言不容易。（作主语）' },
      { en: 'She decided to study abroad.', cn: '她决定出国留学。（作宾语）' },
      { en: 'I have something to tell you.', cn: '我有事要告诉你。（作定语）' }
    ],
    tips: [
      '不定式作目的状语时可放句首或句末',
      '某些动词后只能接不定式: want, decide, hope, expect, plan等'
    ]
  },
  {
    id: 'g019',
    category: 'non-finite',
    title: 'Gerund',
    titleCn: '动名词',
    description: '由"动词-ing"构成，具有名词性质，可作主语、宾语、表语等。',
    structure: '动词-ing',
    examples: [
      { en: 'Swimming is good for health.', cn: '游泳对健康有益。（作主语）' },
      { en: 'She enjoys reading novels.', cn: '她喜欢读小说。（作宾语）' },
      { en: 'His hobby is collecting stamps.', cn: '他的爱好是集邮。（作表语）' }
    ],
    tips: [
      '某些动词后只能接动名词: enjoy, finish, mind, practice, avoid, consider等',
      '介词后必须用动名词'
    ]
  },
  {
    id: 'g020',
    category: 'non-finite',
    title: 'Participle',
    titleCn: '分词',
    description: '包括现在分词(-ing)和过去分词(-ed)，可作定语、状语、补语等。',
    structure: '动词-ing (现在分词) / 动词-ed (过去分词)',
    examples: [
      { en: 'The running water sounds pleasant.', cn: '流水的声音很悦耳。（现在分词作定语）' },
      { en: 'Seen from the hill, the city looks beautiful.', cn: '从山上看，这座城市很美。（过去分词作状语）' },
      { en: 'I found the movie boring.', cn: '我觉得这部电影很无聊。（现在分词作补语）' }
    ],
    tips: [
      '现在分词表示主动或正在进行',
      '过去分词表示被动或已完成',
      '-ing形容词描述事物特征，-ed形容词描述人的感受'
    ]
  }
];

// Get grammar by category
export function getGrammarByCategory(category: string): GrammarRule[] {
  if (category === 'all') return grammarRules;
  return grammarRules.filter(rule => rule.category === category);
}

// Get grammar by ID
export function getGrammarById(id: string): GrammarRule | undefined {
  return grammarRules.find(rule => rule.id === id);
}

// Category display names
export const grammarCategories = {
  tense: { name: '时态', description: '8种基本时态' },
  clause: { name: '从句', description: '定语/状语/名词性从句' },
  sentence: { name: '句型', description: '特殊句型结构' },
  mood: { name: '虚拟语气', description: '假设与愿望' },
  'non-finite': { name: '非谓语动词', description: '不定式/动名词/分词' }
};
