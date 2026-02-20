import { ProjectStatus } from '@prisma/client';
import { z } from 'zod';


export const createProjectSchema = z.object({
    image: z.string().url(),
    title: z.string().min(3).trim(),
    overview: z.string().min(10).trim(),
    description: z.string().min(20).trim(),
    techStack: z.array(z.string()).min(1),
    features: z.array(z.string()).min(1),
    whatILearned: z.array(z.string()).min(1),
    futureImprovements: z.array(z.string()).min(1),
    liveURL: z.string().url(),
    gitHubURL: z.string().url(),
    is_public: z.boolean().optional(),
});

export const updatedProjectsSchema = createProjectSchema.partial()

export const ProjectValidation = {
    createProjectSchema,
    updatedProjectsSchema
};
