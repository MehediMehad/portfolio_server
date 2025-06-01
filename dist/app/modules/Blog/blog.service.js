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
exports.BlogsService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const APIError_1 = __importDefault(require("../../errors/APIError"));
const http_status_1 = __importDefault(require("http-status"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const createBlog = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Destructure required fields from request body
    const { title, overview, content, tags, is_public, isFeatured } = req.body;
    // Handle image upload
    const file = req.file;
    if (!file) {
        throw new APIError_1.default(http_status_1.default.BAD_REQUEST, 'Blog image is required');
    }
    if (file) {
        const uploadResult = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.image = uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url;
    }
    // Check if blog with this title already exists by same author
    const existingBlog = yield prisma_1.default.blogs.findFirst({
        where: {
            title,
            authorId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId
        }
    });
    if (existingBlog) {
        throw new APIError_1.default(http_status_1.default.BAD_REQUEST, 'A blog with this title already exists');
    }
    // Parse boolean values with fallback
    const publicStatus = is_public ? Boolean(is_public) : true;
    const featuredStatus = isFeatured ? Boolean(isFeatured) : false;
    // Convert tags to array if it's a string (e.g., from JSON string)
    let tagArray = [];
    if (tags) {
        try {
            tagArray = typeof tags === 'string' ? JSON.parse(tags) : tags;
        }
        catch (error) {
            tagArray = [];
        }
    }
    // Create the blog
    return yield prisma_1.default.blogs.create({
        data: {
            image: req.body.image,
            title,
            overview,
            content,
            tags: tagArray,
            is_public: publicStatus,
            isFeatured: featuredStatus,
            author: {
                connect: {
                    id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId
                }
            }
        }
    });
});
const getAllMyBlogs = () => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield prisma_1.default.blogs.findMany({
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    profilePhoto: true
                }
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });
    if (!blog) {
        throw new APIError_1.default(http_status_1.default.NOT_FOUND, 'You have no blogs yet');
    }
    return blog;
});
const getSingleBlog = (blogId) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield prisma_1.default.blogs.findFirst({
        where: {
            id: blogId
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    profilePhoto: true
                }
            }
        }
    });
    if (!blog) {
        throw new APIError_1.default(http_status_1.default.NOT_FOUND, 'blog not found');
    }
    return blog;
});
const updateMyBlogs = (userId, req) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, overview, content, tags, is_public, isFeatured, isDeleted } = req.body;
    let image = req.body.profilePhoto;
    const file = req.file;
    // Upload new profile photo if provided
    if (file) {
        const uploadedFile = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        image = uploadedFile === null || uploadedFile === void 0 ? void 0 : uploadedFile.secure_url;
    }
    // Update blog
    const updatedBlog = yield prisma_1.default.blogs.update({
        where: {
            id: req.params.blogId,
            authorId: userId
        },
        data: {
            title,
            overview,
            content,
            image,
            tags: tags
                ? typeof tags === 'string'
                    ? JSON.parse(tags)
                    : tags
                : [],
            is_public: is_public !== undefined ? Boolean(is_public) : undefined,
            isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
            isDeleted: isDeleted !== undefined ? Boolean(isDeleted) : undefined
        }
    });
    if (!updatedBlog) {
        throw new APIError_1.default(http_status_1.default.NOT_FOUND, 'Blog not found');
    }
    return updatedBlog;
});
const deleteBlog = (blogId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield prisma_1.default.blogs.findFirst({
        where: {
            id: blogId,
            authorId: userId
        }
    });
    if (!blog) {
        throw new APIError_1.default(http_status_1.default.NOT_FOUND, 'Blog not found');
    }
    yield prisma_1.default.blogs.delete({
        where: {
            id: blogId
        }
    });
    return {
        message: 'Blog deleted successfully'
    };
});
exports.BlogsService = {
    createBlog,
    getAllMyBlogs,
    getSingleBlog,
    updateMyBlogs,
    deleteBlog
};
