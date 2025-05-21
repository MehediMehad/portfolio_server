import { Request, Response } from 'express';
import { UserService } from './user.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import { userFilterableFields } from './user.constant';
import pick from '../../../shared/pick';

const registrationNewUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.registrationNewUser(req);

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

const getAllUsersWithStats = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ['searchTerm']);
    const options = pick(req.query, ['page', 'limit']);
    const result = await UserService.getAllUsersWithStats(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users with stats fetched successfully!',
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

const getNonParticipants = catchAsync(async (req: Request, res: Response) => {
    const { eventId } = req.params;
    // const userId = req.user.userId;
    const result = await UserService.getNonParticipants(eventId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Non Participants user data fetched!',
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

const getMyDashboardInfo = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await UserService.getMyDashboardInfo(user.userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Dashboard data retrieved successfully!',
        data: result
    });
});

const getAdminDashboardInfo = catchAsync(
    async (req: Request, res: Response) => {
        const result = await UserService.getAdminDashboardInfo();

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Dashboard data retrieved successfully!',
            data: result
        });
    }
);

export const UserController = {
    getMyDashboardInfo,
    registrationNewUser,
    getAllFromDB,
    changeProfileStatus,
    getNonParticipants,
    updateUserProfile,
    getMyInfo,
    getAdminDashboardInfo,
    getAllUsersWithStats
};
