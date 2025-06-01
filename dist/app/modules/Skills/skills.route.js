"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const skills_validation_1 = require("./skills.validation");
const skills_controller_1 = require("./skills.controller");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)('ADMIN'), fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    try {
        req.body = skills_validation_1.SkillsValidation.createSkillSchema.parse(JSON.parse(req.body.data));
        return skills_controller_1.SkillsController.createSkill(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.get('/get-my-skills', (0, auth_1.default)('ADMIN', 'USER'), skills_controller_1.SkillsController.getAllMySkills);
router.patch('/', fileUploader_1.fileUploader.upload.single('file'), (0, auth_1.default)('ADMIN'), (req, res, next) => {
    try {
        req.body = skills_validation_1.SkillsValidation.updatedSkillSchema.parse(JSON.parse(req.body.data));
        return skills_controller_1.SkillsController.updateSkill(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:skillId', (0, auth_1.default)('ADMIN'), skills_controller_1.SkillsController.deleteSkill);
exports.SkillsRoutes = router;
