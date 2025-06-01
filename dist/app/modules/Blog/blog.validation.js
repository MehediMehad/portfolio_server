"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsValidation = void 0;
const zod_1 = require("zod");
// Utility schema for tags (array of strings)
const tagsSchema = zod_1.z.array(zod_1.z.string());
const createBlogSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    overview: zod_1.z.string().min(1, 'Overview is required'),
    image: zod_1.z.string().url('Image must be a valid URL').optional(),
    content: zod_1.z
        .string()
        .min(1000, 'Content must be at least 1000 characters long'),
    tags: tagsSchema,
    is_public: zod_1.z.boolean().optional().default(true),
    isFeatured: zod_1.z.boolean().optional().default(false),
    isDeleted: zod_1.z.boolean().optional().default(false)
});
// updateBlogSchema
const updateBlogSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required').optional(),
    overview: zod_1.z.string().min(1, 'Overview is required').optional(),
    image: zod_1.z.string().url('Image must be a valid URL').optional(),
    content: zod_1.z
        .string()
        .min(1000, 'Content must be at least 1000 characters long')
        .optional(),
    tags: tagsSchema.optional(),
    is_public: zod_1.z.boolean().optional(),
    isFeatured: zod_1.z.boolean().optional(),
    isDeleted: zod_1.z.boolean().optional()
});
exports.BlogsValidation = {
    createBlogSchema,
    updateBlogSchema
};
