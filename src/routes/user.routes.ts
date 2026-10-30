import { Router } from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  getUserPosts,
  deleteUser,
} from '../controllers/userController';

const router = Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.get('/:id/posts', getUserPosts);
router.delete('/:id', deleteUser);

export default router;
