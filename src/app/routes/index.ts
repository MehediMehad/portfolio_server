import express from 'express';
import { UserRoutes } from '../modules/User/user.routes';
import { AuthRouter } from '../modules/Auth/auth.route';
import { SkillsRoutes } from '../modules/Skills/skills.route';
import { SocialMediasRoutes } from '../modules/SocialMedia/social.media.route';
import { ProjectsRoutes } from '../modules/Project/projects.route';
import { BlogRoutes } from '../modules/Blog/blog.route';
import { FeaturedProjectRoutes } from '../modules/FeaturedProject/featured.project.route';

const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes
    },
    {
        path: '/auth',
        route: AuthRouter
    },
    {
        path: '/skill',
        route: SkillsRoutes
    },
    {
        path: '/social-media',
        route: SocialMediasRoutes
    },
    {
        path: '/projects',
        route: ProjectsRoutes
    },
    {
        path: '/featured-projects',
        route: FeaturedProjectRoutes
    },
    {
        path: '/blogs',
        route: BlogRoutes
    }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
