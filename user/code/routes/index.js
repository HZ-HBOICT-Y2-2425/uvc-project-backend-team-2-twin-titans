import express from 'express';
import { getAllUsers, createUser, getUserById, login, updateCo2ByUserId, updateUser } from '../controllers/userController.js';
import { createChat, getAllChats, getChatByChatId, getChatByUserId } from '../controllers/chatController.js';
import { createMessage, getAllMessagesByChatId } from '../controllers/messageController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
import cors from 'cors';
const router = express.Router();

// chat routes
router.get('/chat', cors(), getAllChats);
router.post('/chat', cors(), createChat);
router.get('/chat/:id', cors(), getChatByChatId);
router.get('/:id/chat', cors(), getChatByUserId);

// message routes
router.get('/chat/:id/message', cors(), getAllMessagesByChatId);
router.post('/chat/:id/message', cors(), createMessage);

// user routes
router.get('/', checkName, cors(), getAllUsers);
router.post('/', checkName, cors(), createUser);
router.get('/login', checkName, cors(), login);
router.patch('/:id/addco2', cors(), updateCo2ByUserId);
router.get('/:id', checkName, cors(), getUserById);
router.put('/:id', checkName, cors(), updateUser);

export default router;
