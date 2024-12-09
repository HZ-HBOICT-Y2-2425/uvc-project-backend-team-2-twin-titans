import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
const router = express.Router();

// create a proxy for each microservice
const microserviceProxy = createProxyMiddleware({
  target: 'http://microservice:3011',
  changeOrigin: true
});

const recipesProxy = createProxyMiddleware({
  target: 'http://recipes:3014',
  changeOrigin: true
});

const userProxy = createProxyMiddleware({
  target: 'http://user:3012',
  changeOrigin: true
})

const productsProxy = createProxyMiddleware({
  target: 'http://products:3013',
  changeOrigin: true
})

const categoriesProxy = createProxyMiddleware({
  target: 'http://categories:3015',
  changeOrigin: true
})

const reviewsProxy = createProxyMiddleware({
  target: 'http://reviews:3016',
  changeOrigin: true
})

router.use('/microservice', microserviceProxy);
router.use('/user', userProxy);
router.use('/products', productsProxy);
router.use('/categories', categoriesProxy);
router.use('/reviews', reviewsProxy);

router.use('/microservice', microserviceProxy);
router.use('/recipes', recipesProxy);
export default router;
