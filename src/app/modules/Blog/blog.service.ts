import type { TBlogFilter, TCreateBlogPayload, TUpdateBlogPayload } from './blog.interface';
import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import { IPaginationOptions } from '../../interface/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import ApiError from '../../errors/ApiError';

const createBlog = async (payload: TCreateBlogPayload) => {
    const result = await prisma.blogs.create({
        data: payload,
    });

    return result;
};

const getAllBlogs = async (
    filter: TBlogFilter,
    options: IPaginationOptions,
) => {
    const { searchTerm, tags } = filter;
    const { limit, page, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(options);

    const andConditions: Prisma.BlogsWhereInput[] = [
        { isDeleted: false },
    ];

    // 🔍 Search (title + overview)
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

    // 🏷 Filter by tags
    if (tags) {
        andConditions.push({
            tags: {
                has: tags,
            },
        });
    }

    const whereClause: Prisma.BlogsWhereInput = {
        AND: andConditions,
    };

    const result = await prisma.blogs.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        select: {
            id: true,
            title: true,
            overview: true,
            image: true,
            tags: true,
            createdAt: true,
        },
    });

    const total = await prisma.blogs.count({
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

const getBlogDetailsById = async (id: string) => {
    const blog = await prisma.blogs.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });

    if (!blog) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found');
    }

    return blog;
};

const updateBlogById = async (
    id: string,
    payload: TUpdateBlogPayload,
) => {

    const existing = await prisma.blogs.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });

    if (!existing) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found');
    }

    const result = await prisma.blogs.update({
        where: { id: id },
        data: payload,
    });

    return result;
};

const softDeleteBlog = async (id: string) => {
    const existing = await prisma.blogs.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });

    if (!existing) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found');
    }

    await prisma.blogs.update({
        where: { id },
        data: {
            isDeleted: true,
        },
    });

    return null;
};

export const BlogServices = {
    createBlog,
    getAllBlogs,
    getBlogDetailsById,
    updateBlogById,
    softDeleteBlog,
};

