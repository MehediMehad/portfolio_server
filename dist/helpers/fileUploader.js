"use strict";
// import multer from 'multer';
// import path from 'path';
// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs';
// import config from '../config';
// import { ICloudinaryResponse, IFile } from '../app/interface/file';
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
exports.fileUploader = void 0;
// // Configuration
// cloudinary.config({
//     cloud_name: config.cloudinary.cloud_name,
//     api_key: config.cloudinary.api_key,
//     api_secret: config.cloudinary.api_secret
// });
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(process.cwd(), 'uploads'));
//     },
//     filename: function (req, file, cb) {
//         //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         //   cb(null, file.fieldname + '-' + uniqueSuffix)
//         cb(null, file.fieldname);
//     }
// });
// const upload = multer({ storage: storage });
// const uploadToCloudinary = async (
//     file: IFile
// ): Promise<ICloudinaryResponse | undefined> => {
//     return new Promise((resolve, rejects) => {
//         cloudinary.uploader.upload(
//             file.path,
//             (error: Error, result: ICloudinaryResponse) => {
//                 fs.unlinkSync(file.path); // Delete the file after upload
//                 if (error) {
//                     rejects(error);
//                 } else {
//                     resolve(result);
//                 }
//             }
//         );
//     });
// };
// export const fileUploader = {
//     upload,
//     uploadToCloudinary
// };
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../config"));
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary.cloud_name,
    api_key: config_1.default.cloudinary.api_key,
    api_secret: config_1.default.cloudinary.api_secret
});
// Use /tmp for temporary file storage in serverless environments
const uploadDir = '/tmp/uploads';
// Create upload directory if not exists
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Multer storage configuration
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Unique filename to avoid conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        const basename = path_1.default.basename(file.originalname, ext);
        cb(null, `${basename}-${uniqueSuffix}${ext}`);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
// Upload to Cloudinary and delete temp file
const uploadToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(file.path, { public_id: file.filename.split('.').slice(0, -1).join('.') }, // remove extension for public_id
        (error, result) => {
            try {
                fs_1.default.unlinkSync(file.path); // Delete the file after upload
            }
            catch (err) {
                console.error('Error deleting file:', err);
            }
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
});
exports.fileUploader = {
    upload,
    uploadToCloudinary
};
