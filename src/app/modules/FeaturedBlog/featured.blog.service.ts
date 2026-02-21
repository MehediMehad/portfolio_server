
import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import ApiError from '../../errors/ApiError';

const addFeaturedBlog = async (blogId: string) => {
    // Check blog exists & not deleted
    const blog = await prisma.blogs.findFirst({
        where: {
            id: blogId,
            isDeleted: false,
        },
    });

    if (!blog) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Blog not found');
    }

    // Prevent duplicate
    const alreadyFeatured = await prisma.featuredBlogs.findUnique({
        where: { blogId },
    });

    // If already featured, update createdAt
    if (alreadyFeatured) {
        const updated = await prisma.featuredBlogs.update({
            where: { blogId },
            data: {
                createdAt: new Date(),
            },
        });

        return updated;
    }

    // Create
    const result = await prisma.featuredBlogs.create({
        data: {
            blogId,
        },
    });

    return result;
};

const removeFeaturedBlog = async (blogId: string) => {
    const featured = await prisma.featuredBlogs.findUnique({
        where: { blogId },
    });

    if (!featured) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Featured blog not found');
    }

    await prisma.featuredBlogs.delete({
        where: { blogId },
    });

    return null;
};

const getAllFeaturedBlogs = async () => {
    const result = await prisma.featuredBlogs.findMany({
        include: {
            blog: {
                select: {
                    id: true,
                    title: true,
                    overview: true,
                    image: true,
                    tags: true,
                    createdAt: true,
                },
            },
        },
        take: 3,
        orderBy: {
            createdAt: 'desc',
        },
    });

    // Only return blog data
    return result.map(item => item.blog);
};

export const FeaturedBlogServices = {
    addFeaturedBlog,
    removeFeaturedBlog,
    getAllFeaturedBlogs,
};
