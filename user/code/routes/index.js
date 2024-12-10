import express from 'express';
import { getAllUsers, createUser, getUserById, login, updateCo2ByUserId, updateUser } from '../controllers/userController.js';
import { createChat, getAllChats, getChatByChatId, getChatByUserId } from '../controllers/chatController.js';
import { createMessage, getAllMessagesByChatId } from '../controllers/messageController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
import { addToShoppingCart, deleteItemInCart, getShoppingCartByUserId, updateShoppingCartItem } from '../controllers/cartController.js';
const router = express.Router();

// chat routes
router.get('/chat', getAllChats);
router.post('/chat', createChat);
router.get('/chat/:id', getChatByChatId);
router.get('/:id/chat', getChatByUserId);

// message routes
router.get('/chat/:id/message', getAllMessagesByChatId);
router.post('/chat/:id/message', createMessage);

// shopping cart routes
router.get('/:id/cart', getShoppingCartByUserId);
router.post('/:id/cart', addToShoppingCart);
router.patch('/:id/cart/:itemId', updateShoppingCartItem);
router.delete('/:id/cart/:itemId', deleteItemInCart);

// user routes
router.get('/', checkName, getAllUsers);
router.post('/', checkName, createUser);
router.get('/login', checkName, login);
router.patch('/:id/addco2', updateCo2ByUserId);
router.get('/:id', checkName, getUserById);
router.patch('/:id', checkName, updateUser);

export default router;
