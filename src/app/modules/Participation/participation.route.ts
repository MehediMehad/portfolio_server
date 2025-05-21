import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { ParticipationController } from './participation.controller';

const router = express.Router();

router.put(
    '/status-update',
    auth('ADMIN', 'USER'),
    ParticipationController.participationStatusUpdate
);

export const ParticipationRoutes = router;
