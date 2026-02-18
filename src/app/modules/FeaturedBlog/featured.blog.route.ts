import { Router } from 'express';
import auth from '../../middlewares/auth';
import { FeaturedBlogControllers } from './featured.blog.controller';

const router = Router();

router.post(
    '/:blogId',
    auth('ADMIN'),
    FeaturedBlogControllers.addFeatured,
);

router.delete(
    '/:blogId',
    auth('ADMIN'),
    FeaturedBlogControllers.removeFeatured,
);

router.get(
    '/',
    FeaturedBlogControllers.getFeatured,
);

export const FeaturedBlogRoutes = router;
