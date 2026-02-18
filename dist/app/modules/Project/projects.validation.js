"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectValidation = exports.createProjectSchema = void 0;
const zod_1 = require("zod");
exports.createProjectSchema = zod_1.z.object({
    image: zod_1.z.string().url(),
    title: zod_1.z.string().min(3).trim(),
    overview: zod_1.z.string().min(10).trim(),
    description: zod_1.z.string().min(20).trim(),
    techStack: zod_1.z.array(zod_1.z.string()).min(1),
    features: zod_1.z.array(zod_1.z.string()).min(1),
    whatILearned: zod_1.z.array(zod_1.z.string()).min(1),
    futureImprovements: zod_1.z.array(zod_1.z.string()).min(1),
    liveURL: zod_1.z.string().url(),
    gitHubURL: zod_1.z.string().url(),
    is_public: zod_1.z.boolean().optional(),
});
const updatedProjectsSchema = exports.createProjectSchema.extend({
    updatedAt: zod_1.z.date().optional()
});
exports.ProjectValidation = {
    createProjectSchema: exports.createProjectSchema,
    updatedProjectsSchema
};
