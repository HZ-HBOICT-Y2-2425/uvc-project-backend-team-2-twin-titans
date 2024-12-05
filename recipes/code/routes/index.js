import express from 'express';
import { checkName } from '../middleware/exampleMiddleware.js';
import cors from 'cors';
import { getAllRecipes, getRecipeById } from '../controllers/recipesController.js';
const router = express.Router();

// recipes routes
router.get('/', cors(), checkName, getAllRecipes);
router.get('/:id', cors(), checkName, getRecipeById);
export default router;
