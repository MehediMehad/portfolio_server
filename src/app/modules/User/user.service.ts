import prisma from '../../../shared/prisma';
import { Gender, Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { fileUploader } from '../../../helpers/fileUploader';
import { IFile } from '../../interface/file';
import { Request } from 'express';
import { IPaginationOptions } from '../../interface/pagination';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { userSearchAbleFields } from './user.constant';
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
            'https://github.com/MehediMehad',
            'https://www.linkedin.com/in/mehedimehad'
        ],
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

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;
    const andCondition: Prisma.UserWhereInput[] = [];

    if (params.searchTerm) {
        andCondition.push({
            OR: userSearchAbleFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive' // search case insensitive
                }
            }))
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key]
                    // mode: 'insensitive'    // insensitive you can not use equals only use contains
                }
            }))
        });
    }

    // console.dir(andCondition, { depth: null });

    const whereCondition: Prisma.UserWhereInput =
        andCondition.length > 0 ? { AND: andCondition } : {};

    const result = await prisma.user.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy:
            sortBy && sortOrder
                ? {
                      [sortBy]: sortOrder
                  }
                : {
                      createdAt: 'desc'
                  },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            createdAt: true,
            updatedAt: true
        }
        // include: {
        //     admin: true,
        //     patient: true,
        //     doctor: true
        // }
    });

    const total = await prisma.user.count({
        where: whereCondition
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
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

const updateUserProfilePhoto = async (userId: string, req: Request) => {
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
    const result = await prisma.user.update({
        where: { id: userId },
        data: userData
    });

    return result;
};

const changeProfileStatus = async (id: string, status: UserRole) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    });

    const updateUserStatus = await prisma.user.update({
        where: {
            id
        },
        data: status
    });

    return updateUserStatus;
};

export const UserService = {
    createMyAccount,
    getAllFromDB,
    changeProfileStatus,
    updateUserProfile,
    getMyInfo,
    updateUserProfilePhoto
};
