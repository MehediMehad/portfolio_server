import { Router } from 'express';
import auth from '../../middlewares/auth';
import { FeaturedProjectControllers } from './featured.project.controller';

const router = Router();

router.post(
    '/:projectId',
    auth('ADMIN'),
    FeaturedProjectControllers.addFeatured,
);

router.delete(
    '/:projectId',
    auth('USER'),
    FeaturedProjectControllers.removeFeatured,
);

router.get(
    '/',
    FeaturedProjectControllers.getFeatured,
);

export const FeaturedProjectRoutes = router;
