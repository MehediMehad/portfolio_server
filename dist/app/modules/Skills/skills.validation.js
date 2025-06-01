"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsValidation = void 0;
const zod_1 = require("zod");
const createSkillSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    level: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional()
});
const updatedSkillSchema = zod_1.z.object({
    skillId: zod_1.z.string().min(1, 'Skill ID is required'),
    name: zod_1.z.string().min(1, 'Name is required'),
    level: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional()
});
exports.SkillsValidation = {
    createSkillSchema,
    updatedSkillSchema
};
