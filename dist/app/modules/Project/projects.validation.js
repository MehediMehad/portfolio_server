"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const baseProjectSchema = {
    projectImage: zod_1.z.string().url().optional(),
    title: zod_1.z.string().min(1),
    overview: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    date_time: zod_1.z.string(),
    techStack: zod_1.z.array(zod_1.z.string()),
    features: zod_1.z.array(zod_1.z.string()),
    whatILearned: zod_1.z.array(zod_1.z.string()),
    futureImprovements: zod_1.z.array(zod_1.z.string()),
    liveURL: zod_1.z.string().url(),
    gitHubURL: zod_1.z.string().url(),
    is_public: zod_1.z.boolean().optional().default(true),
    heroSection: zod_1.z.boolean().optional().default(false),
    registration_fee: zod_1.z.number().min(0).optional().default(0),
    isDeleted: zod_1.z.boolean().optional().default(false),
    status: zod_1.z
        .enum(Object.values(client_1.ProjectStatus))
        .optional()
        .default(Object.values(client_1.ProjectStatus)[0]),
    authorId: zod_1.z.string().uuid()
};
const createProjectSchema = zod_1.z.object(baseProjectSchema);
const updatedProjectsSchema = zod_1.z.object(Object.assign(Object.assign({}, baseProjectSchema), { updatedAt: zod_1.z.date().optional() }));
exports.ProjectValidation = {
    createProjectSchema,
    updatedProjectsSchema
};
