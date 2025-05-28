import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { fileUploader } from '../../../helpers/fileUploader';
import { SocialMediasController } from './social.media.controller';
import { SocialMediasValidation } from './social.media.validation';

const router = express.Router();

router.post(
    '/',
    auth('ADMIN'),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = SocialMediasValidation.createSocialMediaSchema.parse(
                JSON.parse(req.body.data)
            );
            return SocialMediasController.createSocialMedia(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    '/get-all-my-social-medias',
    auth('ADMIN', 'USER'),
    SocialMediasController.getAllMySocialMedias
);

router.patch(
    '/',
    fileUploader.upload.single('file'),
    auth('ADMIN'),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = SocialMediasValidation.updatedSocialMediaSchema.parse(
                JSON.parse(req.body.data)
            );
            return SocialMediasController.updateSocialMedia(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

router.delete(
    '/:socialMediaId',
    auth('ADMIN'),
    SocialMediasController.deleteSocialMedia
);

export const SocialMediasRoutes = router;
