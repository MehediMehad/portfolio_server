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
    contactNumber: z.string().optional(),
    profilePhoto: z.string().optional(),
    gender: z.nativeEnum(Gender).optional(),
    designation: z.string().optional(),
    aboutMe: z.string().optional(),
    address: z.string().optional()
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
