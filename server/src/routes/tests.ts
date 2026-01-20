import { Router } from 'express';
import {
  getWeeklyTest,
  submitWeeklyTest,
  submitRecapTest
} from '../controllers/testController';

const router = Router();

router.get('/weekly', getWeeklyTest);
router.post('/weekly/submit', submitWeeklyTest);
router.post('/recap/submit', submitRecapTest);

export default router;
