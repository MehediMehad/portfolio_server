import { Request, Response } from 'express';
import { UserService } from './user.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';

const createMyAccount = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createMyAccount(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User created successfully!',
        data: result
    });
});

const updateUserProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const result = await UserService.updateUserProfile(userId, req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile updated successfully!',
        data: result
    });
});

const getMyInfo = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getMyInfo();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'My info retrieved successfully!',
        data: result
    });
});

export const UserController = {
    createMyAccount,
    updateUserProfile,
    getMyInfo
};
