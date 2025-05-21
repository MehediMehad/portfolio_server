import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ReviewsService, UpdateReviewData } from './review.service';

const sendReview = catchAsync(async (req: Request, res: Response) => {
    const result = await ReviewsService.sendReview(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review sent successfully!',
        data: result
    });
});

const getReview = catchAsync(async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const result = await ReviewsService.getReview(eventId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review get successfully!',
        data: result
    });
});

const getMyReview = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const result = await ReviewsService.getMyReview(userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'My Review get successfully!',
        data: result
    });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { reviewId } = req.params;

    const result = await ReviewsService.deleteReview(userId, reviewId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: result.message,
        data: null
    });
});

// src/controllers/reviewController.ts

const updateReview = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const body = req.body;
    const data = {
        rating: body?.rating,
        comment: body?.comment
    };

    const result = await ReviewsService.updateReview(
        req.body.reviewId,
        userId,
        data
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review updated successfully',
        data: result
    });
});

export const ReviewsController = {
    sendReview,
    getReview,
    getMyReview,
    deleteReview,
    updateReview
};
