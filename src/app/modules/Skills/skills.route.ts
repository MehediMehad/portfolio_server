import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { fileUploader } from '../../../helpers/fileUploader';
import { SkillsValidation } from './skills.validation';
import { SkillsController } from './skills.controller';

const router = express.Router();

router.post(
    '/',
    auth('ADMIN'),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = SkillsValidation.createSkillSchema.parse(
                JSON.parse(req.body.data)
            );

            return SkillsController.createSkill(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    '/get-my-skills',
    auth('ADMIN', 'USER'),
    SkillsController.getAllMySkills
);

router.delete('/:skillId', auth('USER'), SkillsController.deleteSkill);

router.patch(
    '/',
    fileUploader.upload.single('file'),
    auth('ADMIN'),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = SkillsValidation.updatedSkillSchema.parse(
                JSON.parse(req.body.data)
            );
            return SkillsController.updateSkill(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

export const SkillsRoutes = router;
