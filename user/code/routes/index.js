import express from 'express';
import { getAllUsers, createUser, getUserById } from '../controllers/userController.js';
import { createChat, createMessage, getAllChats, getChatByChatId, getChatByUserId } from '../controllers/chatController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
const router = express.Router();

// chat routes
router.get('/chat', getAllChats);
router.post('/chat', createChat);
router.get('/chat/:id', getChatByChatId);
router.get('/chat/user/:id', getChatByUserId);

// message routes
router.post('/message', createMessage);

// user routes
router.get('/', checkName, getAllUsers);
router.post('/', checkName, createUser);
router.get('/:id', checkName, getUserById);

export default router;
