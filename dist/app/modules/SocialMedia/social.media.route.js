"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialMediasRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const social_media_controller_1 = require("./social.media.controller");
const social_media_validation_1 = require("./social.media.validation");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)('ADMIN'), fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    try {
        req.body = social_media_validation_1.SocialMediasValidation.createSocialMediaSchema.parse(JSON.parse(req.body.data));
        return social_media_controller_1.SocialMediasController.createSocialMedia(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.get('/get-all-my-social-medias', social_media_controller_1.SocialMediasController.getAllMySocialMedias);
router.patch('/', fileUploader_1.fileUploader.upload.single('file'), (0, auth_1.default)('ADMIN'), (req, res, next) => {
    try {
        req.body = social_media_validation_1.SocialMediasValidation.updatedSocialMediaSchema.parse(JSON.parse(req.body.data));
        return social_media_controller_1.SocialMediasController.updateSocialMedia(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:socialMediaId', (0, auth_1.default)('ADMIN'), social_media_controller_1.SocialMediasController.deleteSocialMedia);
exports.SocialMediasRoutes = router;
