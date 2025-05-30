import { z } from 'zod';

// Utility schema for tags (array of strings)
const tagsSchema = z.array(z.string());

const createBlogSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    overview: z.string().min(1, 'Overview is required'),
    image: z.string().url('Image must be a valid URL').optional(),
    content: z.string().min(1, 'Content is required'),
    tags: tagsSchema,
    is_public: z.boolean().optional().default(true),
    isFeatured: z.boolean().optional().default(false),
    isDeleted: z.boolean().optional().default(false)
});

export const BlogsValidation = {
    createBlogSchema
};
