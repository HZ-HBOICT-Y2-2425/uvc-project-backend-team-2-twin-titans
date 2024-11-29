import express from 'express';
import { responseExample, updateExample, responseByIdExample } from '../controllers/exampleController.js';
import { checkName } from '../middleware/exampleMiddleware.js';
import { getAllRecipes, getRecipeById, test } from '../controllers/recipesController.js';
const router = express.Router();

// routes
router.get('/test', checkName, test);
router.get('/', (req, res, next) => {
  res.json('hi');
});
router.get('/example', checkName, responseExample);
router.post('/example', checkName, updateExample);
router.get('/example/:id', checkName, responseByIdExample);

// recipes routes
router.get('/recipes', checkName, getAllRecipes);
router.get('/recipes/:id', checkName, getRecipeById);
export default router;
