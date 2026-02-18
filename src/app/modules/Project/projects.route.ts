import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { ProjectValidation } from './projects.validation';
import { ProjectsController } from './project.controller';
import { CloudinaryFileUploader } from '../../middlewares/cloudinaryMulterMiddleware';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
    '/',
    auth('ADMIN'),
    CloudinaryFileUploader.uploadFields, // multipart/form-data → image upload
    validateRequest(ProjectValidation.createProjectSchema, {
        image: 'single',
    }),
    ProjectsController.createProject,
);

router.get('/get-my-project', ProjectsController.getAllMyProjects);

router.patch(
    '/:projectId',
    // fileUploader.upload.single('file'),
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

router.get('/:projectId', ProjectsController.getSingleProject);

router.delete('/:projectId', auth('ADMIN'), ProjectsController.deleteProject);

export const ProjectsRoutes = router;
