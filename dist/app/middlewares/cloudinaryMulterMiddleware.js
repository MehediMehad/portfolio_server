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
exports.CloudinaryFileUploader = void 0;
// MulterMiddleware.ts
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("../libs/cloudinary"));
// Configure Cloudinary storage for multer
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: (_req, file) => __awaiter(void 0, void 0, void 0, function* () {
        let folder = 'users';
        let public_id = `${Date.now()}-${file.fieldname}-${file.originalname.split('.')[0]}`;
        if (file.fieldname === 'image') {
            folder = 'profile-images';
        }
        else if (file.fieldname === 'images') {
            folder = 'gallery';
        }
        else if (file.fieldname === 'video') {
            folder = 'videos';
        }
        // ← This is the key fix
        let resource_type = 'image'; // default
        if (file.mimetype.startsWith('video/')) {
            resource_type = 'video';
        }
        else if (!file.mimetype.startsWith('image/')) {
            // fallback for PDFs, docs, etc. (if you allow them later)
            resource_type = 'raw';
        }
        return {
            folder,
            public_id,
            resource_type, // ← added / dynamic
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'mov', 'avi'],
            // You can keep or remove allowed_formats — it's optional but adds safety
        };
    }),
});
const imageFilter = (_req, file, cb) => {
    // const allowedMimes = [
    //   'image/png',
    //   'image/jpeg',
    //   'image/jpg',
    //   'application/pdf', // pdf
    //   'video/mp4',
    //   'video/webm',
    //   'video/quicktime',
    //   'video/x-msvideo',
    // ];
    // if (!allowedMimes.includes(file.mimetype)) {
    //   return cb(
    //     new ApiError(
    //       httpStatus.BAD_REQUEST,
    //       'Invalid file type. Only PNG, JPG, PDF and JPEG videos are allowed.',
    //     ),
    //     false,
    //   );
    // }
    cb(null, true);
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // e.g. 50MB — adjust as needed
    },
});
// Single upload (most common for profile)
const uploadProfileImage = upload.single('image');
// Multiple / mixed fields upload (used in your register route)
const uploadFields = upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'video', maxCount: 1 },
    { name: 'image', maxCount: 1 },
]);
// Export the same shape as before
exports.CloudinaryFileUploader = {
    upload,
    uploadProfileImage,
    uploadFields,
};
