import { Gender, UserRole, UserStatus } from '@prisma/client';
import { z } from 'zod';

const registration = z.object({
    password: z.string({ required_error: 'password is required' }),
    name: z.string({ required_error: 'name is required' }),
    email: z
        .string({ required_error: 'email is required' })
        .email({ message: 'provide a valid email' }),
    contactNumber: z
        .string({ required_error: 'contact number is required' })
        .regex(/^\d+$/, { message: 'Contact number must be a number' })
        .min(10, { message: 'Contact number must be at least 10 digits' })
        .max(15, { message: 'Contact number must be at most 15 digits' }),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
        required_error: 'gender is required',
        invalid_type_error: 'gender must be MALE, FEMALE, or OTHER'
    }),
    profilePhoto: z.string().optional()
});

const updateProfile = z.object({
      name: z.string().optional(),
      email: z.string().email({ message: 'Provide a valid email' }).optional(),
      contactNumber: z
        .string()
        .regex(/^\d+$/, { message: 'Contact number must be numeric' })
        .min(10, { message: 'Contact number must be at least 10 digits' })
        .max(15, { message: 'Contact number must be at most 15 digits' })
        .optional(),
      profilePhoto: z.string().optional(),
      gender: z.nativeEnum(Gender).optional()
    })

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
    registration,
    updateStatus,
    updateProfile
};
