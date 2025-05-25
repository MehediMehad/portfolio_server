import prisma from '../../../shared/prisma';
import { Gender, Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { fileUploader } from '../../../helpers/fileUploader';
import { IFile } from '../../interface/file';
import { Request } from 'express';
import { jwtHelpers, TPayloadToken } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import ApiError from '../../errors/APIError';
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
        socialMediaLinks: [
            JSON.stringify({
                name: 'LinkedIn',
                url: 'https://www.linkedin.com/in/mehedi-mehad/',
                icon: 'https://cdn-icons-png.flaticon.com/512/174/174857.png'
            }),
            JSON.stringify({
                name: 'GitHub',
                url: 'https://www.linkedin.com/in/mehedi-mehad'
            })
        ],
        // Skill: [
        //     // {
        //     //     id: '63f8b1c2e4b0d3f8b1c2e4b0',
        //     //     level: 'Expert',
        //     //     icon: 'https://cdn-icons-png.flaticon.com/512/919/919851.png'
        //     // },
        //     // {
        //     //     id: '63f8b1c2e4b0d3f8b1c2e4b1',
        //     //     level: 'Intermediate',
        //     //     icon: 'https://cdn-icons-png.flaticon.com/512/919/919851.png'
        //     // }
        // ],
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

const updateUserProfile2 = async (userId: string, req: Request) => {
    const file = req.file as IFile;

    const oldData = await prisma.user.findUniqueOrThrow({
        where: { id: userId }
    });

    let profilePhoto = oldData.profilePhoto;

    if (file) {
        const uploaded = await fileUploader.uploadToCloudinary(file);
        if (uploaded?.secure_url) {
            profilePhoto = uploaded.secure_url;
        }
    }

    const userData: any = { profilePhoto };

    if (req.body.name) userData.name = req.body.name;
    if (req.body.email) userData.email = req.body.email;
    if (req.body.contactNumber) userData.contactNumber = req.body.contactNumber;
    if (req.body.gender) userData.gender = req.body.gender;

    const result = await prisma.user.update({
        where: { id: userId },
        data: userData
    });

    return result;
};
// const updateUserProfile3 = async (userId: string, req: Request) => {
//     const file = req.file as Express.Multer.File | undefined;

//     if (!file && !req.body.data) {
//         throw new ApiError(httpStatus.BAD_REQUEST, 'No data provided');
//     }

//     const { name, email, designation, aboutMe, skills } = req.body;

//     // Upload new profile photo if provided
//     let profilePhoto = req.user?.profilePhoto;
//     if (file) {
//         const uploaded = await fileUploader.uploadToCloudinary(file);

//         if (uploaded && uploaded.secure_url) {
//             profilePhoto = uploaded.secure_url;
//         }
//     }

//     // Update user basic info
//     const userData = {
//         name,
//         email,
//         designation,
//         aboutMe,
//         profilePhoto
//     };

//     // Upsert skills
//     type SkillInput = { name: string; description: string; icon?: string };

//     if (Array.isArray(skills) && skills.length > 0) {
//         for (const skill of skills) {
//             await prisma.skills.upsert({
//                 where: {
//                     user: {
//                         id: userId,
//                         name: skill.name
//                     }
//                 },
//                 update: {
//                     description: skill.description,
//                     icon:
//                         skill.icon ||
//                         'https://cdn-icons-png.flaticon.com/512/919/919851.png'
//                 },
//                 create: {
//                     userId,
//                     name: skill.name,
//                     description: skill.description,
//                     icon:
//                         skill.icon ||
//                         'https://cdn-icons-png.flaticon.com/512/919/919851.png'
//                 }
//             });
//         }
//     }

//     // Save final user update
//     const updatedUser = await prisma.user.update({
//         where: { id: userId },
//         data: userData,
//         include: {
//             Skills: true
//         }
//     });

//     return updatedUser;
// };

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
            socialMediaLinks: socialMediaLinks
                ? JSON.parse(socialMediaLinks)
                : undefined
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
