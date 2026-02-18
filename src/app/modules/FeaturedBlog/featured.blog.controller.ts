import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { FeaturedBlogServices } from './featured.blog.service';
import sendResponse from '../../../shared/sendResponse';

const addFeatured = catchAsync(async (req: Request, res: Response) => {
    const blogId = req.params.blogId as string;

    const result = await FeaturedBlogServices.addFeaturedBlog(blogId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Blog marked as featured',
        data: result,
    });
});

const removeFeatured = catchAsync(async (req: Request, res: Response) => {
    const blogId = req.params.blogId as string;

    await FeaturedBlogServices.removeFeaturedBlog(blogId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Featured blog removed',
    });
});

const getFeatured = catchAsync(async (_req: Request, res: Response) => {
    const result = await FeaturedBlogServices.getAllFeaturedBlogs();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Featured blogs fetched successfully',
        data: result,
    });
});

export const FeaturedBlogControllers = {
    addFeatured,
    removeFeatured,
    getFeatured,
};
