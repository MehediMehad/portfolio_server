import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import { catchAsync } from '../../../shared/catchAsync';
import { BlogServices } from './blog.service';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';

const createBlogIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await BlogServices.createBlog(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Blog created successfully',
        data: result,
    });
});

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query, ['searchTerm', 'tags']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await BlogServices.getAllBlogs(filter, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Blogs fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});

const getBlogDetailsById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const result = await BlogServices.getBlogDetailsById(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Blog fetched successfully',
        data: result,
    });
});

const updateBlogById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const result = await BlogServices.updateBlogById(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Blog updated successfully',
        data: result,
    });
});

const softDeleteBlog = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await BlogServices.softDeleteBlog(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Blog deleted successfully',
    });
});

export const BlogControllers = {
    createBlogIntoDB,
    getAllBlogs,
    getBlogDetailsById,
    updateBlogById,
    softDeleteBlog,
};
