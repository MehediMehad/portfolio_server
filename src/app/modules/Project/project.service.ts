import prisma from '../../../shared/prisma';
import { Request } from 'express';
import ApiError from '../../errors/APIError';
import httpStatus from 'http-status';
import { IFile } from '../../interface/file';
import { fileUploader } from '../../../helpers/fileUploader';
import { ProjectStatus } from '@prisma/client';

const createProject = async (req: Request) => {
    // Destructure required fields from request body
    const {
        title,
        overview,
        description,
        date_time,
        techStack,
        features,
        whatILearned,
        futureImprovements,
        liveURL,
        gitHubURL
    } = req.body;

    // Handle image upload
    const file = req.file as IFile;
    if (!file) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Project image is required');
    }

    if (file) {
        const uploadResult = await fileUploader.uploadToCloudinary(file);
        req.body.projectImage = uploadResult?.secure_url;
    }

    // Check if project with this title already exists (optional)
    const existingProject = await prisma.projects.findFirst({
        where: {
            title,
            authorId: req.user.userId
        }
    });

    if (existingProject) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            'A project with this title already exists'
        );
    }

    // Create the project
    return await prisma.projects.create({
        data: {
            projectImage: req.body.projectImage,
            title,
            overview,
            description,
            date_time,
            techStack,
            features,
            whatILearned,
            futureImprovements,
            liveURL,
            gitHubURL,
            is_public: true,
            heroSection: true,
            status: ProjectStatus.PUBIC,
            author: {
                connect: {
                    id: req.user.userId
                }
            }
        }
    });
};

const getAllMyProjects = async (userId: string) => {
    const project = await prisma.projects.findMany({
        where: {
            authorId: userId
        }
    });
    if (!project) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Project Not Found');
    }

    return project;
};

const deleteProject = async (projectId: string) => {
    const project = await prisma.projects.findFirst({
        where: {
            id: projectId
        }
    });

    if (!project) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            'Skill not found or unauthorized'
        );
    }

    await prisma.projects.delete({
        where: {
            id: projectId
        }
    });

    return {
        message: 'Project deleted successfully'
    };
};

const updateProject = async (userId: string, req: Request) => {
    const { skillId, name, level } = req.body;
    console.log('req.body', req.body);

    if (!skillId) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Skill ID is required');
    }

    const file = req.file as IFile;
    if (file) {
        const fileUploadToCloudinary =
            await fileUploader.uploadToCloudinary(file);

        req.body.icon = fileUploadToCloudinary?.secure_url;
    }

    const skill = await prisma.skills.findFirst({
        where: {
            id: skillId,
            userId: userId
        }
    });

    if (!skill) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            'Skill not found or unauthorized'
        );
    }

    return await prisma.skills.update({
        where: {
            id: skillId
        },
        data: {
            name,
            level,
            icon: req.body.icon
        }
    });
};

export const ProjectsService = {
    createProject,
    getAllMyProjects,
    updateProject,
    deleteProject
};
