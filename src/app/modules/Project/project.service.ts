import prisma from '../../../shared/prisma';
import { Request } from 'express';
import ApiError from '../../errors/APIError';
import httpStatus from 'http-status';
import { IFile } from '../../interface/file';
import { TCreateProjectPayload } from './projects.interface';

const createProject = async (payload: TCreateProjectPayload) => {
    const result = await prisma.projects.create({
        data: payload,
    });

    return result;
};

const getAllMyProjects = async () => {
    const project = await prisma.projects.findMany();
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
    // const { } = req.body;

    // const file = req.file as IFile;
    // if (file) {
    //     const fileUploadToCloudinary =
    //         await fileUploader.uploadToCloudinary(file);

    //     req.body.projectImage = fileUploadToCloudinary?.secure_url;
    // }
    // const project = await prisma.projects.findFirst({
    //     where: {
    //         id: req.body.projectId,
    //         authorId: userId
    //     }
    // });
    // if (!project) {
    //     throw new ApiError(
    //         httpStatus.NOT_FOUND,
    //         'Project not found or unauthorized'
    //     );
    // }
    // const updatedProject = await prisma.projects.update({
    //     where: {
    //         id: req.params.projectId
    //     },
    //     data: {
    //         title: req.body.title,
    //         overview: req.body.overview,
    //         description: req.body.description,
    //         date_time: req.body.date_time,
    //         techStack: req.body.techStack,
    //         features: req.body.features,
    //         whatILearned: req.body.whatILearned,
    //         futureImprovements: req.body.futureImprovements,
    //         liveURL: req.body.liveURL,
    //         gitHubURL: req.body.gitHubURL,
    //         projectImage: req.body.projectImage
    //     }
    // });

    // return updatedProject;
};

export const ProjectsService = {
    createProject,
    getAllMyProjects,
    updateProject,
    deleteProject,
    getSingleProject
};
