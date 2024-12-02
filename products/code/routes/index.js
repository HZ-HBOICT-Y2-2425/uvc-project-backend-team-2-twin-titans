import express from 'express';
import cors from 'cors';
import * as productsController from '../controllers/productsController.js';
const router = express.Router();

router.get('/', cors(), productsController.getProducts);
router.post('/create', cors(), productsController.createProduct);

router.post('/test', cors(), productsController.test);

router.get('/user/:userid', cors(), productsController.getProductsByUserID);
router.get('/product/:productid', cors(), productsController.getProduct);
router.put('/reserve/:userid/:productid', cors(), productsController.reserveProduct);
router.put('/update/:userid/:productid', cors(), productsController.updateProduct);
router.delete('/delete/:userid/:productid', cors(), productsController.deleteProduct);

export default router;
