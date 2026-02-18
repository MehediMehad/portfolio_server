import { z } from 'zod';

export const createBlogSchema = z.object({
    title: z.string().min(5),
    overview: z.string().min(10),
    image: z.string().url(),
    content: z.string().min(50),
    tags: z.array(z.string()).min(1),
});

export const updateBlogSchema = createBlogSchema.partial();

export const BlogValidations = {
    createBlogSchema,
    updateBlogSchema,
};
