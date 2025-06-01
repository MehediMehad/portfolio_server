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
exports.SkillsController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../../shared/catchAsync");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const skills_service_1 = require("./skills.service");
const createSkill = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield skills_service_1.SkillsService.createSkill(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Skill created successfully!',
        data: result
    });
}));
const getAllMySkills = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield skills_service_1.SkillsService.getAllMySkills();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Skills fetched successfully!',
        data: result
    });
}));
const updateSkill = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield skills_service_1.SkillsService.updateSkill(userId, req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Skill updated successfully',
        data: result
    });
}));
const deleteSkill = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { skillId } = req.params;
    const result = yield skills_service_1.SkillsService.deleteSkill(skillId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null
    });
}));
exports.SkillsController = {
    createSkill,
    getAllMySkills,
    deleteSkill,
    updateSkill
};
