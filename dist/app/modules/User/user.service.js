"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.UserService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const fileUploader_1 = require("../../../helpers/fileUploader");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const APIError_1 = __importDefault(require("../../errors/APIError"));
const http_status_1 = __importDefault(require("http-status"));
const createMyAccount = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const email = config_1.default.myInfo.my_email;
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email: email
        }
    });
    if (user) {
        throw new APIError_1.default(http_status_1.default.CONFLICT, 'Admin Already Exist!');
    }
    const file = req.file;
    if (file) {
        const fileUploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.profilePhoto = fileUploadToCloudinary === null || fileUploadToCloudinary === void 0 ? void 0 : fileUploadToCloudinary.secure_url;
    }
    const contactNumber = config_1.default.myInfo.my_number;
    const hashPassword = yield bcrypt.hash(config_1.default.myInfo.my_password, 12);
    const userData = {
        name: 'Mehedi Mehad',
        email: email,
        password: hashPassword,
        profilePhoto: req.body.profilePhoto,
        contactNumber,
        role: client_1.UserRole.ADMIN,
        address: 'Dhaka, Bangladesh',
        aboutMe: "I'm a full-stack developer.",
        designation: 'Full Stack Developer',
        gender: client_1.Gender.Male,
        needPasswordChange: true,
        projectCount: 0,
        blogCount: 0,
        skillCount: 0
    };
    const result = yield prisma_1.default.user.create({
        data: userData
    });
    const data = {
        userId: result.id,
        email: userData.email,
        role: userData.role
    };
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken(data, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in); // "5m"
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken(data, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in); // "30d"
    return {
        data: result,
        accessToken,
        refreshToken
    };
});
const getMyInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    const email = config_1.default.myInfo.my_email;
    const user = yield prisma_1.default.user.findUnique({
        where: { email: email }
    });
    if (!user) {
        throw new Error('User not found!');
    }
    return user;
});
const updateUserProfile = (userId, req) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, aboutMe, designation, address, contactNumber, gender, socialMediaLinks } = req.body;
    let profilePhoto = req.body.profilePhoto;
    const file = req.file;
    // Upload new profile photo if provided
    if (file) {
        const uploadedFile = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        profilePhoto = uploadedFile === null || uploadedFile === void 0 ? void 0 : uploadedFile.secure_url;
    }
    // Update User Profile
    const updatedUser = yield prisma_1.default.user.update({
        where: {
            id: userId
        },
        data: {
            name,
            email,
            profilePhoto,
            aboutMe,
            designation,
            address,
            contactNumber: contactNumber,
            gender,
        }
    });
    // Handle Skills if provided
    const skills = req.body.skills || [];
    if (skills.length > 0) {
        for (const skillName of skills) {
            let skill = yield prisma_1.default.skills.findFirst({
                where: {
                    name: skillName.trim(),
                    isDeleted: false
                }
            });
            if (!skill) {
                // Create new skill if not exists
                skill = yield prisma_1.default.skills.create({
                    data: {
                        name: skillName.trim(),
                        level: `Proficient in ${skillName.trim()}`,
                        icon: `https://via.placeholder.com/50?text= ${skillName.trim().charAt(0)}`,
                        user: {
                            connect: { id: userId }
                        }
                    }
                });
            }
            // Connect skill to user if not already connected
            const existingSkill = yield prisma_1.default.user.findUnique({
                where: { id: userId },
                include: {
                    Skills: {
                        where: { id: skill.id }
                    }
                }
            });
            if (!(existingSkill === null || existingSkill === void 0 ? void 0 : existingSkill.Skills.length)) {
                yield prisma_1.default.user.update({
                    where: { id: userId },
                    data: {
                        Skills: {
                            connect: { id: skill.id }
                        }
                    }
                });
            }
        }
    }
    return updatedUser;
});
exports.UserService = {
    createMyAccount,
    updateUserProfile,
    getMyInfo
};
