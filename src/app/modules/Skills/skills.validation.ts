import { z } from 'zod';

const createSkillSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    level: z.string().optional(),
    icon: z.string().optional()
});

const updatedSkillSchema = z.object({
    skillId: z.string().min(1, 'Skill ID is required'),
    name: z.string().min(1, 'Name is required'),
    level: z.string().optional(),
    icon: z.string().optional()
});

export const SkillsValidation = {
    createSkillSchema,
    updatedSkillSchema
};
