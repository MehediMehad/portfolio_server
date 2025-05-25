import { Gender, UserRole, UserStatus } from '@prisma/client';
import { z } from 'zod';

const createAdmin = z.object({
    profilePhoto: z
        .string({ required_error: 'profilePhoto is required' })
        .optional()
});

const updateProfile = z.object({
    name: z.string().optional(),
    email: z.string().email({ message: 'Provide a valid email' }).optional(),
    // skills: z
    //     .array(
    //         z.object({
    //             skill: z.string().min(1, { message: 'Skill is required' })
    //         })
    //     )
    //     .optional(),
    contactNumber: z
        .string()
        .regex(/^\d+$/, { message: 'Contact number must be numeric' })
        .min(10, { message: 'Contact number must be at least 10 digits' })
        .max(15, { message: 'Contact number must be at most 15 digits' })
        .optional(),
    profilePhoto: z.string().optional(),
    gender: z.nativeEnum(Gender).optional()
});

const updateStatus = z.object({
    body: z.object({
        status: z.nativeEnum(UserStatus).refine(
            (val) => Object.values(UserStatus).includes(val),
            (val) => ({
                message: `Invalid status value: '${val}', expected one of [${Object.values(
                    UserStatus
                ).join(', ')}]`
            })
        )
    })
});

export const UserValidation = {
    createAdmin,
    updateStatus,
    updateProfile
};
