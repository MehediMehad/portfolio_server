import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { fileUploader } from '../../../helpers/fileUploader';
import { EventsValidation } from './events.validation';
import { USER_ROLE } from '../User/user.constant';
import { EventsController } from './events.controller';
import { validateRequest } from '../../middlewares/validateRequest';

const router = express.Router();

router.get('/', EventsController.getAllUpcomingEvent);
router.get('/all-details', EventsController.getAllEventsDetailsPage);

router.get(
    '/my-events',
    auth('USER', 'ADMIN'),
    EventsController.getMyEventsFromDB
);

router.get('/:id', EventsController.getByIdFromDB);

router.post(
    '/',
    auth(USER_ROLE.USER, USER_ROLE.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = EventsValidation.createEvents.parse(
            JSON.parse(req.body.data)
        );
        return EventsController.createEvent(req, res, next);
    }
);

router.put(
    '/add-to-hero-section',
    auth("ADMIN", "USER"),
    EventsController.addHeroSection
);

router.put(
    '/:id',
    auth(USER_ROLE.USER),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = EventsValidation.updateEvent.parse(
            JSON.parse(req.body.data)
        );
        return EventsController.updateIntoDB(req, res, next);
    }
);


router.post(
    '/join-event',
    auth(USER_ROLE.USER),
    validateRequest(EventsValidation.joinEventSchema),
    EventsController.joinEvent
);


router.delete('/:id', auth('ADMIN', 'USER'), EventsController.deleteEvent);

export const EventRoutes = router;
