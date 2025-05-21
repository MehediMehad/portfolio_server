import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { InvitationsService } from './invitation.service';
import { catchAsync } from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import ApiError from '../../errors/APIError';

const sendInviteUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { receiverId } = req.body;
    const { eventId } = req.params;
    if (!eventId) {
        throw new ApiError(httpStatus.NOT_FOUND, 'eventId not found');
    }

    const result = await InvitationsService.sendInviteUser(
        { receiverId, eventId },
        userId
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Invitation sent successfully!',
        data: result
    });
});

const myPendingNotification = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }
    const result = await InvitationsService.myPendingNotification(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Pending notifications fetched successfully!',
        data: result
    });
});

const getNotification = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }
    const result = await InvitationsService.getNotification(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'My Notifications fetched successfully!',
        data: result
    });
});

// invitation.controller.ts

const acceptDeclineInvitation = catchAsync(
    async (req: Request, res: Response) => {
        const { status, invitationId } = req.body; // 'ACCEPTED' or 'REJECTED'  
        const userId = req.user?.userId;

        if (!userId) {
            throw new ApiError(
                httpStatus.UNAUTHORIZED,
                'User not authenticated'
            );
        }

        if (!status || !['ACCEPTED', 'REJECTED'].includes(status)) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Valid status is required (ACCEPTED/REJECTED)'
            );
        }

        const result = await InvitationsService.acceptDeclineInvitation(
            invitationId,
            userId,
            status
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: `Invitation ${status.toLowerCase()} successfully!`,
            data: result
        });
    }
);

export const InvitationsController = {
    sendInviteUser,
    myPendingNotification,
    getNotification,
    acceptDeclineInvitation
};
