import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { fileUploader } from '../../../helpers/fileUploader';
import { BlogsController } from './blog.controller';
import { BlogsValidation } from './blog.validation';
const router = express.Router();

router.post(
    '/',
    auth('ADMIN'),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = BlogsValidation.createBlogSchema.parse(
                JSON.parse(req.body.data)
            );

            return BlogsController.createBlog(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    '/get-my-blogs',
    auth('ADMIN', 'USER'),
    BlogsController.getAllMyBlogs
);

export const BlogsRoutes = router;
