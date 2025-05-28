import { ProjectStatus } from '@prisma/client';
import { z } from 'zod';

const baseProjectSchema = {
    projectImage: z.string().url().optional(),
    title: z.string().min(1),
    overview: z.string().min(1),
    description: z.string().min(1),
    date_time: z.string(),
    techStack: z.array(z.string()),
    features: z.array(z.string()),
    whatILearned: z.array(z.string()),
    futureImprovements: z.array(z.string()),
    liveURL: z.string().url(),
    gitHubURL: z.string().url(),
    is_public: z.boolean().optional().default(true),
    heroSection: z.boolean().optional().default(false),
    registration_fee: z.number().min(0).optional().default(0),
    isDeleted: z.boolean().optional().default(false),
    status: z
        .enum(Object.values(ProjectStatus) as [string, ...string[]])
        .optional()
        .default(Object.values(ProjectStatus)[0]),
    authorId: z.string().uuid()
};

const createProjectSchema = z.object(baseProjectSchema);

const updatedProjectsSchema = z.object({
    ...baseProjectSchema,
    updatedAt: z.date().optional()
});

export const ProjectValidation = {
    createProjectSchema,
    updatedProjectsSchema
};
