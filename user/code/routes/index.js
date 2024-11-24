import express from 'express';
import { getAllUsers, createUser, getUserById } from '../controllers/userController.js';
import { createMessage, getAllChats, getChatByChatId, getChatByUserId } from '../controllers/chatController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
const router = express.Router();

// user routes
router.get('/', checkName, getAllUsers);
router.post('/new', checkName, createUser);
router.get('/id/:id', checkName, getUserById);

// chat routes
router.get('/chat', getAllChats);
router.get('/chat/:id', getChatByChatId);
router.get('/chat/user/:id', getChatByUserId);
router.post('/message/new', createMessage);

export default router;
