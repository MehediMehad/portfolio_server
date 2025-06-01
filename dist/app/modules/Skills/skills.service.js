"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const APIError_1 = __importDefault(require("../../errors/APIError"));
const http_status_1 = __importDefault(require("http-status"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const createSkill = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, level } = req.body;
    const file = req.file;
    if (!file) {
        throw new APIError_1.default(http_status_1.default.BAD_REQUEST, 'File is required');
    }
    if (file) {
        const fileUploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.icon = fileUploadToCloudinary === null || fileUploadToCloudinary === void 0 ? void 0 : fileUploadToCloudinary.secure_url;
    }
    const existingSkill = yield prisma_1.default.skills.findFirst({
        where: {
            name,
            userId: req.user.userId
        }
    });
    if (existingSkill) {
        throw new APIError_1.default(http_status_1.default.BAD_REQUEST, 'Skill with this name already exists');
    }
    return yield prisma_1.default.skills.create({
        data: {
            name,
            level: level,
            icon: req.body.icon,
            userId: req.user.userId
        }
    });
});
// Get All My Skills
const getAllMySkills = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.skills.findMany({
        where: {
            isDeleted: false,
            is_public: true
        }
    });
});
// Delete Skill
const deleteSkill = (skillId) => __awaiter(void 0, void 0, void 0, function* () {
    const skill = yield prisma_1.default.skills.findFirst({
        where: {
            id: skillId
        }
    });
    if (!skill) {
        throw new APIError_1.default(http_status_1.default.NOT_FOUND, 'Skill not found or unauthorized');
    }
    yield prisma_1.default.skills.delete({
        where: {
            id: skillId
        }
    });
    return {
        message: 'Skill deleted successfully'
    };
});
// Update Skill
const updateSkill = (userId, req) => __awaiter(void 0, void 0, void 0, function* () {
    const { skillId, name, level } = req.body;
    if (!skillId) {
        throw new APIError_1.default(http_status_1.default.BAD_REQUEST, 'Skill ID is required');
    }
    const file = req.file;
    if (file) {
        const fileUploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.icon = fileUploadToCloudinary === null || fileUploadToCloudinary === void 0 ? void 0 : fileUploadToCloudinary.secure_url;
    }
    const skill = yield prisma_1.default.skills.findFirst({
        where: {
            id: skillId,
            userId: userId
        }
    });
    if (!skill) {
        throw new APIError_1.default(http_status_1.default.NOT_FOUND, 'Skill not found or unauthorized');
    }
    return yield prisma_1.default.skills.update({
        where: {
            id: skillId
        },
        data: {
            name,
            level,
            icon: req.body.icon
        }
    });
});
exports.SkillsService = {
    createSkill,
    getAllMySkills,
    deleteSkill,
    updateSkill
};
