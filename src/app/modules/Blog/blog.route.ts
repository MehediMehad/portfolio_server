import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BlogControllers } from './blog.controller';
import { BlogValidations } from './blog.validation';
import { CloudinaryFileUploader } from '../../middlewares/cloudinaryMulterMiddleware';

const router = Router();

router.post(
    '/',
    auth('ADMIN'),
    CloudinaryFileUploader.uploadFields, // multipart/form-data → image upload
    validateRequest(BlogValidations.createBlogSchema, {
        image: 'single',
    }),
    BlogControllers.createBlogIntoDB,
);


router.get('/', BlogControllers.getAllBlogs);

router.get('/:id', BlogControllers.getBlogDetailsById);

router.patch(
    '/:id',
    auth('ADMIN'),
    CloudinaryFileUploader.uploadFields, // multipart/form-data → image upload
    validateRequest(BlogValidations.updateBlogSchema, {
        image: 'single',
    }),
    BlogControllers.updateBlogById,
);

router.delete(
    '/:id',
    auth('ADMIN'),
    BlogControllers.softDeleteBlog,
);

export const BlogRoutes = router;

