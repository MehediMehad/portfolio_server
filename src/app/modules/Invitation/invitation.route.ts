import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { validateRequest } from '../../middlewares/validateRequest';
import { InvitationsController } from './invitation.controller';
import { InvitationSValidation } from './invitation.validation';

const router = express.Router();

router.get(
    '/my-pending-notification',
    auth('ADMIN', 'USER'),
    InvitationsController.myPendingNotification
);

router.get(
    '/get-notification',
    auth('ADMIN', 'USER'),
    InvitationsController.getNotification
);

router.post(
    '/:eventId/invite',
    auth('ADMIN', 'USER'),
    validateRequest(InvitationSValidation.sendInviteUserValidationSchema),
    InvitationsController.sendInviteUser
);

router.put(
    '/respond',
    auth('ADMIN', 'USER'),
    InvitationsController.acceptDeclineInvitation
);

export const InvitationsRoutes = router;
