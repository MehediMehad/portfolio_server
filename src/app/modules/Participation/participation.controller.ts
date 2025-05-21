import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ParticipationService } from './participation.service';
import ApiError from '../../errors/APIError';

const participationStatusUpdate = catchAsync(
    async (req: Request, res: Response) => {
        const { userId, eventId, status } = req.body;

        if (!userId || !eventId || !status) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'userId, eventId and status are required'
            );
        }

        const result = await ParticipationService.participationStatusUpdate(
            userId,
            eventId,
            status
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Participation Status Updated successfully!',
            data: result
        });
    }
);

export const ParticipationController = {
    participationStatusUpdate
};
