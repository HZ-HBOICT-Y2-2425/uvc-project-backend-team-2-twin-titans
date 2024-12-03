import express from 'express';
import cors from 'cors';
import * as productsController from '../controllers/productsController.js';
const router = express.Router();
router.use(cors());

router.get('/', cors(), productsController.getProducts);

router.post('/create', cors(), productsController.createProduct);

router.get('/user/:userid', cors(), productsController.getProductsByUserID);

router.get('/producten', productsController.getProducts);

router.get('/product/:productid', cors(), productsController.getProduct);

router.put('/update/:productid/userid', cors(), productsController.updateProduct);

router.delete('/delete/:productid/:userid', cors(), productsController.deleteProduct);

router.put('/unreserve/:productid/:userid', cors(), productsController.unreserveProduct);
router.put('/reserve/:productid/:userid/:reservedbyuserid', cors(), productsController.reserveProduct);

export default router;
