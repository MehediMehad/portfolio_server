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
exports.AuthService = void 0;
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt = __importStar(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const APIError_1 = __importDefault(require("../../errors/APIError"));
const http_status_1 = __importDefault(require("http-status"));
const emailSender_1 = __importDefault(require("./emailSender"));
const emailTemplateHelpers_1 = __importDefault(require("../../../helpers/emailTemplateHelpers"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email
        }
    });
    if (!userData) {
        throw new APIError_1.default(http_status_1.default.NOT_FOUND, 'User Not Found');
    }
    const isCorrectPassword = yield bcrypt.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new APIError_1.default(http_status_1.default.UNAUTHORIZED, 'Password in incorrect');
    }
    const data = {
        userId: userData.id,
        email: userData.email,
        role: userData.role
    };
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken(data, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in); // "5m"
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken(data, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in); // "30d"
    return {
        needPasswordChange: userData.needPasswordChange,
        accessToken,
        refreshToken
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_token_secret); // refreshToken secret
    }
    catch (err) {
        throw new APIError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
    }
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            email: decodedData === null || decodedData === void 0 ? void 0 : decodedData.email
        }
    });
    if (!userData) {
        throw new APIError_1.default(http_status_1.default.NOT_FOUND, 'user Not Found');
    }
    const data = {
        userId: userData.id,
        email: userData.email,
        role: userData.role
    };
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken(data, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in); // sort time
    return {
        needPasswordChange: userData.needPasswordChange,
        accessToken
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });
    const isCorrectPassword = yield bcrypt.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new APIError_1.default(http_status_1.default.UNAUTHORIZED, 'Password in incorrect');
    }
    const hashPassword = yield bcrypt.hash(payload.newPassword, 12);
    yield prisma_1.default.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashPassword,
            needPasswordChange: false
        }
    });
    return {
        message: 'password changed successfully'
    };
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email
        }
    });
    const resetPasswordToken = jwtHelpers_1.jwtHelpers.generateToken({ userId: userData.id, email: userData.email, role: userData.role }, config_1.default.reset_password.secret_token, config_1.default.reset_password.expires_in // "5m"
    );
    const resetPasswordLink = config_1.default.reset_password.link +
        `?userId=${userData.id}&token=${resetPasswordToken}}`;
    yield (0, emailSender_1.default)(userData.email, (0, emailTemplateHelpers_1.default)(resetPasswordLink));
    // http://localhost:3000/reset-pass?email=mehedi3@gmail.com&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ
    return {
        message: 'Password changed successfully!'
    };
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.id
        }
    });
    const isValidToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.reset_password.secret_token);
    if (!isValidToken) {
        throw new APIError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden!');
    }
    // hash password
    const password = yield bcrypt.hash(payload.password, 12);
    // update into database
    yield prisma_1.default.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    });
});
exports.AuthService = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
};
