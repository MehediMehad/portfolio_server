import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SocialMediasService } from './social.media.service';

// Create SocialMedia
const createSocialMedia = catchAsync(async (req: Request, res: Response) => {
    const result = await SocialMediasService.createSocialMedia(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'SocialMedia created successfully!',
        data: result
    });
});

// Get All My SocialMedias
const getAllMySocialMedias = catchAsync(async (req: Request, res: Response) => {
    const result = await SocialMediasService.getAllMySocialMedias();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'SocialMedias fetched successfully!',
        data: result
    });
});

// Update SocialMedia
const updateSocialMedia = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const result = await SocialMediasService.updateSocialMedia(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'SocialMedia updated successfully',
        data: result
    });
});

// Delete SocialMedia
const deleteSocialMedia = catchAsync(async (req: Request, res: Response) => {
    const socialMediaId: string = req.params.socialMediaId as string;

    const result = await SocialMediasService.deleteSocialMedia(socialMediaId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: result.message,
        data: null
    });
});

export const SocialMediasController = {
    createSocialMedia,
    getAllMySocialMedias,
    deleteSocialMedia,
    updateSocialMedia
};
