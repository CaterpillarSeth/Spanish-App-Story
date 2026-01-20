import { Router } from 'express';
import {
  getCurrentLesson,
  getRecapTest,
  completeLesson,
  getAllLessons
} from '../controllers/lessonsController';

const router = Router();

router.get('/current', getCurrentLesson);
router.get('/recap/:lessonNumber', getRecapTest);
router.post('/complete', completeLesson);
router.get('/all', getAllLessons);

export default router;
