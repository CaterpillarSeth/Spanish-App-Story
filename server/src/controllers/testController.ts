import db from '../database';

const DEFAULT_USER_ID = 1;

export const getWeeklyTest = (req: any, res: any) => {
  try {
    const userId = DEFAULT_USER_ID;
    const currentWeek = getCurrentWeekNumber();
    
    const existingWeeklyWords: any[] = db.prepare(`
      SELECT * FROM weekly_words
      WHERE user_id = ? AND week_number = ?
    `).all(userId, currentWeek);
    
    if (existingWeeklyWords.length >= 10) {
      return res.json({ 
        completed: true, 
        message: 'Weekly test already completed',
        weeklyWords: existingWeeklyWords 
      });
    }
    
    const learned: any[] = db.prepare(`
      SELECT word FROM vocabulary WHERE user_id = ?
    `).all(userId);
    
    const learnedWords = learned.map((v: any) => v.word);
    const neededWords = 10 - existingWeeklyWords.length;
    
    let availableWords: any[] = [];
    
    if (learnedWords.length > 0) {
      const placeholders = learnedWords.map(() => '?').join(',');
      const query = `
        SELECT * FROM spanish_words
        WHERE word NOT IN (${placeholders})
        ORDER BY rank
        LIMIT ?
      `;
      availableWords = db.prepare(query).all(...learnedWords, neededWords);
    } else {
      availableWords = db.prepare(`
        SELECT * FROM spanish_words
        ORDER BY rank
        LIMIT ?
      `).all(neededWords);
    }
    
    const testQuestions = availableWords.map((word: any) => {
      const wrongAnswers: any[] = db.prepare(`
        SELECT translation FROM spanish_words
        WHERE word != ? AND word_type = ?
        ORDER BY RANDOM()
        LIMIT 3
      `).all(word.word, word.word_type);
      
      const options = [
        word.translation,
        ...wrongAnswers.map((w: any) => w.translation)
      ].sort(() => Math.random() - 0.5);
      
      return {
        word: word.word,
        wordId: word.id,
        wordType: word.word_type,
        correctAnswer: word.translation,
        options
      };
    });
    
    res.json({ testQuestions, currentWeek });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const submitWeeklyTest = (req: any, res: any) => {
  try {
    const userId = DEFAULT_USER_ID;
    const { answers, week } = req.body;
    
    const results = answers.map((answer: any) => {
      const correct = answer.selectedAnswer === answer.correctAnswer;
      
      if (correct) {
        db.prepare(`
          INSERT INTO weekly_words (user_id, word, translation, week_number)
          VALUES (?, ?, ?, ?)
        `).run(userId, answer.word, answer.correctAnswer, week);
        
        db.prepare(`
          INSERT OR IGNORE INTO vocabulary (user_id, word_id, word, translation, word_type, is_top_1000, source)
          VALUES (?, ?, ?, ?, ?, 1, 'weekly_test')
        `).run(userId, answer.wordId, answer.word, answer.correctAnswer, answer.wordType);
      }
      
      return { ...answer, correct };
    });
    
    const score = results.filter((r: any) => r.correct).length;
    
    res.json({ results, score, total: answers.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const submitRecapTest = (req: any, res: any) => {
  try {
    const userId = DEFAULT_USER_ID;
    const { lessonNumber, answers } = req.body;
    
    const correctCount = answers.filter((a: any) => a.correct).length;
    
    db.prepare(`
      INSERT INTO lesson_recaps (user_id, lesson_number, score, total_questions)
      VALUES (?, ?, ?, ?)
    `).run(userId, lessonNumber, correctCount, answers.length);
    
    const passed = correctCount >= answers.length * 0.7;
    
    res.json({ 
      score: correctCount, 
      total: answers.length, 
      passed,
      message: passed ? 'Great job! You can proceed to the next lesson.' : 'Keep practicing! Review the previous lesson and try again.'
    });
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
