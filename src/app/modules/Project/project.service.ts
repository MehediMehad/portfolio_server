import prisma from '../../../shared/prisma';
import { Request } from 'express';
import ApiError from '../../errors/APIError';
import httpStatus from 'http-status';
import { IFile } from '../../interface/file';
import { TCreateProjectPayload, TProjectsFilter, TUpdateProjectPayload } from './projects.interface';
import { Prisma } from '@prisma/client';
import { IPaginationOptions } from '../../interface/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';

const createProject = async (payload: TCreateProjectPayload) => {
    const result = await prisma.projects.create({
        data: payload,
    });

    return result;
};


const getAllProjects = async (
    filter: TProjectsFilter,
    options: IPaginationOptions,
) => {
    const { searchTerm, techStack, is_public } = filter;
    const { limit, page, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(options);

    const andConditions: Prisma.ProjectsWhereInput[] = [
        { isDeleted: false },
    ];

    // 🔍 Search by title + overview
    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    overview: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
            ],
        });
    }

    // ⚙️ Filter by techStack
    if (techStack) {
        andConditions.push({
            techStack: {
                has: techStack,
            },
        });
    }

    // 🔓 Filter public/private
    if (typeof is_public !== 'undefined') {
        andConditions.push({
            is_public: is_public === true ? true : false,
        });
    }

    const whereClause: Prisma.ProjectsWhereInput = {
        AND: andConditions,
    };

    const result = await prisma.projects.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        select: {
            id: true,
            image: true,
            title: true,
            overview: true,
            techStack: true,
            liveURL: true,
            gitHubURL: true,
            is_public: true,
            createdAt: true,
        },
    });

    const total = await prisma.projects.count({
        where: whereClause,
    });

    const meta = {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
    };

    return {
        meta,
        data: result,
    };
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

const updateProjectById = async (projectId: string, payload: TUpdateProjectPayload) => {
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

    const result = await prisma.projects.update({
        where: { id: projectId },
        data: payload,
    });

    return result;
};

export const ProjectServices = {
    createProject,
    getAllProjects,
    updateProjectById,
    deleteProject,
    getSingleProject
};
