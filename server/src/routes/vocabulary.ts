import { Router } from 'express';
import {
  getVocabularyProgress,
  getWeeklyWords,
  getDailyWord,
  addToVocabulary
} from '../controllers/vocabularyController';

const router = Router();

router.get('/progress', getVocabularyProgress);
router.get('/weekly', getWeeklyWords);
router.get('/daily/:type', getDailyWord);
router.post('/add', addToVocabulary);

export default router;
