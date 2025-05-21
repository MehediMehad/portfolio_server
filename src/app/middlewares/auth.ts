import { NextFunction, Request, Response } from 'express';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import ApiError from '../errors/APIError';
import httpStatus from 'http-status';
import { UserRole } from '@prisma/client';

const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new ApiError(
                    httpStatus.UNAUTHORIZED,
                    'You are not authorized!'
                );
            }
            const verifyUser = jwtHelpers.verifyToken(
                token,
                config.jwt.jwt_secret as Secret
            );

            req.user = verifyUser;

            if (roles.length && !roles.includes(verifyUser.role)) {
                throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden!');
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};

export default auth;
