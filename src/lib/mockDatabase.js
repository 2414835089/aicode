/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} username
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} [lastLogin]
 * @property {string} [avatarUrl]
 * @property {string} [bio]
 */

/**
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} language
 * @property {string} level
 * @property {string} title
 * @property {string} description
 * @property {string} thumbnailUrl
 * @property {number} totalLessons
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Lesson
 * @property {string} id
 * @property {string} courseId
 * @property {string} title
 * @property {string} description
 * @property {number} [duration]
 * @property {number} orderIndex
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Vocabulary
 * @property {string} id
 * @property {string} lessonId
 * @property {string} word
 * @property {string} meaning
 * @property {string} [pronunciation]
 * @property {string} [exampleSentence]
 * @property {number} orderIndex
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} GrammarExercise
 * @property {string} id
 * @property {string} lessonId
 * @property {string} question
 * @property {string[]} options
 * @property {number} correctAnswer
 * @property {string} [explanation]
 * @property {number} orderIndex
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} UserProgress
 * @property {string} id
 * @property {string} userId
 * @property {string} courseId
 * @property {string} lessonId
 * @property {boolean} isCompleted
 * @property {number} progressPercentage
 * @property {string} lastAccessed
 * @property {string} [completedAt]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} CommunityPost
 * @property {string} id
 * @property {string} userId
 * @property {string} title
 * @property {string} content
 * @property {string} [language]
 * @property {number} likesCount
 * @property {number} commentsCount
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} Achievement
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} iconUrl
 * @property {string} requirements
 * @property {string} createdAt
 */

/**
 * @typedef {Object} UserAchievement
 * @property {string} id
 * @property {string} userId
 * @property {string} achievementId
 * @property {string} earnedAt
 */

/**
 * @typedef {Object} VocabularyProgress
 * @property {string} id
 * @property {string} vocabularyId
 * @property {number} interval
 * @property {number} easeFactor
 * @property {number} repetitions
 * @property {string} nextReview
 * @property {string} status
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} GrammarExerciseType
 * @type {'multiple_choice' | 'multiple_select' | 'word_fill' | 'sentence_fill' | 'true_false' | 'sentence_order'}
 */

/**
 * @typedef {Object} GrammarExerciseV2
 * @property {string} id
 * @property {string} lessonId
 * @property {GrammarExerciseType} type
 * @property {string} question
 * @property {string[]} [options]
 * @property {any} correctAnswer
 * @property {string} [explanation]
 * @property {number} orderIndex
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} GrammarProgress
 * @property {string} id
 * @property {string} userId
 * @property {string} exerciseId
 * @property {number} attempts
 * @property {number} correctAttempts
 * @property {boolean} isMastered
 * @property {string} lastAttemptedAt
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} GrammarMistake
 * @property {string} id
 * @property {string} userId
 * @property {string} exerciseId
 * @property {any} userAnswer
 * @property {string} attemptedAt
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * 生成唯一ID
 * @returns {string}
 */
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * 从 localStorage 读取数据
 * @param {string} key
 * @returns {any[]}
 */
const readData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

/**
 * 向 localStorage 写入数据
 * @param {string} key
 * @param {any[]} data
 */
const writeData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * 表名常量
 */
const TABLES = {
  USERS: 'users',
  COURSES: 'courses',
  LESSONS: 'lessons',
  VOCABULARY: 'vocabulary',
  GRAMMAR_EXERCISES: 'grammar_exercises',
  USER_PROGRESS: 'user_progress',
  COMMUNITY_POSTS: 'community_posts',
  ACHIEVEMENTS: 'achievements',
  USER_ACHIEVEMENTS: 'user_achievements',
  VOCABULARY_PROGRESS: 'vocabulary_progress',
  GRAMMAR_PROGRESS: 'grammar_progress',
  GRAMMAR_MISTAKES: 'grammar_mistakes',
  GRAMMAR_EXERCISES_V2: 'grammar_exercises_v2',
};

/**
 * 通用 CRUD 操作
 */
