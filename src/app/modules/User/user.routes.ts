import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { fileUploader } from '../../../helpers/fileUploader';
import { UserValidation } from './user.validation';
import { USER_ROLE } from './user.constant';
import { validateRequest } from '../../middlewares/validateRequest';

const router = express.Router();

router.get('/', auth(USER_ROLE.ADMIN), UserController.getAllFromDB);

router.get(
    '/non-participants/:eventId',
    // auth("ADMIN", "USER"),
    UserController.getNonParticipants
);

router.post(
    '/registration',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.registration.parse(JSON.parse(req.body.data));
        return UserController.registrationNewUser(req, res, next);
    }
);
router.put(
    '/update-profile',
    fileUploader.upload.single('file'),
    auth("ADMIN", "USER"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.updateProfile.parse(
            JSON.parse(req.body.data)
        );
        return UserController.updateUserProfile(req, res, next);
    }
);

router.patch(
    '/:id/status',
    auth(USER_ROLE.ADMIN),
    validateRequest(UserValidation.updateStatus),
    UserController.changeProfileStatus
);
router.get('/me', auth('ADMIN', 'USER'), UserController.getMyInfo);
router.get('/get-my-dashboard-info', auth('ADMIN', 'USER'), UserController.getMyDashboardInfo);
router.get('/get-admin-dashboard-info', auth('ADMIN', 'USER'), UserController.getAdminDashboardInfo);
router.get('/admin/users', UserController.getAllUsersWithStats);

export const UserRoutes = router;
