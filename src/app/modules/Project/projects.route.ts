import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { ProjectValidation } from './projects.validation';
import { ProjectsController } from './project.controller';
import { CloudinaryFileUploader } from '../../middlewares/cloudinaryMulterMiddleware';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

// POST METHOD
router.post(
    '/',
    auth('ADMIN'),
    CloudinaryFileUploader.uploadFields, // multipart/form-data → image upload
    validateRequest(ProjectValidation.createProjectSchema, {
        image: 'single',
    }),
    ProjectsController.createProject,
);

// GET METHOD
router.get('/', ProjectsController.getAllProjects);
router.get('/:id', ProjectsController.getSingleProject);

// PATCH METHOD
router.patch(
    '/:id',
    auth('ADMIN'),
    CloudinaryFileUploader.uploadFields,
    validateRequest(ProjectValidation.updatedProjectsSchema, {
        image: 'single',
    }),
    ProjectsController.updateProjectById,
);

router.patch(
    '/:id/soft-delete',
    auth('ADMIN'),
    ProjectsController.softDeleteProject
);


router.patch(
    '/:id/restore',
    auth('ADMIN'),
    ProjectsController.restoreProject
);


// DELETE METHOD
router.delete(
    '/:id',
    auth('ADMIN'),
    ProjectsController.hardDeleteProject
);




export const ProjectsRoutes = router;
