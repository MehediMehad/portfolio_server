import { UserStatus } from '@prisma/client';
import { jwtHelpers, TPayloadToken } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';
import * as bcrypt from 'bcrypt';
import config from '../../../config';
import ApiError from '../../errors/APIError';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import emailSender from './emailSender';
import resetEmailTemplate from '../../../helpers/emailTemplateHelpers';

const loginUser = async (payload: { email: string; password: string }) => {
    const userData = await prisma.user.findUnique({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });
    if (!userData) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
    }

    const isCorrectPassword = await bcrypt.compare(
        payload.password,
        userData.password
    );

    if (!isCorrectPassword) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password in incorrect');
    }

    const data: TPayloadToken = {
        userId: userData.id,
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
        needPasswordChange: userData.needPasswordChange,
        accessToken,
        refreshToken
    };
};

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelpers.verifyToken(
            token,
            config.jwt.refresh_token_secret as string
        ); // refreshToken secret
    } catch (err) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    const userData = await prisma.user.findUnique({
        where: {
            email: decodedData?.email,
            status: UserStatus.ACTIVE
        }
    });
    if (!userData) {
        throw new ApiError(httpStatus.NOT_FOUND, 'user Not Found');
    }

    const data: TPayloadToken = {
        userId: userData.id,
        email: userData.email,
        role: userData.role
    };

    const accessToken = jwtHelpers.generateToken(
        data,
        config.jwt.jwt_secret as string,
        config.jwt.expires_in as string
    ); // sort time

    return {
        needPasswordChange: userData.needPasswordChange,
        accessToken
    };
};

const changePassword = async (user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword = await bcrypt.compare(
        payload.oldPassword,
        userData.password
    );

    if (!isCorrectPassword) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Password in incorrect');
    }

    const hashPassword: string = await bcrypt.hash(payload.newPassword, 12);

    await prisma.user.update({
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
};

const forgotPassword = async (payload: { email: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const resetPasswordToken = jwtHelpers.generateToken(
        { userId: userData.id, email: userData.email, role: userData.role },
        config.reset_password.secret_token as Secret,
        config.reset_password.expires_in // "5m"
    );

    const resetPasswordLink =
        config.reset_password.link +
        `?userId=${userData.id}&token=${resetPasswordToken}}`;

    await emailSender(userData.email, resetEmailTemplate(resetPasswordLink));

    // http://localhost:3000/reset-pass?email=mehedi3@gmail.com&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ

    return {
        message: 'Password changed successfully!'
    };
};

const resetPassword = async (
    token: string,
    payload: { id: string; password: string }
) => {
    console.log(164, token);

    await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: UserStatus.ACTIVE
        }
    });

    const isValidToken = jwtHelpers.verifyToken(
        token,
        config.reset_password.secret_token as Secret
    );

    if (!isValidToken) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden!');
    }

    // hash password
    const password = await bcrypt.hash(payload.password, 12);

    // update into database
    await prisma.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    });
};

export const AuthService = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
};
