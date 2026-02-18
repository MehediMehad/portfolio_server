"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const projects_validation_1 = require("./projects.validation");
const project_controller_1 = require("./project.controller");
const cloudinaryMulterMiddleware_1 = require("../../middlewares/cloudinaryMulterMiddleware");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)('ADMIN'), cloudinaryMulterMiddleware_1.CloudinaryFileUploader.uploadFields, // multipart/form-data → image upload
(0, validateRequest_1.default)(projects_validation_1.ProjectValidation.createProjectSchema, {
    image: 'single',
}), project_controller_1.ProjectsController.createProject);
router.get('/get-my-project', project_controller_1.ProjectsController.getAllMyProjects);
router.patch('/:projectId', 
// fileUploader.upload.single('file'),
(0, auth_1.default)('ADMIN'), (req, res, next) => {
    try {
        req.body = projects_validation_1.ProjectValidation.updatedProjectsSchema.parse(JSON.parse(req.body.data));
        return project_controller_1.ProjectsController.updateProject(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.get('/:projectId', project_controller_1.ProjectsController.getSingleProject);
router.delete('/:projectId', (0, auth_1.default)('ADMIN'), project_controller_1.ProjectsController.deleteProject);
exports.ProjectsRoutes = router;
