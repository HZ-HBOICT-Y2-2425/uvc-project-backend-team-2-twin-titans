import express from 'express';
import cors from 'cors';
import * as categoriesController from '../controllers/categoriesController.js';
const router = express.Router();

router.get('/', cors(), categoriesController.getCategories);
router.get('/consumables', cors(), categoriesController.getConsumables);
router.get('/allergies', cors(), categoriesController.getAllergies);
router.get('/consumables/:consumableid', cors(), categoriesController.getConsumableByID);
router.get('/allergies/:allergyid', cors(), categoriesController.getAllergyByID);

export default router;
