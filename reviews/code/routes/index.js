import express from 'express';
import cors from 'cors';
import * as reviewsController from '../controllers/reviewsController.js';
const router = express.Router();

router.get('/', cors(), reviewsController.getReviews);

router.post('/create', cors(), reviewsController.createReview);

router.get('/review/:reviewid', cors(), reviewsController.getReview);
router.get('/user/:userid', cors(), reviewsController.getReviewsByUserID);
router.get('/recipe/:recipeid', cors(), reviewsController.getReviewsByRecipeID);

// Has to be fixed
router.put('/update/:reviewid/:userid', cors(), reviewsController.updateReview);

router.delete('/delete/:reviewid/:userid', cors(), reviewsController.deleteReview);

export default router;
