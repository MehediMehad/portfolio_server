import { z } from 'zod';

const createSocialMediaSchema = z.object({
    platformName: z.string().min(1, 'Platform name is required'),
    url: z.string().url('Invalid URL format').min(1, 'URL is required'),
    icon: z.string({ errorMap: () => ({ message: 'Icon is required' }) })
});

const updatedSocialMediaSchema = z.object({
    SocialMediaId: z.string().min(1, 'SocialMedia ID is required'),
    platformName: z.string().min(1, 'Platform name is required').optional(),
    url: z
        .string()
        .url('Invalid URL format')
        .min(1, 'URL is required')
        .optional(),
    icon: z
        .string({ errorMap: () => ({ message: 'Icon is required' }) })
        .optional()
});

export const SocialMediasValidation = {
    createSocialMediaSchema,
    updatedSocialMediaSchema
};
