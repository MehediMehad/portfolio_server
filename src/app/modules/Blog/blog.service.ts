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
        }
    });
    if (!blog) {
        throw new ApiError(httpStatus.NOT_FOUND, 'You have no blogs yet');
    }

    return blog;
};

export const BlogsService = {
    createBlog,
    getAllMyBlogs
};
