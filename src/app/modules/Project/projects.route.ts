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

router.get('/', ProjectsController.getAllProjects);

router.patch(
    '/:id',
    auth('ADMIN'),
    CloudinaryFileUploader.uploadFields, // multipart/form-data → image upload
    validateRequest(ProjectValidation.updatedProjectsSchema, {
        image: 'single',
    }),
    ProjectsController.updateProjectById,
);

router.get('/:id', ProjectsController.getSingleProject);

router.delete('/:id', auth('ADMIN'), ProjectsController.deleteProject);

export const ProjectsRoutes = router;
