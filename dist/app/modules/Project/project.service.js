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
exports.ProjectsService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const APIError_1 = __importDefault(require("../../errors/APIError"));
const http_status_1 = __importDefault(require("http-status"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const client_1 = require("@prisma/client");
const createProject = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, overview, description, date_time, techStack, features, whatILearned, futureImprovements, liveURL, gitHubURL } = req.body;
    // Handle image upload
    const file = req.file;
    if (!file) {
        throw new APIError_1.default(http_status_1.default.BAD_REQUEST, 'Project image is required');
    }
    if (file) {
        const uploadResult = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.projectImage = uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url;
    }
    // Check if project with this title already exists (optional)
    const existingProject = yield prisma_1.default.projects.findFirst({
        where: {
            title,
            authorId: req.user.userId
        }
    });
    if (existingProject) {
        throw new APIError_1.default(http_status_1.default.BAD_REQUEST, 'A project with this title already exists');
    }
    // Create the project
    return yield prisma_1.default.projects.create({
        data: {
            projectImage: req.body.projectImage,
            title,
            overview,
            description,
            date_time,
            techStack,
            features,
            whatILearned,
            futureImprovements,
            liveURL,
            gitHubURL,
            is_public: true,
            heroSection: true,
            status: client_1.ProjectStatus.PUBIC,
            author: {
                connect: {
                    id: req.user.userId
                }
            }
        }
    });
});
const getAllMyProjects = () => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield prisma_1.default.projects.findMany();
    if (!project) {
        throw new APIError_1.default(http_status_1.default.NOT_FOUND, 'Project Not Found');
    }
    return project;
});
const getSingleProject = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield prisma_1.default.projects.findFirst({
        where: {
            id: projectId
        }
    });
    if (!project) {
        throw new APIError_1.default(http_status_1.default.NOT_FOUND, 'Project not found or unauthorized');
    }
    return project;
});
const deleteProject = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield prisma_1.default.projects.findFirst({
        where: {
            id: projectId
        }
    });
    if (!project) {
        throw new APIError_1.default(http_status_1.default.NOT_FOUND, 'Skill not found or unauthorized');
    }
    yield prisma_1.default.projects.delete({
        where: {
            id: projectId
        }
    });
    return {
        message: 'Project deleted successfully'
    };
});
const updateProject = (userId, req) => __awaiter(void 0, void 0, void 0, function* () {
    const {} = req.body;
    const file = req.file;
    if (file) {
        const fileUploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.projectImage = fileUploadToCloudinary === null || fileUploadToCloudinary === void 0 ? void 0 : fileUploadToCloudinary.secure_url;
    }
    const project = yield prisma_1.default.projects.findFirst({
        where: {
            id: req.body.projectId,
            authorId: userId
        }
    });
    if (!project) {
        throw new APIError_1.default(http_status_1.default.NOT_FOUND, 'Project not found or unauthorized');
    }
    const updatedProject = yield prisma_1.default.projects.update({
        where: {
            id: req.params.projectId
        },
        data: {
            title: req.body.title,
            overview: req.body.overview,
            description: req.body.description,
            date_time: req.body.date_time,
            techStack: req.body.techStack,
            features: req.body.features,
            whatILearned: req.body.whatILearned,
            futureImprovements: req.body.futureImprovements,
            liveURL: req.body.liveURL,
            gitHubURL: req.body.gitHubURL,
            projectImage: req.body.projectImage
        }
    });
    return updatedProject;
});
exports.ProjectsService = {
    createProject,
    getAllMyProjects,
    updateProject,
    deleteProject,
    getSingleProject
};
