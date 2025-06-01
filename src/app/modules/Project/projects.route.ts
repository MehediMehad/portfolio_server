import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { fileUploader } from '../../../helpers/fileUploader';
import { ProjectValidation } from './projects.validation';
import { ProjectsController } from './project.controller';

const router = express.Router();

router.post(
    '/',
    auth('ADMIN'),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = ProjectValidation.createProjectSchema.parse(
                JSON.parse(req.body.data)
            );

            return ProjectsController.createProject(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    '/get-my-project',
    auth('ADMIN', 'USER'),
    ProjectsController.getAllMyProjects
);

router.patch(
    '/:projectId',
    fileUploader.upload.single('file'),
    auth('ADMIN'),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = ProjectValidation.updatedProjectsSchema.parse(
                JSON.parse(req.body.data)
            );
            return ProjectsController.updateProject(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

router.delete('/:projectId', auth('ADMIN'), ProjectsController.deleteProject);

export const ProjectsRoutes = router;
