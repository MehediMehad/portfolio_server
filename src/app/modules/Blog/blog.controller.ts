import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BlogsService } from './blog.service';

const createBlog = catchAsync(async (req: Request, res: Response) => {
    const result = await BlogsService.createBlog(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Blog created successfully!',
        data: result
    });
});

const getAllMyBlogs = catchAsync(async (req: Request, res: Response) => {
    const result = await BlogsService.getAllMyBlogs(req.user.userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Blogs fetched successfully!',
        data: result
    });
});

export const BlogsController = {
    createBlog,
    getAllMyBlogs
};
