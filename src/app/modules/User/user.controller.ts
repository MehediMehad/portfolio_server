import { Request, Response } from 'express';
import { UserService } from './user.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { userFilterableFields } from './user.constant';
import pick from '../../../shared/pick';

const createMyAccount = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createMyAccount(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User created successfully!',
        data: result
    });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await UserService.getAllFromDB(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users data fetched!',
        meta: result.meta,
        data: result.data
    });
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserService.changeProfileStatus(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users profile status changed!',
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
    const user = req.user;

    const result = await UserService.getMyInfo(user.userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User info retrieved successfully!',
        data: result
    });
});

export const UserController = {
    createMyAccount,
    getAllFromDB,
    changeProfileStatus,
    updateUserProfile,
    getMyInfo
};
