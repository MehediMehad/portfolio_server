import ApiError from '../../errors/APIError';
import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { ParticipationStatus } from '@prisma/client';

const participationStatusUpdate = async (
    userId: string,
    eventId: string,
    status: string
) => {
    // Check if status is valid
    if (
        !Object.values(ParticipationStatus).includes(
            status as ParticipationStatus
        )
    ) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            `Invalid status. Allowed values: ${Object.values(ParticipationStatus).join(', ')}`
        );
    }

    // Convert string to enum
    const enumStatus = status as ParticipationStatus;

    // Check if participation exists
    const existingParticipation = await prisma.participation.findUnique({
        where: {
            userId_eventId: {
                userId,
                eventId
            }
        }
    });

    if (!existingParticipation) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Participation not found');
    }

    // Update the status
    const updatedParticipation = await prisma.participation.update({
        where: {
            userId_eventId: {
                userId,
                eventId
            }
        },
        data: {
            status: enumStatus
        }
    });

    return updatedParticipation;
};

export const ParticipationService = {
    participationStatusUpdate
};