class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
  }

  /**
   * 获取所有记录
   * @returns {any[]}
   */
  getAll() {
    return readData(this.tableName);
  }

  /**
   * 根据 ID 获取记录
   * @param {string} id
   * @returns {any | undefined}
   */
  getById(id) {
    const data = readData(this.tableName);
    return data.find(item => item.id === id);
  }

  /**
   * 根据条件查询
   * @param {Object} conditions
   * @returns {any[]}
   */
  find(conditions) {
    let data = readData(this.tableName);
    Object.keys(conditions).forEach(key => {
      data = data.filter(item => item[key] === conditions[key]);
    });
    return data;
  }

  /**
   * 创建新记录
   * @param {Object} item
   * @returns {any}
   */
  create(item) {
    const data = readData(this.tableName);
    const newItem = {
      id: generateId(),
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.push(newItem);
    writeData(this.tableName, data);
    return newItem;
  }

  /**
   * 更新记录
   * @param {string} id
   * @param {Object} updates
   * @returns {any | undefined}
   */
  update(id, updates) {
    const data = readData(this.tableName);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return undefined;
    
    data[index] = {
      ...data[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    writeData(this.tableName, data);
    return data[index];
  }

  /**
   * 删除记录
   * @param {string} id
   * @returns {boolean}
   */
  delete(id) {
    const data = readData(this.tableName);
    const filtered = data.filter(item => item.id !== id);
    if (filtered.length === data.length) return false;
    writeData(this.tableName, filtered);
    return true;
  }
}

/**
 * 具体的 Repositories
 */
export const usersRepo = new BaseRepository(TABLES.USERS);
export const coursesRepo = new BaseRepository(TABLES.COURSES);
export const lessonsRepo = new BaseRepository(TABLES.LESSONS);
export const vocabularyRepo = new BaseRepository(TABLES.VOCABULARY);
export const grammarExercisesRepo = new BaseRepository(TABLES.GRAMMAR_EXERCISES);
export const userProgressRepo = new BaseRepository(TABLES.USER_PROGRESS);
export const communityPostsRepo = new BaseRepository(TABLES.COMMUNITY_POSTS);
export const achievementsRepo = new BaseRepository(TABLES.ACHIEVEMENTS);
export const userAchievementsRepo = new BaseRepository(TABLES.USER_ACHIEVEMENTS);
export const vocabularyProgressRepo = new BaseRepository(TABLES.VOCABULARY_PROGRESS);
export const grammarProgressRepo = new BaseRepository(TABLES.GRAMMAR_PROGRESS);
export const grammarMistakesRepo = new BaseRepository(TABLES.GRAMMAR_MISTAKES);
export const grammarExercisesV2Repo = new BaseRepository(TABLES.GRAMMAR_EXERCISES_V2);

/**
 * 生成示例课程数据
 * @returns {Course[]}
 */
const generateSampleCourses = () => {
  const languages = ['english', 'japanese', 'korean'];
  const levels = ['beginner', 'elementary', 'intermediate', 'advanced'];
  const courseNames = {
    english: {
      beginner: '英语入门：字母与基础发音',
      elementary: '英语初级：日常会话',
      intermediate: '英语中级：阅读与写作',
      advanced: '英语高级：商务与学术',
    },
    japanese: {
      beginner: '日语入门：五十音图',
      elementary: '日语初级：基本句型',
      intermediate: '日语中级：听力与表达',
      advanced: '日语高级：日本文化与文学',
    },
    korean: {
      beginner: '韩语入门：韩文字母',
      elementary: '韩语初级：生活用语',
      intermediate: '韩语中级：会话与语法',
      advanced: '韩语高级：新闻与媒体',
    },
  };

  const courses = [];
  languages.forEach(language => {
    levels.forEach((level, levelIndex) => {
      courses.push({
        id: generateId(),
        language,
        level,
        title: courseNames[language][level],
        description: `掌握${courseNames[language][level]}的核心内容，从基础到精通。`,
        thumbnailUrl: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(`${language} language learning ${level} level`)}&image_size=square`,
        totalLessons: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  });
  return courses;
};

/**
 * 生成示例课时数据
 * @param {string[]} courseIds
 * @returns {Lesson[]}
 */
const generateSampleLessons = (courseIds) => {
  const lessons = [];
  courseIds.forEach(courseId => {
    for (let i = 0; i < 10; i++) {
      lessons.push({
        id: generateId(),
        courseId,
        title: `第 ${i + 1} 课：基础内容 ${i + 1}`,
        description: `本节课将学习 ${i + 1} 个核心知识点。`,
        duration: 30 + Math.floor(Math.random() * 30),
        orderIndex: i + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  });
  return lessons;
};

/**
 * 生成示例单词数据
 * @param {string[]} lessonIds
 * @returns {Vocabulary[]}
 */
const generateSampleVocabulary = (lessonIds) => {
  const vocabulary = [];
  const sampleWords = [
    { word: 'Hello', meaning: '你好', pronunciation: '/həˈloʊ/' },
    { word: 'Thank you', meaning: '谢谢', pronunciation: '/θæŋk juː/' },
    { word: 'Goodbye', meaning: '再见', pronunciation: '/ɡʊdˈbaɪ/' },
    { word: 'Please', meaning: '请', pronunciation: '/pliːz/' },
    { word: 'Sorry', meaning: '对不起', pronunciation: '/ˈsɔːri/' },
  ];

  lessonIds.forEach(lessonId => {
    sampleWords.forEach((item, index) => {
      vocabulary.push({
        id: generateId(),
        lessonId,
        ...item,
        exampleSentence: `${item.word}, nice to meet you!`,
        orderIndex: index + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  });
  return vocabulary;
};

/**
 * 生成示例语法练习题（旧版，保持兼容性）
 * @param {string[]} lessonIds
 * @returns {GrammarExercise[]}
 */
const generateSampleGrammarExercises = (lessonIds) => {
  const exercises = [];
  const sampleExercises = [
    {
      question: '选择正确的单词填空：___ are you from?',
      options: ['Where', 'What', 'When', 'How'],
      correctAnswer: 0,
      explanation: '询问来自哪里要用 "Where"。',
    },
    {
      question: '选择正确的形式：I ___ a student.',
      options: ['is', 'am', 'are', 'be'],
      correctAnswer: 1,
      explanation: '第一人称单数用 "am"。',
    },
  ];

  lessonIds.forEach(lessonId => {
    sampleExercises.forEach((item, index) => {
      exercises.push({
        id: generateId(),
        lessonId,
        ...item,
        orderIndex: index + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  });
  return exercises;
};

/**
 * 生成示例语法练习题（新版，支持多种题型）
 * @param {string[]} lessonIds
 * @returns {GrammarExerciseV2[]}
 */
const generateSampleGrammarExercisesV2 = (lessonIds) => {
  const exercises = [];
  
  const sampleExercises = [
    {
      type: 'multiple_choice',
      question: '选择正确的单词填空：___ are you from?',
      options: ['Where', 'What', 'When', 'How'],
      correctAnswer: 0,
      explanation: '询问来自哪里要用 "Where"。',
    },
    {
      type: 'multiple_choice',
      question: '选择正确的形式：I ___ a student.',
      options: ['is', 'am', 'are', 'be'],
      correctAnswer: 1,
      explanation: '第一人称单数用 "am"。',
    },
    {
      type: 'multiple_select',
      question: '选择所有正确的答案：下列哪些是动词？',
      options: ['run', 'beautiful', 'jump', 'happy'],
      correctAnswer: [0, 2],
      explanation: 'run 和 jump 是动词，beautiful 和 happy 是形容词。',
    },
    {
      type: 'word_fill',
      question: '用适当的单词填空：She ___ (go) to school every day.',
      correctAnswer: 'goes',
      explanation: '主语是第三人称单数，一般现在时动词用 goes。',
    },
    {
      type: 'sentence_fill',
      question: '完成句子：If it rains tomorrow, ___.',
      correctAnswer: 'we will stay at home',
      explanation: '条件状语从句，主句用将来时，从句用一般现在时。',
    },
    {
      type: 'true_false',
      question: '判断："She don\'t like apples" 是正确的句子。',
      correctAnswer: false,
      explanation: '主语是第三人称单数，否定句应该用 doesn\'t 而不是 don\'t。',
    },
    {
      type: 'sentence_order',
      question: '将下列词语排序组成正确的句子：',
      options: ['the', 'is', 'book', 'on', 'table', 'the'],
      correctAnswer: [0, 2, 1, 3, 5, 4],
      explanation: '正确的句子是 "The book is on the table."',
    },
    {
      type: 'multiple_choice',
      question: '选择正确的介词：The book is ___ the table.',
      options: ['in', 'on', 'at', 'to'],
      correctAnswer: 1,
      explanation: '表示在表面上用介词 on。',
    },
  ];

  lessonIds.forEach(lessonId => {
    sampleExercises.forEach((item, index) => {
      exercises.push({
        id: generateId(),
        lessonId,
        ...item,
        orderIndex: index + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  });
  return exercises;
};

/**
 * 生成示例成就数据
 * @returns {Achievement[]}
 */
const generateSampleAchievements = () => {
  return [
    {
      id: generateId(),
      name: '初学者',
      description: '完成第一个课时',
      iconUrl: '🏆',
      requirements: '完成任意1个课时',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: '学习达人',
      description: '完成10个课时',
      iconUrl: '🌟',
      requirements: '累计完成10个课时',
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: '语言大师',
      description: '完成一门语言的所有课程',
      iconUrl: '👑',
      requirements: '完成同一语言的所有课程',
      createdAt: new Date().toISOString(),
    },
  ];
};

/**
 * 初始化数据库
 * @param {boolean} force - 是否强制重新初始化
 */
export const initializeDatabase = (force = false) => {
  const isInitialized = localStorage.getItem('db_initialized');
  
  if (!force && isInitialized) {
    return;
  }

  const courses = generateSampleCourses();
  writeData(TABLES.COURSES, courses);

  const courseIds = courses.map(c => c.id);
  const lessons = generateSampleLessons(courseIds);
  writeData(TABLES.LESSONS, lessons);

  const lessonIds = lessons.map(l => l.id);
  const vocabulary = generateSampleVocabulary(lessonIds);
  writeData(TABLES.VOCABULARY, vocabulary);

  const grammarExercises = generateSampleGrammarExercises(lessonIds);
  writeData(TABLES.GRAMMAR_EXERCISES, grammarExercises);

  const grammarExercisesV2 = generateSampleGrammarExercisesV2(lessonIds);
  writeData(TABLES.GRAMMAR_EXERCISES_V2, grammarExercisesV2);

  const achievements = generateSampleAchievements();
  writeData(TABLES.ACHIEVEMENTS, achievements);

  writeData(TABLES.USERS, []);
  writeData(TABLES.USER_PROGRESS, []);
  writeData(TABLES.COMMUNITY_POSTS, []);
  writeData(TABLES.USER_ACHIEVEMENTS, []);

  localStorage.setItem('db_initialized', 'true');
};

/**
 * 重置数据库
 */
export const resetDatabase = () => {
  Object.values(TABLES).forEach(table => {
    localStorage.removeItem(table);
  });
  localStorage.removeItem('db_initialized');
  initializeDatabase();
};
