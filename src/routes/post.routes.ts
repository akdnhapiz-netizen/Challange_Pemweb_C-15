import { Router } from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  bulkCreatePosts,
   getDailyStats,
} from '../controllers/postController';

const router = Router();

router.post('/bulk', bulkCreatePosts);
router.post('/', createPost);
router.get('/', getAllPosts);
router.get('/stats/daily', getDailyStats);
router.get('/:id', getPostById);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;