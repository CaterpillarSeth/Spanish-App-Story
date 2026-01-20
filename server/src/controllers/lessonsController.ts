import db from '../database';
import { generateLesson, generateRecapQuestions } from '../utils/aiHelper';

const DEFAULT_USER_ID = 1;

export const getCurrentLesson = async (req: any, res: any) => {
  try {
    const userId = DEFAULT_USER_ID;
    
    const completedLessons: any[] = db.prepare(`
      SELECT lesson_number FROM lessons
      WHERE user_id = ? AND completed = 1
      ORDER BY lesson_number DESC
    `).all(userId);
    
    const nextLessonNumber = completedLessons.length > 0 
      ? completedLessons[0].lesson_number + 1 
      : 1;
    
    let lesson: any = db.prepare(`
      SELECT * FROM lessons
      WHERE user_id = ? AND lesson_number = ?
    `).get(userId, nextLessonNumber);
    
    if (!lesson) {
      const lessonContent = await generateLesson(nextLessonNumber);
      
      db.prepare(`
        INSERT INTO lessons (user_id, lesson_number, title, content)
        VALUES (?, ?, ?, ?)
      `).run(userId, nextLessonNumber, lessonContent.title, lessonContent.content);
      
      lesson = {
        lesson_number: nextLessonNumber,
        title: lessonContent.title,
        content: lessonContent.content,
        completed: 0
      };
    }
    
    res.json({ lesson, needsRecap: nextLessonNumber > 1 });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecapTest = async (req: any, res: any) => {
  try {
    const userId = DEFAULT_USER_ID;
    const lessonNumber = parseInt(req.params.lessonNumber);
    
    const previousLesson: any = db.prepare(`
      SELECT * FROM lessons
      WHERE user_id = ? AND lesson_number = ?
    `).get(userId, lessonNumber - 1);
    
    if (!previousLesson) {
      return res.status(404).json({ error: 'Previous lesson not found' });
    }
    
    const questions = await generateRecapQuestions(previousLesson.title, previousLesson.content);
    
    res.json({ questions, previousLesson: previousLesson.title });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const completeLesson = (req: any, res: any) => {
  try {
    const userId = DEFAULT_USER_ID;
    const { lessonNumber } = req.body;
    
    db.prepare(`
      UPDATE lessons
      SET completed = 1, completed_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND lesson_number = ?
    `).run(userId, lessonNumber);
    
    res.json({ success: true, message: 'Lesson completed!' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllLessons = (req: any, res: any) => {
  try {
    const userId = DEFAULT_USER_ID;
    
    const lessons: any[] = db.prepare(`
      SELECT lesson_number, title, completed, completed_at
      FROM lessons
      WHERE user_id = ?
      ORDER BY lesson_number
    `).all(userId);
    
    res.json({ lessons });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
