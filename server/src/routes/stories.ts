import { Router } from 'express';
import {
  createStory,
  getStories,
  getStory
} from '../controllers/storiesController';

const router = Router();

router.post('/generate', createStory);
router.get('/', getStories);
router.get('/:id', getStory);

export default router;
