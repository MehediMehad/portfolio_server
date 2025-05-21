// import multer from 'multer';
// import path from 'path';
// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs';
// import config from '../config';
// import { ICloudinaryResponse, IFile } from '../app/interface/file';

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


import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import config from '../config';
import { ICloudinaryResponse, IFile } from '../app/interface/file';

// Configure Cloudinary
cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret
});

// Use /tmp for temporary file storage in serverless environments
const uploadDir = '/tmp/uploads';

// Create upload directory if not exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Unique filename to avoid conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        cb(null, `${basename}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({ storage: storage });

// Upload to Cloudinary and delete temp file
const uploadToCloudinary = async (
    file: IFile
): Promise<ICloudinaryResponse | undefined> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            file.path,
            { public_id: file.filename.split('.').slice(0, -1).join('.') }, // remove extension for public_id
            (error: Error | any, result: any) => {
                try {
                    fs.unlinkSync(file.path); // Delete the file after upload
                } catch (err) {
                    console.error('Error deleting file:', err);
                }

                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
    });
};

export const fileUploader = {
    upload,
    uploadToCloudinary
};