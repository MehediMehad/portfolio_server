import prisma from '../../../shared/prisma';
import { Gender, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { fileUploader } from '../../../helpers/fileUploader';
import { IFile } from '../../interface/file';
import { Request } from 'express';
import { jwtHelpers, TPayloadToken } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';

const createMyAccount = async (req: Request) => {
    const email: string = config.myInfo.my_email!;
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (user) {
        throw new ApiError(httpStatus.CONFLICT, 'Admin Already Exist!');
    }

    const file = req.file as IFile;

    if (file) {
        const fileUploadToCloudinary =
            await fileUploader.uploadToCloudinary(file);

        req.body.profilePhoto = fileUploadToCloudinary?.secure_url;
    }

    const contactNumber: string = config.myInfo.my_number!;

    const hashPassword: string = await bcrypt.hash(
        config.myInfo.my_password!,
        12
    );
    const userData = {
        name: 'Mehedi Mehad',
        email: email,
        password: hashPassword,
        profilePhoto: req.body.profilePhoto,
        contactNumber,
        role: UserRole.ADMIN,
        address: 'Dhaka, Bangladesh',
        aboutMe: "I'm a full-stack developer.",
        designation: 'Full Stack Developer',
        gender: Gender.Male,
        needPasswordChange: true,
        projectCount: 0,
        blogCount: 0,
        skillCount: 0
    };

    const result = await prisma.user.create({
        data: userData
    });

    const data: TPayloadToken = {
        userId: result.id,
        email: userData.email,
        role: userData.role
    };

    const accessToken = jwtHelpers.generateToken(
        data,
        config.jwt.jwt_secret as string,
        config.jwt.expires_in as string
    ); // "5m"

    const refreshToken = jwtHelpers.generateToken(
        data,
        config.jwt.refresh_token_secret as string,
        config.jwt.refresh_token_expires_in as string
    ); // "30d"

    return {
        data: result,
        accessToken,
        refreshToken
    };
};

const getMyInfo = async () => {
    const email: string = config.myInfo.my_email!;

    const user = await prisma.user.findUnique({
        where: { email: email }
    });

    if (!user) {
        throw new Error('User not found!');
    }

    return user;
};

const updateUserProfile = async (userId: string, req: Request) => {
    const {
        name,
        email,
        aboutMe,
        designation,
        address,
        contactNumber,
        gender,
        socialMediaLinks
    } = req.body;

    let profilePhoto = req.body.profilePhoto;
    const file = req.file as IFile;

    // Upload new profile photo if provided
    if (file) {
        const uploadedFile = await fileUploader.uploadToCloudinary(file);
        profilePhoto = uploadedFile?.secure_url;
    }

    // Update User Profile
    const updatedUser = await prisma.user.update({
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
    const skills: string[] = req.body.skills || [];

    if (skills.length > 0) {
        for (const skillName of skills) {
            let skill = await prisma.skills.findFirst({
                where: {
                    name: skillName.trim(),
                    isDeleted: false
                }
            });

            if (!skill) {
                // Create new skill if not exists
                skill = await prisma.skills.create({
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
            const existingSkill = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    Skills: {
                        where: { id: skill.id }
                    }
                }
            });

            if (!existingSkill?.Skills.length) {
                await prisma.user.update({
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
};

export const UserService = {
    createMyAccount,
    updateUserProfile,
    getMyInfo
};
