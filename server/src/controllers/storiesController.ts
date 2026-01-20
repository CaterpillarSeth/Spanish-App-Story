import db from '../database';
import { generateStory } from '../utils/aiHelper';

const DEFAULT_USER_ID = 1;

export const createStory = async (req: any, res: any) => {
  try {
    const userId = DEFAULT_USER_ID;
    const { topic } = req.body;
    
    const userVocabulary: any[] = db.prepare(`
      SELECT word, translation FROM vocabulary
      WHERE user_id = ?
    `).all(userId);
    
    const weeklyWords: any[] = db.prepare(`
      SELECT word, translation FROM weekly_words
      WHERE user_id = ? AND week_number = ?
    `).all(userId, getCurrentWeekNumber());
    
    const today = new Date().toISOString().split('T')[0];
    const dailyWords: any[] = db.prepare(`
      SELECT word, translation FROM daily_words
      WHERE user_id = ? AND date = ?
    `).all(userId, today);
    
    const allVocab = [
      ...userVocabulary.map((v: any) => v.word),
      ...weeklyWords.map((w: any) => w.word),
      ...dailyWords.map((d: any) => d.word)
    ];
    
    const uniqueVocab = [...new Set(allVocab)];
    
    if (uniqueVocab.length < 10) {
      return res.status(400).json({ 
        error: 'You need at least 10 words in your vocabulary to generate a story. Complete the weekly test first!' 
      });
    }
    
    const story = await generateStory(topic, uniqueVocab);
    
    db.prepare(`
      INSERT INTO stories (user_id, topic, content)
      VALUES (?, ?, ?)
    `).run(userId, topic, story);
    
    res.json({ story, vocabularyUsed: uniqueVocab.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getStories = (req: any, res: any) => {
  try {
    const userId = DEFAULT_USER_ID;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const stories: any[] = db.prepare(`
      SELECT * FROM stories
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `).all(userId, limit);
    
    res.json({ stories });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getStory = (req: any, res: any) => {
  try {
    const userId = DEFAULT_USER_ID;
    const storyId = parseInt(req.params.id);
    
    const story: any = db.prepare(`
      SELECT * FROM stories
      WHERE user_id = ? AND id = ?
    `).get(userId, storyId);
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    res.json({ story });
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
