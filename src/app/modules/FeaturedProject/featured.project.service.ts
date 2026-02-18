import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import ApiError from '../../errors/APIError';

const addFeaturedProject = async (projectId: string) => {
    // Check project exists & not deleted
    const project = await prisma.projects.findFirst({
        where: {
            id: projectId,
            isDeleted: false,
        },
    });

    if (!project) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
    }

    // Prevent duplicate (unique already protects, but we handle cleanly)
    const alreadyFeatured = await prisma.featuredProjects.findUnique({
        where: { projectId },
    });

    if (alreadyFeatured) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Project already featured');
    }

    const result = await prisma.featuredProjects.create({
        data: {
            projectId,
        },
    });

    return result;
};

const removeFeaturedProject = async (projectId: string) => {
    const featured = await prisma.featuredProjects.findUnique({
        where: { projectId },
    });

    if (!featured) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Featured project not found');
    }

    await prisma.featuredProjects.delete({
        where: { projectId },
    });

    return null;
};

const getAllFeaturedProjects = async () => {
    const result = await prisma.featuredProjects.findMany({
        include: {
            project: {
                select: {
                    id: true,
                    image: true,
                    title: true,
                    overview: true,
                    techStack: true,
                    liveURL: true,
                    gitHubURL: true,
                    createdAt: true,
                },
            },
        },
        take: 3,
        orderBy: {
            createdAt: 'desc',
        },
    });

    return result.map(item => item.project);
};

export const FeaturedProjectServices = {
    addFeaturedProject,
    removeFeaturedProject,
    getAllFeaturedProjects,
};
