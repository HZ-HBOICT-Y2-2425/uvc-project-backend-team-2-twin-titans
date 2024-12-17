import express from 'express';
import cors from 'cors';
import * as productsController from '../controllers/productsController.js';
import * as productsMiddleware from '../middleware/productsMiddleware.js';

const router = express.Router();

router.get('/', cors(), productsController.getProducts);

router.post('/create', cors(), productsMiddleware.handleImageUpload, productsController.createProduct);

router.get('/product/image/:imagename', cors(), productsController.getImage);

router.get('/product/:productid', cors(), productsController.getProduct);

router.get('/user/:userid', cors(), productsController.getProductsByUserID);

router.put('/update/:productid/:userid', cors(), productsMiddleware.handleImageUpload, productsController.updateProduct);

router.delete('/delete/:productid/:userid', cors(), productsController.deleteProduct);

router.put('/unreserve/:productid/:userid', cors(), productsController.unreserveProduct);
router.put('/reserve/:productid/:userid/:reservedbyuserid', cors(), productsController.reserveProduct);

export default router;