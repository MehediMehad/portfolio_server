import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ProjectsService } from './project.service';

// Create Skill
const createProject = catchAsync(async (req: Request, res: Response) => {
    const result = await ProjectsService.createProject(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Project created successfully!',
        data: result
    });
});

// Get All My Projects
const getAllMyProjects = catchAsync(async (req: Request, res: Response) => {
    const result = await ProjectsService.getAllMyProjects(req.user.userId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Project fetched successfully!',
        data: result
    });
});

// Update Skill
const updateProject = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const result = await ProjectsService.updateProject(userId, req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Project updated successfully',
        data: result
    });
});

// Delete Skill
const deleteProject = catchAsync(async (req: Request, res: Response) => {
    const { projectId } = req.params;

    const result = await ProjectsService.deleteProject(projectId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: result.message,
        data: null
    });
});

export const ProjectsController = {
    createProject,
    getAllMyProjects,
    updateProject,
    deleteProject
};
