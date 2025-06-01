import prisma from '../../../shared/prisma';
import { Request } from 'express';
import ApiError from '../../errors/APIError';
import httpStatus from 'http-status';
import { IFile } from '../../interface/file';
import { fileUploader } from '../../../helpers/fileUploader';
import { ProjectStatus } from '@prisma/client';

const createProject = async (req: Request) => {
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

const getSingleProject = async (projectId: string) => {
    const project = await prisma.projects.findFirst({
        where: {
            id: projectId
        }
    });

    if (!project) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            'Project not found or unauthorized'
        );
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
    const {} = req.body;

    const file = req.file as IFile;
    if (file) {
        const fileUploadToCloudinary =
            await fileUploader.uploadToCloudinary(file);

        req.body.projectImage = fileUploadToCloudinary?.secure_url;
    }
    const project = await prisma.projects.findFirst({
        where: {
            id: req.body.projectId,
            authorId: userId
        }
    });
    if (!project) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            'Project not found or unauthorized'
        );
    }
    const updatedProject = await prisma.projects.update({
        where: {
            id: req.params.projectId
        },
        data: {
            title: req.body.title,
            overview: req.body.overview,
            description: req.body.description,
            date_time: req.body.date_time,
            techStack: req.body.techStack,
            features: req.body.features,
            whatILearned: req.body.whatILearned,
            futureImprovements: req.body.futureImprovements,
            liveURL: req.body.liveURL,
            gitHubURL: req.body.gitHubURL,
            projectImage: req.body.projectImage
        }
    });

    return updatedProject;
};

export const ProjectsService = {
    createProject,
    getAllMyProjects,
    updateProject,
    deleteProject,
    getSingleProject
};
