import prisma from '../../../shared/prisma';
import { Request } from 'express';
import ApiError from '../../errors/APIError';
import httpStatus from 'http-status';
import { IFile } from '../../interface/file';
import { fileUploader } from '../../../helpers/fileUploader';

const createBlog = async (req: Request) => {
    // Destructure required fields from request body
    const { title, overview, content, tags, is_public, isFeatured } = req.body;

    // Handle image upload
    const file = req.file as IFile;
    if (!file) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Blog image is required');
    }

    if (file) {
        const uploadResult = await fileUploader.uploadToCloudinary(file);
        req.body.image = uploadResult?.secure_url as string;
    }

    // Check if blog with this title already exists by same author
    const existingBlog = await prisma.blogs.findFirst({
        where: {
            title,
            authorId: req.user?.userId
        }
    });

    if (existingBlog) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            'A blog with this title already exists'
        );
    }

    // Parse boolean values with fallback
    const publicStatus = is_public ? Boolean(is_public) : true;
    const featuredStatus = isFeatured ? Boolean(isFeatured) : false;

    // Convert tags to array if it's a string (e.g., from JSON string)
    let tagArray: string[] = [];
    if (tags) {
        try {
            tagArray = typeof tags === 'string' ? JSON.parse(tags) : tags;
        } catch (error) {
            tagArray = [];
        }
    }

    // Create the blog
    return await prisma.blogs.create({
        data: {
            image: req.body.image,
            title,
            overview,
            content,
            tags: tagArray,
            is_public: publicStatus,
            isFeatured: featuredStatus,
            author: {
                connect: {
                    id: req.user?.userId
                }
            }
        }
    });
};

const getAllMyBlogs = async (userId: string) => {
    const blog = await prisma.blogs.findMany({
        where: {
            authorId: userId
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    profilePhoto: true
                }
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });
    if (!blog) {
        throw new ApiError(httpStatus.NOT_FOUND, 'You have no blogs yet');
    }

    return blog;
};

const updateMyBlogs = async (userId: string, req: Request) => {
    const { title, overview, content, tags, is_public, isFeatured, isDeleted } =
        req.body;

    let image = req.body.profilePhoto;
    const file = req.file as IFile;

    // Upload new profile photo if provided
    if (file) {
        const uploadedFile = await fileUploader.uploadToCloudinary(file);
        image = uploadedFile?.secure_url;
    }

    // Update blog
    const updatedBlog = await prisma.blogs.update({
        where: {
            id: req.params.blogId,
            authorId: userId
        },
        data: {
            title,
            overview,
            content,
            image,
            tags: tags
                ? typeof tags === 'string'
                    ? JSON.parse(tags)
                    : tags
                : [],
            is_public: is_public !== undefined ? Boolean(is_public) : undefined,
            isFeatured:
                isFeatured !== undefined ? Boolean(isFeatured) : undefined,
            isDeleted: isDeleted !== undefined ? Boolean(isDeleted) : undefined
        }
    });
    if (!updatedBlog) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found');
    }
    return updatedBlog;
};

const deleteBlog = async (blogId: string, userId: string) => {
    const blog = await prisma.blogs.findFirst({
        where: {
            id: blogId,
            authorId: userId
        }
    });

    if (!blog) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found');
    }

    await prisma.blogs.delete({
        where: {
            id: blogId
        }
    });

    return {
        message: 'Blog deleted successfully'
    };
};

export const BlogsService = {
    createBlog,
    getAllMyBlogs,
    updateMyBlogs,
    deleteBlog
};
