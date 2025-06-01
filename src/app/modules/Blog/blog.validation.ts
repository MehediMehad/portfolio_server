import { z } from 'zod';

// Utility schema for tags (array of strings)
const tagsSchema = z.array(z.string());

const createBlogSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    overview: z.string().min(1, 'Overview is required'),
    image: z.string().url('Image must be a valid URL').optional(),
    content: z
        .string()
        .min(1000, 'Content must be at least 1000 characters long'),
    tags: tagsSchema,
    is_public: z.boolean().optional().default(true),
    isFeatured: z.boolean().optional().default(false),
    isDeleted: z.boolean().optional().default(false)
});

// updateBlogSchema
const updateBlogSchema = z.object({
    title: z.string().min(1, 'Title is required').optional(),
    overview: z.string().min(1, 'Overview is required').optional(),
    image: z.string().url('Image must be a valid URL').optional(),
    content: z
        .string()
        .min(1000, 'Content must be at least 1000 characters long')
        .optional(),
    tags: tagsSchema.optional(),
    is_public: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    isDeleted: z.boolean().optional()
});

export const BlogsValidation = {
    createBlogSchema,
    updateBlogSchema
};
