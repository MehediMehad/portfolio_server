"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialMediasValidation = void 0;
const zod_1 = require("zod");
const createSocialMediaSchema = zod_1.z.object({
    platformName: zod_1.z.string().min(1, 'Platform name is required'),
    url: zod_1.z.string().url('Invalid URL format').min(1, 'URL is required'),
    icon: zod_1.z
        .string({ errorMap: () => ({ message: 'Icon is required' }) })
        .optional()
});
const updatedSocialMediaSchema = zod_1.z.object({
    SocialMediaId: zod_1.z.string().min(1, 'SocialMedia ID is required'),
    platformName: zod_1.z.string().min(1, 'Platform name is required').optional(),
    url: zod_1.z
        .string()
        .url('Invalid URL format')
        .min(1, 'URL is required')
        .optional(),
    icon: zod_1.z
        .string({ errorMap: () => ({ message: 'Icon is required' }) })
        .optional()
});
exports.SocialMediasValidation = {
    createSocialMediaSchema,
    updatedSocialMediaSchema
};
