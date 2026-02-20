import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ProjectServices } from './project.service';
import pick from '../../../shared/pick';

const createProject = catchAsync(async (req: Request, res: Response) => {
    const result = await ProjectServices.createProject(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Project created successfully!',
        data: result
    });
});

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query, ['searchTerm', 'techStack', 'is_public']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await ProjectServices.getAllProjects(filter, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Projects fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});

// get single project by id
const getSingleProject = catchAsync(async (req: Request, res: Response) => {
    const projectId = req.params.id as string;
    const result = await ProjectServices.getSingleProject(projectId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Project fetched successfully!',
        data: result
    });
});

const updateProjectById = catchAsync(async (req: Request, res: Response) => {
    const projectId = req.params.id as string;
    const body = req.body;
    const result = await ProjectServices.updateProjectById(projectId, body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Project updated successfully',
        data: result
    });
});

const softDeleteProject = catchAsync(async (req: Request, res: Response) => {
    const projectId = req.params.id as string;

    const result = await ProjectServices.softDeleteProject(projectId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Project soft deleted successfully',
        data: result
    });
});

const restoreProject = catchAsync(async (req: Request, res: Response) => {
    const projectId = req.params.id as string;

    const result = await ProjectServices.restoreProject(projectId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Project restored successfully',
        data: result
    });
});

const hardDeleteProject = catchAsync(async (req: Request, res: Response) => {
    const projectId = req.params.id as string;

    const result = await ProjectServices.hardDeleteProject(projectId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Project restored successfully',
        data: result
    });
});


export const ProjectsController = {
    createProject,
    getAllProjects,
    getSingleProject,
    updateProjectById,
    softDeleteProject,
    restoreProject,
    hardDeleteProject
};
