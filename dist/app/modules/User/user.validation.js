"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createAdmin = zod_1.z.object({
    profilePhoto: zod_1.z
        .string({ required_error: 'profilePhoto is required' })
        .optional()
});
const updateProfile = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().email({ message: 'Provide a valid email' }).optional(),
    contactNumber: zod_1.z.string().optional(),
    profilePhoto: zod_1.z.string().optional(),
    gender: zod_1.z.nativeEnum(client_1.Gender).optional(),
    designation: zod_1.z.string().optional(),
    aboutMe: zod_1.z.string().optional(),
    address: zod_1.z.string().optional()
});
exports.UserValidation = {
    createAdmin,
    updateProfile
};
