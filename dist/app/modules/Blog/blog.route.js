"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const blog_controller_1 = require("./blog.controller");
const blog_validation_1 = require("./blog.validation");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)('ADMIN'), fileUploader_1.fileUploader.upload.single('file'), (req, res, next) => {
    try {
        req.body = blog_validation_1.BlogsValidation.createBlogSchema.parse(JSON.parse(req.body.data));
        return blog_controller_1.BlogsController.createBlog(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.get('/get-my-blogs', blog_controller_1.BlogsController.getAllMyBlogs);
router.get('/:blogId', blog_controller_1.BlogsController.getSingleBlog);
router.patch('/update-blog/:blogId', fileUploader_1.fileUploader.upload.single('file'), (0, auth_1.default)('ADMIN', 'USER'), (req, res, next) => {
    req.body = blog_validation_1.BlogsValidation.updateBlogSchema.parse(JSON.parse(req.body.data));
    return blog_controller_1.BlogsController.updateMyBlogs(req, res, next);
});
router.delete('/:blogId', (0, auth_1.default)('ADMIN', 'USER'), blog_controller_1.BlogsController.deleteBlog);
exports.BlogsRoutes = router;
