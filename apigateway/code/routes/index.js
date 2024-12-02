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

router.use('/microservice', microserviceProxy);
router.use('/recipes', recipesProxy);
export default router;
