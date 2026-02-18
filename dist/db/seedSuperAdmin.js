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
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../config"));
const prisma_1 = __importDefault(require("../shared/prisma"));
const superAdminData = {
    name: 'Md. Mehedi Hasan Mehad',
    profilePhoto: 'https://res.cloudinary.com/dxbpbbpbh/image/upload/v1748803881/photo_2024-08-15_01-36-46-1748803881699-988306660.jpg',
    email: config_1.default.myInfo.my_email,
    password: config_1.default.myInfo.my_password,
    contactNumber: config_1.default.myInfo.my_number,
    role: client_1.UserRole.ADMIN,
    aboutMe: 'Full Stack Developer specializing in scalable web applications using Node.js, Express, Next.js, Prisma, and PostgreSQL. Passionate about clean architecture and production-grade systems.',
    designation: 'Full Stack Developer',
    projectCount: 0,
    blogCount: 0,
    skillCount: 0,
    socialMediaLinks: [
        'https://github.com/yourusername',
        'https://linkedin.com/in/yourusername',
        'https://twitter.com/yourusername',
        'https://mehedimehadportfolio.vercel.app'
    ],
    gender: client_1.Gender.Male,
    needPasswordChange: false,
    address: 'Dhaka, Bangladesh',
};
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSuperAdminExists = yield prisma_1.default.user.findFirst({
            where: {
                role: client_1.UserRole.ADMIN,
            },
        });
        if (isSuperAdminExists) {
            console.log('⚠️  Super Admin already exists.');
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(superAdminData.password, 12);
        yield prisma_1.default.user.create({
            data: Object.assign(Object.assign({}, superAdminData), { password: hashedPassword }),
        });
        console.log('✅ Super Admin created successfully.');
    }
    catch (error) {
        console.error('❌ Error seeding Super Admin:', error);
    }
});
exports.default = seedSuperAdmin;
