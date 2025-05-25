import prisma from '../../../shared/prisma';
import { Request } from 'express';
import ApiError from '../../errors/APIError';
import httpStatus from 'http-status';
import { IFile } from '../../interface/file';
import { fileUploader } from '../../../helpers/fileUploader';
import {
    TCreateSocialMediaBody,
    TUpdateSocialMediaBody
} from './social.media.interface';

// Create SocialMedia
const createSocialMedia = async (req: Request) => {
    const { platformName, url }: TCreateSocialMediaBody = req.body;

    const file = req.file as IFile;
    if (!file) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'File is required');
    }
    if (file) {
        const fileUploadToCloudinary =
            await fileUploader.uploadToCloudinary(file);

        req.body.icon = fileUploadToCloudinary?.secure_url;
    }

    const existingSocialMedia = await prisma.socialMedia.findFirst({
        where: {
            platformName
        }
    });
    if (existingSocialMedia) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            'SocialMedia with this name already exists'
        );
    }

    return await prisma.socialMedia.create({
        data: {
            platformName,
            url,
            icon: req.body.icon
        }
    });
};

// Get All My SocialMedias
const getAllMySocialMedias = async () => {
    return await prisma.socialMedia.findMany();
};

// Update SocialMedia
const updateSocialMedia = async (req: Request) => {
    const { SocialMediaId, platformName, url }: TUpdateSocialMediaBody =
        req.body;

    const file = req.file as IFile;
    if (file) {
        const fileUploadToCloudinary =
            await fileUploader.uploadToCloudinary(file);

        req.body.icon = fileUploadToCloudinary?.secure_url;
    }

    const SocialMedia = await prisma.socialMedia.findFirst({
        where: {
            id: SocialMediaId
        }
    });

    if (!SocialMedia) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            'SocialMedia not found or unauthorized'
        );
    }

    return await prisma.socialMedia.update({
        where: {
            id: SocialMediaId
        },
        data: {
            platformName,
            url,
            icon: req.body.icon
        }
    });
};

// Delete SocialMedia
const deleteSocialMedia = async (socialMediaId: string) => {
    const SocialMedia = await prisma.socialMedia.findFirst({
        where: {
            id: socialMediaId
        }
    });

    if (!SocialMedia) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            'SocialMedia not found or unauthorized'
        );
    }

    await prisma.socialMedia.delete({
        where: {
            id: socialMediaId
        }
    });

    return {
        message: 'SocialMedia deleted successfully'
    };
};

export const SocialMediasService = {
    createSocialMedia,
    getAllMySocialMedias,
    deleteSocialMedia,
    updateSocialMedia
};
