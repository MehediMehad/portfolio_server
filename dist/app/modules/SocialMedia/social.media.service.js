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
exports.SocialMediasService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const APIError_1 = __importDefault(require("../../errors/APIError"));
const http_status_1 = __importDefault(require("http-status"));
const fileUploader_1 = require("../../../helpers/fileUploader");
// Create SocialMedia
const createSocialMedia = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { platformName, url } = req.body;
    const file = req.file;
    if (!file) {
        throw new APIError_1.default(http_status_1.default.BAD_REQUEST, 'File is required');
    }
    if (file) {
        const fileUploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.icon = fileUploadToCloudinary === null || fileUploadToCloudinary === void 0 ? void 0 : fileUploadToCloudinary.secure_url;
    }
    const existingSocialMedia = yield prisma_1.default.socialMedia.findFirst({
        where: {
            platformName
        }
    });
    if (existingSocialMedia) {
        throw new APIError_1.default(http_status_1.default.BAD_REQUEST, 'SocialMedia with this name already exists');
    }
    return yield prisma_1.default.socialMedia.create({
        data: {
            platformName,
            url,
            icon: req.body.icon
        }
    });
});
// Get All My SocialMedias
const getAllMySocialMedias = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.socialMedia.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
});
// Update SocialMedia
const updateSocialMedia = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { SocialMediaId, platformName, url } = req.body;
    const file = req.file;
    if (file) {
        const fileUploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.icon = fileUploadToCloudinary === null || fileUploadToCloudinary === void 0 ? void 0 : fileUploadToCloudinary.secure_url;
    }
    const SocialMedia = yield prisma_1.default.socialMedia.findFirst({
        where: {
            id: SocialMediaId
        }
    });
    if (!SocialMedia) {
        throw new APIError_1.default(http_status_1.default.NOT_FOUND, 'SocialMedia not found or unauthorized');
    }
    return yield prisma_1.default.socialMedia.update({
        where: {
            id: SocialMediaId
        },
        data: {
            platformName,
            url,
            icon: req.body.icon
        }
    });
});
// Delete SocialMedia
const deleteSocialMedia = (socialMediaId) => __awaiter(void 0, void 0, void 0, function* () {
    const SocialMedia = yield prisma_1.default.socialMedia.findFirst({
        where: {
            id: socialMediaId
        }
    });
    if (!SocialMedia) {
        throw new APIError_1.default(http_status_1.default.NOT_FOUND, 'SocialMedia not found or unauthorized');
    }
    yield prisma_1.default.socialMedia.delete({
        where: {
            id: socialMediaId
        }
    });
    return {
        message: 'SocialMedia deleted successfully'
    };
});
exports.SocialMediasService = {
    createSocialMedia,
    getAllMySocialMedias,
    deleteSocialMedia,
    updateSocialMedia
};
