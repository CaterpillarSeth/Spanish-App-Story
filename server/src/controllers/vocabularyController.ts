import db from '../database';

const DEFAULT_USER_ID = 1;

export const getVocabularyProgress = (req: any, res: any) => {
  try {
    const userId = DEFAULT_USER_ID;
    
    const top1000Learned = db.prepare(`
      SELECT v.*, sw.rank 
      FROM vocabulary v
      JOIN spanish_words sw ON v.word = sw.word
      WHERE v.user_id = ? AND v.is_top_1000 = 1
      ORDER BY sw.rank
    `).all(userId);
    
    const otherWords = db.prepare(`
      SELECT * FROM vocabulary
      WHERE user_id = ? AND is_top_1000 = 0
      ORDER BY learned_at DESC
    `).all(userId);
    
    res.json({
      top1000: top1000Learned,
      others: otherWords,
      top1000Count: top1000Learned.length,
      totalCount: top1000Learned.length + otherWords.length
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getWeeklyWords = (req: any, res: any) => {
  try {
    const userId = DEFAULT_USER_ID;
    const currentWeek = req.query.week || getCurrentWeekNumber();
    
    const weeklyWords = db.prepare(`
      SELECT * FROM weekly_words
      WHERE user_id = ? AND week_number = ?
      ORDER BY added_at DESC
    `).all(userId, currentWeek);
    
    res.json({ weeklyWords, currentWeek });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getDailyWord = (req: any, res: any) => {
  try {
    const userId = DEFAULT_USER_ID;
    const today = new Date().toISOString().split('T')[0];
    const wordType = req.params.type;
    
    let dailyWord: any = db.prepare(`
      SELECT * FROM daily_words
      WHERE user_id = ? AND date = ? AND word_type = ?
    `).get(userId, today, wordType);
    
    if (!dailyWord) {
      const learned: any[] = db.prepare(`
        SELECT word FROM vocabulary WHERE user_id = ?
      `).all(userId);
      
      const learnedWords = learned.map((v: any) => v.word);
      
      if (learnedWords.length > 0) {
        const placeholders = learnedWords.map(() => '?').join(',');
        const query = `
          SELECT * FROM spanish_words
          WHERE word_type = ? AND word NOT IN (${placeholders})
          ORDER BY rank
          LIMIT 1
        `;
        const availableWords: any = db.prepare(query).get(wordType, ...learnedWords);
        
        if (availableWords) {
          db.prepare(`
            INSERT INTO daily_words (user_id, word, translation, word_type, date)
            VALUES (?, ?, ?, ?, ?)
          `).run(userId, availableWords.word, availableWords.translation, wordType, today);
          
          dailyWord = { ...availableWords, date: today };
        }
      } else {
        const availableWords: any = db.prepare(`
          SELECT * FROM spanish_words
          WHERE word_type = ?
          ORDER BY rank
          LIMIT 1
        `).get(wordType);
        
        if (availableWords) {
          db.prepare(`
            INSERT INTO daily_words (user_id, word, translation, word_type, date)
            VALUES (?, ?, ?, ?, ?)
          `).run(userId, availableWords.word, availableWords.translation, wordType, today);
          
          dailyWord = { ...availableWords, date: today };
        }
      }
    }
    
    res.json({ dailyWord });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addToVocabulary = (req: any, res: any) => {
  try {
    const userId = DEFAULT_USER_ID;
    const { word, translation, wordType, isTop1000, source, wordId } = req.body;
    
    const result: any = db.prepare(`
      INSERT OR IGNORE INTO vocabulary (user_id, word_id, word, translation, word_type, is_top_1000, source)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userId, wordId || null, word, translation, wordType, isTop1000 ? 1 : 0, source);
    
    res.json({ success: result.changes > 0, message: result.changes > 0 ? 'Word added to vocabulary' : 'Word already in vocabulary' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

function getCurrentWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.floor(diff / oneWeek);
}
