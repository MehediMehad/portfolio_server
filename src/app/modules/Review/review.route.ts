import express from 'express';
import { ReviewsController } from './review.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { validateRequest } from '../../middlewares/validateRequest';
import { ReviewsValidation } from './review.validation';

const router = express.Router();

router.post(
    '/',
    auth('USER', 'ADMIN'),
    validateRequest(ReviewsValidation.createReviewSchema),
    ReviewsController.sendReview
);

router.get(
    '/get-my-review',
    auth('USER', 'ADMIN'),
    ReviewsController.getMyReview
);
router.get(
    '/single/:eventId',
    auth('USER', 'ADMIN'),
    ReviewsController.getReview
);
router.delete(
    '/:reviewId',
    auth('USER', 'ADMIN'),
    ReviewsController.deleteReview
);
router.patch(
    '/',
    auth('USER', 'ADMIN'),
    ReviewsController.updateReview
);

export const ReviewsRoutes = router;
