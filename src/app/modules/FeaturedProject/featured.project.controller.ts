import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { FeaturedProjectServices } from './featured.project.service';
import sendResponse from '../../../shared/sendResponse';

const addFeatured = catchAsync(async (req: Request, res: Response) => {
    const projectId = req.params.projectId as string;

    const result = await FeaturedProjectServices.addFeaturedProject(projectId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Project marked as featured',
        data: result,
    });
});

const removeFeatured = catchAsync(async (req: Request, res: Response) => {
    const projectId = req.params.projectId as string;

    await FeaturedProjectServices.removeFeaturedProject(projectId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Featured project removed',
    });
});

const getFeatured = catchAsync(async (_req: Request, res: Response) => {
    const result = await FeaturedProjectServices.getAllFeaturedProjects();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Featured projects fetched successfully',
        data: result,
    });
});

export const FeaturedProjectControllers = {
    addFeatured,
    removeFeatured,
    getFeatured,
};
