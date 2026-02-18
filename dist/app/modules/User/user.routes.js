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
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const user_validation_1 = require("./user.validation");
const APIError_1 = __importDefault(require("../../errors/APIError"));
const router = express_1.default.Router();
router.post('/create-admin', fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    req.body = user_validation_1.UserValidation.createAdmin.parse(JSON.parse(req.body.data));
    return user_controller_1.UserController.createMyAccount(req, res, next);
});
// router.put(
//     '/update-profile',
//     fileUploader.upload.single('file'),
//     auth('ADMIN', 'USER'),
//     (req: Request, res: Response, next: NextFunction) => {
//         console.log(req.body)
//         req.body = UserValidation.updateProfile.parse(
//             JSON.parse(req.body.data)
//         );
//         return UserController.updateUserProfile(req, res, next);
//     }
// );
router.put("/update-profile", fileUploader_1.fileUploader.upload.single("file"), (0, auth_1.default)("ADMIN", "USER"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("BODY => ", req.body);
        console.log("FILE => ", req.file);
        if (!req.body.data) {
            throw new APIError_1.default(400, "Profile data missing");
        }
        const parsedData = JSON.parse(req.body.data);
        req.body = user_validation_1.UserValidation.updateProfile.parse(parsedData);
        return user_controller_1.UserController.updateUserProfile(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/me', user_controller_1.UserController.getMyInfo);
exports.UserRoutes = router;
