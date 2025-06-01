import prisma from '../../../shared/prisma';
import { Request } from 'express';
import ApiError from '../../errors/APIError';
import httpStatus from 'http-status';
import { IFile } from '../../interface/file';
import { fileUploader } from '../../../helpers/fileUploader';

const createSkill = async (req: Request) => {
    const { name, level } = req.body;

    const file = req.file as IFile;
    if (!file) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'File is required');
    }
    if (file) {
        const fileUploadToCloudinary =
            await fileUploader.uploadToCloudinary(file);

        req.body.projectImage = fileUploadToCloudinary?.secure_url;
    }

    const existingSkill = await prisma.skills.findFirst({
        where: {
            name,
            userId: req.user.userId
        }
    });
    if (existingSkill) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            'Skill with this name already exists'
        );
    }

    return await prisma.skills.create({
        data: {
            name,
            level: level,
            icon: req.body.icon,
            userId: req.user.userId
        }
    });
};

// Get All My Skills
const getAllMySkills = async () => {
    return await prisma.skills.findMany({
        where: {
            isDeleted: false,
            is_public: true
        }
    });
};

// Delete Skill
const deleteSkill = async (skillId: string) => {
    const skill = await prisma.skills.findFirst({
        where: {
            id: skillId
        }
    });

    if (!skill) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            'Skill not found or unauthorized'
        );
    }

    await prisma.skills.delete({
        where: {
            id: skillId
        }
    });

    return {
        message: 'Skill deleted successfully'
    };
};

// Update Skill
const updateSkill = async (userId: string, req: Request) => {
    const { skillId, name, level } = req.body;

    if (!skillId) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Skill ID is required');
    }

    const file = req.file as IFile;
    if (file) {
        const fileUploadToCloudinary =
            await fileUploader.uploadToCloudinary(file);

        req.body.icon = fileUploadToCloudinary?.secure_url;
    }

    const skill = await prisma.skills.findFirst({
        where: {
            id: skillId,
            userId: userId
        }
    });

    if (!skill) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            'Skill not found or unauthorized'
        );
    }

    return await prisma.skills.update({
        where: {
            id: skillId
        },
        data: {
            name,
            level,
            icon: req.body.icon
        }
    });
};

export const SkillsService = {
    createSkill,
    getAllMySkills,
    deleteSkill,
    updateSkill
};
