import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { fileUploader } from '../../../helpers/fileUploader';
import { UserValidation } from './user.validation';
import { USER_ROLE } from './user.constant';
import { validateRequest } from '../../middlewares/validateRequest';
import ApiError from '../../errors/APIError';

const router = express.Router();

router.post(
    '/create-admin',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createAdmin.parse(JSON.parse(req.body.data));
        return UserController.createMyAccount(req, res, next);
    }
);

// router.put(
//     '/update-profile',
//     fileUploader.upload.single('file'),
//     auth('ADMIN', 'USER'),
//     (req: Request, res: Response, next: NextFunction) => {
//         console.log(req.body)
//         req.body = UserValidation.updateProfile.parse(
//             JSON.parse(req.body.data)
//         );
//         return UserController.updateUserProfile(req, res, next);
//     }
// );

router.put(
    "/update-profile",
    fileUploader.upload.single("file"),
    auth("ADMIN", "USER"),
    async (req, res, next) => {
        try {
            console.log("BODY => ", req.body);
            console.log("FILE => ", req.file);

            if (!req.body.data) {
                throw new ApiError(400, "Profile data missing");
            }

            const parsedData = JSON.parse(req.body.data);

            req.body = UserValidation.updateProfile.parse(parsedData);

            return UserController.updateUserProfile(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/me', UserController.getMyInfo);

export const UserRoutes = router;
