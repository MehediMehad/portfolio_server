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
exports.SocialMediasController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../../shared/catchAsync");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const social_media_service_1 = require("./social.media.service");
// Create SocialMedia
const createSocialMedia = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield social_media_service_1.SocialMediasService.createSocialMedia(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SocialMedia created successfully!',
        data: result
    });
}));
// Get All My SocialMedias
const getAllMySocialMedias = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield social_media_service_1.SocialMediasService.getAllMySocialMedias();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SocialMedias fetched successfully!',
        data: result
    });
}));
// Update SocialMedia
const updateSocialMedia = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield social_media_service_1.SocialMediasService.updateSocialMedia(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'SocialMedia updated successfully',
        data: result
    });
}));
// Delete SocialMedia
const deleteSocialMedia = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { socialMediaId } = req.params;
    const result = yield social_media_service_1.SocialMediasService.deleteSocialMedia(socialMediaId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null
    });
}));
exports.SocialMediasController = {
    createSocialMedia,
    getAllMySocialMedias,
    deleteSocialMedia,
    updateSocialMedia
};
