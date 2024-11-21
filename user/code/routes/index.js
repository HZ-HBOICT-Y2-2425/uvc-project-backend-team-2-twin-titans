import express from 'express';
import { getAllUsers, createUser, getUserById } from '../controllers/exampleController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
const router = express.Router();

// routes
// router.get('/', (req, res, next) => {
//   res.json('hi');
// });
router.get('/', checkName, getAllUsers);
router.post('/new', checkName, createUser);
router.get('/:id', checkName, getUserById);

export default router;
