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
    const result = await BlogsService.getAllMyBlogs();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Blogs fetched successfully!',
        data: result
    });
});

const getSingleBlog = catchAsync(async (req: Request, res: Response) => {
    const { blogId } = req.params;
    const result = await BlogsService.getSingleBlog(blogId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Blog fetched successfully!',
        data: result
    });
});

const updateMyBlogs = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const result = await BlogsService.updateMyBlogs(userId, req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Blog updated successfully!',
        data: result
    });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
    const { blogId } = req.params;
    const userId = req.user.userId;

    const result = await BlogsService.deleteBlog(blogId, userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: result.message,
        data: null
    });
});

export const BlogsController = {
    createBlog,
    getAllMyBlogs,
    getSingleBlog,
    updateMyBlogs,
    deleteBlog
};
