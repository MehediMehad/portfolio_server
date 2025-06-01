"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.post('/create-admin', fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    req.body = user_validation_1.UserValidation.createAdmin.parse(JSON.parse(req.body.data));
    return user_controller_1.UserController.createMyAccount(req, res, next);
});
router.put('/update-profile', fileUploader_1.fileUploader.upload.single('file'), (0, auth_1.default)('ADMIN', 'USER'), (req, res, next) => {
    req.body = user_validation_1.UserValidation.updateProfile.parse(JSON.parse(req.body.data));
    return user_controller_1.UserController.updateUserProfile(req, res, next);
});
router.get('/me', user_controller_1.UserController.getMyInfo);
exports.UserRoutes = router;
