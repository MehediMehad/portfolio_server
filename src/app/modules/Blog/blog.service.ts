import prisma from '../../../shared/prisma';
import { Request } from 'express';
import ApiError from '../../errors/APIError';
import httpStatus from 'http-status';
import { IFile } from '../../interface/file';
import { fileUploader } from '../../../helpers/fileUploader';

const createBlog = async (req: Request) => {};

export const BlogsService = {
    createBlog
};
