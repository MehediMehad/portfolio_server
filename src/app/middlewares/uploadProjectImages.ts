import { Request, Response, NextFunction } from 'express';
import { CloudinaryFileUploader } from './cloudinaryMulterMiddleware';

const uploadProjectImages = async (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    try {
        if (!req.files) return next();

        const files = req.files as { [key: string]: Express.Multer.File[] };

        if (files.image?.[0]) {
            const url = await CloudinaryFileUploader.uploadToCloudinary(
                files.image[0].path,
                'projects'
            );

            req.body.image = url;
        }

        next();
    } catch (error) {
        next(error);
    }
};

export default uploadProjectImages;