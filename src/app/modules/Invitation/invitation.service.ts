import { InvitationStatus } from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../errors/APIError';
import httpStatus from 'http-status';

interface SendInviteUserParams {
    receiverId: string;
    eventId: string;
}

const sendInviteUser = async (
    payload: SendInviteUserParams,
    senderId: string
) => {
    const { receiverId, eventId } = payload;

    // Check if event exists
    const event = await prisma.events.findUnique({
        where: { id: eventId }
    });

    if (!event) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Event not found');
    }

    // Check if user exists
    const receiver = await prisma.user.findUnique({
        where: { id: receiverId }
    });

    if (!receiver) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Receiver not found');
    }

    // Check if already invited
    const existingInvite = await prisma.invitation.findFirst({
        where: {
            receiverId,
            event_id: eventId
        }
    });

    if (existingInvite) {
        throw new ApiError(httpStatus.CONFLICT, 'Already invited');
    }

    // Create invitation
    const invitation = await prisma.invitation.create({
        data: {
            senderId,
            receiverId,
            event_id: eventId,
            status: InvitationStatus.PENDING
        }
    });

    return invitation;
};

const myPendingNotification = async (userId: string) => {
    const pendingInvitations = await prisma.invitation.findMany({
        where: {
            receiverId: userId,
            status: InvitationStatus.PENDING // or InvitationStatus.PENDING if you are using enum
        },
        include: {
            sender: true,
            event: true
        },
        orderBy: {
            invited_at: 'desc' // Newest first
        }
    });

    return pendingInvitations;
};

const getNotification = async (userId: string) => {
    const getNotification = await prisma.invitation.findMany({
        where: {
            receiverId: userId,
            NOT: {
                status: 'PENDING'
            }
        },
        include: {
            sender: true,
            event: true
        },
        orderBy: {
            invited_at: 'desc' // Newest first
        }
    });

    return getNotification;
};

const acceptDeclineInvitation = async (
    invitationId: string,
    userId: string,
    status: string
) => {
    // Check if the invitation exists and receiver is this user
    const invitation = await prisma.invitation.findFirst({
        where: {
            id: invitationId,
            receiverId: userId
        }
    });

    if (!invitation) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            'Invitation not found or you are not authorized to respond.'
        );
    }

    // Convert string to enum
    const enumStatus = status as InvitationStatus;

    // Update the status and respondedAt timestamp
    const updatedInvitation = await prisma.invitation.update({
        where: {
            id: invitationId
        },
        data: {
            status: enumStatus
        },
        include: {
            sender: true,
            event: true
        }
    });

    return updatedInvitation;
};

export const InvitationsService = {
    sendInviteUser,
    myPendingNotification,
    getNotification,
    acceptDeclineInvitation
};
