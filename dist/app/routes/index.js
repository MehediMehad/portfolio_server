"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/User/user.routes");
const auth_route_1 = require("../modules/Auth/auth.route");
const skills_route_1 = require("../modules/Skills/skills.route");
const social_media_route_1 = require("../modules/SocialMedia/social.media.route");
const projects_route_1 = require("../modules/Project/projects.route");
const blog_route_1 = require("../modules/Blog/blog.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/user',
        route: user_routes_1.UserRoutes
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRouter
    },
    {
        path: '/skill',
        route: skills_route_1.SkillsRoutes
    },
    {
        path: '/social-media',
        route: social_media_route_1.SocialMediasRoutes
    },
    {
        path: '/projects',
        route: projects_route_1.ProjectsRoutes
    },
    {
        path: '/blogs',
        route: blog_route_1.BlogsRoutes
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
